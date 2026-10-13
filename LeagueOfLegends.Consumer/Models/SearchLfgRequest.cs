namespace LeagueOfLegends.Consumer.Models;

public sealed class SearchLfgRequest
{
    public string? Kind { get; init; }
    public string? Query { get; init; }
    public int? IdRegion { get; init; }
    public int? IdLane { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}
