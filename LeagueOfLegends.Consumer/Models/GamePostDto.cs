namespace LeagueOfLegends.Consumer.Models;

public sealed class GamePostDto
{
    public Guid PublicId { get; init; }
    public Guid TeamPublicId { get; init; }
    public string Body { get; init; } = "";
    public string Status { get; init; } = "";
    public DateTime CreationDate { get; init; }
    public Guid AuthorPlayerPublicId { get; init; }
    public Guid AuthorPlatformUserPublicId { get; init; }
    public string AuthorNickname { get; init; } = "";
    public string AuthorDiscriminator { get; init; } = "";
    public string AuthorAvatarUrl { get; init; } = "";
    public string? ModerationReason { get; init; }
    public DateTime? ModeratedAt { get; init; }
}
