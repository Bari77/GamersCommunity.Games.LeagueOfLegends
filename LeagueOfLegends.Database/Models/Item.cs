using GamersCommunity.Core.Database;

namespace LeagueOfLegends.Database.Models;

public class Item : IKeyTable
{
    public int Id { get; set; }
    public DateTime CreationDate { get; set; }
    public DateTime ModificationDate { get; set; }
    public string Entitled { get; set; } = string.Empty;
}
