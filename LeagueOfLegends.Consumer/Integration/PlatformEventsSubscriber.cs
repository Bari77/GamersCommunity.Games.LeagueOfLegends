using GamersCommunity.Core.Events;
using GamersCommunity.Core.Rabbit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Serilog;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Consumer.Integration;

/// <summary>
/// Keeps the local <see cref="PlatformUserSnapshot"/> read model in sync with the identities
/// broadcast by the Platform microservice.
/// </summary>
/// <remarks>
/// Every game microservice binds its own queue to the shared <c>platform_events</c> exchange, so a
/// new game plugs in without any change on the Platform side.
/// </remarks>
public sealed class PlatformEventsSubscriber : IntegrationEventSubscriber
{
    public const string MicroserviceId = "leagueoflegends";

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger _logger;

    public PlatformEventsSubscriber(
        IOptions<RabbitMQSettings> opts,
        IServiceScopeFactory scopeFactory,
        ILogger logger) : base(opts, logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override string Exchange => IntegrationExchanges.PlatformEvents;

    protected override string Queue => IntegrationQueues.ForMicroservice(IntegrationExchanges.PlatformEvents, MicroserviceId);

    protected override async Task HandleAsync(string type, string json, CancellationToken ct)
    {
        if (!string.Equals(type, IntegrationEventTypes.UserIdentityChanged, StringComparison.OrdinalIgnoreCase))
        {
            // Unknown events are ignored so Platform can introduce new ones without breaking us.
            _logger.Debug("Ignoring integration event '{Type}'.", type);
            return;
        }

        var evt = IntegrationEventSerializer.Deserialize<UserIdentityChangedEvent>(json);
        if (evt is null || evt.UserPublicId == Guid.Empty)
        {
            _logger.Warning("Invalid '{Type}' payload.", type);
            return;
        }

        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<LeagueOfLegendsDbContext>();

        var snapshot = await context.PlatformUserSnapshots
            .FirstOrDefaultAsync(s => s.PlatformUserPublicId == evt.UserPublicId, ct);

        if (snapshot is null)
        {
            context.PlatformUserSnapshots.Add(new PlatformUserSnapshot
            {
                PlatformUserPublicId = evt.UserPublicId,
                Nickname = evt.Nickname,
                Discriminator = evt.Discriminator,
                AvatarUrl = evt.AvatarUrl,
                UpdatedAt = evt.OccurredAt,
            });
        }
        else if (evt.OccurredAt > snapshot.UpdatedAt)
        {
            snapshot.Nickname = evt.Nickname;
            snapshot.Discriminator = evt.Discriminator;
            snapshot.AvatarUrl = evt.AvatarUrl;
            snapshot.UpdatedAt = evt.OccurredAt;
        }
        else
        {
            return;
        }

        await context.SaveChangesAsync(ct);
    }
}
