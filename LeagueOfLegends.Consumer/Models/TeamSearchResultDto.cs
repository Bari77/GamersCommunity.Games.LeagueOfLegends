namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSearchResultDto
{
    public IReadOnlyList<TeamSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
