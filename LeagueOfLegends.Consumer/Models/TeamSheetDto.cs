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
