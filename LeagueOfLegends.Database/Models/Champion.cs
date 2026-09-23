using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class Champion : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Code { get; set; } = null!;

    public virtual ICollection<PlayerChampion> PlayerChampions { get; set; } = null!;
}
