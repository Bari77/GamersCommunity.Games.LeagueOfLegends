namespace LeagueOfLegends.Consumer.Models;

public sealed class PlayerMediaDto
{
    public Guid PublicId { get; init; }
    public Guid PlayerPublicId { get; init; }
    public string Url { get; init; } = string.Empty;
    public string? Caption { get; init; }
    public bool Share { get; init; }
    public DateTime CreationDate { get; init; }
}
