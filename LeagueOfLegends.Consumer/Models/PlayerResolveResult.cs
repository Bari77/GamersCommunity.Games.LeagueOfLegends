namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerResolveResult
{
    public Guid? PlayerPublicId { get; init; }
    public bool HasSheet => PlayerPublicId.HasValue;
}
