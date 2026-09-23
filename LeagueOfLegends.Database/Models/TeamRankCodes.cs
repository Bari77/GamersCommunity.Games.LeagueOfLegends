namespace LeagueOfLegends.Database.Models;

public static class TeamRankCodes
{
    public const string Captain = "captain";
    public const string Player = "player";
    public const string Coach = "coach";
    public const string Manager = "manager";

    public static readonly string[] PlayerSlots = [Captain, Player];

    public static readonly string[] Staff = [Coach, Manager];

    public static readonly string[] CanModerate = [Captain, Coach, Manager];

    public static readonly string[] CanPostAsTeam = [Captain, Coach, Manager];

    public static readonly string[] All = [Captain, Player, Coach, Manager];

    public static bool IsPlayerSlot(string? rank) => rank is Captain or Player;

    public static bool IsStaff(string? rank) => rank is Coach or Manager;
}
