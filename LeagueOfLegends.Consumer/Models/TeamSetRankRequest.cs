namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSetRankRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Rank { get; init; } = "";
}
