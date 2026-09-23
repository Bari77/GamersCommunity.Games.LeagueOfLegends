using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class PlayerChampion : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public int IdChampion { get; set; }

    public int IdKind { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Champion IdChampionNavigation { get; set; } = null!;

    public virtual PlayerChampionKind IdKindNavigation { get; set; } = null!;
}
