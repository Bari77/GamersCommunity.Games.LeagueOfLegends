using GamersCommunity.Core.Exceptions;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Security;

public static class TeamAuth
{
    public sealed record TeamStanding(string Rank, int PlayerId);

    public static int Weight(string? rank) => rank switch
    {
        TeamRankCodes.Captain => 4,
        TeamRankCodes.Manager => 3,
        TeamRankCodes.Coach => 2,
        TeamRankCodes.Player => 1,
        _ => 0,
    };

    public static bool CanModerate(string? rank) => TeamRankCodes.CanModerate.Contains(rank);

    public static bool CanEditSheet(string? rank) => rank is TeamRankCodes.Captain or TeamRankCodes.Manager;

    public static bool CanKick(string? actor, string? target) =>
        actor switch
        {
            TeamRankCodes.Captain => target is not TeamRankCodes.Captain,
            TeamRankCodes.Coach or TeamRankCodes.Manager => target == TeamRankCodes.Player,
            _ => false,
        };

    public static async Task<TeamStanding?> FindStandingAsync(
        LeagueOfLegendsDbContext context,
        int teamId,
        int playerId,
        CancellationToken ct)
    {
        var rank = await context.TeamMembers.AsNoTracking()
            .Where(m => m.IdTeam == teamId && m.IdPlayer == playerId)
            .Select(m => m.IdTeamRankNavigation.Code)
            .FirstOrDefaultAsync(ct);

        return rank is null ? null : new TeamStanding(rank, playerId);
    }

    public static async Task<TeamStanding> RequireStandingAsync(
        LeagueOfLegendsDbContext context,
        int teamId,
        int playerId,
        string minimumRank,
        CancellationToken ct)
    {
        var standing = await FindStandingAsync(context, teamId, playerId, ct)
            ?? throw new ForbiddenException("TEAM_MEMBER_REQUIRED", "You are not a member of this team");

        if (Weight(standing.Rank) < Weight(minimumRank))
            throw new ForbiddenException("TEAM_RANK_REQUIRED", $"Rank '{minimumRank}' or above is required");

        return standing;
    }

    public static async Task<int> RequireRankIdAsync(
        LeagueOfLegendsDbContext context,
        string rank,
        CancellationToken ct) =>
        await context.TeamRanks.AsNoTracking()
            .Where(r => r.Code == rank)
            .Select(r => r.Id)
            .FirstOrDefaultAsync(ct) is var id && id != 0
            ? id
            : throw new InternalServerErrorException("TEAM_RANK_MISSING", $"Team rank '{rank}' is not seeded");
}
