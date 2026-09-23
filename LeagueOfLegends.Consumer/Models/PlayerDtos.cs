namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerLoadRequest
{
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
}

public sealed record CatalogItemDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
}

public sealed record PlayerLaneDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
}

public sealed record PlayerChampionDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
    public string Kind { get; init; } = "";
    public string? Lane { get; init; }
}

public sealed record PlayerRankDto
{
    public string? Tier { get; init; }
    public string? Division { get; init; }
    public int? Lp { get; init; }
}

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

public sealed class PlayerResolveRequest
{
    public Guid PlatformUserPublicId { get; init; }
}

public sealed class PlayerResolveResult
{
    public Guid? PlayerPublicId { get; init; }
    public bool HasSheet => PlayerPublicId.HasValue;
}

public sealed class PlayerChampionUpdateDto
{
    public int IdChampion { get; init; }
    public string Kind { get; init; } = "";
    public int? IdLane { get; init; }
}

public sealed class PlayerRankUpdateDto
{
    public string? Tier { get; init; }
    public string? Division { get; init; }
    public int? Lp { get; init; }
}

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

public sealed class PlayerOptionsDto
{
    public IReadOnlyList<CatalogItemDto> Lanes { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Regions { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Champions { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> ChampionKinds { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Tiers { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Divisions { get; init; } = [];
}
