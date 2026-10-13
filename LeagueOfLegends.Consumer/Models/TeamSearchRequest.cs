namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSearchRequest
{
    public string? Query { get; init; }
    public int? IdRegion { get; init; }
    public int? MinMembers { get; init; }

    /// <summary>Lane the main roster does not cover yet.</summary>
    public int? IdMissingLane { get; init; }

    /// <summary>Keeps teams that still have a free player seat.</summary>
    public bool? OpenRoster { get; init; }

    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}
