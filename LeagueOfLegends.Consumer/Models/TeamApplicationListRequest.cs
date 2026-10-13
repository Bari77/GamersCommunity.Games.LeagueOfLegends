namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamApplicationListRequest
{
    public Guid TeamPublicId { get; init; }
    public string? Status { get; init; }
}
