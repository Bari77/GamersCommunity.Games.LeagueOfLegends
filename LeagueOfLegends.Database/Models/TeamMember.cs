using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class TeamMember : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdTeam { get; set; }

    public int IdPlayer { get; set; }

    public int IdTeamRank { get; set; }

    public int? IdLane { get; set; }

    public string? RosterKind { get; set; }

    public virtual Team IdTeamNavigation { get; set; } = null!;

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual TeamRank IdTeamRankNavigation { get; set; } = null!;

    public virtual Lane? IdLaneNavigation { get; set; }
}
