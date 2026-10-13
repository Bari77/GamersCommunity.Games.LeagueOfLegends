namespace LeagueOfLegends.Consumer.Models;

public sealed record CatalogItemDto
{
    public int Id { get; init; }
    public string Code { get; init; } = "";
}
