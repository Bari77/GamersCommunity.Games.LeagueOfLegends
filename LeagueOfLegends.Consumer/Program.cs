using GamersCommunity.Core.Hosting;
using GamersCommunity.Core.Logging;
using GamersCommunity.Core.Platform;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Configuration;
using LeagueOfLegends.Consumer.Integration;
using LeagueOfLegends.Consumer.Services.Infra;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Seed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;

namespace LeagueOfLegends.Consumer;

public class Program
{
    public static Task Main(string[] args) =>
        GamersCommunityConsumerHost.RunAsync<LeagueOfLegendsDbContext, LeagueOfLegendsServiceConsumer>(
            args,
            consoleTitle: "LeagueOfLegends MicroService",
            configureLogging: (context, logging) =>
            {
                var loggerSettings = context.Configuration.GetSection("LoggerSettings").Get<LoggerSettings>() ?? new LoggerSettings();
                Logger.Initialize(loggerSettings, "LeagueOfLegends MS", context.HostingEnvironment);
                logging.ClearProviders();
                Log.Information("Starting ...");
            },
            configureServices: (context, services) =>
            {
                services.AddOptions<AppSettings>().Bind(context.Configuration.GetSection("AppSettings")).ValidateOnStart();
                services.AddRealtimeEventPublisher();
                services.AddPlatformRpcClients();
                services.AddScoped<ITeamWhispers, TeamWhispers>();
                services.Scan(scan => scan
                    .FromAssembliesOf(typeof(AppSettings))
                    .AddClasses(c => c.AssignableTo<IBusService>())
                    .AsImplementedInterfaces()
                    .WithScopedLifetime());
                services.AddScoped<HealthService>();
                services.AddHostedService<PlatformEventsSubscriber>();
            },
            afterMigrate: async (db, sp, _) =>
            {
                var seedLogger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("ReferenceDataSeed");
                await ReferenceDataSeed.EnsureAsync(db, seedLogger);
            });
}
