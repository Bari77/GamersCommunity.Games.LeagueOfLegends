using GamersCommunity.Core.Enums;
using GamersCommunity.Core.Exceptions;
using GamersCommunity.Core.Rabbit;
using LeagueOfLegends.Consumer.Services.Data;
using Xunit;

namespace LeagueOfLegends.Tests.Services.Data;

public class PlayersServiceTests
{
    [Fact]
    public async Task Resolve_ReturnsNoSheetUntilB1()
    {
        var svc = new PlayersService();
        var json = await svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Resolve",
            Data = """{"platformUserPublicId":"11111111-1111-1111-1111-111111111111"}""",
        });

        Assert.Contains("\"hasSheet\":false", json, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("playerPublicId", json, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Load_IsNotImplementedYet()
    {
        var svc = new PlayersService();
        await Assert.ThrowsAsync<InternalServerErrorException>(() => svc.HandleAsync(new BusMessage
        {
            Type = BusServiceTypeEnum.DATA,
            Resource = "Players",
            Action = "Load",
        }));
    }
}
