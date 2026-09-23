using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class TeamRanksSeed : KeyTableSeed<LeagueOfLegendsDbContext, TeamRank>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.TeamRanks);

    protected override DbSet<TeamRank> GetSet(LeagueOfLegendsDbContext db) => db.TeamRanks;

    protected override IReadOnlyList<TeamRank> Rows { get; } =
    [
        new() { Id = 1, Code = TeamRankCodes.Captain, SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = TeamRankCodes.Player, SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = TeamRankCodes.Coach, SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Code = TeamRankCodes.Manager, SortOrder = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
