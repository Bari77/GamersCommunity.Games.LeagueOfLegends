import { PlayerMediaDto } from "@bari77/gc-sdk";
import { PLAYER_PUBLIC_ID } from "./players";

export const mockPlayerPictures: PlayerMediaDto[] = [
    {
        publicId: "aa000000-0000-4000-8000-000000000001",
        playerPublicId: PLAYER_PUBLIC_ID,
        url: "https://picsum.photos/seed/lol-faker-1/800/600",
        caption: "Worlds lobby",
        share: true,
        creationDate: new Date("2026-02-03T12:00:00Z").toISOString(),
    },
    {
        publicId: "aa000000-0000-4000-8000-000000000002",
        playerPublicId: PLAYER_PUBLIC_ID,
        url: "https://picsum.photos/seed/lol-faker-2/800/600",
        caption: "Pentakill",
        share: true,
        creationDate: new Date("2026-03-12T18:00:00Z").toISOString(),
    },
];

export const mockPlayerVideos: PlayerMediaDto[] = [
    {
        publicId: "bbbbbbb1-0000-0000-0000-000000000001",
        playerPublicId: PLAYER_PUBLIC_ID,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Outplay compilation",
        share: true,
        creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
];

export const mockPlayerStreams: PlayerMediaDto[] = [
    {
        publicId: "ccccccc1-0000-0000-0000-000000000001",
        playerPublicId: PLAYER_PUBLIC_ID,
        url: "https://twitch.tv/riotgames",
        caption: "Official broadcast",
        share: true,
        creationDate: new Date("2025-06-01T12:00:00Z").toISOString(),
    },
];
