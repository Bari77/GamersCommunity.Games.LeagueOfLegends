namespace LeagueOfLegends.Consumer.Models;

public sealed class PostableTeamDto
{
    public Guid PublicId { get; init; }
    public string Entitled { get; init; } = "";
    public string Discriminator { get; init; } = "";
    public string Rank { get; init; } = "";
}
