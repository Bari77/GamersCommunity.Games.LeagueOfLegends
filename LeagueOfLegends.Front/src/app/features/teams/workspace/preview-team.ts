import type { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import {
    ROSTER_KIND_MAIN,
    ROSTER_KIND_SUB,
    TEAM_RANK_CAPTAIN,
    TEAM_RANK_PLAYER,
    TeamMember,
    TeamSheet,
} from "@features/teams/models/team.model";

const PLATFORM_USER = "00000000-0000-0000-0000-000000000001";

export const WORKSPACE_PREVIEW_TEAM_MEMBERS: TeamMember[] = [
    new TeamMember(
        "00000000-0000-0000-0000-000000000201",
        PLATFORM_USER,
        "Faker",
        "0001",
        "",
        TEAM_RANK_CAPTAIN,
        "Hide on bush",
        "KR1",
        3,
        "mid",
        ROSTER_KIND_MAIN,
        new Date("2024-01-15T12:00:00Z"),
    ),
    new TeamMember(
        "00000000-0000-0000-0000-000000000202",
        PLATFORM_USER,
        "Gumayusi",
        "0002",
        "",
        TEAM_RANK_PLAYER,
        "Gumayusi",
        "KR1",
        4,
        "bottom",
        ROSTER_KIND_MAIN,
        new Date("2024-03-02T12:00:00Z"),
    ),
    new TeamMember(
        "00000000-0000-0000-0000-000000000203",
        PLATFORM_USER,
        "Keria",
        "0003",
        "",
        TEAM_RANK_PLAYER,
        "Keria",
        "KR1",
        5,
        "support",
        ROSTER_KIND_SUB,
        new Date("2024-03-02T12:00:00Z"),
    ),
];

export const WORKSPACE_PREVIEW_TEAM = new TeamSheet(
    "00000000-0000-0000-0000-000000000099",
    "T1",
    "0001",
    "T1",
    "We play to win. Five players, one call, every scrim.",
    null,
    "kr",
    new Date("2024-01-15T12:00:00Z"),
    WORKSPACE_PREVIEW_TEAM_MEMBERS.length,
    3,
    WORKSPACE_PREVIEW_TEAM_MEMBERS,
    TEAM_RANK_CAPTAIN,
    null,
    null,
    2,
);

export const WORKSPACE_PREVIEW_TEAM_LINKS: GcLink[] = [
    { url: "https://discord.gg/example", label: "Team Discord" },
    { url: "https://www.twitch.tv/t1", label: "Twitch" },
    { url: "https://www.youtube.com/@T1", label: "YouTube" },
];

export const WORKSPACE_PREVIEW_TEAM_PHOTOS: GcGalleryItem[] = [
    { url: "https://picsum.photos/seed/gc-lol-team-1/960/720", title: "Worlds photo" },
    { url: "https://picsum.photos/seed/gc-lol-team-2/960/720", title: "Scrim week" },
];

export const WORKSPACE_PREVIEW_TEAM_VIDEOS: GcGalleryItem[] = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Recruitment trailer" },
];
