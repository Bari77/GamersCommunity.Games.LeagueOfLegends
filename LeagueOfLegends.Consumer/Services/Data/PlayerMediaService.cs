using System.Linq.Expressions;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using GamersCommunity.Core.Serialization;
using GamersCommunity.Core.Services;
using LeagueOfLegends.Consumer.Models;
using LeagueOfLegends.Consumer.Security;
using LeagueOfLegends.Database.Context;
using LeagueOfLegends.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace LeagueOfLegends.Consumer.Services.Data;

/// <summary>
/// CRUD shared by the three profile media resources (pictures, videos, streams).
/// Visitors only ever see the entries their owner flagged as shared.
/// </summary>
public abstract class PlayerMediaService<TEntity>(LeagueOfLegendsDbContext context, string table)
    : GenericDataService<LeagueOfLegendsDbContext, TEntity>(context, table)
    where TEntity : class, IPlayerMedia, new()
{
    private const int MaxUrlLength = 500;
    private const int MaxCaptionLength = 150;
    private const int MaxItemsPerPlayer = 200;

    protected abstract DbSet<TEntity> Entities { get; }

    protected abstract Expression<Func<TEntity, bool>> OwnedBy(int idPlayer);

    protected abstract Expression<Func<TEntity, bool>> WithPublicId(Guid publicId);

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

            case "DELETE":
                return JsonSafe.Serialize(await DeleteAsync(message, ct));
        }

        return await base.HandleAsync(message, ct);
    }

    private async Task<List<PlayerMediaDto>> ListAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerMediaListRequest>(message.Data);
        if (request.PlayerPublicId == Guid.Empty)
            throw new BadRequestException("INVALID_PLAYER", "Player public id is required");

        var owner = await Context.Players.AsNoTracking()
            .FirstOrDefaultAsync(p => p.PublicId == request.PlayerPublicId, ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        var isOwner = CallerKeycloakId(message) == owner.IdKeycloak;

        var entities = await Entities.AsNoTracking().Where(OwnedBy(owner.Id)).ToListAsync(ct);

        return entities
            .Where(entity => isOwner || entity.Share)
            .OrderByDescending(entity => entity.CreationDate)
            .Select(entity => ToDto(entity, owner.PublicId))
            .ToList();
    }

    private async Task<PlayerMediaDto> CreateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerMediaCreateRequest>(message.Data);
        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);

        var owned = await Entities.Where(OwnedBy(caller.Id)).CountAsync(ct);
        if (owned >= MaxItemsPerPlayer)
            throw new BadRequestException("TOO_MANY_ITEMS", "You reached the maximum number of entries");

        var entity = new TEntity
        {
            PublicId = Guid.NewGuid(),
            IdPlayer = caller.Id,
            Url = ValidateUrl(request.Url),
            Caption = NormalizeCaption(request.Caption),
            Share = request.Share,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };

        Entities.Add(entity);
        await Context.SaveChangesAsync(ct);

        return ToDto(entity, caller.PublicId);
    }

    private async Task<PlayerMediaDto> UpdateAsync(BusMessage message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(message.Data))
            throw new BadRequestException("DATA_MANDATORY", "Data mandatory");

        var request = ConsumerParamParser.ToObject<PlayerMediaUpdateRequest>(message.Data);
        var (entity, owner) = await RequireOwnedAsync(message, ct);

        if (request.Url is not null)
            entity.Url = ValidateUrl(request.Url);
        if (request.Caption is not null)
            entity.Caption = NormalizeCaption(request.Caption);
        if (request.Share is bool share)
            entity.Share = share;

        entity.ModificationDate = DateTime.UtcNow;
        await Context.SaveChangesAsync(ct);

        return ToDto(entity, owner.PublicId);
    }

    private async Task<PlayerMediaDeleteResult> DeleteAsync(BusMessage message, CancellationToken ct)
    {
        var (entity, _) = await RequireOwnedAsync(message, ct);

        Entities.Remove(entity);
        await Context.SaveChangesAsync(ct);

        return new PlayerMediaDeleteResult { PublicId = entity.PublicId };
    }

    private async Task<(TEntity Entity, Player Owner)> RequireOwnedAsync(BusMessage message, CancellationToken ct)
    {
        if (message.PublicId is not Guid publicId)
            throw new BadRequestException("ID_MANDATORY", "Id mandatory");

        var caller = await CallerAuth.RequirePlayerAsync(Context, message, ct);
        var entity = await Entities.Where(WithPublicId(publicId)).FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException("NOT_FOUND", "Cannot find ressource");

        if (entity.IdPlayer != caller.Id)
            throw new ForbiddenException("FORBIDDEN", "Cannot alter another player's media");

        return (entity, caller);
    }

    private static Guid? CallerKeycloakId(BusMessage message) =>
        message.Caller?.Subject is { } subject && Guid.TryParse(subject, out var id) ? id : null;

    private static PlayerMediaDto ToDto(TEntity entity, Guid playerPublicId) => new()
    {
        PublicId = entity.PublicId,
        PlayerPublicId = playerPublicId,
        Url = entity.Url,
        Caption = entity.Caption,
        Share = entity.Share,
        CreationDate = entity.CreationDate,
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

    private static string? NormalizeCaption(string? caption)
    {
        var value = caption?.Trim();
        if (string.IsNullOrEmpty(value))
            return null;
        if (value.Length > MaxCaptionLength)
            throw new BadRequestException("CAPTION_TOO_LONG", $"Caption cannot exceed {MaxCaptionLength} characters");

        return value;
    }
}
