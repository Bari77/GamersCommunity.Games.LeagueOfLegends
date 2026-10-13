namespace LeagueOfLegends.Consumer.Models;

public sealed class TeamWallRequest
{
    public Guid TeamPublicId { get; init; }
    public DateTime? BeforeCreationDate { get; init; }
    public Guid? BeforePublicId { get; init; }
    public int Take { get; init; } = 20;
}
