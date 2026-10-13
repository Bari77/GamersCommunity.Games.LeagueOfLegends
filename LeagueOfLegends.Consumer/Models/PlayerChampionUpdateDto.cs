namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerChampionUpdateDto
{
    public int IdChampion { get; init; }
    public string Kind { get; init; } = "";
    public int? IdLane { get; init; }
}
