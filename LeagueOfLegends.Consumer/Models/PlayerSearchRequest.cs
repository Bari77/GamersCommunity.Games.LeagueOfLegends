namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerSearchRequest
{
    /// <summary>
    /// Matches the Platform nickname or Riot ID; the discriminator is searchable through
    /// <c>Nickname#1234</c>.
    /// </summary>
    public string? Query { get; init; }

    public int? IdRegion { get; init; }

    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
