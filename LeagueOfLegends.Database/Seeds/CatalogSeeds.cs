using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Database.Seeds;

public static class CatalogSeeds
{
    private static readonly DateTime SeededAt = new(2026, 9, 23, 0, 0, 0, DateTimeKind.Utc);

    public static Lane[] Lanes { get; } =
    [
        Lane(1, "top", 1),
        Lane(2, "jungle", 2),
        Lane(3, "mid", 3),
        Lane(4, "bottom", 4),
        Lane(5, "support", 5),
    ];

    public static Region[] Regions { get; } =
    [
        Region(1, "euw", 1),
        Region(2, "eune", 2),
        Region(3, "na", 3),
        Region(4, "kr", 4),
    ];

    public static PlayerChampionKind[] ChampionKinds { get; } =
    [
        Kind(1, "main", 1),
        Kind(2, "pool", 2),
        Kind(3, "learning", 3),
    ];

    public static Champion[] Champions { get; } =
    [
        Champion(1, "aatrox"),
        Champion(2, "ahri"),
        Champion(3, "akali"),
        Champion(4, "alistar"),
        Champion(5, "amumu"),
        Champion(6, "anivia"),
        Champion(7, "annie"),
        Champion(8, "aphelios"),
        Champion(9, "ashe"),
        Champion(10, "azir"),
        Champion(11, "bard"),
        Champion(12, "blitzcrank"),
        Champion(13, "brand"),
        Champion(14, "braum"),
        Champion(15, "caitlyn"),
        Champion(16, "camille"),
        Champion(17, "cassiopeia"),
        Champion(18, "darius"),
        Champion(19, "diana"),
        Champion(20, "draven"),
        Champion(21, "ekko"),
        Champion(22, "evelynn"),
        Champion(23, "ezreal"),
        Champion(24, "fiora"),
        Champion(25, "fizz"),
        Champion(26, "gnar"),
        Champion(27, "graves"),
        Champion(28, "hecarim"),
        Champion(29, "illaoi"),
        Champion(30, "irelia"),
        Champion(31, "janna"),
        Champion(32, "jarvaniv"),
        Champion(33, "jax"),
        Champion(34, "jhin"),
        Champion(35, "jinx"),
        Champion(36, "kaisa"),
        Champion(37, "karma"),
        Champion(38, "kassadin"),
        Champion(39, "katarina"),
        Champion(40, "kayle"),
        Champion(41, "kayn"),
        Champion(42, "khazix"),
        Champion(43, "kindred"),
        Champion(44, "leblanc"),
        Champion(45, "leesin"),
        Champion(46, "leona"),
        Champion(47, "lulu"),
        Champion(48, "lux"),
        Champion(49, "malphite"),
        Champion(50, "missfortune"),
        Champion(51, "mordekaiser"),
        Champion(52, "morgana"),
        Champion(53, "nami"),
        Champion(54, "nasus"),
        Champion(55, "nautilus"),
        Champion(56, "nidalee"),
        Champion(57, "orianna"),
        Champion(58, "ornn"),
        Champion(59, "pyke"),
        Champion(60, "rakan"),
        Champion(61, "renekton"),
        Champion(62, "riven"),
        Champion(63, "senna"),
        Champion(64, "seraphine"),
        Champion(65, "sett"),
        Champion(66, "sion"),
        Champion(67, "sivir"),
        Champion(68, "sona"),
        Champion(69, "soraka"),
        Champion(70, "syndra"),
        Champion(71, "thresh"),
        Champion(72, "tristana"),
        Champion(73, "twitch"),
        Champion(74, "varus"),
        Champion(75, "vayne"),
        Champion(76, "veigar"),
        Champion(77, "viego"),
        Champion(78, "viktor"),
        Champion(79, "warwick"),
        Champion(80, "xayah"),
        Champion(81, "xinzhao"),
        Champion(82, "yasuo"),
        Champion(83, "yone"),
        Champion(84, "yuumi"),
        Champion(85, "zed"),
        Champion(86, "zeri"),
        Champion(87, "zoe"),
        Champion(88, "zyra"),
    ];

    private static Lane Lane(int id, string code, int order) => new()
    {
        Id = id,
        Code = code,
        SortOrder = order,
        CreationDate = SeededAt,
        ModificationDate = SeededAt,
    };

    private static Region Region(int id, string code, int order) => new()
    {
        Id = id,
        Code = code,
        SortOrder = order,
        CreationDate = SeededAt,
        ModificationDate = SeededAt,
    };

    private static PlayerChampionKind Kind(int id, string code, int order) => new()
    {
        Id = id,
        Code = code,
        SortOrder = order,
        CreationDate = SeededAt,
        ModificationDate = SeededAt,
    };

    private static Champion Champion(int id, string code) => new()
    {
        Id = id,
        Code = code,
        CreationDate = SeededAt,
        ModificationDate = SeededAt,
    };
}
