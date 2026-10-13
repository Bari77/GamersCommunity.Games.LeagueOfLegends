namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamApplicationReviewRequest
{
    public Guid PublicId { get; init; }
    public bool Accept { get; init; }
}
