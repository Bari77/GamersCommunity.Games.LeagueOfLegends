using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using LeagueOfLegends.Consumer.Services.Data;
using LeagueOfLegends.Database.Models;
using Xunit;

namespace LeagueOfLegends.Tests.Services.Data;

public class PlayersServiceTests
{
    private static readonly Guid KeycloakId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid PlatformPublicId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    [Fact]
    public async Task Resolve_ReturnsNoSheet_WhenPlayerMissing()
    {
        await using var context = FakeDataset.CreateContext();
        var svc = new PlayersService(context);

        var json = await svc.HandleAsync(ResolveMessage());

        Assert.Contains("\"hasSheet\":false", json, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("playerPublicId", json, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Load_CreatesSheet_ThenResolveFindsIt()
    {
        await using var context = FakeDataset.CreateContext();
        var svc = new PlayersService(context);

        var created = await svc.HandleAsync(LoadMessage());
        Assert.Contains(PlatformPublicId.ToString(), created, StringComparison.OrdinalIgnoreCase);

        var resolved = await svc.HandleAsync(ResolveMessage());
        Assert.Contains("\"hasSheet\":true", resolved, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("playerPublicId", resolved, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Get_ReturnsSheetByPublicId()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        var svc = new PlayersService(context);

        var json = await svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Get",
            PublicId = player.PublicId,
        });

        Assert.Contains(player.PublicId.ToString(), json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"nickname\":\"Faker\"", json, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Update_SavesPresentations_ForOwner()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        var svc = new PlayersService(context);

        var json = await svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Update",
            PublicId = player.PublicId,
            Data = """{"presentationIrl":"<p>Hello IRL</p>"}""",
            Caller = new CallerIdentity { Subject = KeycloakId.ToString() },
        });

        Assert.Contains("Hello IRL", json, StringComparison.Ordinal);
        Assert.Equal("<p>Hello IRL</p>", context.Players.Single().PresentationIrl);
    }

    [Fact]
    public async Task Update_RejectsOtherPlayer()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        context.Players.Add(new Player
        {
            PublicId = Guid.NewGuid(),
            IdKeycloak = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            PlatformUserPublicId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            IdUser = 2,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        });
        await context.SaveChangesAsync();
        var svc = new PlayersService(context);

        await Assert.ThrowsAsync<ForbiddenException>(() => svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Update",
            PublicId = player.PublicId,
            Data = """{"presentationIg":"nope"}""",
            Caller = new CallerIdentity { Subject = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
        }));
    }

    [Fact]
    public async Task Options_ReturnsCatalog()
    {
        await using var context = FakeDataset.CreateContext();
        var svc = new PlayersService(context);

        var json = await svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Options",
        });

        Assert.Contains("\"code\":\"top\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"code\":\"euw\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"code\":\"ahri\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"code\":\"main\"", json, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Update_SavesRiotIdentityLanesRankAndPool()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        var svc = new PlayersService(context);

        var json = await svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Update",
            PublicId = player.PublicId,
            Data = """
                {
                  "gameName":"Hide on bush",
                  "tagLine":"kr1",
                  "idRegion":4,
                  "idPrimaryLane":3,
                  "secondaryLaneIds":[2,5],
                  "solo":{"tier":"challenger","lp":1247},
                  "champions":[{"idChampion":2,"kind":"main"},{"idChampion":85,"kind":"pool"}]
                }
                """,
            Caller = new CallerIdentity { Subject = KeycloakId.ToString() },
        });

        Assert.Contains("Hide on bush", json, StringComparison.Ordinal);
        Assert.Contains("\"tagLine\":\"KR1\"", json, StringComparison.Ordinal);
        Assert.Contains("\"code\":\"kr\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"code\":\"mid\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"code\":\"jungle\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"tier\":\"challenger\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"kind\":\"main\"", json, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("Hide on bush", context.Players.Single().GameName);
        Assert.Equal("KR1", context.Players.Single().TagLine);
        Assert.Equal(4, context.Players.Single().IdRegion);
        Assert.Equal(3, context.Players.Single().IdPrimaryLane);
    }

    [Fact]
    public async Task Update_RejectsDuplicateRiotIdInSameRegion()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        context.Players.Add(new Player
        {
            PublicId = Guid.NewGuid(),
            IdKeycloak = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            PlatformUserPublicId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            IdUser = 2,
            GameName = "Hide on bush",
            TagLine = "KR1",
            IdRegion = 4,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        });
        await context.SaveChangesAsync();
        var svc = new PlayersService(context);

        var error = await Assert.ThrowsAsync<BadRequestException>(() => svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Update",
            PublicId = player.PublicId,
            Data = """{"gameName":"Hide on bush","tagLine":"kr1","idRegion":4}""",
            Caller = new CallerIdentity { Subject = KeycloakId.ToString() },
        }));

        Assert.Equal("RIOT_ID_TAKEN", error.Code);
    }

    [Fact]
    public async Task Update_RejectsSecondaryEqualToPrimary()
    {
        await using var context = FakeDataset.CreateContext();
        var player = await SeedPlayerAsync(context);
        var svc = new PlayersService(context);

        var error = await Assert.ThrowsAsync<BadRequestException>(() => svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Update",
            PublicId = player.PublicId,
            Data = """{"idPrimaryLane":3,"secondaryLaneIds":[3]}""",
            Caller = new CallerIdentity { Subject = KeycloakId.ToString() },
        }));

        Assert.Equal("LANE_OVERLAP", error.Code);
    }

    [Fact]
    public async Task Load_RequiresAuthenticatedCaller()
    {
        await using var context = FakeDataset.CreateContext();
        var svc = new PlayersService(context);

        await Assert.ThrowsAsync<UnauthorizedException>(() => svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Load",
            Data = $$"""{"platformUserId":1,"platformUserPublicId":"{{PlatformPublicId}}"}""",
        }));
    }

    private static BusMessage LoadMessage() => new()
    {
        Type = BusServiceTypeEnum.DATA,
        Resource = "Players",
        Action = "Load",
        Data = $$"""{"platformUserId":1,"platformUserPublicId":"{{PlatformPublicId}}"}""",
        Caller = new CallerIdentity { Subject = KeycloakId.ToString() },
    };

    private static BusMessage ResolveMessage() => new()
    {
        Type = BusServiceTypeEnum.DATA,
        Resource = "Players",
        Action = "Resolve",
        Data = $$"""{"platformUserPublicId":"{{PlatformPublicId}}"}""",
    };

    private static async Task<Player> SeedPlayerAsync(LeagueOfLegends.Database.Context.LeagueOfLegendsDbContext context)
    {
        var player = new Player
        {
            PublicId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            IdKeycloak = KeycloakId,
            PlatformUserPublicId = PlatformPublicId,
            IdUser = 1,
            CreationDate = DateTime.UtcNow,
            ModificationDate = DateTime.UtcNow,
        };
        context.Players.Add(player);
        context.PlatformUserSnapshots.Add(new PlatformUserSnapshot
        {
            PlatformUserPublicId = PlatformPublicId,
            Nickname = "Faker",
            Discriminator = "0001",
            AvatarUrl = "https://example.test/faker.png",
            UpdatedAt = DateTime.UtcNow,
        });
        await context.SaveChangesAsync();
        return player;
    }
}
