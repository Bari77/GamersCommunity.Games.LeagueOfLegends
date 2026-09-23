using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class GamePost : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public int IdTeam { get; set; }

    public int IdPlayer { get; set; }

    public string Body { get; set; } = null!;

    public int IdStatus { get; set; }

    public int? IdModerator { get; set; }

    public DateTime? ModeratedAt { get; set; }

    public string? ModerationReason { get; set; }

    public virtual Team IdTeamNavigation { get; set; } = null!;

    public virtual Player IdPlayerNavigation { get; set; } = null!;

    public virtual GamePostStatus IdStatusNavigation { get; set; } = null!;

    public virtual Player? IdModeratorNavigation { get; set; }
}
