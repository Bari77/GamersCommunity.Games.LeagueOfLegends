using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace LeagueOfLegends.Database.Context;

/// <summary>
/// Factory used by EF Core tools (<c>dotnet ef</c>) at design-time.
/// </summary>
public class LeagueOfLegendsDbContextFactory : IDesignTimeDbContextFactory<LeagueOfLegendsDbContext>
{
    public LeagueOfLegendsDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<LeagueOfLegendsDbContext>()
            .UseSqlServer(
                "Server=127.0.0.1,14333;User Id=sa;Password=Your_password123;Initial Catalog=LeagueOfLegends;TrustServerCertificate=True;Encrypt=True;")
            .Options;
        return new LeagueOfLegendsDbContext(options);
    }
}
