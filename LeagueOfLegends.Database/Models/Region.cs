using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class Region : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Code { get; set; } = null!;

    public int SortOrder { get; set; }

    public virtual ICollection<Player> Players { get; set; } = null!;

    public virtual ICollection<LfgAd> LfgAds { get; set; } = [];
}
