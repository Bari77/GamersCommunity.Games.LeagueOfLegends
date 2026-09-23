using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class TeamLink : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Url { get; set; } = null!;

    public string Label { get; set; } = null!;

    public string? Icon { get; set; }

    public int Position { get; set; }

    public int IdTeam { get; set; }

    public virtual Team IdTeamNavigation { get; set; } = null!;
}
