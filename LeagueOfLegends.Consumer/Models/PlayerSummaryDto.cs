namespace LeagueOfLegends.Consumer.Models;

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
    public PlayerRankDto? Solo { get; init; }
    public DateTime CreationDate { get; init; }
}
