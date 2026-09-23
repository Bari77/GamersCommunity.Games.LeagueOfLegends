using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class LfgAd : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdPlayer { get; set; }

    public string Kind { get; set; } = null!;

    public string Title { get; set; } = "";

    public string Body { get; set; } = null!;

    public int? IdRegion { get; set; }

    public int? IdLane { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool IsActive { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual Region? IdRegionNavigation { get; set; }

    public virtual Lane? IdLaneNavigation { get; set; }
}
