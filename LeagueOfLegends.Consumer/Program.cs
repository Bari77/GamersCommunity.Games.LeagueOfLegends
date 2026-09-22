using GamersCommunity.Core.Database;
using GamersCommunity.Core.Logging;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using LeagueOfLegends.Consumer.Configuration;
using LeagueOfLegends.Consumer.Integration;
using LeagueOfLegends.Consumer.Services.Infra;
using LeagueOfLegends.Database.Context;

namespace LeagueOfLegends.Consumer;

public class Program
{
    public static async Task Main(string[] args)
    {
        Console.Title = "LeagueOfLegends MicroService";
        try
        {
            var builder = Host.CreateDefaultBuilder(args)
                .ConfigureLogging((context, logging) =>
                {
                    var loggerSettings = context.Configuration.GetSection("LoggerSettings").Get<LoggerSettings>() ?? new LoggerSettings();
                    Logger.Initialize(loggerSettings, "LeagueOfLegends MS", context.HostingEnvironment);
                    logging.ClearProviders();
                    Log.Information("Starting ...");
                })
                .ConfigureServices((context, services) =>
                {
                    services.AddOptions<RabbitMQSettings>().Bind(context.Configuration.GetSection("RabbitMQ")).ValidateOnStart();
                    services.AddOptions<AppSettings>().Bind(context.Configuration.GetSection("AppSettings")).ValidateOnStart();
                    services.AddDbContext<LeagueOfLegendsDbContext>((sp, options) =>
                    {
                        var connectionString = context.Configuration.GetConnectionString("Database")
                            ?? throw new InvalidOperationException("Connection string 'Database' is missing.");
                        options.UseGamersCommunitySqlServer(connectionString);
                    });
                    services.AddSingleton<Serilog.ILogger>(sp => Log.Logger);
                    services.Scan(scan => scan
                        .FromAssembliesOf(typeof(AppSettings))
                        .AddClasses(c => c.AssignableTo<IBusService>())
                        .AsImplementedInterfaces()
                        .WithScopedLifetime());
                    services.AddScoped<HealthService>();
                    services.AddScoped<BusRouter>();
                    services.AddScoped<LeagueOfLegendsServiceConsumer>();
                    services.AddHostedService<ConsumerWorker>();
                    services.AddHostedService<PlatformEventsSubscriber>();
                });

            var host = builder.Build();
            await host.Services.ApplyMigrationsWithRetryAsync<LeagueOfLegendsDbContext>();
            var environment = host.Services.GetRequiredService<IHostEnvironment>();
            Log.Information("Started in {Environment} environment...", environment.EnvironmentName);
            await host.RunAsync();
        }
        catch (HostAbortedException ex) { Log.Fatal(ex, "Aborted."); }
        catch (Exception ex) { Log.Fatal(ex, "Terminated unexpectedly."); }
        finally { Log.Information("Stopped ..."); }
    }
}
