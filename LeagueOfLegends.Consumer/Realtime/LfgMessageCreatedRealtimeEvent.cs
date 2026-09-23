namespace LeagueOfLegends.Consumer.Realtime;

public sealed class LfgMessageCreatedRealtimeEvent
{
    public string Type { get; init; } = RealtimeEventTypes.LfgMessageCreated;

    public string Game { get; init; } = RealtimeGames.LeagueOfLegends;

    public required LfgMessageRealtimePayload Message { get; init; }
}

public sealed class LfgMessageRealtimePayload
{
    public Guid PublicId { get; init; }
    public string Kind { get; init; } = "";
    public string Body { get; init; } = "";
    public string SenderNickname { get; init; } = "";
    public string SenderDiscriminator { get; init; } = "";
    public Guid PlayerPublicId { get; init; }
    public Guid PlatformUserPublicId { get; init; }
    public string SenderAvatarUrl { get; init; } = "";
    public string? RegionCode { get; init; }
    public string? LaneCode { get; init; }
    public Guid? TeamPublicId { get; init; }
    public string? TeamName { get; init; }
    public string? TeamDiscriminator { get; init; }
    public string? TeamTag { get; init; }
    public DateTime CreationDate { get; init; }
    public DateTime ExpiresAt { get; init; }
}
