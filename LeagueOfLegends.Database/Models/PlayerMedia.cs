using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

/// <summary>
/// Shared shape of the three profile media tables, so one service can serve them all.
/// </summary>
public interface IPlayerMedia : IKeyTable
{
    Guid PublicId { get; set; }

    string Url { get; set; }

    bool Share { get; set; }

    int IdPlayer { get; set; }

    string? Caption { get; set; }
}

public partial class PlayerPicture : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Title;
        set => Title = value ?? string.Empty;
    }
}

public partial class PlayerVideo : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Title;
        set => Title = value ?? string.Empty;
    }
}

public partial class PlayerStream : IPlayerMedia
{
    string? IPlayerMedia.Caption
    {
        get => Description;
        set => Description = value;
    }
}
