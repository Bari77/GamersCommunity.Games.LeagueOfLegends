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

public class GamePostsService(LeagueOfLegendsDbContext context) : IBusService
{
    private const int MaxTake = 50;
    private const int MaxBodyLength = 4000;
    private const int MaxReasonLength = 500;
    private readonly LeagueOfLegendsDbContext _context = context;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;
    public string Resource => "GamePosts";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default) =>
        message.Action switch
        {
            "ListTeamWall" => JsonSafe.Serialize(await ListTeamWallAsync(message, ct)),
            "ListPending" => JsonSafe.Serialize(await ListPendingAsync(message, ct)),
            "Create" => JsonSafe.Serialize(await CreateAsync(message, ct)),
            "Update" => JsonSafe.Serialize(await UpdateAsync(message, ct)),
            "Moderate" => JsonSafe.Serialize(await ModerateAsync(message, ct)),
            "Delete" => JsonSafe.Serialize(await DeleteAsync(message, ct)),
            _ => throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented"),
        };

    private async Task<GamePostPageDto> ListTeamWallAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamWallRequest>(message.Data);
        var teamId = await RequireTeamIdAsync(request.TeamPublicId, ct);
        var take = request.Take is > 0 and <= MaxTake ? request.Take : 20;

        var query = _context.GamePosts.AsNoTracking()
            .Where(p => p.IdTeam == teamId && p.IdStatusNavigation.Code == GamePostStatusCodes.Approved);

        if (request.BeforePublicId is { } beforePublicId && request.BeforeCreationDate is { } beforeDate)
        {
            query = query.Where(p =>
                p.CreationDate < beforeDate
                || (p.CreationDate == beforeDate && p.PublicId.CompareTo(beforePublicId) < 0));
        }

        return await PageAsync(query, take, ct);
    }

    private async Task<GamePostPageDto> ListPendingAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamWallRequest>(message.Data);
        var teamId = await RequireTeamIdAsync(request.TeamPublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, teamId, caller.Id, TeamRankCodes.Coach, ct);

        var take = request.Take is > 0 and <= MaxTake ? request.Take : 20;
        var query = _context.GamePosts.AsNoTracking()
            .Where(p => p.IdTeam == teamId && p.IdStatusNavigation.Code == GamePostStatusCodes.Pending);

        return await PageAsync(query, take, ct);
    }

    private async Task<GamePostDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        var teamId = await RequireTeamIdAsync(request.TeamPublicId, ct);
        var standing = await TeamAuth.RequireStandingAsync(_context, teamId, caller.Id, TeamRankCodes.Player, ct);
        var body = NormalizePostBody(request.Body);
        var status = TeamAuth.CanModerate(standing.Rank)
            ? GamePostStatusCodes.Approved
            : GamePostStatusCodes.Pending;
        var now = DateTime.UtcNow;

        var post = new GamePost
        {
            PublicId = Guid.NewGuid(),
            IdTeam = teamId,
            IdPlayer = caller.Id,
            Body = body,
            IdStatus = await RequireStatusIdAsync(status, ct),
            CreationDate = now,
            ModificationDate = now,
        };

        if (status == GamePostStatusCodes.Approved)
        {
            post.IdModerator = caller.Id;
            post.ModeratedAt = now;
        }

        await _context.GamePosts.AddAsync(post, ct);
        await _context.SaveChangesAsync(ct);
        return await ToDtoAsync(post.Id, ct);
    }

    private async Task<GamePostDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostUpdateRequest>(message.Data);
        var post = await RequirePostAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        if (post.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Only the author can edit this post");

        var standing = await TeamAuth.RequireStandingAsync(_context, post.IdTeam, caller.Id, TeamRankCodes.Player, ct);
        var now = DateTime.UtcNow;
        var moderates = TeamAuth.CanModerate(standing.Rank);

        post.Body = NormalizePostBody(request.Body);
        post.IdStatus = await RequireStatusIdAsync(
            moderates ? GamePostStatusCodes.Approved : GamePostStatusCodes.Pending,
            ct);
        post.IdModerator = moderates ? caller.Id : null;
        post.ModeratedAt = moderates ? now : null;
        post.ModerationReason = null;
        post.ModificationDate = now;
        await _context.SaveChangesAsync(ct);
        return await ToDtoAsync(post.Id, ct);
    }

    private async Task<GamePostDto> ModerateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostModerateRequest>(message.Data);
        var post = await RequirePostAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        await TeamAuth.RequireStandingAsync(_context, post.IdTeam, caller.Id, TeamRankCodes.Coach, ct);

        var reason = string.IsNullOrWhiteSpace(request.Reason) ? null : request.Reason.Trim();
        if (reason is { Length: > MaxReasonLength })
            throw new BadRequestException("REASON_TOO_LONG", $"Reason cannot exceed {MaxReasonLength} characters");

        post.IdStatus = await RequireStatusIdAsync(
            request.Approve ? GamePostStatusCodes.Approved : GamePostStatusCodes.Rejected,
            ct);
        post.IdModerator = caller.Id;
        post.ModeratedAt = DateTime.UtcNow;
        post.ModerationReason = reason;
        post.ModificationDate = post.ModeratedAt.Value;
        await _context.SaveChangesAsync(ct);
        return await ToDtoAsync(post.Id, ct);
    }

    private async Task<GamePostTargetRequest> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<GamePostTargetRequest>(message.Data);
        var post = await RequirePostAsync(request.PublicId, ct);
        var caller = await CallerAuth.RequirePlayerAsync(_context, message, ct);
        if (post.IdPlayer != caller.Id)
            await TeamAuth.RequireStandingAsync(_context, post.IdTeam, caller.Id, TeamRankCodes.Coach, ct);

        _context.GamePosts.Remove(post);
        await _context.SaveChangesAsync(ct);
        return new GamePostTargetRequest { PublicId = post.PublicId };
    }

    private async Task<GamePostPageDto> PageAsync(IQueryable<GamePost> query, int take, CancellationToken ct)
    {
        var rows = await Project(query
                .OrderByDescending(p => p.CreationDate)
                .ThenByDescending(p => p.PublicId)
                .Take(take + 1))
            .ToListAsync(ct);

        var hasMore = rows.Count > take;
        if (hasMore)
            rows.RemoveAt(rows.Count - 1);

        return new GamePostPageDto { Items = rows, HasMore = hasMore };
    }

    private async Task<int> RequireTeamIdAsync(Guid teamPublicId, CancellationToken ct)
    {
        if (teamPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Team public id is required");

        return await _context.Teams.AsNoTracking()
            .Where(t => t.PublicId == teamPublicId)
            .Select(t => (int?)t.Id)
            .FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");
    }

    private async Task<GamePost> RequirePostAsync(Guid publicId, CancellationToken ct)
    {
        if (publicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Post public id is required");

        return await _context.GamePosts.FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
            ?? throw new NotFoundException("POST_NOT_FOUND", "Post not found");
    }

    private async Task<int> RequireStatusIdAsync(string code, CancellationToken ct) =>
        await _context.GamePostStatuses.AsNoTracking()
            .Where(s => s.Code == code)
            .Select(s => s.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new BadRequestException("INVALID_STATUS", $"Unknown post status '{code}'");

    private IQueryable<GamePostDto> Project(IQueryable<GamePost> posts) =>
        posts.Select(p => new GamePostDto
        {
            PublicId = p.PublicId,
            TeamPublicId = p.IdTeamNavigation.PublicId,
            Body = p.Body,
            Status = p.IdStatusNavigation.Code,
            CreationDate = p.CreationDate,
            AuthorPlayerPublicId = p.IdPlayerNavigation.PublicId,
            AuthorPlatformUserPublicId = p.IdPlayerNavigation.PlatformUserPublicId ?? Guid.Empty,
            AuthorNickname = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Nickname)
                .FirstOrDefault() ?? "Player",
            AuthorDiscriminator = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.Discriminator)
                .FirstOrDefault() ?? "0000",
            AuthorAvatarUrl = _context.PlatformUserSnapshots
                .Where(s => s.PlatformUserPublicId == p.IdPlayerNavigation.PlatformUserPublicId)
                .Select(s => s.AvatarUrl)
                .FirstOrDefault() ?? "",
            ModerationReason = p.ModerationReason,
            ModeratedAt = p.ModeratedAt,
        });

    private async Task<GamePostDto> ToDtoAsync(int postId, CancellationToken ct) =>
        await Project(_context.GamePosts.AsNoTracking().Where(p => p.Id == postId)).FirstAsync(ct);

    private static string NormalizePostBody(string? raw)
    {
        var body = RichHtml.SanitizeRequired(raw);
        if (body is null)
            throw new BadRequestException("VALIDATION", "Post body is required");
        if (body.Length > MaxBodyLength)
            throw new BadRequestException("BODY_TOO_LONG", $"Post cannot exceed {MaxBodyLength} characters");

        return body;
    }
}
