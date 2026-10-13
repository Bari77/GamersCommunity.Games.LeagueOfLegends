namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerSearchResultDto
{
    public IReadOnlyList<PlayerSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
