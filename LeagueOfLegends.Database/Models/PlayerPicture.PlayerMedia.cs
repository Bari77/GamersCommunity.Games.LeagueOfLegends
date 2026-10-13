namespace LeagueOfLegends.Database.Models;

public partial class PlayerPicture : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Title;
        set => Title = value ?? string.Empty;
    }
}
