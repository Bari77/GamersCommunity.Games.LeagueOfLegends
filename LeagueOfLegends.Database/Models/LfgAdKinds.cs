namespace LeagueOfLegends.Database.Models;

/// <summary>
/// Values stored in <see cref="LfgAd.Kind"/>. Team ads stay reserved for spec Teams.
/// </summary>
public static class LfgAdKinds
{
    public const string Player = "player";

    public const string Team = "team";

    public static bool IsKnown(string kind) => kind is Player or Team;
}
