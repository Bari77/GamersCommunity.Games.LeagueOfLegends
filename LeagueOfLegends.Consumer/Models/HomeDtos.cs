namespace LeagueOfLegends.Consumer.Models;

public sealed class HomeFeedDto
{
    public IReadOnlyList<LfgAdSummaryDto> LatestLfg { get; init; } = [];
    public IReadOnlyList<PlayerSummaryDto> LatestPlayers { get; init; } = [];
    public IReadOnlyList<TeamSummaryDto> LatestTeams { get; init; } = [];
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
    public Guid? TeamPublicId { get; init; }
    public string? TeamName { get; init; }
    public string? TeamDiscriminator { get; init; }
    public string? TeamTag { get; init; }
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

public sealed class PlayerSearchRequest
{
    /// <summary>
    /// Matches the Platform nickname or Riot ID; the discriminator is searchable through
    /// <c>Nickname#1234</c>.
    /// </summary>
    public string? Query { get; init; }

    public int? IdRegion { get; init; }

    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}

public sealed class PlayerSearchResultDto
{
    public IReadOnlyList<PlayerSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
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

public sealed class SearchLfgRequest
{
    public string? Kind { get; init; }
    public string? Query { get; init; }
    public int? IdRegion { get; init; }
    public int? IdLane { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}

public sealed class LfgAdPageDto
{
    public IReadOnlyList<LfgAdSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}

public sealed class CreateLfgAdRequest
{
    public string Body { get; init; } = "";
    public DateTime? ExpiresAt { get; init; }
    public Guid? TeamPublicId { get; init; }
    public int? IdLane { get; init; }
}
