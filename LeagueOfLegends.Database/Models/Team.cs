using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class Team : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Entitled { get; set; } = null!;

    public string Discriminator { get; set; } = null!;

    public string? Tag { get; set; }

    public string? Sentence { get; set; }

    public string? LayoutJson { get; set; }

    public int IdCaptain { get; set; }

    public int? IdRegion { get; set; }

    public virtual Player IdCaptainNavigation { get; set; } = null!;

    public virtual Region? IdRegionNavigation { get; set; }

    public virtual ICollection<TeamMember> TeamMembers { get; set; } = [];

    public virtual ICollection<TeamApplication> TeamApplications { get; set; } = [];

    public virtual ICollection<TeamLink> TeamLinks { get; set; } = [];

    public virtual ICollection<GamePost> GamePosts { get; set; } = [];

    public virtual ICollection<LfgAd> LfgAds { get; set; } = [];
}
