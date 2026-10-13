namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerUpdateRequest
{
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public string? LayoutJson { get; init; }
    public string? GameName { get; init; }
    public string? TagLine { get; init; }
    public int? IdRegion { get; init; }
    public int? IdPrimaryLane { get; init; }
    public IReadOnlyList<int>? SecondaryLaneIds { get; init; }
    public PlayerRankUpdateDto? Solo { get; init; }
    public PlayerRankUpdateDto? Flex { get; init; }
    public IReadOnlyList<PlayerChampionUpdateDto>? Champions { get; init; }
}
