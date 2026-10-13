using System.Linq.Expressions;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public sealed class PlayerStreamsService(LeagueOfLegendsDbContext context)
    : PlayerMediaService<PlayerStream>(context, "PlayerStreams")
{
    protected override DbSet<PlayerStream> Entities => Context.PlayerStreams;

    protected override Expression<Func<PlayerStream, bool>> OwnedBy(int idPlayer) => m => m.IdPlayer == idPlayer;

    protected override Expression<Func<PlayerStream, bool>> WithPublicId(Guid publicId) => m => m.PublicId == publicId;
}
