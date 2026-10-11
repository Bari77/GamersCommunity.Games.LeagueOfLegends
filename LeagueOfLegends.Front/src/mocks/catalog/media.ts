import { PlayerMediaDto } from "@bari77/gc-sdk";
import { mockUuid } from "./ids";
import { MOCK_PERSONAS } from "./personas";

const PHOTO_CAPTIONS = [
    "Ranked lobby",
    "Clash win screen",
    "Scrim whiteboard",
    "Pentakill clip still",
    "Skin showcase",
    "Duo queue vibes",
    "Watch party",
    "Bootcamp desk",
];

function picturesFor(playerPublicId: string, nickname: string, personaIndex: number): PlayerMediaDto[] {
    const count = 2 + (personaIndex % 3);
    return Array.from({ length: count }, (_, shot) => {
        const seed = `lol-${nickname.toLowerCase()}-${shot + 1}`;
        return {
            publicId: mockUuid(`lol:picture:${nickname}:${shot}`),
            playerPublicId,
            url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`,
            caption: PHOTO_CAPTIONS[(personaIndex * 3 + shot) % PHOTO_CAPTIONS.length],
            share: true,
            creationDate: new Date(Date.UTC(2025, 2 + (shot % 8), 2 + personaIndex)).toISOString(),
        };
    });
}

export const mockPlayerPictures: PlayerMediaDto[] = MOCK_PERSONAS.flatMap((persona, index) =>
    picturesFor(persona.playerPublicId, persona.nickname, index),
);

const featured = MOCK_PERSONAS.slice(0, 6);

export const mockPlayerVideos: PlayerMediaDto[] = featured.map((persona, index) => ({
    publicId: mockUuid(`lol:video:${persona.nickname}`),
    playerPublicId: persona.playerPublicId,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: `${persona.nickname} — outplay compilation`,
    share: true,
    creationDate: new Date(Date.UTC(2025, 5, 1 + index)).toISOString(),
}));

export const mockPlayerStreams: PlayerMediaDto[] = featured.slice(0, 4).map((persona, index) => ({
    publicId: mockUuid(`lol:stream:${persona.nickname}`),
    playerPublicId: persona.playerPublicId,
    url: "https://twitch.tv/riotgames",
    caption: `${persona.nickname} community night`,
    share: true,
    creationDate: new Date(Date.UTC(2025, 6, 1 + index)).toISOString(),
}));
