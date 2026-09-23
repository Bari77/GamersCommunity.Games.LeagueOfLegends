namespace LeagueOfLegends.Database.Models;

public static class RosterKindCodes
{
    public const string Main = "main";
    public const string Sub = "sub";

    public static bool IsValid(string? kind) => kind is Main or Sub;
}
