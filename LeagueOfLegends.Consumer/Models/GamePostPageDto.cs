namespace LeagueOfLegends.Consumer.Models;

public sealed class GamePostPageDto
{
    public IReadOnlyList<GamePostDto> Items { get; init; } = [];
    public bool HasMore { get; init; }
}
