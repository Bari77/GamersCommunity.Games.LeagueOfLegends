namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSearchRequest
{
    public string? Query { get; init; }
    public int? IdRegion { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}
