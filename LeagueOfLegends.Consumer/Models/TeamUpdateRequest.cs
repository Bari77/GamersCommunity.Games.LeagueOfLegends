namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamUpdateRequest
{
    public string? Entitled { get; init; }
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
    public string? LayoutJson { get; init; }
}
