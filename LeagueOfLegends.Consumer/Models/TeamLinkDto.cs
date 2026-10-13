namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamLinkDto
{
    public Guid PublicId { get; init; }
    public Guid TeamPublicId { get; init; }
    public string Url { get; init; } = "";
    public string Label { get; init; } = "";
    public string? Icon { get; init; }
    public int Position { get; init; }
}
