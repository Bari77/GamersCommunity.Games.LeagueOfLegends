import { PlayerSummaryDto } from "@features/home/dto/home-feed.dto";
import { PlayerSheetDto } from "@features/players/dto/player.dto";
import { MOCK_PERSONAS, mockPortraitUrl, persona } from "./personas";
import { getSessionPersona } from "./session";

const self = getSessionPersona();

export const PLATFORM_USER_PUBLIC_ID = self.platformUserPublicId;
export const PLAYER_PUBLIC_ID = self.playerPublicId;

type SheetSeed = {
    who: string;
    presentationIrl: string;
    presentationIg: string;
    region: { id: number; code: string };
    primaryLane: { id: number; code: string };
    secondaryLanes: { id: number; code: string }[];
    solo: NonNullable<PlayerSheetDto["solo"]>;
    flex: NonNullable<PlayerSheetDto["flex"]>;
    champions: NonNullable<PlayerSheetDto["champions"]>;
    creationDate: string;
};

function sheet(opts: SheetSeed): PlayerSheetDto {
    const who = persona(opts.who);
    return {
        publicId: who.playerPublicId,
        platformUserPublicId: who.platformUserPublicId,
        nickname: who.nickname,
        discriminator: who.discriminator,
        avatarUrl: mockPortraitUrl(who.nickname),
        presentationIrl: opts.presentationIrl,
        presentationIg: opts.presentationIg,
        creationDate: opts.creationDate,
        layoutJson: null,
        gameName: who.gameName,
        tagLine: who.tagLine,
        region: opts.region,
        primaryLane: opts.primaryLane,
        secondaryLanes: opts.secondaryLanes,
        solo: opts.solo,
        flex: opts.flex,
        champions: opts.champions,
    };
}

