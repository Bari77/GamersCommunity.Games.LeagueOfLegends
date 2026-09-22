namespace LeagueOfLegends.Database.Models;

/// <summary>
/// Local read model of a Platform user identity, fed by the <c>platform_events</c> broadcast.
/// </summary>
/// <remarks>
/// Platform stays the owner of this data; this table is a replica kept for display purposes so that
/// queries never leave the microservice. It deliberately holds no authorization state: roles, bans
/// and mutes must always be read from their source of truth.
/// </remarks>
public partial class PlatformUserSnapshot
{
    /// <summary>
    /// Public identifier of the Platform user. Primary key: the snapshot has no identity of its own.
    /// </summary>
    public Guid PlatformUserPublicId { get; set; }

    public string Nickname { get; set; } = null!;

    public string Discriminator { get; set; } = null!;

    public string AvatarUrl { get; set; } = null!;

    /// <summary>
    /// <c>OccurredAt</c> of the event this row was built from. Used to discard out-of-order deliveries.
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
