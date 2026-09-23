using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class Player : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string? PresentationIrl { get; set; }

    public string? PresentationIg { get; set; }

    public int IdUser { get; set; }

    public Guid? IdKeycloak { get; set; }

    public Guid? PlatformUserPublicId { get; set; }

    public string? LayoutJson { get; set; }

    public string? GameName { get; set; }

    public string? TagLine { get; set; }

    public int? IdRegion { get; set; }

    public int? IdPrimaryLane { get; set; }

    public string? SoloTier { get; set; }

    public string? SoloDivision { get; set; }

    public int? SoloLp { get; set; }

    public string? FlexTier { get; set; }

    public string? FlexDivision { get; set; }

    public int? FlexLp { get; set; }

    public virtual Region? IdRegionNavigation { get; set; }

    public virtual Lane? IdPrimaryLaneNavigation { get; set; }

    public virtual ICollection<PlayerLane> PlayerLanes { get; set; } = [];

    public virtual ICollection<PlayerChampion> PlayerChampions { get; set; } = [];

    public virtual ICollection<PlayerPicture> PlayerPictures { get; set; } = [];

    public virtual ICollection<PlayerVideo> PlayerVideos { get; set; } = [];

    public virtual ICollection<PlayerStream> PlayerStreams { get; set; } = [];

    public virtual ICollection<LfgAd> LfgAds { get; set; } = [];

    public virtual ICollection<TeamMember> TeamMembers { get; set; } = [];

    public virtual ICollection<TeamApplication> TeamApplications { get; set; } = [];

    public virtual ICollection<Team> CaptainedTeams { get; set; } = [];
}
