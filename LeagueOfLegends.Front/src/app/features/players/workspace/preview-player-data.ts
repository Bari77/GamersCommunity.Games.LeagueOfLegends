import type { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import { PlayerTeam } from "@features/teams/models/team.model";

export const WORKSPACE_PREVIEW_LINKS: GcLink[] = [
    { url: "https://www.youtube.com/@gamerscommunity", label: "YouTube channel" },
    { url: "https://discord.gg/example", label: "Discord server" },
    { url: "https://www.twitch.tv/riotgames", label: "Live streams" },
    { url: "https://x.com/leagueoflegends", label: "News on X" },
];

export const WORKSPACE_PREVIEW_PHOTOS: GcGalleryItem[] = [
    { url: "https://picsum.photos/seed/gc-lol-photo-1/960/720", title: "Ranked night" },
    { url: "https://picsum.photos/seed/gc-lol-photo-2/960/720", title: "Pentakill" },
    { url: "https://picsum.photos/seed/gc-lol-photo-3/960/720", title: "Team lobby" },
    { url: "https://picsum.photos/seed/gc-lol-photo-4/960/720", title: "Baron steal" },
    { url: "https://picsum.photos/seed/gc-lol-photo-5/960/720", title: "Skin showcase" },
    { url: "https://picsum.photos/seed/gc-lol-photo-6/960/720", title: "Worlds watch party" },
];

export const WORKSPACE_PREVIEW_VIDEOS: GcGalleryItem[] = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Outplay compilation" },
    { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", title: "Mid lane guide" },
    { url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", title: "Clash highlights" },
];

export const WORKSPACE_PREVIEW_PLAYER_TEAMS: PlayerTeam[] = [
    new PlayerTeam(
        "44444444-4444-4444-4444-444444444444",
        "T1",
        "0001",
        "T1",
        "kr",
        "captain",
        "mid",
        "main",
        5,
        5,
    ),
];

export const WORKSPACE_PREVIEW_STREAMS: GcGalleryItem[] = [
    { url: "riotgames", title: "Official broadcast" },
    { url: "https://www.twitch.tv/lcs", title: "LCS" },
];
