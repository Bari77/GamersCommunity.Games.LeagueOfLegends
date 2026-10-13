using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Consumer.Services;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

/// <summary>
/// The shortcuts a team pins on its page: Discord, forum, streams. Read by anyone visiting the
/// sheet, curated by managers (and above) who run the team's settings.
/// </summary>
public sealed class TeamLinksService(LeagueOfLegendsDbContext context)
    : GenericDataService<LeagueOfLegendsDbContext, TeamLink>(context, "TeamLinks")
{
    private const int MaxUrlLength = 500;
    private const int MaxLabelLength = 50;
    private const int MaxIconLength = 30;
    private const int MaxLinksPerTeam = 50;

    public override async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        switch (message.Action?.ToUpperInvariant())
        {
            case "LIST":
                return JsonSafe.Serialize(await ListAsync(message, ct));

            case "CREATE":
                return JsonSafe.Serialize(await CreateAsync(message, ct));

            case "UPDATE":
                return JsonSafe.Serialize(await UpdateAsync(message, ct));

            case "REORDER":
                return JsonSafe.Serialize(await ReorderAsync(message, ct));

            case "DELETE":
                return JsonSafe.Serialize(await DeleteAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<List<TeamLinkDto>> ListAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamLinkListRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);

        return await Context.TeamLinks.AsNoTracking()
            .Where(link => link.IdTeam == team.Id)
            .OrderBy(link => link.Position)
            .ThenBy(link => link.CreationDate)
            .Select(link => new TeamLinkDto
            {
                PublicId = link.PublicId,
                TeamPublicId = team.PublicId,
                Url = link.Url,
                Label = link.Label,
                Icon = link.Icon,
                Position = link.Position,
            })
            .ToListAsync(ct);
    }

    private async Task<TeamLinkDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamLinkCreateRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        await RequireEditorAsync(message, team.Id, ct);

        var owned = await Context.TeamLinks.Where(link => link.IdTeam == team.Id).ToListAsync(ct);
        if (owned.Count >= MaxLinksPerTeam)
            throw new BadRequestException("TOO_MANY_ITEMS", "This team reached the maximum number of links");

        var now = DateTime.UtcNow;
        var link = new TeamLink
        {
            PublicId = Guid.NewGuid(),
            IdTeam = team.Id,
            Url = ValidateUrl(request.Url),
            Label = ValidateLabel(request.Label),
            Icon = NormalizeIcon(request.Icon),
            Position = owned.Count == 0 ? 0 : owned.Max(existing => existing.Position) + 1,
            CreationDate = now,
            ModificationDate = now,
        };

        Context.TeamLinks.Add(link);
        await Context.SaveChangesAsync(ct);
        return ToDto(link, team.PublicId);
    }

    private async Task<TeamLinkDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamLinkUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var (link, team) = await RequireCuratedAsync(message, ct);

        if (request.Url is not null)
            link.Url = ValidateUrl(request.Url);
        if (request.Label is not null)
            link.Label = ValidateLabel(request.Label);
        if (sent.Contains(nameof(TeamLinkUpdateRequest.Icon)))
            link.Icon = NormalizeIcon(request.Icon);

        link.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);
        return ToDto(link, team.PublicId);
    }

    /// <summary>
    /// Renumbers the team's links from the order sent. Links left out keep their rank after the
    /// listed ones, so a stale client cannot silently shuffle what it did not know about.
    /// </summary>
    private async Task<List<TeamLinkDto>> ReorderAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<TeamLinkReorderRequest>(message.Data);
        var team = await RequireTeamAsync(request.TeamPublicId, ct);
        await RequireEditorAsync(message, team.Id, ct);

        var links = await Context.TeamLinks.Where(link => link.IdTeam == team.Id).ToListAsync(ct);
        var ranks = request.PublicIds
            .Select((publicId, index) => (publicId, index))
            .ToDictionary(entry => entry.publicId, entry => entry.index);

        foreach (var link in links)
        {
            link.Position = ranks.TryGetValue(link.PublicId, out var rank) ? rank : ranks.Count;
            link.ModificationDate = DateTime.UtcNow;
        }

        await Context.SaveChangesAsync(ct);
        return [.. links
            .OrderBy(link => link.Position)
            .ThenBy(link => link.CreationDate)
            .Select(link => ToDto(link, team.PublicId))];
    }

    private async Task<TeamLinkDeleteResult> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        var (link, _) = await RequireCuratedAsync(message, ct);
        Context.TeamLinks.Remove(link);
        await Context.SaveChangesAsync(ct);
        return new TeamLinkDeleteResult { PublicId = link.PublicId };
    }

    private async Task<Team> RequireTeamAsync(Guid teamPublicId, CancellationToken ct)
    {
        if (teamPublicId == Guid.Empty)
            throw new BadRequestException("VALIDATION", "Team public id is required");

        return await Context.Teams.AsNoTracking()
            .FirstOrDefaultAsync(t => t.PublicId == teamPublicId, ct)
            ?? throw new NotFoundException("TEAM_NOT_FOUND", "Team not found");
    }

    private async Task RequireEditorAsync(BusMessage message, int teamId, CancellationToken ct)
    {
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        await TeamAuth.RequireStandingAsync(Context, teamId, caller.Id, TeamRankCodes.Manager, ct);
    }

    private async Task<(TeamLink Link, Team Team)> RequireCuratedAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        var link = await Context.TeamLinks.FirstOrDefaultAsync(l => l.PublicId == publicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Link not found");

        var team = await Context.Teams.AsNoTracking().FirstAsync(t => t.Id == link.IdTeam, ct);
        await RequireEditorAsync(message, team.Id, ct);
        return (link, team);
    }

    private static TeamLinkDto ToDto(TeamLink link, Guid teamPublicId) => new()
    {
        PublicId = link.PublicId,
        TeamPublicId = teamPublicId,
        Url = link.Url,
        Label = link.Label,
        Icon = link.Icon,
        Position = link.Position,
    };

    private static string ValidateUrl(string url)
    {
        var value = url?.Trim() ?? string.Empty;
        if (value.Length == 0)
            throw new BadRequestException("URL_MANDATORY", "A URL is required");
        if (value.Length > MaxUrlLength)
            throw new BadRequestException("URL_TOO_LONG", $"URL cannot exceed {MaxUrlLength} characters");
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp))
            throw new BadRequestException("URL_INVALID", "URL must be an absolute http(s) address");

        return value;
    }

    private static string ValidateLabel(string label)
    {
        var value = label?.Trim() ?? string.Empty;
        if (value.Length == 0)
            throw new BadRequestException("LABEL_MANDATORY", "A label is required");
        if (value.Length > MaxLabelLength)
            throw new BadRequestException("LABEL_TOO_LONG", $"Label cannot exceed {MaxLabelLength} characters");

        return value;
    }

    private static string? NormalizeIcon(string? icon)
    {
        var value = icon?.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(value))
            return null;
        if (value.Length > MaxIconLength)
            throw new BadRequestException("ICON_INVALID", $"Icon key cannot exceed {MaxIconLength} characters");

        return value;
    }
}