const SEEDS: SheetSeed[] = [
    {
        who: "Nyxara",
        presentationIrl: "Climbing soloQ after work. Voice on Discord, chill vibes.",
        presentationIg: "Ahri one-trick with a Zed pocket pick.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [
            { id: 2, code: "jungle" },
            { id: 5, code: "support" },
        ],
        solo: { tier: "challenger", division: null, lp: 1247 },
        flex: { tier: "diamond", division: "1", lp: 42 },
        champions: [
            { id: 2, code: "ahri", kind: "main", lane: "mid" },
            { id: 85, code: "zed", kind: "pool", lane: "mid" },
            { id: 82, code: "yasuo", kind: "pool", lane: "mid" },
            { id: 7, code: "leblanc", kind: "learning", lane: "mid" },
            { id: 45, code: "leesin", kind: "learning", lane: "jungle" },
            { id: 36, code: "kaisa", kind: "pool", lane: "bottom" },
        ],
        creationDate: "2024-01-14T10:00:00.000Z",
    },
    {
        who: "Vexthorn",
        presentationIrl: "Pathing nerd. Looking for a reliable mid duo.",
        presentationIg: "Early invade jungler, tracks every wave.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "grandmaster", division: null, lp: 312 },
        flex: { tier: "emerald", division: "1", lp: 68 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 85, code: "zed", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2024-06-12T18:00:00.000Z",
    },
    {
        who: "Lirael",
        presentationIrl: "EU evenings. Prefer duo bot with mics.",
        presentationIg: "Engage / peel flex support.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "master", division: null, lp: 88 },
        flex: { tier: "diamond", division: "2", lp: 21 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 36, code: "kaisa", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2024-08-01T12:00:00.000Z",
    },
    {
        who: "Kaelith",
        presentationIrl: "Top lane for life. Scrim-ready on weeknights.",
        presentationIg: "Weak-side top, teleports for bot fights.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "diamond", division: "1", lp: 56 },
        flex: { tier: "platinum", division: "2", lp: 40 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2024-05-20T09:30:00.000Z",
    },
    {
        who: "Soryn",
        presentationIrl: "ADC who tracks wave states. Looking for a sticky support.",
        presentationIg: "Kai'Sa / lane bully bot.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "emerald", division: "2", lp: 74 },
        flex: { tier: "emerald", division: "1", lp: 12 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 2, code: "ahri", kind: "learning", lane: "mid" },
        ],
        creationDate: "2024-09-03T16:45:00.000Z",
    },
    {
        who: "Quill",
        presentationIrl: "NA nights. Shotcalling jungle for amateur rosters.",
        presentationIg: "Farm-heavy into mid-game skirmishes.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "platinum", division: "1", lp: 33 },
        flex: { tier: "gold", division: "1", lp: 90 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
        ],
        creationDate: "2024-04-11T21:00:00.000Z",
    },
    {
        who: "Ashveil",
        presentationIrl: "Flex mid/support on KR evenings. Clash weekends.",
        presentationIg: "Roaming mid with vision obsession.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "diamond", division: "3", lp: 18 },
        flex: { tier: "diamond", division: "4", lp: 5 },
        champions: [
            { id: 7, code: "leblanc", kind: "main", lane: "mid" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
        ],
        creationDate: "2024-07-22T14:10:00.000Z",
    },
    {
        who: "Rivenna",
        presentationIrl: "Top / mid flex. Happy to fill for Clash.",
        presentationIg: "Yasuo enjoyer, still learning Lee Sin.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "platinum", division: "2", lp: 61 },
        flex: { tier: "platinum", division: "3", lp: 14 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
        ],
        creationDate: "2025-01-08T11:00:00.000Z",
    },
    {
        who: "Hexar",
        presentationIrl: "NA mid laner, night owl. Duo queue welcome.",
        presentationIg: "Assassin mid — Zed / LeBlanc.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "diamond", division: "2", lp: 27 },
        flex: { tier: "emerald", division: "3", lp: 80 },
        champions: [
            { id: 85, code: "zed", kind: "main", lane: "mid" },
            { id: 7, code: "leblanc", kind: "pool", lane: "mid" },
        ],
        creationDate: "2025-02-19T03:20:00.000Z",
    },
    {
        who: "Solenne",
        presentationIrl: "EUNE support main. Soft engagers preferred.",
        presentationIg: "Thresh hooks and calm shotcalls.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "gold", division: "1", lp: 44 },
        flex: { tier: "gold", division: "2", lp: 9 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 36, code: "kaisa", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2025-03-04T17:45:00.000Z",
    },
    {
        who: "Bramble",
        presentationIrl: "Jungle / support fill. Theorycraft Discord addict.",
        presentationIg: "Lee Sin paths and warded rivers.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "emerald", division: "1", lp: 3 },
        flex: { tier: "platinum", division: "1", lp: 70 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
        ],
        creationDate: "2025-04-16T08:05:00.000Z",
    },
    {
        who: "Myrren",
        presentationIrl: "KR ADC. Quiet comms, loud CS numbers.",
        presentationIg: "Kai'Sa into most drafts.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "master", division: null, lp: 210 },
        flex: { tier: "diamond", division: "1", lp: 11 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 85, code: "zed", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-05-02T13:30:00.000Z",
    },
    {
        who: "Torven",
        presentationIrl: "NA top laner. Weak side specialist.",
        presentationIg: "Yasuo / teleport plays.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "emerald", division: "4", lp: 52 },
        flex: { tier: "platinum", division: "4", lp: 0 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
        ],
        creationDate: "2025-06-11T22:15:00.000Z",
    },
    {
        who: "Elandra",
        presentationIrl: "EUW mid. Coaching VODs on the side.",
        presentationIg: "Control mages and tempo mid.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "diamond", division: "4", lp: 91 },
        flex: { tier: "diamond", division: "4", lp: 40 },
        champions: [
            { id: 2, code: "ahri", kind: "main", lane: "mid" },
            { id: 7, code: "leblanc", kind: "pool", lane: "mid" },
        ],
        creationDate: "2025-07-01T10:40:00.000Z",
    },
    {
        who: "Pike",
        presentationIrl: "EUNE support / jungle. Always down for Clash.",
        presentationIg: "Engage support first, Lee when autofilled.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "silver", division: "1", lp: 67 },
        flex: { tier: "gold", division: "4", lp: 22 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2025-08-20T19:00:00.000Z",
    },
    {
        who: "Vesper",
        presentationIrl: "KR jungle. Tracking every camp timer.",
        presentationIg: "Lee Sin into skirmish comps.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 1, code: "top" }],
        solo: { tier: "grandmaster", division: null, lp: 88 },
        flex: { tier: "master", division: null, lp: 12 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 82, code: "yasuo", kind: "pool", lane: "top" },
        ],
        creationDate: "2025-09-09T07:25:00.000Z",
    },
    {
        who: "Corvin",
        presentationIrl: "NA ADC. Looking for a permanent duo.",
        presentationIg: "Kai'Sa into scaling drafts.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "platinum", division: "3", lp: 19 },
        flex: { tier: "emerald", division: "4", lp: 55 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 71, code: "thresh", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-10-14T01:50:00.000Z",
    },
    {
        who: "Fenric",
        presentationIrl: "EUW top. Scrim block Tue/Thu.",
        presentationIg: "Split-push Yasuo enjoyer.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "master", division: null, lp: 45 },
        flex: { tier: "diamond", division: "2", lp: 8 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2025-11-28T15:05:00.000Z",
    },
];

if (SEEDS.length !== MOCK_PERSONAS.length) {
    throw new Error(`LoL mock sheet seeds (${SEEDS.length}) must match personas (${MOCK_PERSONAS.length}).`);
}

const sheetsByNickname = Object.fromEntries(SEEDS.map((seed) => [seed.who, sheet(seed)])) as Record<
    string,
    PlayerSheetDto
>;

export const mockPlayerSheet: PlayerSheetDto = sheetsByNickname[self.nickname];

export const extraPlayerSheets: Record<string, PlayerSheetDto> = Object.fromEntries(
    Object.values(sheetsByNickname)
        .filter((item) => item.publicId !== PLAYER_PUBLIC_ID)
        .map((item) => [item.publicId, item]),
);

export function playerSheetByPublicId(publicId: string, current: PlayerSheetDto): PlayerSheetDto | null {
    if (publicId === current.publicId) {
        return current;
    }
    return extraPlayerSheets[publicId] ?? null;
}

export function allPlayerSheets(current: PlayerSheetDto = mockPlayerSheet): PlayerSheetDto[] {
    return [current, ...Object.values(extraPlayerSheets)];
}

export function toPlayerSummary(sheetDto: PlayerSheetDto): PlayerSummaryDto {
    return {
        publicId: sheetDto.publicId,
        platformUserPublicId: sheetDto.platformUserPublicId,
        nickname: sheetDto.nickname,
        discriminator: sheetDto.discriminator,
        avatarUrl: sheetDto.avatarUrl,
        presentationIrl: sheetDto.presentationIrl,
        gameName: sheetDto.gameName,
        tagLine: sheetDto.tagLine,
        regionCode: sheetDto.region?.code ?? null,
        primaryLaneCode: sheetDto.primaryLane?.code ?? null,
        creationDate: sheetDto.creationDate,
    };
}

export function sheetByNickname(nickname: string, current: PlayerSheetDto = mockPlayerSheet): PlayerSheetDto {
    if (nickname === current.nickname) {
        return current;
    }
    const found = sheetsByNickname[nickname];
    if (!found) {
        throw new Error(`No player sheet for persona ${nickname}`);
    }
    return found;
}

export function lfgSenderFields(nickname: string, current: PlayerSheetDto = mockPlayerSheet) {
    const sheetDto = sheetByNickname(nickname, current);
    return {
        senderNickname: sheetDto.nickname,
        senderDiscriminator: sheetDto.discriminator,
        playerPublicId: sheetDto.publicId,
        platformUserPublicId: sheetDto.platformUserPublicId,
        senderAvatarUrl: sheetDto.avatarUrl,
        regionCode: sheetDto.region?.code ?? null,
        laneCode: sheetDto.primaryLane?.code ?? null,
    };
}
