namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamDisbandRequest
{
    public Guid TeamPublicId { get; init; }
    public string Confirmation { get; init; } = "";
}
