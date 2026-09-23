using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class GamePostStatusesSeed : KeyTableSeed<LeagueOfLegendsDbContext, GamePostStatus>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.GamePostStatuses);

    protected override DbSet<GamePostStatus> GetSet(LeagueOfLegendsDbContext db) => db.GamePostStatuses;

    protected override IReadOnlyList<GamePostStatus> Rows { get; } =
    [
        new() { Id = 1, Code = GamePostStatusCodes.Pending, SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = GamePostStatusCodes.Approved, SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = GamePostStatusCodes.Rejected, SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
