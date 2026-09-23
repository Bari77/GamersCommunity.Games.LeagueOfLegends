namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamLinkDto
{
    public Guid PublicId { get; init; }
    public Guid TeamPublicId { get; init; }
    public string Url { get; init; } = "";
    public string Label { get; init; } = "";
    public string? Icon { get; init; }
    public int Position { get; init; }
}

public sealed class TeamLinkListRequest
{
    public Guid TeamPublicId { get; init; }
}

public sealed class TeamLinkCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Url { get; init; } = "";
    public string Label { get; init; } = "";
    public string? Icon { get; init; }
}

public sealed class TeamLinkUpdateRequest
{
    public string? Url { get; init; }
    public string? Label { get; init; }
    public string? Icon { get; init; }
}

public sealed class TeamLinkReorderRequest
{
    public Guid TeamPublicId { get; init; }
    public IReadOnlyList<Guid> PublicIds { get; init; } = [];
}

public sealed class TeamLinkDeleteResult
{
    public Guid PublicId { get; init; }
}
