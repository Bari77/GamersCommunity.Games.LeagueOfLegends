using Microsoft.Extensions.Logging;
using LeagueOfLegends.Database.Context;

namespace LeagueOfLegends.Database.Seed;

public static class ReferenceDataSeed
{
    private static readonly IReadOnlyList<IReferenceTableSeed<LeagueOfLegendsDbContext>> Tables =
        ReferenceTableSeedDiscovery.Discover<LeagueOfLegendsDbContext>(typeof(ReferenceDataSeed).Assembly);

    public static async Task EnsureAsync(
        LeagueOfLegendsDbContext db,
        ILogger logger,
        CancellationToken ct = default)
    {
        logger.LogInformation("Reference data seed starting ({TableCount} tables)", Tables.Count);
        foreach (var table in Tables)
            logger.LogDebug("Seed discovery: {Seed} (Order={Order})", table.GetType().Name, table.Order);

        var totals = SeedTotals.Zero;
        foreach (var table in Tables)
            totals += await table.EnsureAsync(db, logger, ct);

        if (totals.HasChanges)
        {
            logger.LogInformation(
                "Reference data seed saved: {Inserted} inserted, {Updated} updated, {Unchanged} unchanged",
                totals.Inserted, totals.Updated, totals.Unchanged);
        }
        else
        {
            logger.LogInformation(
                "Reference data seed already in sync ({Unchanged} rows unchanged)",
                totals.Unchanged);
        }
    }
}
