import type { WidgetCatalog, WidgetPageVisibilityOption } from "@bari77/gc-widgets";

export const PAGE_VISIBILITY_PUBLIC = "public";
export const PAGE_VISIBILITY_FRIENDS = "friends";
export const PAGE_VISIBILITY_PRIVATE = "private";

export const PLAYER_PAGE_VISIBILITY_OPTIONS: WidgetPageVisibilityOption[] = [
    { value: PAGE_VISIBILITY_PUBLIC, label: $localize`:@@lol.player.page.visibility.public:Everyone` },
    { value: PAGE_VISIBILITY_FRIENDS, label: $localize`:@@lol.player.page.visibility.friends:My friends` },
    { value: PAGE_VISIBILITY_PRIVATE, label: $localize`:@@lol.player.page.visibility.private:Only me` },
];

export const PLAYER_WIDGETS = {
    identity: "identity",
    presentationIrl: "presentation-irl",
    presentationIg: "presentation-ig",
    stats: "stats",
    champions: "champions",
    photos: "photos",
    videos: "videos",
    streams: "streams",
    twitch: "gc-twitch",
    links: "gc-links",
    teams: "teams",
} as const;

export const gameWorkspaceRegistry = {
    catalog: [
        {
            type: PLAYER_WIDGETS.identity,
            label: $localize`:@@lol.player.widget.identity:Identity`,
            description: $localize`:@@lol.player.widget.identity.desc:Registration date and Platform profile link.`,
            cols: 4,
            rows: 3,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.presentationIrl,
            label: $localize`:@@lol.player.presentationIrl:IRL presentation`,
            cols: 8,
            rows: 3,
        },
        {
            type: PLAYER_WIDGETS.presentationIg,
            label: $localize`:@@lol.player.presentationIg:In-game presentation`,
            cols: 8,
            rows: 3,
        },
        {
            type: PLAYER_WIDGETS.stats,
            label: $localize`:@@lol.player.widget.stats:Stats`,
            description: $localize`:@@lol.player.widget.stats.desc:Riot ID, region, lanes and ranks.`,
            cols: 12,
            rows: 6,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.teams,
            label: $localize`:@@lol.player.widget.teams:Teams`,
            description: $localize`:@@lol.player.widget.teams.desc:LoL teams this player belongs to.`,
            cols: 12,
            rows: 5,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.champions,
            label: $localize`:@@lol.player.widget.champions:Champions`,
            description: $localize`:@@lol.player.widget.champions.desc:Mains, pool and champions you are learning.`,
            cols: 12,
            rows: 7,
            unique: true,
        },
        {
            type: PLAYER_WIDGETS.photos,
            label: $localize`:@@lol.player.widget.photos:Photo gallery`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.videos,
            label: $localize`:@@lol.player.widget.videos:Video gallery`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.streams,
            label: $localize`:@@lol.player.widget.streams:My streams`,
            description: $localize`:@@lol.player.widget.streams.desc:Twitch channels saved on your profile.`,
            cols: 12,
            rows: 6,
        },
        {
            type: PLAYER_WIDGETS.twitch,
            label: $localize`:@@lol.player.widget.twitch:Twitch player`,
            description: $localize`:@@lol.player.widget.twitch.desc:Embeds a single channel of your choice.`,
            cols: 6,
            rows: 5,
            fields: [
                {
                    key: "channel",
                    type: "url",
                    label: $localize`:@@lol.player.widget.twitch.channel:Channel or twitch.tv address`,
                    placeholder: "https://twitch.tv/…",
                },
            ],
        },
        {
            type: PLAYER_WIDGETS.links,
            label: $localize`:@@lol.player.widget.links:Links`,
            description: $localize`:@@lol.player.widget.links.desc:YouTube, X, Instagram, Discord…`,
            cols: 6,
            rows: 3,
        },
    ] satisfies WidgetCatalog,
    columns: 12,
    rowHeight: 90,
    pageVisibilityOptions: PLAYER_PAGE_VISIBILITY_OPTIONS,
};

export const PLAYER_WIDGET_CATALOG = gameWorkspaceRegistry.catalog;
export const PLAYER_WORKSPACE_COLUMNS = gameWorkspaceRegistry.columns;
export const PLAYER_WORKSPACE_ROW_HEIGHT = gameWorkspaceRegistry.rowHeight;
