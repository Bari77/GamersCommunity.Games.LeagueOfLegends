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

public interface IPlatformConversationsClient
{
    Task EnsureGuildChannelAsync(
        string managedKey,
        string title,
        string? pictureUrl,
        Guid ownerUserPublicId,
        CancellationToken ct = default);

    Task AddGuildMemberAsync(string managedKey, Guid userPublicId, CancellationToken ct = default);

    Task RemoveGuildMemberAsync(string managedKey, Guid userPublicId, CancellationToken ct = default);

    Task DeleteGuildChannelAsync(string managedKey, CancellationToken ct = default);
}

/// <summary>
/// Asks Platform to keep the team Whispers channel in sync with the roster.
/// </summary>
/// <remarks>
/// Conversations belong to Platform and must never be replicated here. Membership is pushed over
/// a synchronous RPC on the Platform queue. The ENSURE_GUILD action also creates team channels
/// when the managed key is <c>lol:team:{publicId}</c>.
/// </remarks>
public sealed class PlatformConversationsClient(IOptions<RabbitMQSettings> opts, ILogger logger)
    : IPlatformConversationsClient, IAsyncDisposable
{
    private const string PlatformQueue = "platform_queue";

    private readonly RabbitMQSettings _settings = opts.Value;

    private readonly ConnectionFactory _factory = new()
    {
        HostName = opts.Value.Hostname,
        UserName = opts.Value.Username,
        Password = opts.Value.Password,
    };

    private readonly SemaphoreSlim _gate = new(1, 1);
    private IConnection? _connection;

    public Task EnsureGuildChannelAsync(
        string managedKey,
        string title,
        string? pictureUrl,
        Guid ownerUserPublicId,
        CancellationToken ct = default) =>
        CallVoidAsync("ENSURE_GUILD", new
        {
            ManagedKey = managedKey,
            Title = title,
            PictureUrl = pictureUrl,
            OwnerUserPublicId = ownerUserPublicId,
        }, ct);

    public Task AddGuildMemberAsync(string managedKey, Guid userPublicId, CancellationToken ct = default) =>
        CallVoidAsync("ADD_GUILD_MEMBER", new { ManagedKey = managedKey, UserPublicId = userPublicId }, ct);

    public Task RemoveGuildMemberAsync(string managedKey, Guid userPublicId, CancellationToken ct = default) =>
        CallVoidAsync("REMOVE_GUILD_MEMBER", new { ManagedKey = managedKey, UserPublicId = userPublicId }, ct);

    public Task DeleteGuildChannelAsync(string managedKey, CancellationToken ct = default) =>
        CallVoidAsync("DELETE_GUILD", new { ManagedKey = managedKey }, ct);

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

    private async Task CallVoidAsync(string action, object data, CancellationToken ct)
    {
        var payload = JsonSafe.Serialize(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Conversations",
            Action = action,
            Data = JsonSafe.Serialize(data),
        });

        try
        {
            await CallAsync(payload, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.Error(ex, "Platform did not apply team Whispers action {Action}.", action);
            throw;
        }
    }

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
}
