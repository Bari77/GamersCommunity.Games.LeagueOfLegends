namespace LeagueOfLegends.Consumer.Models;

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
