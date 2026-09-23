using Microsoft.EntityFrameworkCore;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seed;

public sealed class TeamApplicationStatusesSeed : KeyTableSeed<LeagueOfLegendsDbContext, TeamApplicationStatus>
{
    protected override string TableName => nameof(LeagueOfLegendsDbContext.TeamApplicationStatuses);

    protected override DbSet<TeamApplicationStatus> GetSet(LeagueOfLegendsDbContext db) => db.TeamApplicationStatuses;

    protected override IReadOnlyList<TeamApplicationStatus> Rows { get; } =
    [
        new() { Id = 1, Code = TeamApplicationStatusCodes.Pending, SortOrder = 1, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 2, Code = TeamApplicationStatusCodes.Accepted, SortOrder = 2, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 3, Code = TeamApplicationStatusCodes.Rejected, SortOrder = 3, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
        new() { Id = 4, Code = TeamApplicationStatusCodes.Withdrawn, SortOrder = 4, CreationDate = SeedDates.Utc, ModificationDate = SeedDates.Utc },
    ];
}
