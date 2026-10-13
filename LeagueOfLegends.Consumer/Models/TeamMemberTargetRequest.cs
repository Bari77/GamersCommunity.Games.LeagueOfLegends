namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamMemberTargetRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
}
