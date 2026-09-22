using GamersCommunity.Core.Rabbit;
using Microsoft.Extensions.Options;
using Serilog;

namespace LeagueOfLegends.Consumer;

public class LeagueOfLegendsServiceConsumer(IOptions<RabbitMQSettings> otps, BusRouter router, ILogger logger)
    : BasicServiceConsumer(otps, router, logger)
{
    public override string QUEUE { get; set; } = "leagueoflegends_queue";
}
