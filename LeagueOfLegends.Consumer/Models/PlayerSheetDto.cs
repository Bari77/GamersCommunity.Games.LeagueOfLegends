namespace LeagueOfLegends.Consumer.Models;

public sealed record PlayerSheetDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public DateTime CreationDate { get; init; }
    public string? LayoutJson { get; init; }
    public string? GameName { get; init; }
    public string? TagLine { get; init; }
    public CatalogItemDto? Region { get; init; }
    public PlayerLaneDto? PrimaryLane { get; init; }
    public IReadOnlyList<PlayerLaneDto> SecondaryLanes { get; init; } = [];
    public PlayerRankDto? Solo { get; init; }
    public PlayerRankDto? Flex { get; init; }
    public IReadOnlyList<PlayerChampionDto> Champions { get; init; } = [];
}
