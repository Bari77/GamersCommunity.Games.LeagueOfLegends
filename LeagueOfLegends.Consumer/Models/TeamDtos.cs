namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSheetDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
    public string? LayoutJson { get; init; }
    public string? RegionCode { get; init; }
    public DateTime CreationDate { get; init; }
    public int MemberCount { get; init; }
    public int PlayerSlotCount { get; init; }
    public IReadOnlyList<TeamMemberDto> Members { get; init; } = [];
    public string? ViewerRank { get; init; }
    public string? ViewerApplicationStatus { get; init; }
    public Guid? ViewerApplicationPublicId { get; init; }
    public int PendingApplicationCount { get; init; }
}

public sealed class TeamMemberDto
{
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string Rank { get; init; } = "";
    public string? GameName { get; init; }
    public string? TagLine { get; init; }
    public int? IdLane { get; init; }
    public string? LaneCode { get; init; }
    public string? RosterKind { get; init; }
    public DateTime JoinedAt { get; init; }
    public IReadOnlyList<PlayerChampionDto> Champions { get; set; } = [];
}

public sealed class TeamSummaryDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
    public string? RegionCode { get; init; }
    public DateTime CreationDate { get; init; }
    public int MemberCount { get; init; }
    public int PlayerSlotCount { get; init; }
}

public sealed class TeamSearchRequest
{
    public string? Query { get; init; }
    public int? IdRegion { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}

public sealed class TeamSearchResultDto
{
    public IReadOnlyList<TeamSummaryDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}

public sealed class TeamListByPlayerRequest
{
    public Guid PlayerPublicId { get; init; }
}

public sealed class PlayerTeamDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string? Tag { get; init; }
    public string? RegionCode { get; init; }
    public string Rank { get; init; } = "";
    public string? LaneCode { get; init; }
    public string? RosterKind { get; init; }
    public int MemberCount { get; init; }
    public int PlayerSlotCount { get; init; }
}

public sealed class TeamCreateRequest
{
    public string Entitled { get; init; } = "";
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
}

public sealed class TeamUpdateRequest
{
    public string? Entitled { get; init; }
    public string? Tag { get; init; }
    public string? Sentence { get; init; }
    public string? LayoutJson { get; init; }
}

public sealed class TeamSetRankRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Rank { get; init; } = "";
}

public sealed class TeamSetRosterRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public int IdLane { get; init; }
    public string RosterKind { get; init; } = "";
}

public sealed class TeamMemberTargetRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
}

public sealed class TeamDisbandRequest
{
    public Guid TeamPublicId { get; init; }
    public string Confirmation { get; init; } = "";
}

public sealed class TeamLeaveResult
{
    public Guid TeamPublicId { get; init; }
}

public sealed class TeamDisbandResult
{
    public Guid PublicId { get; init; }
    public string Handle { get; init; } = "";
}

public sealed class PostableTeamDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string Rank { get; init; } = "";
}

public sealed class TeamApplicationDto
{
    public Guid PublicId { get; init; }
    public string Message { get; init; } = "";
    public string Status { get; init; } = "";
    public string SoughtRank { get; init; } = "";
    public string? LaneCode { get; init; }
    public DateTime CreationDate { get; init; }
    public DateTime? ReviewedAt { get; init; }
    public Guid TeamPublicId { get; init; }
    public string TeamName { get; init; } = "";
    public string TeamDiscriminator { get; init; } = "";
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
}

public sealed class TeamApplicationCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Message { get; init; } = "";
    public string SoughtRank { get; init; } = "";
    public int? IdLane { get; init; }
}

public sealed class TeamApplicationListRequest
{
    public Guid TeamPublicId { get; init; }
    public string? Status { get; init; }
}

public sealed class TeamApplicationReviewRequest
{
    public Guid PublicId { get; init; }
    public bool Accept { get; init; }
}

public sealed class TeamApplicationTargetRequest
{
    public Guid PublicId { get; init; }
}
