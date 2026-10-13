namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamSetRosterRequest
{
    public Guid TeamPublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public int IdLane { get; init; }
    public string RosterKind { get; init; } = "";
}
