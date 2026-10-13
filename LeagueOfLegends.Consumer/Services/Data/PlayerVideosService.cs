using System.Linq.Expressions;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public sealed class PlayerVideosService(LeagueOfLegendsDbContext context)
    : PlayerMediaService<PlayerVideo>(context, "PlayerVideos")
{
    protected override DbSet<PlayerVideo> Entities => Context.PlayerVideos;

    protected override Expression<Func<PlayerVideo, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerVideo, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}
