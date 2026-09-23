using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Realtime;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class LfgAdsService(
    LeagueOfLegendsDbContext context,
    IRealtimeEventPublisher realtimePublisher) : IBusService
{
    private const int RecentTake = 50;
    private const int MaxBodyLength = 2000;
    private static readonly TimeSpan PostCooldown = TimeSpan.FromMinutes(3);
    private readonly LeagueOfLegendsDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "LfgAds";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action)
        {
            case "ListRecent":
                return JsonSafe.Serialize(await ListRecentAsync(message, ct));

            case "ListBefore":
                return JsonSafe.Serialize(await ListBeforeAsync(message, ct));

            case "Create":
                return JsonSafe.Serialize(await CreateAsync(message, ct));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }

    internal static IQueryable<LfgAdSummaryDto> ProjectSummaries(
        LeagueOfLegendsDbContext context,
        IQueryable<LfgAd> ads) =>
        ads.Select(ad => new LfgAdSummaryDto
        {
            PublicId = ad.PublicId,
            Kind = ad.Kind,
            Body = ad.Body,
            CreationDate = ad.CreationDate,
            ExpiresAt = ad.ExpiresAt,
            PlayerPublicId = ad.IdPlayerNavigation.PublicId,
            PlatformUserPublicId = ad.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            SenderNickname = context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            SenderDiscriminator = context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            SenderAvatarUrl = context.PlatformUserSnapshots
                .Where(s => (Guid?)s.PlatformUserPublicId == ad.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
            RegionCode = ad.IdRegionNavigation != null ? ad.IdRegionNavigation.Code : null,
            LaneCode = ad.IdLaneNavigation != null ? ad.IdLaneNavigation.Code : null,
        });

    private async Task<List<LfgAdSummaryDto>> ListRecentAsync(BusMessage message, CancellationToken ct)
    {
        var kind = ResolveKind(string.IsNullOrWhiteSpace(message.Data)
            ? null
            : ConsumerParamParser.ToObject<ListLfgRecentRequest>(message.Data).Kind);

        var now = DateTime.UtcNow;
        var messages = await ProjectSummaries(_context, _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind)
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(RecentTake))
            .ToListAsync(ct);

        messages.Reverse();
        return messages;
    }

    private async Task<List<LfgAdSummaryDto>> ListBeforeAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<ListLfgBeforeRequest>(message.Data);
        if (request.BeforePublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Cursor is required");

        var kind = ResolveKind(request.Kind);
        var take = request.Take is > 0 and <= RecentTake ? request.Take : RecentTake;
        var now = DateTime.UtcNow;
        var messages = await ProjectSummaries(_context, _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind)
            .Where(ad =>
                ad.CreationDate < request.BeforeCreationDate
                || (ad.CreationDate == request.BeforeCreationDate && ad.PublicId.CompareTo(request.BeforePublicId) < 0))
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(take))
            .ToListAsync(ct);

        messages.Reverse();
        return messages;
    }

    private async Task<LfgAdSummaryDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<CreateLfgAdRequest>(message.Data);
        var body = request.Body.Trim();
        if (string.IsNullOrWhiteSpace(body))
            throw new BadRequestException("VALIDATION", "Message is required");
        if (body.Length > MaxBodyLength)
            throw new BadRequestException("VALIDATION", "Message is too long");

        var player = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var postedAt = DateTime.UtcNow;
        await EnsureNotInCooldownAsync(player.Id, postedAt, ct);

        var ad = new LfgAd
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = player.Id,
            Kind = LfgAdKinds.Player,
            Title = string.Empty,
            Body = body,
            IdRegion = player.IdRegion,
            IdLane = player.IdPrimaryLane,
            CreationDate = postedAt,
            ModificationDate = postedAt,
            ExpiresAt = request.ExpiresAt is { } custom && custom > postedAt ? custom : postedAt.AddDays(7),
            IsActive = true,
        };

        await _context.LfgAds.AddAsync(ad, ct);
        await _context.SaveChangesAsync(ct);

        var dto = await ProjectSummaries(_context, _context.LfgAds.AsNoTracking().Where(a => a.Id == ad.Id))
            .FirstAsync(ct);

        await realtimePublisher.PublishAsync(
            new LfgMessageCreatedRealtimeEvent
            {
                Message = new LfgMessageRealtimePayload
                {
                    PublicId = dto.PublicId,
                    Kind = dto.Kind,
                    Body = dto.Body,
                    SenderNickname = dto.SenderNickname,
                    SenderDiscriminator = dto.SenderDiscriminator,
                    PlayerPublicId = dto.PlayerPublicId,
                    PlatformUserPublicId = dto.PlatformUserPublicId,
                    SenderAvatarUrl = dto.SenderAvatarUrl,
                    CreationDate = dto.CreationDate,
                },
            },
            ct);

        return dto;
    }

    private static string ResolveKind(string? requested)
    {
        if (string.IsNullOrWhiteSpace(requested))
            return LfgAdKinds.Player;

        var kind = requested.Trim().ToLowerInvariant();
        if (!LfgAdKinds.IsKnown(kind))
            throw new BadRequestException("VALIDATION", $"Unknown LFG kind '{requested}'");

        return kind;
    }

    private async Task EnsureNotInCooldownAsync(int idPlayer, DateTime postedAt, CancellationToken ct)
    {
        var lastPostAt = await _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IdPlayer == idPlayer && ad.Kind == LfgAdKinds.Player)
            .OrderByDescending(ad => ad.CreationDate)
            .Select(ad => ad.CreationDate)
            .FirstOrDefaultAsync(ct);

        if (lastPostAt != default && postedAt - lastPostAt < PostCooldown)
            throw new BadRequestException("COOLDOWN", "Please wait before posting another LFG message");
    }
}
