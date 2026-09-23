using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class RegionsSeed : KeyTableSeed<LeagueOfLegendsDbContext, Region>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.Regions);

    protected override DbSet<Region> GetSet(LeagueOfLegendsDbContext db) => db.Regions;

    protected override IReadOnlyList<Region> Rows { get; } =
    [
        new() { Id = 1, Code = "euw", SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = "eune", SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = "na", SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Code = "kr", SortOrder = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
