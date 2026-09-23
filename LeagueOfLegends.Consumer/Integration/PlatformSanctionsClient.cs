using System.Collections.Concurrent;
using System.Text;
using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;

namespace LeagueOfLegends.Consumer.Integration;

public interface IPlatformSanctionsClient
{
    /// <summary>
    /// Refuses the call when the caller is muted or banned on Platform.
    /// </summary>
    Task EnsureCanPublishAsync(BusMessage message, CancellationToken ct = default);
}

/// <summary>
/// Asks Platform, on every publication, whether the caller is allowed to speak.
/// </summary>
/// <remarks>
/// <para>
/// Sanctions belong to Platform and must never be replicated into this database, so there is no
/// local table to read: the check is a synchronous RPC on the Platform queue. A short-lived cache
/// keeps a burst of posts from turning into a burst of round trips.
/// </para>
/// <para>
/// The check fails closed. An unreachable Platform blocks new publications rather than silently
/// letting a muted player through, which is the whole point of enforcing the sanction server-side.
/// A caller with no Platform account has nothing to enforce and is let through.
/// </para>
/// </remarks>
public sealed class PlatformSanctionsClient(IOptions<RabbitMQSettings> opts, ILogger logger)
    : IPlatformSanctionsClient, IAsyncDisposable
{
    private const string PlatformQueue = "platform_queue";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);

    private readonly RabbitMQSettings _settings = opts.Value;

    private readonly ConnectionFactory _factory = new()
    {
        HostName = opts.Value.Hostname,
        UserName = opts.Value.Username,
        Password = opts.Value.Password,
    };

    private readonly ConcurrentDictionary<string, CacheEntry> _cache = new();
    private readonly SemaphoreSlim _gate = new(1, 1);
    private IConnection? _connection;

    public async Task EnsureCanPublishAsync(BusMessage message, CancellationToken ct = default)
    {
        if (message.Caller?.Subject is not { } subject || string.IsNullOrWhiteSpace(subject))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        var sanctions = await GetSanctionsAsync(subject, message.Caller, ct);

        if (sanctions.Banned)
            throw new ForbiddenException("BANNED", "Banned account");

        if (sanctions.ActiveMute is { } mute)
        {
            throw new ForbiddenException(
                "MUTED",
                $"You are muted until {mute.EndDate:u}: {mute.Reason}");
        }
    }

    public async ValueTask DisposeAsync()
    {
        await _gate.WaitAsync();
        try
        {
            if (_connection is not null)
            {
                await _connection.DisposeAsync();
                _connection = null;
            }
        }
        finally
        {
            _gate.Release();
            _gate.Dispose();
        }
    }

    private async Task<CallerSanctions> GetSanctionsAsync(
        string subject,
        CallerIdentity caller,
        CancellationToken ct)
    {
        if (_cache.TryGetValue(subject, out var cached) && cached.ExpiresAt > DateTime.UtcNow)
            return cached.Sanctions;

        var sanctions = await FetchSanctionsAsync(caller, ct);
        _cache[subject] = new CacheEntry(sanctions, DateTime.UtcNow.Add(CacheDuration));

        PruneCache();
        return sanctions;
    }

    private async Task<CallerSanctions> FetchSanctionsAsync(CallerIdentity caller, CancellationToken ct)
    {
        var payload = JsonSafe.Serialize(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Users",
            Action = "Sanctions",
            Caller = caller,
        });

        string response;
        try
        {
            response = await CallAsync(payload, ct);
        }
        catch (RpcException ex) when (ex.Code == "UNAUTHORIZED")
        {
            // No Platform account behind this Keycloak subject: nothing to enforce.
            return CallerSanctions.None;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.Error(ex, "Could not read Platform sanctions; refusing the publication.");
            throw new InternalServerErrorException(
                "SANCTIONS_UNAVAILABLE",
                "Moderation status is temporarily unavailable, please retry");
        }

        return JsonSafe.Deserialize<CallerSanctions>(response) ?? CallerSanctions.None;
    }

    /// <summary>
    /// Minimal RPC over the default exchange: publish on the Platform queue with an exclusive reply
    /// queue, and wait for the envelope carrying the matching correlation id.
    /// </summary>
    private async Task<string> CallAsync(string payload, CancellationToken ct)
    {
        var connection = await EnsureConnectionAsync(ct);
        await using var channel = await connection.CreateChannelAsync(cancellationToken: CancellationToken.None);

        var replyQueue = await channel.QueueDeclareAsync(
            queue: string.Empty,
            durable: false,
            exclusive: true,
            autoDelete: true,
            arguments: null,
            cancellationToken: CancellationToken.None);

        var correlationId = Guid.NewGuid().ToString("N");
        var completion = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += (_, ea) =>
        {
            if (ea.BasicProperties?.CorrelationId != correlationId)
                return Task.CompletedTask;

            try
            {
                var body = Encoding.UTF8.GetString(ea.Body.ToArray());
                var envelope = JsonSafe.Deserialize<RpcEnvelope<string?>>(body)
                    ?? throw new RpcException("INVALID_RESPONSE", "Response cannot be deserialized.", body);

                if (!envelope.Ok)
                {
                    throw new RpcException(
                        envelope.Error?.Code ?? "ERROR",
                        envelope.Error?.Message ?? "Unknown error");
                }

                completion.TrySetResult(envelope.Data ?? string.Empty);
            }
            catch (Exception ex)
            {
                completion.TrySetException(ex);
            }

            return Task.CompletedTask;
        };

        var consumerTag = await channel.BasicConsumeAsync(
            queue: replyQueue.QueueName,
            autoAck: true,
            consumer: consumer,
            cancellationToken: CancellationToken.None);

        try
        {
            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: PlatformQueue,
                mandatory: false,
                basicProperties: new BasicProperties
                {
                    CorrelationId = correlationId,
                    ReplyTo = replyQueue.QueueName,
                    ContentType = "application/json",
                    ContentEncoding = "utf-8",
                },
                body: Encoding.UTF8.GetBytes(payload),
                cancellationToken: CancellationToken.None);

            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(_settings.Timeout));
            using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeout.Token);

            try
            {
                return await completion.Task.WaitAsync(linked.Token);
            }
            catch (OperationCanceledException) when (timeout.IsCancellationRequested)
            {
                throw new GatewayTimeoutException(
                    "TIMEOUT",
                    $"Platform did not answer within {_settings.Timeout}s.");
            }
        }
        finally
        {
            try
            {
                await channel.BasicCancelAsync(consumerTag, cancellationToken: CancellationToken.None);
            }
            catch
            {
                /* channel may already be closing */
            }
        }
    }

    private async Task<IConnection> EnsureConnectionAsync(CancellationToken ct)
    {
        if (_connection is { IsOpen: true })
            return _connection;

        await _gate.WaitAsync(ct);
        try
        {
            if (_connection is { IsOpen: true })
                return _connection;

            _connection = await _factory.CreateConnectionAsync(ct);
            return _connection;
        }
        finally
        {
            _gate.Release();
        }
    }

    private void PruneCache()
    {
        var now = DateTime.UtcNow;
        foreach (var (key, entry) in _cache)
        {
            if (entry.ExpiresAt <= now)
                _cache.TryRemove(key, out _);
        }
    }

    private sealed record CacheEntry(CallerSanctions Sanctions, DateTime ExpiresAt);

    /// <summary>
    /// Mirrors Platform's <c>CallerSanctionsDto</c>. Kept local so the two services stay free to
    /// evolve their own payloads.
    /// </summary>
    private sealed class CallerSanctions
    {
        public static readonly CallerSanctions None = new();

        public bool Banned { get; init; }

        public ActiveMute? ActiveMute { get; init; }
    }

    private sealed class ActiveMute
    {
        public string Reason { get; init; } = "";

        public DateTime EndDate { get; init; }
    }
}
