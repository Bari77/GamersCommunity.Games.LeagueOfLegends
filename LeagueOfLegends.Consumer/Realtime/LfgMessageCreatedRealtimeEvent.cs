namespace LeagueOfLegends.Consumer.Realtime;

public sealed class LfgMessageCreatedRealtimeEvent
{
    public string Type { get; init; } = RealtimeEventTypes.LfgMessageCreated;

    public string Game { get; init; } = RealtimeGames.LeagueOfLegends;

    public required LfgMessageRealtimePayload Message { get; init; }
}
