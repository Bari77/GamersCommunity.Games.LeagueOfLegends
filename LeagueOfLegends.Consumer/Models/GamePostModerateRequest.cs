namespace LeagueOfLegends.Consumer.Models;

public sealed class GamePostModerateRequest
{
    public Guid PublicId { get; init; }
    public bool Approve { get; init; }
    public string? Reason { get; init; }
}
