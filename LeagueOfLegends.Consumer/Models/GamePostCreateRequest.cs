namespace LeagueOfLegends.Consumer.Models;

public sealed class GamePostCreateRequest
{
    public Guid TeamPublicId { get; init; }
    public string Body { get; init; } = "";
}
