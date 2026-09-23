using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Platform;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Integration;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class TeamApplicationsService(
    LeagueOfLegendsDbContext context,
    ITeamWhispers whispers,
    IPlatformSanctionsClient sanctions) : IBusService
{
    private const int MaxMessageLength = 1000;
    private readonly LeagueOfLegendsDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "TeamApplications";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default) =>
        message.Action switch
        {
            "Create" => JsonSafe.Serialize(await CreateAsync(message, ct)),
            "ListMine" => JsonSafe.Serialize(await ListMineAsync(message, ct)),
            "List" => JsonSafe.Serialize(await ListForTeamAsync(message, ct)),
            "Review" => JsonSafe.Serialize(await ReviewAsync(message, ct)),
            "Withdraw" => JsonSafe.Serialize(await WithdrawAsync(message, ct)),
            _ => throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented"),
        };

    private async Task<TeamApplicationDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamApplicationCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await sanctions.EnsureCanPublishAsync(message, ct);
        var text = (RichHtml.SanitizeRequired(request.Message) ?? "").Trim();
        if (text.Length == 0)
            throw new BadRequestException("VALIDATION", "An application message is required");
        if (text.Length > MaxMessageLength)
            throw new BadRequestException("MESSAGE_TOO_LONG", $"Message cannot exceed {MaxMessageLength} characters");

        var team = await _context.Teams.AsNoTracking()
            .FirstOrDefaultAsync(t => t.PublicId == request.TeamPublicId, ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");

        if (await _context.TeamMembers.AnyAsync(m => m.IdTeam == team.Id && m.IdPlayer == caller.Id, ct))
            throw new BadRequestException("ALREADY_MEMBER", "You already belong to this team");

        var alreadyPending = await _context.TeamApplications.AnyAsync(
            a => a.IdTeam == team.Id
                 && a.IdPlayer == caller.Id
                 && a.IdStatusNavigation.Code == TeamApplicationStatusCodes.Pending,
            ct);
        if (alreadyPending)
            throw new BadRequestException("APPLICATION_PENDING", "You already have a pending application");

        var soughtRank = (request.SoughtRank ?? "").Trim().ToLowerInvariant();
        if (soughtRank is not (TeamRankCodes.Player or TeamRankCodes.Coach or TeamRankCodes.Manager))
            throw new BadRequestException("VALIDATION", "Apply as player, coach or manager");

        int? idLane = null;
        if (soughtRank == TeamRankCodes.Player)
        {
            if (request.IdLane is not { } laneId)
                throw new BadRequestException("VALIDATION", "A lane is required for a player application");
            if (!await _context.Lanes.AnyAsync(l => l.Id == laneId, ct))
                throw new BadRequestException("VALIDATION", "Unknown lane");
            idLane = laneId;
        }

        var now = DateTime.UtcNow;
        var application = new TeamApplication
        {
            PublicId = Guid.NewGuid(),
            IdTeam = team.Id,
            IdPlayer = caller.Id,
            Message = text,
            IdStatus = await RequireStatusIdAsync(TeamApplicationStatusCodes.Pending, ct),
            IdSoughtRank = await TeamAuth.RequireRankIdAsync(_context, soughtRank, ct),
            IdLane = idLane,
            CreationDate = now,
            ModificationDate = now,
        };

        await _context.TeamApplications.AddAsync(application, ct);
        await _context.SaveChangesAsync(ct);
        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<List<TeamApplicationDto>> ListMineAsync(BusMessage message, CancellationToken ct)
    {
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        return await Project(_context.TeamApplications.AsNoTracking()
                .Where(a => a.IdPlayer == caller.Id)
                .OrderByDescending(a => a.CreationDate))
            .ToListAsync(ct);
    }

    private async Task<List<TeamApplicationDto>> ListForTeamAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamApplicationListRequest>(message.Data);
        var team = await _context.Teams.AsNoTracking()
            .FirstOrDefaultAsync(t => t.PublicId == request.TeamPublicId, ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");

        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, team.Id, caller.Id, TeamRankCodes.Coach, ct);

        var status = string.IsNullOrWhiteSpace(request.Status)
            ? TeamApplicationStatusCodes.Pending
            : request.Status.Trim().ToLowerInvariant();

        return await Project(_context.TeamApplications.AsNoTracking()
                .Where(a => a.IdTeam == team.Id && a.IdStatusNavigation.Code == status)
                .OrderBy(a => a.CreationDate))
            .ToListAsync(ct);
    }

    private async Task<TeamApplicationDto> ReviewAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamApplicationReviewRequest>(message.Data);
        var application = await RequirePendingAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, application.IdTeam, caller.Id, TeamRankCodes.Coach, ct);

        var now = DateTime.UtcNow;
        if (request.Accept)
        {
            if (await _context.TeamMembers.AnyAsync(m => m.IdTeam == application.IdTeam && m.IdPlayer == application.IdPlayer, ct))
                throw new BadRequestException("ALREADY_MEMBER", "This player joined the team in the meantime");

            var soughtRank = await _context.TeamRanks.AsNoTracking()
                .Where(r => r.Id == application.IdSoughtRank)
                .Select(r => r.Code)
                .FirstAsync(ct);

            await TeamsService.EnsureRankSlotAvailableAsync(_context, application.IdTeam, soughtRank, null, ct);

            var member = new TeamMember
            {
                PublicId = Guid.NewGuid(),
                IdTeam = application.IdTeam,
                IdPlayer = application.IdPlayer,
                IdTeamRank = application.IdSoughtRank,
                CreationDate = now,
                ModificationDate = now,
            };
            if (TeamRankCodes.IsPlayerSlot(soughtRank) && application.IdLane is { })
            {
                var kind = await TeamsService.DefaultRosterKindAsync(
                    _context,
                    application.IdTeam,
                    application.IdLane,
                    null,
                    ct);
                await TeamsService.ApplyPlayerSeatAsync(
                    _context,
                    member,
                    application.IdTeam,
                    application.IdLane,
                    kind,
                    ct);
            }

            await _context.TeamMembers.AddAsync(member, ct);
        }

        application.IdStatus = await RequireStatusIdAsync(
            request.Accept ? TeamApplicationStatusCodes.Accepted : TeamApplicationStatusCodes.Rejected,
            ct);
        application.IdReviewer = caller.Id;
        application.ReviewedAt = now;
        application.ModificationDate = now;
        await _context.SaveChangesAsync(ct);
        if (request.Accept)
        {
            var team = await _context.Teams.AsNoTracking().FirstAsync(t => t.Id == application.IdTeam, ct);
            await whispers.OnMemberJoinedAsync(team, application.IdPlayer, ct);
        }
        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<TeamApplicationDto> WithdrawAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamApplicationTargetRequest>(message.Data);
        var application = await RequirePendingAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        if (application.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot withdraw another player's application");

        application.IdStatus = await RequireStatusIdAsync(TeamApplicationStatusCodes.Withdrawn, ct);
        application.ModificationDate = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return await ToDtoAsync(application.Id, ct);
    }

    private async Task<TeamApplication> RequirePendingAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Application public id is required");

        var application = await _context.TeamApplications
            .FirstOrDefaultAsync(a => a.PublicId == publicId, ct)
            ?? throw new NotFoundException("APPLICATION_NOT_FOUND", "Application not found");

        var status = await _context.TeamApplicationStatuses.AsNoTracking()
            .Where(s => s.Id == application.IdStatus)
            .Select(s => s.Code)
            .FirstAsync(ct);

        if (status != TeamApplicationStatusCodes.Pending)
            throw new BadRequestException("APPLICATION_CLOSED", "This application has already been handled");

        return application;
    }

    private async Task<int> RequireStatusIdAsync(string code, CancellationToken ct) =>
        await _context.TeamApplicationStatuses.AsNoTracking()
            .Where(s => s.Code == code)
            .Select(s => s.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new BadRequestException("INVALID_STATUS", $"Unknown application status '{code}'");

    private IQueryable<TeamApplicationDto> Project(IQueryable<TeamApplication> applications) =>
        applications.Select(a => new TeamApplicationDto
        {
            PublicId = a.PublicId,
            Message = a.Message,
            Status = a.IdStatusNavigation.Code,
            SoughtRank = a.IdSoughtRankNavigation.Code,
            LaneCode = a.IdLaneNavigation != null ? a.IdLaneNavigation.Code : null,
            CreationDate = a.CreationDate,
            ReviewedAt = a.ReviewedAt,
            TeamPublicId = a.IdTeamNavigation.PublicId,
            TeamName = a.IdTeamNavigation.Entitled,
            TeamDiscriminator = a.IdTeamNavigation.Discriminator,
            PlayerPublicId = a.IdPlayerNavigation.PublicId,
            PlatformUserPublicId = a.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            Nickname = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == a.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            Discriminator = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == a.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            AvatarUrl = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == a.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
        });

    private async Task<TeamApplicationDto> ToDtoAsync(int applicationId, CancellationToken ct) =>
        await Project(_context.TeamApplications.AsNoTracking().Where(a => a.Id == applicationId))
            .FirstAsync(ct);
}
