namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerLoadRequest
{
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
}

public sealed record PlayerSheetDto
{
    public Guid PublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string Nickname { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string AvatarUrl { get; init; } = "";
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public DateTime CreationDate { get; init; }
    public string? LayoutJson { get; init; }
}

public sealed class PlayerResolveRequest
{
    public Guid PlatformUserPublicId { get; init; }
}

public sealed class PlayerResolveResult
{
    public Guid? PlayerPublicId { get; init; }
    public bool HasSheet => PlayerPublicId.HasValue;
}

public sealed class PlayerUpdateRequest
{
    public string? PresentationIrl { get; init; }
    public string? PresentationIg { get; init; }
    public string? LayoutJson { get; init; }
}
