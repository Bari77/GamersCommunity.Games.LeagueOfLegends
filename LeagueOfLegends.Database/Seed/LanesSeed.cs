using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class LanesSeed : KeyTableSeed<LeagueOfLegendsDbContext, Lane>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.Lanes);

    protected override DbSet<Lane> GetSet(LeagueOfLegendsDbContext db) => db.Lanes;

    protected override IReadOnlyList<Lane> Rows { get; } =
    [
        new() { Id = 1, Code = "top", SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = "jungle", SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = "mid", SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Code = "bottom", SortOrder = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 5, Code = "support", SortOrder = 5, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
