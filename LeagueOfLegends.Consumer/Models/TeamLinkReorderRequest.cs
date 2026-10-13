namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamLinkReorderRequest
{
    public Guid TeamPublicId { get; init; }
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}
