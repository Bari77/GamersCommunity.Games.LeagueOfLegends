using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public partial class PlayerVideo : IKeyTable
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime ModificationDate { get; set; }

    public string Url { get; set; } = null!;

    public string Title { get; set; } = null!;

    public bool Share { get; set; }

    public int IdPlayer { get; set; }

    public virtual Player IdPlayerNavigation { get; set; } = null!;
}
