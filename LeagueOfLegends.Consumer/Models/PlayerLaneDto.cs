namespace LeagueOfLegends.Consumer.Models;

public sealed record PlayerLaneDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
}
