namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerMediaCreateRequest
{
    public string Url { get; init; } = string.Empty;
    public string? Caption { get; init; }
    public bool Share { get; init; } = true;
}
