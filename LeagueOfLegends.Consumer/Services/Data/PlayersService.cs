using System.Text.Json;
using System.Text.RegularExpressions;
using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class PlayersService(LeagueOfLegendsDbContext context) : IBusService
{
    private const int MaxLayoutLength = 32000;
    private const int MaxPresentationLength = 4000;
    private static readonly Regex TagLinePattern = new("^[A-Za-z0-9]{2,5}$", RegexOptions.Compiled);
    private static readonly HashSet<string> ApexTiers = new(StringComparer.OrdinalIgnoreCase)
    {
        "master", "grandmaster", "challenger",
    };
    private static readonly HashSet<string> RankedTiers = new(StringComparer.OrdinalIgnoreCase)
    {
        "iron", "bronze", "silver", "gold", "platinum", "emerald", "diamond",
        "master", "grandmaster", "challenger",
    };
    private static readonly HashSet<string> RankedDivisions = new(StringComparer.OrdinalIgnoreCase)
    {
        "4", "3", "2", "1",
    };

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;

    public string Resource => "Players";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        return message.Action switch
        {
            "Load" => JsonSafe.Serialize(await LoadAsync(message, ct)),
            "Resolve" => JsonSafe.Serialize(await ResolveByPlatformUserAsync(message, ct)),
            "Get" => JsonSafe.Serialize(await GetSheetAsync(message, ct)),
            "Options" => JsonSafe.Serialize(await OptionsAsync(ct)),
            "Update" => JsonSafe.Serialize(await UpdateSheetAsync(message, ct)),
            _ => throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented"),
        };
    }

    private async Task<PlayerSheetDto> LoadAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLoadRequest>(message.Data);
        if (request.PlatformUserId <= 0 || request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user identity is required");

        var idKeycloak = CallerAuth.RequireKeycloakId(message);
        var player = await context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct);

        if (player is null)
        {
            player = new Player
            {
                PublicId = Guid.NewGuid(),
                IdKeycloak = idKeycloak,
                PlatformUserPublicId = request.PlatformUserPublicId,
                IdUser = request.PlatformUserId,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            };
            await context.Players.AddAsync(player, ct);
            await context.SaveChangesAsync(ct);
        }
        else if (player.PlatformUserPublicId != request.PlatformUserPublicId || player.IdUser != request.PlatformUserId)
        {
            player.PlatformUserPublicId = request.PlatformUserPublicId;
            player.IdUser = request.PlatformUserId;
            player.ModificationDate = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }

        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerResolveResult> ResolveByPlatformUserAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerResolveRequest>(message.Data);
        if (request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user public id is required");

        var player = await context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PlatformUserPublicId == request.PlatformUserPublicId, ct);

        return new PlayerResolveResult { PlayerPublicId = player?.PublicId };
    }

    private async Task<PlayerSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var player = await ResolvePlayerAsync(message, ct);
        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerOptionsDto> OptionsAsync(CancellationToken ct)
    {
        return new PlayerOptionsDto
        {
            Lanes = await context.Lanes.AsNoTracking()
                .OrderBy(l => l.SortOrder)
                .Select(l => new CatalogItemDto { Id = l.Id, Code = l.Code })
                .ToListAsync(ct),
            Regions = await context.Regions.AsNoTracking()
                .OrderBy(r => r.SortOrder)
                .Select(r => new CatalogItemDto { Id = r.Id, Code = r.Code })
                .ToListAsync(ct),
            Champions = await context.Champions.AsNoTracking()
                .OrderBy(c => c.Code)
                .Select(c => new CatalogItemDto { Id = c.Id, Code = c.Code })
                .ToListAsync(ct),
            ChampionKinds = await context.PlayerChampionKinds.AsNoTracking()
                .OrderBy(k => k.SortOrder)
                .Select(k => new CatalogItemDto { Id = k.Id, Code = k.Code })
                .ToListAsync(ct),
            Tiers =
            [
                new() { Id = 1, Code = "iron" },
                new() { Id = 2, Code = "bronze" },
                new() { Id = 3, Code = "silver" },
                new() { Id = 4, Code = "gold" },
                new() { Id = 5, Code = "platinum" },
                new() { Id = 6, Code = "emerald" },
                new() { Id = 7, Code = "diamond" },
                new() { Id = 8, Code = "master" },
                new() { Id = 9, Code = "grandmaster" },
                new() { Id = 10, Code = "challenger" },
            ],
            Divisions =
            [
                new() { Id = 4, Code = "4" },
                new() { Id = 3, Code = "3" },
                new() { Id = 2, Code = "2" },
                new() { Id = 1, Code = "1" },
            ],
        };
    }

    private async Task<PlayerSheetDto> UpdateSheetAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(context, message, ct);
        var target = await context.Players
            .Include(p => p.PlayerLanes)
            .Include(p => p.PlayerChampions)
            .FirstOrDefaultAsync(p => message.PublicId != null && p.PublicId == message.PublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (caller.Id != target.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot update another player's sheet");

        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIrl)))
            target.PresentationIrl = NormalizePresentation(request.PresentationIrl);
        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIg)))
            target.PresentationIg = NormalizePresentation(request.PresentationIg);
        if (sent.Contains(nameof(PlayerUpdateRequest.LayoutJson)))
            target.LayoutJson = NormalizeLayout(request.LayoutJson ?? "");

        if (sent.Contains(nameof(PlayerUpdateRequest.GameName))
            || sent.Contains(nameof(PlayerUpdateRequest.TagLine))
            || sent.Contains(nameof(PlayerUpdateRequest.IdRegion)))
        {
            await ApplyRiotIdentityAsync(target, request, sent, ct);
        }

        if (sent.Contains(nameof(PlayerUpdateRequest.IdPrimaryLane))
            || sent.Contains(nameof(PlayerUpdateRequest.SecondaryLaneIds)))
        {
            await ApplyLanesAsync(target, request, sent, ct);
        }

        if (sent.Contains(nameof(PlayerUpdateRequest.Solo)))
        {
            ApplyRank(request.Solo, out var soloTier, out var soloDivision, out var soloLp, "SOLO");
            target.SoloTier = soloTier;
            target.SoloDivision = soloDivision;
            target.SoloLp = soloLp;
        }

        if (sent.Contains(nameof(PlayerUpdateRequest.Flex)))
        {
            ApplyRank(request.Flex, out var flexTier, out var flexDivision, out var flexLp, "FLEX");
            target.FlexTier = flexTier;
            target.FlexDivision = flexDivision;
            target.FlexLp = flexLp;
        }

        if (sent.Contains(nameof(PlayerUpdateRequest.Champions)))
            await ApplyChampionsAsync(target, request.Champions, ct);

        target.ModificationDate = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);

        return await ToSheetDtoAsync(target.Id, ct);
    }

    private async Task ApplyRiotIdentityAsync(
        Player target,
        PlayerUpdateRequest request,
        HashSet<string> sent,
        CancellationToken ct)
    {
        var gameName = sent.Contains(nameof(PlayerUpdateRequest.GameName))
            ? NormalizeGameName(request.GameName)
            : target.GameName;
        var tagLine = sent.Contains(nameof(PlayerUpdateRequest.TagLine))
            ? NormalizeTagLine(request.TagLine)
            : target.TagLine;
        var idRegion = sent.Contains(nameof(PlayerUpdateRequest.IdRegion))
            ? request.IdRegion
            : target.IdRegion;

        if (string.IsNullOrEmpty(gameName) && string.IsNullOrEmpty(tagLine) && idRegion is null)
        {
            target.GameName = null;
            target.TagLine = null;
            target.IdRegion = null;
            return;
        }

        if (string.IsNullOrEmpty(gameName) || string.IsNullOrEmpty(tagLine) || idRegion is null)
            throw new BadRequestException("RIOT_ID_INCOMPLETE", "Riot ID needs a game name, a tag line and a region");

        if (!await context.Regions.AnyAsync(r => r.Id == idRegion, ct))
            throw new BadRequestException("UNKNOWN_REGION", "Unknown region");

        var sameRegion = await context.Players.AsNoTracking()
            .Where(p => p.Id != target.Id && p.IdRegion == idRegion && p.TagLine == tagLine && p.GameName != null)
            .Select(p => p.GameName!)
            .ToListAsync(ct);
        if (sameRegion.Any(name => name.Equals(gameName, StringComparison.OrdinalIgnoreCase)))
            throw new BadRequestException("RIOT_ID_TAKEN", "This Riot ID is already used in that region");

        target.GameName = gameName;
        target.TagLine = tagLine;
        target.IdRegion = idRegion;
    }

    private async Task ApplyLanesAsync(
        Player target,
        PlayerUpdateRequest request,
        HashSet<string> sent,
        CancellationToken ct)
    {
        var primaryId = sent.Contains(nameof(PlayerUpdateRequest.IdPrimaryLane))
            ? request.IdPrimaryLane
            : target.IdPrimaryLane;

        if (primaryId is null)
            throw new BadRequestException("PRIMARY_LANE_REQUIRED", "A primary lane is required");

        if (!await context.Lanes.AnyAsync(l => l.Id == primaryId, ct))
            throw new BadRequestException("UNKNOWN_LANE", "Unknown primary lane");

        var secondaryIds = sent.Contains(nameof(PlayerUpdateRequest.SecondaryLaneIds))
            ? (request.SecondaryLaneIds ?? []).Distinct().ToList()
            : target.PlayerLanes.Select(l => l.IdLane).ToList();

        if (secondaryIds.Contains(primaryId.Value))
            throw new BadRequestException("LANE_OVERLAP", "A secondary lane cannot be the primary lane");

        var known = await context.Lanes.AsNoTracking()
            .Where(l => secondaryIds.Contains(l.Id))
            .Select(l => l.Id)
            .ToListAsync(ct);
        if (known.Count != secondaryIds.Count)
            throw new BadRequestException("UNKNOWN_LANE", "Unknown secondary lane");

        target.IdPrimaryLane = primaryId;
        context.PlayerLanes.RemoveRange(target.PlayerLanes);
        foreach (var laneId in secondaryIds)
        {
            target.PlayerLanes.Add(new PlayerLane
            {
                IdPlayer = target.Id,
                IdLane = laneId,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            });
        }
    }

    private async Task ApplyChampionsAsync(
        Player target,
        IReadOnlyList<PlayerChampionUpdateDto>? champions,
        CancellationToken ct)
    {
        var rows = champions ?? [];
        if (rows.Select(r => r.IdChampion).Distinct().Count() != rows.Count)
            throw new BadRequestException("CHAMPION_DUPLICATE", "A champion can only appear once in the pool");

        var kinds = await context.PlayerChampionKinds.AsNoTracking()
            .ToDictionaryAsync(k => k.Code, k => k.Id, StringComparer.OrdinalIgnoreCase, ct);
        var championIds = await context.Champions.AsNoTracking()
            .Select(c => c.Id)
            .ToListAsync(ct);
        var knownChampions = championIds.ToHashSet();
        var laneIds = rows.Where(r => r.IdLane is not null).Select(r => r.IdLane!.Value).Distinct().ToList();
        var knownLanes = laneIds.Count == 0
            ? []
            : await context.Lanes.AsNoTracking()
                .Where(l => laneIds.Contains(l.Id))
                .Select(l => l.Id)
                .ToListAsync(ct);

        foreach (var row in rows)
        {
            if (!knownChampions.Contains(row.IdChampion))
                throw new BadRequestException("UNKNOWN_CHAMPION", "Unknown champion");
            if (!kinds.ContainsKey(row.Kind ?? ""))
                throw new BadRequestException("UNKNOWN_CHAMPION_KIND", "Unknown champion kind");
            if (row.IdLane is int laneId && !knownLanes.Contains(laneId))
                throw new BadRequestException("UNKNOWN_LANE", "Unknown champion lane");
        }

        context.PlayerChampions.RemoveRange(target.PlayerChampions);
        foreach (var row in rows)
        {
            target.PlayerChampions.Add(new PlayerChampion
            {
                IdPlayer = target.Id,
                IdChampion = row.IdChampion,
                IdKind = kinds[row.Kind],
                IdLane = row.IdLane,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            });
        }
    }

    private static void ApplyRank(
        PlayerRankUpdateDto? rank,
        out string? tier,
        out string? division,
        out int? lp,
        string queue)
    {
        if (rank is null || string.IsNullOrWhiteSpace(rank.Tier))
        {
            tier = null;
            division = null;
            lp = null;
            return;
        }

        var normalizedTier = rank.Tier.Trim().ToLowerInvariant();
        if (!RankedTiers.Contains(normalizedTier))
            throw new BadRequestException($"{queue}_TIER_UNKNOWN", "Unknown ranked tier");

        var isApex = ApexTiers.Contains(normalizedTier);
        string? normalizedDivision = null;
        if (!string.IsNullOrWhiteSpace(rank.Division))
        {
            normalizedDivision = rank.Division.Trim();
            if (!RankedDivisions.Contains(normalizedDivision))
                throw new BadRequestException($"{queue}_DIVISION_UNKNOWN", "Unknown ranked division");
        }

        if (isApex)
        {
            if (normalizedDivision is not null)
                throw new BadRequestException($"{queue}_DIVISION_INVALID", "Master and above have no division");
        }
        else if (normalizedDivision is null)
        {
            throw new BadRequestException($"{queue}_DIVISION_REQUIRED", "This tier needs a division");
        }

        if (rank.Lp is { } value)
        {
            var maxLp = isApex ? 9999 : 100;
            if (value < 0 || value > maxLp)
                throw new BadRequestException($"{queue}_LP_INVALID", "LP is out of range");
            lp = value;
        }
        else
        {
            lp = null;
        }

        tier = normalizedTier;
        division = normalizedDivision;
    }

    private static string? NormalizeGameName(string? value)
    {
        var name = value?.Trim();
        if (string.IsNullOrEmpty(name))
            return null;
        if (name.Length is < 3 or > 16)
            throw new BadRequestException("GAME_NAME_INVALID", "Game name must be 3 to 16 characters");
        return name;
    }

    private static string? NormalizeTagLine(string? value)
    {
        var tag = value?.Trim();
        if (string.IsNullOrEmpty(tag))
            return null;
        if (!TagLinePattern.IsMatch(tag))
            throw new BadRequestException("TAG_LINE_INVALID", "Tag line must be 2 to 5 letters or digits");
        return tag.ToUpperInvariant();
    }

    private static string? NormalizeLayout(string layoutJson)
    {
        if (string.IsNullOrWhiteSpace(layoutJson))
            return null;

        if (layoutJson.Length > MaxLayoutLength)
            throw new BadRequestException("LAYOUT_TOO_LARGE", "Layout payload is too large");

        try
        {
            using var document = JsonDocument.Parse(layoutJson);
            if (document.RootElement.ValueKind is not (JsonValueKind.Object or JsonValueKind.Array))
                throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }
        catch (JsonException)
        {
            throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }

        return layoutJson;
    }

    private static string? NormalizePresentation(string? value)
    {
        var html = RichHtml.SanitizeOptional(value);
        if (html != null && html.Length > MaxPresentationLength)
            throw new BadRequestException("VALIDATION", $"Text must be at most {MaxPresentationLength} characters");

        return html;
    }

    private async Task<Player> ResolvePlayerAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is Guid publicId)
            return await context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (message.Id is int id)
            return await context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.Id == id, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        throw new BadRequestException("ID_MANDATORY", "Id mandatory");
    }

    private async Task<PlayerSheetDto> ToSheetDtoAsync(int playerId, CancellationToken ct)
    {
        var player = await context.Players.AsNoTracking()
            .Where(p => p.Id == playerId)
            .Select(p => new
            {
                p.PublicId,
                p.PlatformUserPublicId,
                p.PresentationIrl,
                p.PresentationIg,
                p.CreationDate,
                p.LayoutJson,
                p.GameName,
                p.TagLine,
                p.SoloTier,
                p.SoloDivision,
                p.SoloLp,
                p.FlexTier,
                p.FlexDivision,
                p.FlexLp,
                Region = p.IdRegionNavigation == null
                    ? null
                    : new CatalogItemDto
                    {
                        Id = p.IdRegionNavigation.Id,
                        Code = p.IdRegionNavigation.Code,
                    },
                PrimaryLane = p.IdPrimaryLaneNavigation == null
                    ? null
                    : new PlayerLaneDto
                    {
                        Id = p.IdPrimaryLaneNavigation.Id,
                        Code = p.IdPrimaryLaneNavigation.Code,
                    },
                SecondaryLanes = p.PlayerLanes
                    .OrderBy(l => l.IdLaneNavigation.SortOrder)
                    .Select(l => new PlayerLaneDto
                    {
                        Id = l.IdLaneNavigation.Id,
                        Code = l.IdLaneNavigation.Code,
                    })
                    .ToList(),
                Champions = p.PlayerChampions
                    .OrderBy(c => c.IdKindNavigation.SortOrder)
                    .ThenBy(c => c.IdChampionNavigation.Code)
                    .Select(c => new PlayerChampionDto
                    {
                        Id = c.IdChampionNavigation.Id,
                        Code = c.IdChampionNavigation.Code,
                        Kind = c.IdKindNavigation.Code,
                        Lane = c.IdLaneNavigation == null ? null : c.IdLaneNavigation.Code,
                    })
                    .ToList(),
                Snapshot = context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => new { s.Nickname, s.Discriminator, s.AvatarUrl })
                    .FirstOrDefault(),
            })
            .FirstAsync(ct);

        return new PlayerSheetDto
        {
            PublicId = player.PublicId,
            PlatformUserPublicId = player.PlatformUserPublicId ?? Guid.Empty,
            Nickname = player.Snapshot?.Nickname ?? "",
            Discriminator = player.Snapshot?.Discriminator ?? "",
            AvatarUrl = player.Snapshot?.AvatarUrl ?? "",
            PresentationIrl = player.PresentationIrl,
            PresentationIg = player.PresentationIg,
            CreationDate = player.CreationDate,
            LayoutJson = player.LayoutJson,
            GameName = player.GameName,
            TagLine = player.TagLine,
            Region = player.Region,
            PrimaryLane = player.PrimaryLane,
            SecondaryLanes = player.SecondaryLanes,
            Solo = ToRank(player.SoloTier, player.SoloDivision, player.SoloLp),
            Flex = ToRank(player.FlexTier, player.FlexDivision, player.FlexLp),
            Champions = player.Champions,
        };
    }

    private static PlayerRankDto? ToRank(string? tier, string? division, int? lp)
        => string.IsNullOrEmpty(tier)
            ? null
            : new PlayerRankDto { Tier = tier, Division = division, Lp = lp };
}
