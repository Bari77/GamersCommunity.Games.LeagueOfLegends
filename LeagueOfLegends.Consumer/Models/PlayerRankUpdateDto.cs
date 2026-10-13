namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerRankUpdateDto
{
    public string? Tier { get; init; }
    public string? Division { get; init; }
    public int? Lp { get; init; }
}
