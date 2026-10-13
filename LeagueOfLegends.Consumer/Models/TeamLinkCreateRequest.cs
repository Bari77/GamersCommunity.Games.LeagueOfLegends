namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamLinkCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Url { get; init; } = "";
    public string Label { get; init; } = "";
    public string? Icon { get; init; }
}
