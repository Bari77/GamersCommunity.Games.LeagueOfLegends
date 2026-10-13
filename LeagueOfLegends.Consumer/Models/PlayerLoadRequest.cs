namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerLoadRequest
{
    public int PlatformUserId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
}
