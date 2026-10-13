namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerOptionsDto
{
    public IReadOnlyList<CatalogItemDto> Lanes { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Regions { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Champions { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> ChampionKinds { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Tiers { get; init; } = [];
    public IReadOnlyList<CatalogItemDto> Divisions { get; init; } = [];
}
