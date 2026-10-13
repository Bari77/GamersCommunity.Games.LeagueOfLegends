namespace LeagueOfLegends.Consumer.Models;

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
    /// <summary>Solo/Duo ladder rank when the player has set one (players and staff).</summary>
    public PlayerRankDto? Solo { get; set; }
    public IReadOnlyList<PlayerChampionDto> Champions { get; set; } = [];
}
