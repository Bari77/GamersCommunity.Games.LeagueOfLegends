using System.Text.Json;
using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Html;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

public class PlayersService(LeagueOfLegendsDbContext context) : IBusService
{
    private const int MaxLayoutLength = 32000;
    private const int MaxPresentationLength = 4000;

    BusServiceTypeEnum IBusService.Type => BusServiceTypeEnum.DATA;

    public string Resource => "Players";

    public async Task<string> HandleAsync(BusMessage message, CancellationToken ct = default)
    {
        return message.Action switch
        {
            "Load" => JsonSafe.Serialize(await LoadAsync(message, ct)),
            "Resolve" => JsonSafe.Serialize(await ResolveByPlatformUserAsync(message, ct)),
            "Get" => JsonSafe.Serialize(await GetSheetAsync(message, ct)),
            "Update" => JsonSafe.Serialize(await UpdateSheetAsync(message, ct)),
            _ => throw new InternalServerErrorException("ACTION_NOT_IMPLEMENTED", $"Action {message.Action} not implemented"),
        };
    }

    private async Task<PlayerSheetDto> LoadAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerLoadRequest>(message.Data);
        if (request.PlatformUserId <= 0 || request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user identity is required");

        var idKeycloak = CallerAuth.RequireKeycloakId(message);
        var player = await context.Players.FirstOrDefaultAsync(p => p.IdKeycloak == idKeycloak, ct);

        if (player is null)
        {
            player = new Player
            {
                PublicId = Guid.NewGuid(),
                IdKeycloak = idKeycloak,
                PlatformUserPublicId = request.PlatformUserPublicId,
                IdUser = request.PlatformUserId,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
            };
            await context.Players.AddAsync(player, ct);
            await context.SaveChangesAsync(ct);
        }
        else if (player.PlatformUserPublicId != request.PlatformUserPublicId || player.IdUser != request.PlatformUserId)
        {
            player.PlatformUserPublicId = request.PlatformUserPublicId;
            player.IdUser = request.PlatformUserId;
            player.ModificationDate = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }

        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerResolveResult> ResolveByPlatformUserAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerResolveRequest>(message.Data);
        if (request.PlatformUserPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLATFORM_USER", "Platform user public id is required");

        var player = await context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PlatformUserPublicId == request.PlatformUserPublicId, ct);

        return new PlayerResolveResult { PlayerPublicId = player?.PublicId };
    }

    private async Task<PlayerSheetDto> GetSheetAsync(BusMessage message, CancellationToken ct)
    {
        var player = await ResolvePlayerAsync(message, ct);
        return await ToSheetDtoAsync(player.Id, ct);
    }

    private async Task<PlayerSheetDto> UpdateSheetAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerUpdateRequest>(message.Data);
        var sent = RequestPayload.SentFields(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(context, message, ct);
        var target = await context.Players
            .FirstOrDefaultAsync(p => message.PublicId != null && p.PublicId == message.PublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (caller.Id != target.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot update another player's sheet");

        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIrl)))
            target.PresentationIrl = NormalizePresentation(request.PresentationIrl);
        if (sent.Contains(nameof(PlayerUpdateRequest.PresentationIg)))
            target.PresentationIg = NormalizePresentation(request.PresentationIg);
        if (sent.Contains(nameof(PlayerUpdateRequest.LayoutJson)))
            target.LayoutJson = NormalizeLayout(request.LayoutJson ?? "");

        target.ModificationDate = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);

        return await ToSheetDtoAsync(target.Id, ct);
    }

    private static string? NormalizeLayout(string layoutJson)
    {
        if (string.IsNullOrWhiteSpace(layoutJson))
            return null;

        if (layoutJson.Length > MaxLayoutLength)
            throw new BadRequestException("LAYOUT_TOO_LARGE", "Layout payload is too large");

        try
        {
            using var document = JsonDocument.Parse(layoutJson);
            if (document.RootElement.ValueKind is not (JsonValueKind.Object or JsonValueKind.Array))
                throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }
        catch (JsonException)
        {
            throw new BadRequestException("LAYOUT_INVALID", "Layout must be a JSON object or array");
        }

        return layoutJson;
    }

    private static string? NormalizePresentation(string? value)
    {
        var html = RichHtml.SanitizeOptional(value);
        if (html != null && html.Length > MaxPresentationLength)
            throw new BadRequestException("VALIDATION", $"Text must be at most {MaxPresentationLength} characters");

        return html;
    }

    private async Task<Player> ResolvePlayerAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is Guid publicId)
            return await context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.PublicId == publicId, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (message.Id is int id)
            return await context.Players.AsNoTracking()
                       .FirstOrDefaultAsync(p => p.Id == id, ct)
                   ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        throw new BadRequestException("ID_MANDATORY", "Id mandatory");
    }

    private async Task<PlayerSheetDto> ToSheetDtoAsync(int playerId, CancellationToken ct)
    {
        var player = await context.Players.AsNoTracking()
            .Where(p => p.Id == playerId)
            .Select(p => new
            {
                p.PublicId,
                p.PlatformUserPublicId,
                p.PresentationIrl,
                p.PresentationIg,
                p.CreationDate,
                p.LayoutJson,
                Snapshot = context.PlatformUserSnapshots
                    .Where(s => s.PlatformUserPublicId == p.PlatformUserPublicId)
                    .Select(s => new { s.Nickname, s.Discriminator, s.AvatarUrl })
                    .FirstOrDefault(),
            })
            .FirstAsync(ct);

        return new PlayerSheetDto
        {
            PublicId = player.PublicId,
            PlatformUserPublicId = player.PlatformUserPublicId ?? Guid.Empty,
            Nickname = player.Snapshot?.Nickname ?? "",
            Discriminator = player.Snapshot?.Discriminator ?? "",
            AvatarUrl = player.Snapshot?.AvatarUrl ?? "",
            PresentationIrl = player.PresentationIrl,
            PresentationIg = player.PresentationIg,
            CreationDate = player.CreationDate,
            LayoutJson = player.LayoutJson,
        };
    }
}
