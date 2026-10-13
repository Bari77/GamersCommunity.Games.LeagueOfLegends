using LeagueOfLegends.Database.Context;
using Microsoft.Extensions.Logging;

namespace LeagueOfLegends.Database.Seed;

public static class ReferenceDataSeed
{
    private static readonly IReadOnlyList<IReferenceTableSeed<LeagueOfLegendsDbContext>> Tables =
        ReferenceTableSeedDiscovery.Discover<LeagueOfLegendsDbContext>(typeof(ReferenceDataSeed).Assembly);

    public static Task EnsureAsync(
        LeagueOfLegendsDbContext db,
        ILogger logger,
        CancellationToken ct = default) =>
        ReferenceDataSeedRunner.EnsureAsync(db, Tables, logger, ct);
}
