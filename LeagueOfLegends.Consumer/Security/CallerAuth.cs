using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Security;

public static class CallerAuth
{
    public static async Task<Player> RequirePlayerAsync(
        LeagueOfLegendsDbContext context,
        BusMessage message,
        CancellationToken ct)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        return await context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct)
            ?? throw new UnauthorizedException("UNAUTHORIZED", "LoL player sheet not initialized");
    }

    public static Guid RequireKeycloakId(BusMessage message)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            throw new UnauthorizedException("UNAUTHORIZED", "Authenticated caller required");

        return idKeycloak;
    }

    public static async Task<int?> FindPlayerIdAsync(
        LeagueOfLegendsDbContext context,
        BusMessage message,
        CancellationToken ct)
    {
        if (message.Caller?.Subject is not { } subject || !Guid.TryParse(subject, out var idKeycloak))
            return null;

        return await context.Players.AsNoTracking()
            .Where(p => p.IdKeycloak == idKeycloak)
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync(ct);
    }
}
