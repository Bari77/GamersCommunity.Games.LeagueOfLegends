namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamApplicationCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Message { get; init; } = "";
    public string SoughtRank { get; init; } = "";
    public int? IdLane { get; init; }
}
