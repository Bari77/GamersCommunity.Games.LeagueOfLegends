using GamersCommunity.Core.Services;
using LeagueOfLegends.Database.Context;

namespace LeagueOfLegends.Consumer.Services.Infra;

public class HealthService(LeagueOfLegendsDbContext context) : HealthService<LeagueOfLegendsDbContext>(context)
{
}
