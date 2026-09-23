using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class PlayerChampionKindsSeed : KeyTableSeed<LeagueOfLegendsDbContext, PlayerChampionKind>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.PlayerChampionKinds);

    protected override DbSet<PlayerChampionKind> GetSet(LeagueOfLegendsDbContext db) => db.PlayerChampionKinds;

    protected override IReadOnlyList<PlayerChampionKind> Rows { get; } =
    [
        new() { Id = 1, Code = "main", SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = "pool", SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = "learning", SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
