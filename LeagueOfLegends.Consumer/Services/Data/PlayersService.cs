using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;

namespace LeagueOfLegends.Consumer.Services.Data;

/// <summary>
/// B0 stub: profile resolve must answer immediately so the shell catalogue does not wait on a
/// missing handler. Sheet Load/Get/Update arrive in Vague B1.
/// </summary>
public class PlayersService : IBusService
{
    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;

    public string Resource => "Players";

    public Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        if (string.Equals(message.Action, "Resolve", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(JsonSafe.Serialize(new PlayerResolveResult()));
        }

        throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented");
    }
}

public sealed class PlayerResolveResult
{
    public Guid? PlayerPublicId { get; init; }

    public bool HasSheet => PlayerPublicId.HasValue;
}
