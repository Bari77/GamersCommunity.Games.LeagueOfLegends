import type { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import { TeamSheet } from "@features/teams/models/team.model";
import { mockTeamSheet, TEAM_PUBLIC_ID } from "../../../../mocks/catalog/orgs";
import { mockTeamLinks } from "../../../../mocks/catalog/team-wall";

export const WORKSPACE_PREVIEW_TEAM_MEMBERS = TeamSheet.fromDto(mockTeamSheet).members;

export const WORKSPACE_PREVIEW_TEAM = TeamSheet.fromDto(mockTeamSheet);

export const WORKSPACE_PREVIEW_TEAM_LINKS: GcLink[] = mockTeamLinks
    .filter((link) => link.teamPublicId === TEAM_PUBLIC_ID)
    .map((link) => ({ url: link.url, label: link.label ?? link.url }));

export const WORKSPACE_PREVIEW_TEAM_PHOTOS: GcGalleryItem[] = [
    { url: "https://picsum.photos/seed/gc-lol-team-1/960/720", title: "Scrim photo" },
    { url: "https://picsum.photos/seed/gc-lol-team-2/960/720", title: "Watch party" },
    { url: "https://picsum.photos/seed/gc-lol-team-3/960/720", title: "Bootcamp whiteboard" },
];

export const WORKSPACE_PREVIEW_TEAM_VIDEOS: GcGalleryItem[] = [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Recruitment trailer" },
];
