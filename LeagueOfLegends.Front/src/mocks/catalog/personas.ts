import { mockPortraitUrl as portraitFromAssets, PlaygroundPersona } from "@bari77/gc-playground";
import { environment } from "../../environments/environment";
import { mockUuid } from "./ids";

/** Same catalog as Platform: `…/Avatars/{1-12}.png`, stable per seed so faces do not flicker. */
export function mockPortraitUrl(seed: string): string {
    return portraitFromAssets(environment.assetsBaseUrl, seed);
}

export interface MockPersona extends PlaygroundPersona {
    gameName: string;
    tagLine: string;
}

/**
 * Synthetic summoner cast for UI-only mocks (not real pros).
 * IDs are stable so deep links / LFG / Resolve keep working across reloads.
 */
export const MOCK_PERSONAS: MockPersona[] = [
    {
        id: "Nyxara",
        platformUserPublicId: mockUuid("lol:platform:Nyxara"),
        playerPublicId: mockUuid("lol:player:Nyxara"),
        nickname: "Nyxara",
        discriminator: "0001",
        gameName: "Nyxara",
        tagLine: "KR1",
    },
    {
        id: "Vexthorn",
        platformUserPublicId: mockUuid("lol:platform:Vexthorn"),
        playerPublicId: mockUuid("lol:player:Vexthorn"),
        nickname: "Vexthorn",
        discriminator: "0412",
        gameName: "Vexthorn",
        tagLine: "KR1",
    },
    {
        id: "Lirael",
        platformUserPublicId: mockUuid("lol:platform:Lirael"),
        playerPublicId: mockUuid("lol:player:Lirael"),
        nickname: "Lirael",
        discriminator: "0808",
        gameName: "Lirael",
        tagLine: "EUW",
    },
    {
        id: "Kaelith",
        platformUserPublicId: mockUuid("lol:platform:Kaelith"),
        playerPublicId: mockUuid("lol:player:Kaelith"),
        nickname: "Kaelith",
        discriminator: "1120",
        gameName: "Kaelith",
        tagLine: "EUW",
    },
    {
        id: "Soryn",
        platformUserPublicId: mockUuid("lol:platform:Soryn"),
        playerPublicId: mockUuid("lol:player:Soryn"),
        nickname: "Soryn",
        discriminator: "2204",
        gameName: "Soryn",
        tagLine: "EUW",
    },
    {
        id: "Quill",
        platformUserPublicId: mockUuid("lol:platform:Quill"),
        playerPublicId: mockUuid("lol:player:Quill"),
        nickname: "Quill",
        discriminator: "3091",
        gameName: "Quill",
        tagLine: "NA1",
    },
    {
        id: "Ashveil",
        platformUserPublicId: mockUuid("lol:platform:Ashveil"),
        playerPublicId: mockUuid("lol:player:Ashveil"),
        nickname: "Ashveil",
        discriminator: "5510",
        gameName: "Ashveil",
        tagLine: "KR1",
    },
    {
        id: "Rivenna",
        platformUserPublicId: mockUuid("lol:platform:Rivenna"),
        playerPublicId: mockUuid("lol:player:Rivenna"),
        nickname: "Rivenna",
        discriminator: "6612",
        gameName: "Rivenna",
        tagLine: "EUW",
    },
    {
        id: "Hexar",
        platformUserPublicId: mockUuid("lol:platform:Hexar"),
        playerPublicId: mockUuid("lol:player:Hexar"),
        nickname: "Hexar",
        discriminator: "7740",
        gameName: "Hexar",
        tagLine: "NA1",
    },
    {
        id: "Solenne",
        platformUserPublicId: mockUuid("lol:platform:Solenne"),
        playerPublicId: mockUuid("lol:player:Solenne"),
        nickname: "Solenne",
        discriminator: "8811",
        gameName: "Solenne",
        tagLine: "EUNE",
    },
    {
        id: "Bramble",
        platformUserPublicId: mockUuid("lol:platform:Bramble"),
        playerPublicId: mockUuid("lol:player:Bramble"),
        nickname: "Bramble",
        discriminator: "9022",
        gameName: "Bramble",
        tagLine: "EUW",
    },
    {
        id: "Myrren",
        platformUserPublicId: mockUuid("lol:platform:Myrren"),
        playerPublicId: mockUuid("lol:player:Myrren"),
        nickname: "Myrren",
        discriminator: "1337",
        gameName: "Myrren",
        tagLine: "KR1",
    },
    {
        id: "Torven",
        platformUserPublicId: mockUuid("lol:platform:Torven"),
        playerPublicId: mockUuid("lol:player:Torven"),
        nickname: "Torven",
        discriminator: "2448",
        gameName: "Torven",
        tagLine: "NA1",
    },
    {
        id: "Elandra",
        platformUserPublicId: mockUuid("lol:platform:Elandra"),
        playerPublicId: mockUuid("lol:player:Elandra"),
        nickname: "Elandra",
        discriminator: "3559",
        gameName: "Elandra",
        tagLine: "EUW",
    },
    {
        id: "Pike",
        platformUserPublicId: mockUuid("lol:platform:Pike"),
        playerPublicId: mockUuid("lol:player:Pike"),
        nickname: "Pike",
        discriminator: "4660",
        gameName: "Pike",
        tagLine: "EUNE",
    },
    {
        id: "Vesper",
        platformUserPublicId: mockUuid("lol:platform:Vesper"),
        playerPublicId: mockUuid("lol:player:Vesper"),
        nickname: "Vesper",
        discriminator: "5771",
        gameName: "Vesper",
        tagLine: "KR1",
    },
    {
        id: "Corvin",
        platformUserPublicId: mockUuid("lol:platform:Corvin"),
        playerPublicId: mockUuid("lol:player:Corvin"),
        nickname: "Corvin",
        discriminator: "6882",
        gameName: "Corvin",
        tagLine: "NA1",
    },
    {
        id: "Fenric",
        platformUserPublicId: mockUuid("lol:platform:Fenric"),
        playerPublicId: mockUuid("lol:player:Fenric"),
        nickname: "Fenric",
        discriminator: "7993",
        gameName: "Fenric",
        tagLine: "EUW",
    },
    {
        id: "Dravik",
        platformUserPublicId: mockUuid("lol:platform:Dravik"),
        playerPublicId: mockUuid("lol:player:Dravik"),
        nickname: "Dravik",
        discriminator: "8101",
        gameName: "Dravik",
        tagLine: "KR1",
    },
    {
        id: "Calyx",
        platformUserPublicId: mockUuid("lol:platform:Calyx"),
        playerPublicId: mockUuid("lol:player:Calyx"),
        nickname: "Calyx",
        discriminator: "8202",
        gameName: "Calyx",
        tagLine: "KR1",
    },
    {
        id: "Orin",
        platformUserPublicId: mockUuid("lol:platform:Orin"),
        playerPublicId: mockUuid("lol:player:Orin"),
        nickname: "Orin",
        discriminator: "8303",
        gameName: "Orin",
        tagLine: "EUW",
    },
    {
        id: "Wisp",
        platformUserPublicId: mockUuid("lol:platform:Wisp"),
        playerPublicId: mockUuid("lol:player:Wisp"),
        nickname: "Wisp",
        discriminator: "8404",
        gameName: "Wisp",
        tagLine: "NA1",
    },
    {
        id: "Marrow",
        platformUserPublicId: mockUuid("lol:platform:Marrow"),
        playerPublicId: mockUuid("lol:player:Marrow"),
        nickname: "Marrow",
        discriminator: "8505",
        gameName: "Marrow",
        tagLine: "EUW",
    },
    {
        id: "Jex",
        platformUserPublicId: mockUuid("lol:platform:Jex"),
        playerPublicId: mockUuid("lol:player:Jex"),
        nickname: "Jex",
        discriminator: "8606",
        gameName: "Jex",
        tagLine: "EUW",
    },
    {
        id: "Pell",
        platformUserPublicId: mockUuid("lol:platform:Pell"),
        playerPublicId: mockUuid("lol:player:Pell"),
        nickname: "Pell",
        discriminator: "8707",
        gameName: "Pell",
        tagLine: "EUW",
    },
    {
        id: "Rook",
        platformUserPublicId: mockUuid("lol:platform:Rook"),
        playerPublicId: mockUuid("lol:player:Rook"),
        nickname: "Rook",
        discriminator: "8808",
        gameName: "Rook",
        tagLine: "KR1",
    },
    {
        id: "Kestrel",
        platformUserPublicId: mockUuid("lol:platform:Kestrel"),
        playerPublicId: mockUuid("lol:player:Kestrel"),
        nickname: "Kestrel",
        discriminator: "8909",
        gameName: "Kestrel",
        tagLine: "KR1",
    },
    {
        id: "Vale",
        platformUserPublicId: mockUuid("lol:platform:Vale"),
        playerPublicId: mockUuid("lol:player:Vale"),
        nickname: "Vale",
        discriminator: "9010",
        gameName: "Vale",
        tagLine: "KR1",
    },
    {
        id: "Ivor",
        platformUserPublicId: mockUuid("lol:platform:Ivor"),
        playerPublicId: mockUuid("lol:player:Ivor"),
        nickname: "Ivor",
        discriminator: "9414",
        gameName: "Ivor",
        tagLine: "EUNE",
    },
    {
        id: "Nox",
        platformUserPublicId: mockUuid("lol:platform:Nox"),
        playerPublicId: mockUuid("lol:player:Nox"),
        nickname: "Nox",
        discriminator: "9111",
        gameName: "Nox",
        tagLine: "EUNE",
    },
    {
        id: "Halcyon",
        platformUserPublicId: mockUuid("lol:platform:Halcyon"),
        playerPublicId: mockUuid("lol:player:Halcyon"),
        nickname: "Halcyon",
        discriminator: "9212",
        gameName: "Halcyon",
        tagLine: "EUNE",
    },
    {
        id: "Wren",
        platformUserPublicId: mockUuid("lol:platform:Wren"),
        playerPublicId: mockUuid("lol:player:Wren"),
        nickname: "Wren",
        discriminator: "9313",
        gameName: "Wren",
        tagLine: "EUNE",
    },
    {
        id: "Galen",
        platformUserPublicId: mockUuid("lol:platform:Galen"),
        playerPublicId: mockUuid("lol:player:Galen"),
        nickname: "Galen",
        discriminator: "9515",
        gameName: "Galen",
        tagLine: "NA1",
    },
];

