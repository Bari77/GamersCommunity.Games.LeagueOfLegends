namespace LeagueOfLegends.Consumer.Models;

public sealed class HomeFeedDto
{
    public IReadOnlyList<LfgAdSummaryDto> LatestLfg { get; init; } = [];
    public IReadOnlyList<PlayerSummaryDto> LatestPlayers { get; init; } = [];
    public IReadOnlyList<TeamSummaryDto> LatestTeams { get; init; } = [];
}
