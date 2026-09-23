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
}
