using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Consumer.Integration;

public interface ITeamWhispers
{
    Task OnCreatedAsync(Team team, int founderPlayerId, CancellationToken ct);

    Task OnUpdatedAsync(Team team, CancellationToken ct);

    Task OnMemberJoinedAsync(Team team, int playerId, CancellationToken ct);

    Task OnMemberLeftAsync(Guid teamPublicId, int playerId, CancellationToken ct);

    Task OnDisbandedAsync(Guid teamPublicId, CancellationToken ct);
}
