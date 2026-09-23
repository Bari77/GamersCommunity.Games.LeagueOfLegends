using System.Text.RegularExpressions;
using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Consumer.Services;
using LeagueOfLegends.Consumer.Workspace;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class TeamsService(LeagueOfLegendsDbContext context) : IBusService
{
    private const int MaxSearchTake = 50;
    private const int MaxLayoutLength = 32000;
    private static readonly Regex TagPattern = new("^[A-Za-z0-9]{2,5}$", RegexOptions.Compiled);
    private readonly LeagueOfLegendsDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "Teams";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default) =>
        message.Action switch
        {
            "Get" => JsonSafe.Serialize(await GetSheetAsync(message, ct)),
            "Search" => JsonSafe.Serialize(await SearchAsync(message, ct)),
            "ListByPlayer" => JsonSafe.Serialize(await ListByPlayerAsync(message, ct)),
            "ListPostable" => JsonSafe.Serialize(await ListPostableAsync(message, ct)),
            "Create" => JsonSafe.Serialize(await CreateAsync(message, ct)),
            "Update" => JsonSafe.Serialize(await UpdateAsync(message, ct)),
            "SetRank" => JsonSafe.Serialize(await SetRankAsync(message, ct)),
            "SetRoster" => JsonSafe.Serialize(await SetRosterAsync(message, ct)),
            "Kick" => JsonSafe.Serialize(await KickAsync(message, ct)),
            "Leave" => JsonSafe.Serialize(await LeaveAsync(message, ct)),
            "TransferCaptaincy" => JsonSafe.Serialize(await TransferCaptaincyAsync(message, ct)),
            "Disband" => JsonSafe.Serialize(await DisbandAsync(message, ct)),
            _ => throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented"),
        };

    private async Task<TeamSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var publicId = ResolveTeamPublicId(message);
        var team = await _context.Teams.AsNoTracking()
            .Where(t => t.PublicId == publicId)
            .Select(t => new
            {
                t.Id,
                t.PublicId,
                t.Entitled,
                t.Discriminator,
                t.Tag,
                t.Sentence,
                t.LayoutJson,
                RegionCode = t.IdRegionNavigation != null ? t.IdRegionNavigation.Code : null,
                t.CreationDate,
                MemberCount = t.TeamMembers.Count,
                PlayerSlotCount = t.TeamMembers.Count(m => TeamRankCodes.PlayerSlots.Contains(m.IdTeamRankNavigation.Code)),
            })
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");

        var viewerId = await CallerAuth.FindPlayerIdAsync(_context, message, ct);
        var standing = viewerId is { } playerId
            ? await TeamAuth.FindStandingAsync(_context, team.Id, playerId, ct)
            : null;

        var application = viewerId is { } candidateId
            ? await _context.TeamApplications.AsNoTracking()
                .Where(a => a.IdTeam == team.Id && a.IdPlayer == candidateId)
                .OrderByDescending(a => a.CreationDate)
                .Select(a => new { a.PublicId, Status = a.IdStatusNavigation.Code })
                .FirstOrDefaultAsync(ct)
            : null;

        var moderates = TeamAuth.CanModerate(standing?.Rank);

        return new TeamSheetDto
        {
            PublicId = team.PublicId,
            Entitled = team.Entitled,
            Discriminator = team.Discriminator,
            Tag = team.Tag,
            Sentence = team.Sentence,
            LayoutJson = FilterPages(team.LayoutJson, standing?.Rank),
            RegionCode = team.RegionCode,
            CreationDate = team.CreationDate,
            MemberCount = team.MemberCount,
            PlayerSlotCount = team.PlayerSlotCount,
            Members = await ListMembersAsync(team.Id, ct),
            ViewerRank = standing?.Rank,
            ViewerApplicationStatus = application?.Status,
            ViewerApplicationPublicId = application?.PublicId,
            PendingApplicationCount = moderates
                ? await _context.TeamApplications.CountAsync(
                    a => a.IdTeam == team.Id && a.IdStatusNavigation.Code == TeamApplicationStatusCodes.Pending,
                    ct)
                : 0,
        };
    }

    private async Task<List<TeamMemberDto>> ListMembersAsync(int teamId, CancellationToken ct) =>
        await _context.TeamMembers.AsNoTracking()
            .Where(m => m.IdTeam == teamId)
            .OrderBy(m => m.IdTeamRankNavigation.SortOrder)
            .ThenBy(m => m.CreationDate)
            .Select(m => new TeamMemberDto
            {
                PlayerPublicId = m.IdPlayerNavigation.PublicId,
                PlatformUserPublicId = m.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
                Nickname = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == m.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.Nickname)
                    .FirstOrDefault() ?? "Player",
                Discriminator = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == m.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.Discriminator)
                    .FirstOrDefault() ?? "0000",
                AvatarUrl = _context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == m.IdPlayerNavigation.PlatformUserPublicId)
                    .Select(s => s.AvatarUrl)
                    .FirstOrDefault() ?? "",
                Rank = m.IdTeamRankNavigation.Code,
                GameName = m.IdPlayerNavigation.GameName,
                TagLine = m.IdPlayerNavigation.TagLine,
                IdLane = m.IdLane ?? m.IdPlayerNavigation.IdPrimaryLane,
                LaneCode = m.IdLaneNavigation != null
                    ? m.IdLaneNavigation.Code
                    : m.IdPlayerNavigation.IdPrimaryLaneNavigation != null
                        ? m.IdPlayerNavigation.IdPrimaryLaneNavigation.Code
                        : null,
                RosterKind = m.RosterKind,
                JoinedAt = m.CreationDate,
            })
            .ToListAsync(ct);

    private async Task<TeamSearchResultDto> SearchAsync(BusMessage message, CancellationToken ct)
    {
        var request = string.IsNullOrWhiteSpace(message.Data)
            ? new TeamSearchRequest()
            : ConsumerParamParser.ToObject<TeamSearchRequest>(message.Data);

        var take = request.Take is > 0 and <= MaxSearchTake ? request.Take : 20;
        var query = _context.Teams.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var (name, discriminator) = SearchHandle.Split(request.Query);
            query = query.Where(t => t.Entitled.Contains(name) || (t.Tag != null && t.Tag.Contains(name)));
            if (discriminator is not null)
                query = query.Where(t => t.Discriminator == discriminator);
        }

        if (request.IdRegion is { } idRegion)
            query = query.Where(t => t.IdRegion == idRegion);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(t =>
                t.CreationDate < beforeDate
                || (t.CreationDate == beforeDate && t.PublicId.CompareTo(beforePublicId) < 0));
        }

        var rows = await query
            .OrderByDescending(t => t.CreationDate)
            .ThenByDescending(t => t.PublicId)
            .Take(take + 1)
            .Select(t => new TeamSummaryDto
            {
                PublicId = t.PublicId,
                Entitled = t.Entitled,
                Discriminator = t.Discriminator,
                Tag = t.Tag,
                Sentence = t.Sentence,
                RegionCode = t.IdRegionNavigation != null ? t.IdRegionNavigation.Code : null,
                CreationDate = t.CreationDate,
                MemberCount = t.TeamMembers.Count,
                PlayerSlotCount = t.TeamMembers.Count(m => TeamRankCodes.PlayerSlots.Contains(m.IdTeamRankNavigation.Code)),
            })
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new TeamSearchResultDto { Items = rows, HasMore = hasMore };
    }

    private async Task<List<PlayerTeamDto>> ListByPlayerAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamListByPlayerRequest>(message.Data);
        if (request.PlayerPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Player public id is required");

        var playerId = await _context.Players.AsNoTracking()
            .Where(p => p.PublicId == request.PlayerPublicId)
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("PLAYER_NOT_FOUND", "Player not found");

        return await _context.TeamMembers.AsNoTracking()
            .Where(m => m.IdPlayer == playerId)
            .OrderBy(m => m.IdTeamRankNavigation.SortOrder)
            .ThenBy(m => m.IdTeamNavigation.Entitled)
            .ThenBy(m => m.IdTeamNavigation.Discriminator)
            .Select(m => new PlayerTeamDto
            {
                PublicId = m.IdTeamNavigation.PublicId,
                Entitled = m.IdTeamNavigation.Entitled,
                Discriminator = m.IdTeamNavigation.Discriminator,
                Tag = m.IdTeamNavigation.Tag,
                RegionCode = m.IdTeamNavigation.IdRegionNavigation != null
                    ? m.IdTeamNavigation.IdRegionNavigation.Code
                    : null,
                Rank = m.IdTeamRankNavigation.Code,
                LaneCode = m.IdLaneNavigation != null
                    ? m.IdLaneNavigation.Code
                    : m.IdPlayerNavigation.IdPrimaryLaneNavigation != null
                        ? m.IdPlayerNavigation.IdPrimaryLaneNavigation.Code
                        : null,
                RosterKind = m.RosterKind,
                MemberCount = m.IdTeamNavigation.TeamMembers.Count,
                PlayerSlotCount = m.IdTeamNavigation.TeamMembers.Count(
                    other => TeamRankCodes.PlayerSlots.Contains(other.IdTeamRankNavigation.Code)),
            })
            .ToListAsync(ct);
    }

    private async Task<List<PostableTeamDto>> ListPostableAsync(BusMessage message, CancellationToken ct)
    {
        var idKeycloak = CallerAuth.RequireKeycloakId(message);

        return await _context.TeamMembers.AsNoTracking()
            .Where(m => m.IdPlayerNavigation.IdKeycloak == idKeycloak
                        && TeamRankCodes.CanPostAsTeam.Contains(m.IdTeamRankNavigation.Code))
            .Select(m => new PostableTeamDto
            {
                PublicId = m.IdTeamNavigation.PublicId,
                Entitled = m.IdTeamNavigation.Entitled,
                Discriminator = m.IdTeamNavigation.Discriminator,
                Rank = m.IdTeamRankNavigation.Code,
            })
            .OrderBy(t => t.Entitled)
            .ThenBy(t => t.Discriminator)
            .ToListAsync(ct);
    }

    private async Task<TeamSheetDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var entitled = (request.Entitled ?? "").Trim();
        if (entitled.Length is < 3 or > 50)
            throw new BadRequestException("VALIDATION", "Team name must be between 3 and 50 characters");

        var now = DateTime.UtcNow;
        var team = new Team
        {
            PublicId = Guid.NewGuid(),
            Entitled = entitled,
            Discriminator = await AllocateDiscriminatorAsync(entitled, ct),
            Tag = NormalizeTag(request.Tag),
            Sentence = NormalizeSentence(request.Sentence),
            IdCaptain = caller.Id,
            IdRegion = caller.IdRegion,
            CreationDate = now,
            ModificationDate = now,
        };

        await _context.Teams.AddAsync(team, ct);
        await _context.SaveChangesAsync(ct);

        var captain = new TeamMember
        {
            PublicId = Guid.NewGuid(),
            IdTeam = team.Id,
            IdPlayer = caller.Id,
            IdTeamRank = await TeamAuth.RequireRankIdAsync(_context, TeamRankCodes.Captain, ct),
            CreationDate = now,
            ModificationDate = now,
        };
        if (caller.IdPrimaryLane is { })
            await ApplyPlayerSeatAsync(_context, captain, team.Id, caller.IdPrimaryLane, RosterKindCodes.Main, ct);
        await _context.TeamMembers.AddAsync(captain, ct);
        await _context.SaveChangesAsync(ct);

        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamSheetDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var publicId = ResolveTeamPublicId(message);
        var request = ConsumerParamParser.ToObject<TeamUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var team = await RequireTeamAsync(publicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var standing = await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Manager, ct);

        if (sent.Contains(nameof(TeamUpdateRequest.Sentence)))
            team.Sentence = NormalizeSentence(request.Sentence);
        if (sent.Contains(nameof(TeamUpdateRequest.Tag)))
            team.Tag = NormalizeTag(request.Tag);
        if (sent.Contains(nameof(TeamUpdateRequest.Entitled)))
            await RenameAsync(team, request.Entitled, ct);

        if (sent.Contains(nameof(TeamUpdateRequest.LayoutJson)))
        {
            if (standing.Rank != TeamRankCodes.Captain)
                throw new ForbiddenException("TEAM_RANK_REQUIRED", "Only the captain can change the team layout");
            team.LayoutJson = NormalizeLayout(request.LayoutJson);
        }

        team.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamSheetDto> SetRankAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamSetRankRequest>(message.Data);
        var rank = (request.Rank ?? "").Trim().ToLowerInvariant();
        if (rank is not (TeamRankCodes.Player or TeamRankCodes.Coach or TeamRankCodes.Manager))
            throw new BadRequestException("VALIDATION", "Rank must be 'player', 'coach' or 'manager'; use TransferCaptaincy for the lead");

        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Captain, ct);

        var membership = await RequireMembershipAsync(team.Id, request.PlayerPublicId, ct);
        if (membership.IdPlayer == team.IdCaptain)
            throw new BadRequestException("CANNOT_DEMOTE_CAPTAIN", "Transfer captaincy before changing the captain's rank");

        await EnsureRankSlotAvailableAsync(team.Id, rank, membership.Id, ct);
        membership.IdTeamRank = await TeamAuth.RequireRankIdAsync(_context, rank, ct);

        if (TeamRankCodes.IsPlayerSlot(rank))
        {
            var playerLane = await _context.Players.AsNoTracking()
                .Where(p => p.Id == membership.IdPlayer)
                .Select(p => p.IdPrimaryLane)
                .FirstAsync(ct);
            var laneId = membership.IdLane ?? playerLane;
            if (laneId is { })
            {
                var kind = membership.RosterKind
                           ?? await DefaultRosterKindAsync(_context, team.Id, laneId, membership.Id, ct);
                await ApplyPlayerSeatAsync(_context, membership, team.Id, laneId, kind, ct);
            }
        }
        else
        {
            ClearPlayerSeat(membership);
        }

        membership.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamSheetDto> SetRosterAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamSetRosterRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Captain, ct);

        var membership = await RequireMembershipAsync(team.Id, request.PlayerPublicId, ct);
        var rank = await _context.TeamRanks.AsNoTracking()
            .Where(r => r.Id == membership.IdTeamRank)
            .Select(r => r.Code)
            .FirstAsync(ct);
        if (!TeamRankCodes.IsPlayerSlot(rank))
            throw new BadRequestException("VALIDATION", "Only players have a main or sub seat");

        await ApplyPlayerSeatAsync(_context, membership, team.Id, request.IdLane, request.RosterKind, ct);
        membership.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamSheetDto> KickAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamMemberTargetRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var standing = await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Coach, ct);
        var membership = await RequireMembershipAsync(team.Id, request.PlayerPublicId, ct);
        if (membership.IdPlayer == caller.Id)
            throw new BadRequestException("CANNOT_KICK_SELF", "Use Leave to quit a team");

        var targetRank = await _context.TeamRanks.AsNoTracking()
            .Where(r => r.Id == membership.IdTeamRank)
            .Select(r => r.Code)
            .FirstAsync(ct);

        if (!TeamAuth.CanKick(standing.Rank, targetRank))
            throw new ForbiddenException("TEAM_RANK_REQUIRED", "Cannot kick a member of that rank");

        _context.TeamMembers.Remove(membership);
        await _context.SaveChangesAsync(ct);
        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamLeaveResult> LeaveAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamMemberTargetRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var membership = await RequireMembershipAsync(team.Id, request.PlayerPublicId, ct);
        if (membership.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot make another player leave");
        if (membership.IdPlayer == team.IdCaptain)
            throw new BadRequestException("CAPTAIN_CANNOT_LEAVE", "Transfer captaincy or disband the team first");

        _context.TeamMembers.Remove(membership);
        await _context.SaveChangesAsync(ct);
        return new TeamLeaveResult { TeamPublicId = team.PublicId };
    }

    private async Task<TeamSheetDto> TransferCaptaincyAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamMemberTargetRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Captain, ct);

        var successor = await RequireMembershipAsync(team.Id, request.PlayerPublicId, ct);
        if (successor.IdPlayer == team.IdCaptain)
            throw new BadRequestException("ALREADY_CAPTAIN", "That player already captains the team");

        var successorRank = await _context.TeamRanks.AsNoTracking()
            .Where(r => r.Id == successor.IdTeamRank)
            .Select(r => r.Code)
            .FirstAsync(ct);
        if (!TeamRankCodes.IsPlayerSlot(successorRank))
            throw new BadRequestException("PLAYER_SLOT_REQUIRED", "Captaincy can only move to a player-slot member");

        var former = await _context.TeamMembers
            .FirstOrDefaultAsync(m => m.IdTeam == team.Id && m.IdPlayer == team.IdCaptain, ct);

        var now = DateTime.UtcNow;
        successor.IdTeamRank = await TeamAuth.RequireRankIdAsync(_context, TeamRankCodes.Captain, ct);
        successor.ModificationDate = now;
        if (former is not null)
        {
            former.IdTeamRank = await TeamAuth.RequireRankIdAsync(_context, TeamRankCodes.Player, ct);
            former.ModificationDate = now;
        }

        team.IdCaptain = successor.IdPlayer;
        team.ModificationDate = now;
        await _context.SaveChangesAsync(ct);
        return await GetSheetAsync(TeamMessageFor(message, team.PublicId), ct);
    }

    private async Task<TeamDisbandResult> DisbandAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamDisbandRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Captain, ct);

        var handle = $"{team.Entitled}#{team.Discriminator}";
        if (!string.Equals((request.Confirmation ?? "").Trim(), handle, StringComparison.Ordinal))
            throw new BadRequestException("CONFIRMATION_MISMATCH", "Type the team handle to confirm");

        _context.TeamApplications.RemoveRange(await _context.TeamApplications.Where(a => a.IdTeam == team.Id).ToListAsync(ct));
        _context.GamePosts.RemoveRange(await _context.GamePosts.Where(p => p.IdTeam == team.Id).ToListAsync(ct));
        _context.LfgAds.RemoveRange(await _context.LfgAds.Where(a => a.IdTeam == team.Id).ToListAsync(ct));
        _context.TeamLinks.RemoveRange(await _context.TeamLinks.Where(l => l.IdTeam == team.Id).ToListAsync(ct));
        _context.TeamMembers.RemoveRange(await _context.TeamMembers.Where(m => m.IdTeam == team.Id).ToListAsync(ct));
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync(ct);
        return new TeamDisbandResult { PublicId = team.PublicId, Handle = handle };
    }

    internal static async Task EnsureRankSlotAvailableAsync(
        LeagueOfLegendsDbContext context,
        int teamId,
        string rank,
        int? exceptMemberId,
        CancellationToken ct)
    {
        if (rank == TeamRankCodes.Captain)
            throw new BadRequestException("VALIDATION", "Use TransferCaptaincy for the captain slot");

        if (!TeamRankCodes.IsStaff(rank))
            return;

        var taken = await context.TeamMembers.AsNoTracking()
            .AnyAsync(
                m => m.IdTeam == teamId
                     && m.IdTeamRankNavigation.Code == rank
                     && (exceptMemberId == null || m.Id != exceptMemberId),
                ct);
        if (taken)
            throw new BadRequestException("STAFF_SLOT_TAKEN", $"The {rank} seat is already taken");
    }

    internal static async Task ApplyPlayerSeatAsync(
        LeagueOfLegendsDbContext context,
        TeamMember membership,
        int teamId,
        int? idLane,
        string? rosterKind,
        CancellationToken ct)
    {
        if (idLane is not { } laneId)
            throw new BadRequestException("VALIDATION", "A lane is required for a player seat");
        if (!await context.Lanes.AnyAsync(l => l.Id == laneId, ct))
            throw new BadRequestException("VALIDATION", "Unknown lane");

        var kind = (rosterKind ?? RosterKindCodes.Sub).Trim().ToLowerInvariant();
        if (!RosterKindCodes.IsValid(kind))
            throw new BadRequestException("VALIDATION", "Roster kind must be main or sub");

        if (kind == RosterKindCodes.Main)
        {
            var others = await context.TeamMembers
                .Where(m =>
                    m.IdTeam == teamId
                    && m.Id != membership.Id
                    && m.IdLane == laneId
                    && m.RosterKind == RosterKindCodes.Main)
                .ToListAsync(ct);
            foreach (var other in others)
                other.RosterKind = RosterKindCodes.Sub;
        }

        membership.IdLane = laneId;
        membership.RosterKind = kind;
    }

    internal static void ClearPlayerSeat(TeamMember membership)
    {
        membership.IdLane = null;
        membership.RosterKind = null;
    }

    internal static async Task<string> DefaultRosterKindAsync(
        LeagueOfLegendsDbContext context,
        int teamId,
        int? idLane,
        int? exceptMemberId,
        CancellationToken ct)
    {
        if (idLane is not { } laneId)
            return RosterKindCodes.Sub;

        var hasMain = await context.TeamMembers.AsNoTracking()
            .AnyAsync(
                m => m.IdTeam == teamId
                     && m.IdLane == laneId
                     && m.RosterKind == RosterKindCodes.Main
                     && (exceptMemberId == null || m.Id != exceptMemberId),
                ct);
        return hasMain ? RosterKindCodes.Sub : RosterKindCodes.Main;
    }

    private Task EnsureRankSlotAvailableAsync(int teamId, string rank, int? exceptMemberId, CancellationToken ct) =>
        EnsureRankSlotAvailableAsync(_context, teamId, rank, exceptMemberId, ct);

    private async Task<Team> RequireTeamAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Team public id is required");

        return await _context.Teams.FirstOrDefaultAsync(t => t.PublicId == publicId, ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");
    }

    private async Task<TeamMember> RequireMembershipAsync(int teamId, Guid playerPublicId, CancellationToken ct)
    {
        if (playerPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Player public id is required");

        return await _context.TeamMembers
                   .FirstOrDefaultAsync(m => m.IdTeam == teamId && m.IdPlayerNavigation.PublicId == playerPublicId, ct)
               ?? throw new NotFoundException("TEAM_MEMBER_NOT_FOUND", "That player is not a member of this team");
    }

    private async Task<string> AllocateDiscriminatorAsync(string entitled, CancellationToken ct)
    {
        var taken = await _context.Teams.AsNoTracking()
            .Where(t => t.Entitled == entitled)
            .Select(t => t.Discriminator)
            .ToListAsync(ct);

        if (taken.Count >= 9000)
            throw new BadRequestException("TEAM_NAME_EXHAUSTED", "Too many teams already use that name");

        string candidate;
        do
        {
            candidate = Random.Shared.Next(1000, 10000).ToString();
        } while (taken.Contains(candidate));

        return candidate;
    }

    private async Task RenameAsync(Team team, string? entitled, CancellationToken ct)
    {
        var name = (entitled ?? "").Trim();
        if (name.Length is < 3 or > 50)
            throw new BadRequestException("VALIDATION", "Team name must be between 3 and 50 characters");
        if (string.Equals(name, team.Entitled, StringComparison.Ordinal))
            return;

        team.Entitled = name;
        team.Discriminator = await AllocateDiscriminatorAsync(name, ct);
    }

    private static string? NormalizeTag(string? tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            return null;
        var value = tag.Trim();
        if (!TagPattern.IsMatch(value))
            throw new BadRequestException("VALIDATION", "Tag must be 2 to 5 letters or digits");
        return value.ToUpperInvariant();
    }

    private static string? NormalizeSentence(string? sentence)
    {
        if (string.IsNullOrWhiteSpace(sentence))
            return null;
        var text = RichHtml.SanitizeOptional(sentence)?.Trim();
        return string.IsNullOrWhiteSpace(text) ? null : text;
    }

    private static string? NormalizeLayout(string? layout)
    {
        if (string.IsNullOrWhiteSpace(layout))
            return null;
        if (layout.Length > MaxLayoutLength)
            throw new BadRequestException("VALIDATION", "Layout is too large");
        return layout;
    }

    /// <summary>
    /// Drops the pages the visitor's rank does not reach. A page without a visibility, or marked
    /// public, is open to everyone; the others name the lowest rank allowed to open them.
    /// </summary>
    private static string? FilterPages(string? layoutJson, string? viewerRank)
    {
        var weight = TeamAuth.Weight(viewerRank);

        return WorkspaceVisibility.Filter(
            layoutJson,
            visibility => visibility is null
                          || visibility == "public"
                          || weight >= TeamAuth.Weight(visibility));
    }

    private static BusMessage TeamMessageFor(BusMessage source, Guid teamPublicId) => new()
    {
        Type = source.Type,
        Resource = source.Resource,
        Action = "Get",
        PublicId = teamPublicId,
        Caller = source.Caller,
    };

    private static Guid ResolveTeamPublicId(BusMessage message)
    {
        if (message.PublicId is { } fromRoute && fromRoute != Guid.Empty)
            return fromRoute;
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("VALIDATION", "Team public id is required");

        using var doc = System.Text.Json.JsonDocument.Parse(message.Data);
        if (doc.RootElement.TryGetProperty("publicId", out var prop) && Guid.TryParse(prop.GetString(), out var id))
            return id;
        if (doc.RootElement.TryGetProperty("teamPublicId", out var teamProp) && Guid.TryParse(teamProp.GetString(), out var teamId))
            return teamId;

        throw new BadRequestException("VALIDATION", "Team public id is required");
    }
}
