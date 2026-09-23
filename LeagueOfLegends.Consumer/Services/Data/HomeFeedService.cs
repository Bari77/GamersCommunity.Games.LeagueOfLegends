using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class HomeFeedService(LeagueOfLegendsDbContext context) : IBusService
{
    private const int FeedTake = 5;
    private readonly LeagueOfLegendsDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "HomeFeed";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        if (!message.Action.Equals("Get", StringComparison.OrdinalIgnoreCase))
            throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");

        var now = DateTime.UtcNow;

        var latestLfg = await ToLfgSummaries(_context.LfgAds.AsNoTracking()
            .Where(ad => ad.IsActive && ad.ExpiresAt > now && ad.Kind == LfgAdKinds.Player)
            .OrderByDescending(ad => ad.CreationDate)
            .ThenByDescending(ad => ad.PublicId)
            .Take(FeedTake))
            .ToListAsync(ct);
        latestLfg.Reverse();

        var latestPlayers = await _context.Players.AsNoTracking()
            .Where(p => p.PlatformUserPublicId != null)
            .OrderByDescending(p => p.CreationDate)
            .Take(FeedTake)
            .Select(p => new PlayerSummaryDto
            {
                PublicId = p.PublicId,
                PlatformUserPublicId = p.PlatformUserPublicId ?? Guid.Empty,
                Nickname = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Nickname)
                    .FirstOrDefault() ?? "Player",
                Discriminator = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.Discriminator)
                    .FirstOrDefault() ?? "0000",
                AvatarUrl = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => s.AvatarUrl)
                    .FirstOrDefault() ?? "",
                PresentationIrl = p.PresentationIrl,
                GameName = p.GameName,
                TagLine = p.TagLine,
                RegionCode = p.IdRegionNavigation != null ? p.IdRegionNavigation.Code : null,
                PrimaryLaneCode = p.IdPrimaryLaneNavigation != null ? p.IdPrimaryLaneNavigation.Code : null,
                CreationDate = p.CreationDate,
            })
            .ToListAsync(ct);

        return JsonSafe.Serialize(new HomeFeedDto
        {
            LatestLfg = latestLfg,
            LatestPlayers = latestPlayers,
        });
    }

    private IQueryable<LfgAdSummaryDto> ToLfgSummaries(IQueryable<LfgAd> ads) =>
        LfgAdsService.ProjectSummaries(_context, ads);
}