/**
 * Older cast so a dedicated search tab has a second page, and enough laners that fill rosters
 * never stack one player into many teams (see `orgs.ts`).
 */
const SEARCH_FILL = [
    ["Arden", "EUW"],
    ["Blythe", "NA1"],
    ["Cassian", "KR1"],
    ["Diora", "EUNE"],
    ["Elowen", "EUW"],
    ["Faris", "NA1"],
    ["Gwyn", "KR1"],
    ["Hester", "EUNE"],
    ["Idris", "EUW"],
    ["Jorah", "NA1"],
    ["Keira", "KR1"],
    ["Lumen", "EUNE"],
    ["Merin", "EUW"],
    ["Nalia", "NA1"],
    ["Oskar", "KR1"],
    ["Perrin", "EUNE"],
    ["Quenna", "EUW"],
    ["Rhosyn", "NA1"],
    ["Sable", "KR1"],
    ["Tamsin", "EUNE"],
    ["Ulric", "EUW"],
    ["Veda", "NA1"],
    ["Wynn", "KR1"],
    ["Xara", "EUNE"],
    ["Yorick", "EUW"],
    ["Zephyr", "NA1"],
    ["Auden", "KR1"],
] as const;

for (const [index, [nickname, tagLine]] of SEARCH_FILL.entries()) {
    MOCK_PERSONAS.push({
        id: nickname,
        platformUserPublicId: mockUuid(`lol:platform:${nickname}`),
        playerPublicId: mockUuid(`lol:player:${nickname}`),
        nickname,
        discriminator: String(3001 + index).padStart(4, "0"),
        gameName: nickname,
        tagLine,
    });
}

export const DEFAULT_PERSONA_ID = "Nyxara";

export function persona(nickname: string): MockPersona {
    const found = MOCK_PERSONAS.find((item) => item.id === nickname || item.nickname === nickname);
    if (!found) {
        throw new Error(`Unknown mock persona: ${nickname}`);
    }
    return found;
}

export function personaByPlatformId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((item) => item.platformUserPublicId === publicId);
}

export function personaByPlayerId(publicId: string): MockPersona | undefined {
    return MOCK_PERSONAS.find((item) => item.playerPublicId === publicId);
}
