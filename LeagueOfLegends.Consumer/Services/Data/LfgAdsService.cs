using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Platform;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Realtime;
using LeagueOfLegends.Consumer.Integration;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class LfgAdsService(
    LeagueOfLegendsDbContext context,
    IRealtimeEventPublisher realtimePublisher,
    IPlatformSanctionsClient sanctions) : IBusService
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

            case "Search":
                return JsonSafe.Serialize(await SearchAsync(message, ct));

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
            TeamPublicId = ad.IdTeamNavigation != null ? ad.IdTeamNavigation.PublicId : null,
            TeamName = ad.IdTeamNavigation != null ? ad.IdTeamNavigation.Entitled : null,
            TeamDiscriminator = ad.IdTeamNavigation != null ? ad.IdTeamNavigation.Discriminator : null,
            TeamTag = ad.IdTeamNavigation != null ? ad.IdTeamNavigation.Tag : null,
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

    private async Task<LfgAdPageDto> SearchAsync(BusMessage message, CancellationToken ct)
    {
        var request = string.IsNullOrWhiteSpace(message.Data)
            ? new SearchLfgRequest()
            : ConsumerParamParser.ToObject<SearchLfgRequest>(message.Data);

        var kind = ResolveKind(request.Kind);
        var take = request.Take is > 0 and <= RecentTake ? request.Take : 20;
        var now = DateTime.UtcNow;

        var query = _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == kind);

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var text = request.Query.Trim();
            query = query.Where(ad => ad.Body.Contains(text));
        }

        if (request.IdRegion is { } idRegion)
            query = query.Where(ad => ad.IdRegion == idRegion);

        if (request.IdLane is { } idLane)
            query = query.Where(ad => ad.IdLane == idLane);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(ad =>
                ad.CreationDate < beforeDate
                || (ad.CreationDate == beforeDate && ad.PublicId.CompareTo(beforePublicId) < 0));
        }

        var rows = await ProjectSummaries(
                _context,
                query
                    .OrderByDescending(ad => ad.CreationDate)
                    .ThenByDescending(ad => ad.PublicId)
                    .Take(take + 1))
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new LfgAdPageDto { Items = rows, HasMore = hasMore };
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
        await sanctions.EnsureCanPublishAsync(message, ct);
        var postedAt = DateTime.UtcNow;

        Team? team = null;
        if (request.TeamPublicId is { } teamPublicId && teamPublicId != Guid.Empty)
        {
            team = await _context.Teams.FirstOrDefaultAsync(t => t.PublicId == teamPublicId, ct)
                ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");
            await TeamAuth.RequireStandingAsync(_context, team.Id, player.Id, TeamRankCodes.Coach, ct);
        }

        var kind = team is null ? LfgAdKinds.Player : LfgAdKinds.Team;
        await EnsureNotInCooldownAsync(player.Id, team?.Id, kind, postedAt, ct);

        int? idLane = request.IdLane;
        if (idLane is { } laneId)
        {
            var laneExists = await _context.Lanes.AsNoTracking().AnyAsync(l => l.Id == laneId, ct);
            if (!laneExists)
                throw new BadRequestException("VALIDATION", "Unknown lane");
        }
        else if (team is null)
        {
            idLane = player.IdPrimaryLane;
        }

        var ad = new LfgAd
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = player.Id,
            IdTeam = team?.Id,
            Kind = kind,
            Title = string.Empty,
            Body = body,
            IdRegion = team?.IdRegion ?? player.IdRegion,
            IdLane = idLane,
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
                    RegionCode = dto.RegionCode,
                    LaneCode = dto.LaneCode,
                    TeamPublicId = dto.TeamPublicId,
                    TeamName = dto.TeamName,
                    TeamDiscriminator = dto.TeamDiscriminator,
                    TeamTag = dto.TeamTag,
                    CreationDate = dto.CreationDate,
                    ExpiresAt = dto.ExpiresAt,
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

    private async Task EnsureNotInCooldownAsync(int idPlayer, int? idTeam, string kind, DateTime postedAt, CancellationToken ct)
    {
        var query = _context.LfgAds.AsNoTracking()
            .Where(ad => ad.IdPlayer == idPlayer && ad.Kind == kind);

        query = idTeam is { } teamId
            ? query.Where(ad => ad.IdTeam == teamId)
            : query.Where(ad => ad.IdTeam == null);

        var lastPostAt = await query
            .OrderByDescending(ad => ad.CreationDate)
            .Select(ad => ad.CreationDate)
            .FirstOrDefaultAsync(ct);

        if (lastPostAt != default && postedAt - lastPostAt < PostCooldown)
            throw new BadRequestException("COOLDOWN", "Please wait before posting another LFG message");
    }
}
