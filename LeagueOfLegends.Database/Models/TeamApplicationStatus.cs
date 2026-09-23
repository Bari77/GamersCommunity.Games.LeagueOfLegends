using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class TeamApplicationStatus : IKeyTable
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Code { get; set; } = null!;

    public int SortOrder { get; set; }

    public virtual ICollection<TeamApplication> TeamApplications { get; set; } = [];
}
