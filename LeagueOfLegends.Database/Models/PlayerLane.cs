using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class PlayerLane : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public int IdLane { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Lane IdLaneNavigation { get; set; } = null!;
}
