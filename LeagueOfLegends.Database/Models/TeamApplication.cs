using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class TeamApplication : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdTeam { get; set; }

    public int IdPlayer { get; set; }

    public string Message { get; set; } = "";

    public int IdStatus { get; set; }

    public int IdSoughtRank { get; set; }

    public int? IdLane { get; set; }

    public int? IdReviewer { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public virtual Team IdTeamNavigation { get; set; } = null!;

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual TeamApplicationStatus IdStatusNavigation { get; set; } = null!;

    public virtual TeamRank IdSoughtRankNavigation { get; set; } = null!;

    public virtual Lane? IdLaneNavigation { get; set; }

    public virtual Player? IdReviewerNavigation { get; set; }
}
