using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using LeagueOfLegends.Database.Seed;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Tests;

public static class FakeDataset
{
    public static LeagueOfLegendsDbContext CreateContext(string? name = null)
    {
        var options = new DbContextOptionsBuilder<LeagueOfLegendsDbContext>()
            .UseInMemoryDatabase(name ?? Guid.NewGuid().ToString())
            .Options;
        var context = new LeagueOfLegendsDbContext(options);
        SeedCatalog(context);
        return context;
    }

    public static void SeedCatalog(LeagueOfLegendsDbContext context)
    {
        if (context.Lanes.Any())
            return;

        context.Lanes.AddRange(new LanesSeed().CatalogRows.Select(lane => new Lane
        {
            Id = lane.Id,
            Code = lane.Code,
            SortOrder = lane.SortOrder,
            CreationDate = lane.CreationDate,
            ModificationDate = lane.ModificationDate,
        }));
        context.Regions.AddRange(new RegionsSeed().CatalogRows.Select(region => new Region
        {
            Id = region.Id,
            Code = region.Code,
            SortOrder = region.SortOrder,
            CreationDate = region.CreationDate,
            ModificationDate = region.ModificationDate,
        }));
        context.Champions.AddRange(new ChampionsSeed().CatalogRows.Select(champion => new Champion
        {
            Id = champion.Id,
            Code = champion.Code,
            CreationDate = champion.CreationDate,
            ModificationDate = champion.ModificationDate,
        }));
        context.PlayerChampionKinds.AddRange(new PlayerChampionKindsSeed().CatalogRows.Select(kind => new PlayerChampionKind
        {
            Id = kind.Id,
            Code = kind.Code,
            SortOrder = kind.SortOrder,
            CreationDate = kind.CreationDate,
            ModificationDate = kind.ModificationDate,
        }));
        context.SaveChanges();
    }
}
