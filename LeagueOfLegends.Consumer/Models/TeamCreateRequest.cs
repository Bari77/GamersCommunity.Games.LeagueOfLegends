namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamCreateRequest
{
    public string Entitled { get; init; } = "";
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
}
