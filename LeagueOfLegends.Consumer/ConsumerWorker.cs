using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace LeagueOfLegends.Consumer;

public class ConsumerWorker(IServiceScopeFactory scopeFactory, ILogger logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var consumer = scope.ServiceProvider.GetRequiredService<LeagueOfLegendsServiceConsumer>();
        var delay = TimeSpan.FromSeconds(3);
        while (!ct.IsCancellationRequested)
        {
            try
            {
                await consumer.StartListeningAsync(ct);
                return;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                logger.Information("ConsumerWorker stopping (cancellation requested).");
                return;
            }
            catch (Exception ex)
            {
                logger.Error(ex, "RabbitMQ communication error. Retrying in {Delay}s.", delay.TotalSeconds);
                try
                {
                    await Task.Delay(delay, ct);
                }
                catch (OperationCanceledException) when (ct.IsCancellationRequested)
                {
                    logger.Information("ConsumerWorker stopping (cancellation requested).");
                    return;
                }
            }
        }
    }
}
