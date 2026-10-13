namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerSearchRequest
{
    /// <summary>
    /// Matches the Platform nickname or Riot ID; the discriminator is searchable through
    /// <c>Nickname#1234</c>.
    /// </summary>
    public string? Query { get; init; }

    public int? IdRegion { get; init; }

    /// <summary>Primary lane the player queues.</summary>
    public int? IdLane { get; init; }

    /// <summary>Lowest solo queue tier to keep, from iron up to challenger.</summary>
    public string? MinSoloTier { get; init; }

    /// <summary>Keeps players who do not already hold a player seat on a team.</summary>
    public bool? LookingForTeam { get; init; }

    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }

    public int Take { get; init; } = 20;
}
