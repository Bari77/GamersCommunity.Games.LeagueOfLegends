using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Database.Context;

/// <summary>
/// Design-time DbContext configuration (<c>dotnet ef</c> tools).
/// At runtime, the connection string is injected via DI in <c>LeagueOfLegends.Consumer</c>.
/// </summary>
public partial class LeagueOfLegendsDbContext
{
    public LeagueOfLegendsDbContext()
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(
                "Server=127.0.0.1,14333;User Id=sa;Password=Your_password123;Initial Catalog=LeagueOfLegends;TrustServerCertificate=True;Encrypt=True;");
        }
    }
}
