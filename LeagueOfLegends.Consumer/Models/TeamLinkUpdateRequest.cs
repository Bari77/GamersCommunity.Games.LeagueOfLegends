namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamLinkUpdateRequest
{
    public string? Url { get; init; }
    public string? Label { get; init; }
    public string? Icon { get; init; }
}
