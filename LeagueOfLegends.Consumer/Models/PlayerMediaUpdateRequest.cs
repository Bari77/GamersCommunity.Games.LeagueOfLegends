namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerMediaUpdateRequest
{
    public string? Url { get; init; }
    public string? Caption { get; init; }
    public bool? Share { get; init; }
}
