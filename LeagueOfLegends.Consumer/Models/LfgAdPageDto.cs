namespace LeagueOfLegends.Consumer.Models;

public sealed class LfgAdPageDto
{
    public IReadOnlyList<LfgAdSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
