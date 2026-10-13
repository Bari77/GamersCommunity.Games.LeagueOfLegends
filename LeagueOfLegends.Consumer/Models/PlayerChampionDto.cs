namespace LeagueOfLegends.Consumer.Models;

public sealed record PlayerChampionDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
    public string Kind { get; init; } = "";
    public string? Lane { get; init; }
}
