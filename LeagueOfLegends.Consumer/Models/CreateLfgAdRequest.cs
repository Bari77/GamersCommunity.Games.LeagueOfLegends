namespace LeagueOfLegends.Consumer.Models;

public sealed class CreateLfgAdRequest
{
    public string Body { get; init; } = "";
    public DateTime? ExpiresAt { get; init; }
    public Guid? TeamPublicId { get; init; }
    public int? IdLane { get; init; }
}
