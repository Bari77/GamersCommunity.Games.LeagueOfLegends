namespace LeagueOfLegends.Database.Models;

public partial class PlayerStream : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Description;
        set => Description = value;
    }
}
