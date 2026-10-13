namespace LeagueOfLegends.Consumer.Models;

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
