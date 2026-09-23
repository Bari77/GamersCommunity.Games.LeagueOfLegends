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

public sealed class GamePostPageDto
{
    public IReadOnlyList<GamePostDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}

public sealed class TeamWallRequest
{
    public Guid TeamPublicId { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}

public sealed class GamePostCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Body { get; init; } = "";
}

public sealed class GamePostUpdateRequest
{
    public Guid PublicId { get; init; }
    public string Body { get; init; } = "";
}

public sealed class GamePostModerateRequest
{
    public Guid PublicId { get; init; }
    public bool Approve { get; init; }
    public string? Reason { get; init; }
}

public sealed class GamePostTargetRequest
{
    public Guid PublicId { get; init; }
}
