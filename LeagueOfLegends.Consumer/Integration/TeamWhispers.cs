using Microsoft.EntityFrameworkCore;
using Serilog;
using GamersCommunity.Core.Platform;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;

namespace LeagueOfLegends.Consumer.Integration;

public interface ITeamWhispers
{
    Task OnCreatedAsync(Team team, int founderPlayerId, CancellationToken ct);

    Task OnUpdatedAsync(Team team, CancellationToken ct);

    Task OnMemberJoinedAsync(Team team, int playerId, CancellationToken ct);

    Task OnMemberLeftAsync(Guid teamPublicId, int playerId, CancellationToken ct);

    Task OnDisbandedAsync(Guid teamPublicId, CancellationToken ct);
}

/// <summary>
/// Keeps the Platform Whispers team channel aligned with the roster: created with the team,
/// members follow join/leave, and the title follows the handle.
/// </summary>
public sealed class TeamWhispers(
    LeagueOfLegendsDbContext context,
    IPlatformConversationsClient conversations,
    ILogger logger) : ITeamWhispers
{
    public async Task OnCreatedAsync(Team team, int founderPlayerId, CancellationToken ct) =>
        await TryAsync("create", () => EnsureAndAddAsync(team, founderPlayerId, ct));

    public async Task OnUpdatedAsync(Team team, CancellationToken ct)
    {
        await TryAsync("refresh", async () =>
        {
            var owner = await PlatformUserOfPlayerAsync(team.IdCaptain, ct);
            if (owner is null)
            {
                logger.Warning("Team {TeamId} has no Platform owner; Whispers channel was not refreshed.", team.PublicId);
                return;
            }

            await conversations.EnsureGuildChannelAsync(
                KeyFor(team.PublicId),
                ChannelTitle(team),
                pictureUrl: null,
                owner.Value,
                ct);
        });
    }

    public async Task OnMemberJoinedAsync(Team team, int playerId, CancellationToken ct) =>
        await TryAsync("add member", () => EnsureAndAddAsync(team, playerId, ct));

    public async Task OnMemberLeftAsync(Guid teamPublicId, int playerId, CancellationToken ct)
    {
        await TryAsync("remove member", async () =>
        {
            var user = await PlatformUserOfPlayerAsync(playerId, ct);
            if (user is null)
                return;

            await conversations.RemoveGuildMemberAsync(KeyFor(teamPublicId), user.Value, ct);
        });
    }

    public async Task OnDisbandedAsync(Guid teamPublicId, CancellationToken ct) =>
        await TryAsync("delete", () => conversations.DeleteGuildChannelAsync(KeyFor(teamPublicId), ct));

    private async Task TryAsync(string op, Func<Task> action)
    {
        try
        {
            await action();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.Error(ex, "Could not {Op} the team Whispers channel.", op);
        }
    }

    private async Task EnsureAndAddAsync(Team team, int playerId, CancellationToken ct)
    {
        var owner = await PlatformUserOfPlayerAsync(team.IdCaptain, ct);
        if (owner is null)
        {
            logger.Warning("Team {TeamId} has no Platform owner; Whispers channel was not created.", team.PublicId);
            return;
        }

        var key = KeyFor(team.PublicId);
        await conversations.EnsureGuildChannelAsync(
            key,
            ChannelTitle(team),
            pictureUrl: null,
            owner.Value,
            ct);

        var member = await PlatformUserOfPlayerAsync(playerId, ct);
        if (member is null || member == owner)
            return;

        await conversations.AddGuildMemberAsync(key, member.Value, ct);
    }

    private async Task<Guid?> PlatformUserOfPlayerAsync(int playerId, CancellationToken ct)
    {
        var publicId = await context.Players.AsNoTracking()
            .Where(p => p.Id == playerId)
            .Select(p => p.PlatformUserPublicId)
            .FirstOrDefaultAsync(ct);

        return publicId is { } id && id != Guid.Empty ? id : null;
    }

    internal static string KeyFor(Guid teamPublicId) => $"lol:team:{teamPublicId:D}";

    internal static string ChannelTitle(Team team) => $"{team.Entitled}#{team.Discriminator}";
}
