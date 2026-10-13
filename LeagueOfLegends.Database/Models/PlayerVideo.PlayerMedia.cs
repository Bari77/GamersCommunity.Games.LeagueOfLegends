namespace LeagueOfLegends.Database.Models;

public partial class PlayerVideo : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Title;
        set => Title = value ?? string.Empty;
    }
}
