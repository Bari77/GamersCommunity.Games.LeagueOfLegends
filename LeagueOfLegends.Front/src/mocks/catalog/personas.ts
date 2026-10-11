import { mockPortraitUrl as portraitFromAssets, type PlaygroundPersona } from "@bari77/gc-playground";
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
];

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
