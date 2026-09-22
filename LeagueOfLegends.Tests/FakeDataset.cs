using LeagueOfLegends.Database.Context;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Tests;

public static class FakeDataset
{
    public static LeagueOfLegendsDbContext CreateContext(string? name = null)
    {
        var options = new DbContextOptionsBuilder<LeagueOfLegendsDbContext>()
            .UseInMemoryDatabase(name ?? Guid.NewGuid().ToString())
            .Options;
        return new LeagueOfLegendsDbContext(options);
    }
}
