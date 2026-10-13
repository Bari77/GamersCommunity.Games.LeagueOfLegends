namespace LeagueOfLegends.Consumer.Models;

public sealed class GamePostUpdateRequest
{
    public Guid PublicId { get; init; }
    public string Body { get; init; } = "";
}
