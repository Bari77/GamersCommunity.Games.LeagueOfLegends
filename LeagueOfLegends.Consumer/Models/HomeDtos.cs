namespace LeagueOfLegends.Consumer.Models;

public sealed class HomeFeedDto
{
    public IReadOnlyList<LfgAdSummaryDto> LatestLfg { get; init; } = [];
    public IReadOnlyList<PlayerSummaryDto> LatestPlayers { get; init; } = [];
}

public sealed class LfgAdSummaryDto
{
    public Guid PublicId { get; init; }
    public string Kind { get; init; } = "";
    public string Body { get; init; } = "";
    public DateTime CreationDate { get; init; }
    public DateTime ExpiresAt { get; init; }
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string SenderNickname { get; init; } = "";
    public string SenderDiscriminator { get; init; } = "";
    public string SenderAvatarUrl { get; init; } = "";
    public string? RegionCode { get; init; }
    public string? LaneCode { get; init; }
}

public sealed class PlayerSummaryDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public string? GameName { get; init; }
    public string? TagLine { get; init; }
    public string? RegionCode { get; init; }
    public string? PrimaryLaneCode { get; init; }
    public DateTime CreationDate { get; init; }
}

public sealed class ListLfgRecentRequest
{
    public string? Kind { get; init; }
}

public sealed class ListLfgBeforeRequest
{
    public string? Kind { get; init; }
    public DateTime BeforeCreationDate { get; init; }
    public Guid BeforePublicId { get; init; }
    public int Take { get; init; } = 50;
}

public sealed class CreateLfgAdRequest
{
    public string Body { get; init; } = "";
    public DateTime? ExpiresAt { get; init; }
}
