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
