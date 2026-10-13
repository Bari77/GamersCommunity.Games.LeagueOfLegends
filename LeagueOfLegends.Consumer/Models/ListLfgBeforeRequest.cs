namespace LeagueOfLegends.Consumer.Models;

public sealed class ListLfgBeforeRequest
{
    public string? Kind { get; init; }
    public DateTime BeforeCreationDate { get; init; }
    public Guid BeforePublicId { get; init; }
    public int Take { get; init; } = 50;
}
