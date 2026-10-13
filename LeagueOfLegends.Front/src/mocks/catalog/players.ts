import { PlayerSummaryDto } from "@features/home/dto/player-summary.dto";
import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";
import { MOCK_PERSONAS, mockPortraitUrl, persona } from "./personas";
import { getSessionPersona } from "./session";

const self = getSessionPersona();

export const PLATFORM_USER_PUBLIC_ID = self.platformUserPublicId;
export const PLAYER_PUBLIC_ID = self.playerPublicId;

interface SheetSeed {
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
}

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
        presentationIg: "Ahri main mid — Zed / Akali / Syndra pocket, still sharpening LeBlanc.",
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
            { id: 3, code: "akali", kind: "pool", lane: "mid" },
            { id: 70, code: "syndra", kind: "pool", lane: "mid" },
            { id: 82, code: "yasuo", kind: "pool", lane: "mid" },
            { id: 44, code: "leblanc", kind: "learning", lane: "mid" },
        ],
        creationDate: "2024-01-14T10:00:00.000Z",
    },
    {
        who: "Vexthorn",
        presentationIrl: "Pathing nerd. Looking for a reliable mid duo.",
        presentationIg: "Lee Sin invade jungler — Graves / Viego / Kha'Zix / Nidalee cover drafts.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "grandmaster", division: null, lp: 312 },
        flex: { tier: "emerald", division: "1", lp: 68 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 27, code: "graves", kind: "pool", lane: "jungle" },
            { id: 77, code: "viego", kind: "pool", lane: "jungle" },
            { id: 42, code: "khazix", kind: "pool", lane: "jungle" },
            { id: 56, code: "nidalee", kind: "pool", lane: "jungle" },
            { id: 41, code: "kayn", kind: "learning", lane: "jungle" },
        ],
        creationDate: "2024-06-12T18:00:00.000Z",
    },
    {
        who: "Lirael",
        presentationIrl: "EU evenings. Prefer duo bot with mics.",
        presentationIg: "Engage / peel support — Thresh main with Nautilus, Rell, Nami, Rakan.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "master", division: null, lp: 88 },
        flex: { tier: "diamond", division: "2", lp: 21 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 55, code: "nautilus", kind: "pool", lane: "support" },
            { id: 136, code: "rell", kind: "pool", lane: "support" },
            { id: 53, code: "nami", kind: "pool", lane: "support" },
            { id: 60, code: "rakan", kind: "pool", lane: "support" },
            { id: 36, code: "kaisa", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2024-08-01T12:00:00.000Z",
    },
    {
        who: "Kaelith",
        presentationIrl: "Top lane for life. Scrim-ready on weeknights.",
        presentationIg: "Weak-side top — Ornn / K'Sante / Renekton / Camille, Yasuo for snowball drafts.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "diamond", division: "1", lp: 56 },
        flex: { tier: "platinum", division: "2", lp: 40 },
        champions: [
            { id: 58, code: "ornn", kind: "main", lane: "top" },
            { id: 109, code: "ksante", kind: "pool", lane: "top" },
            { id: 61, code: "renekton", kind: "pool", lane: "top" },
            { id: 16, code: "camille", kind: "pool", lane: "top" },
            { id: 82, code: "yasuo", kind: "pool", lane: "top" },
            { id: 45, code: "leesin", kind: "learning", lane: "jungle" },
        ],
        creationDate: "2024-05-20T09:30:00.000Z",
    },
    {
        who: "Soryn",
        presentationIrl: "ADC who tracks wave states. Looking for a sticky support.",
        presentationIg: "Kai'Sa bot — Jinx / Ezreal / Xayah / Zeri / Lucian for draft coverage.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "emerald", division: "2", lp: 74 },
        flex: { tier: "emerald", division: "1", lp: 12 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
            { id: 23, code: "ezreal", kind: "pool", lane: "bottom" },
            { id: 80, code: "xayah", kind: "pool", lane: "bottom" },
            { id: 86, code: "zeri", kind: "pool", lane: "bottom" },
            { id: 118, code: "lucian", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2024-09-03T16:45:00.000Z",
    },
    {
        who: "Quill",
        presentationIrl: "NA nights. Shotcalling jungle for amateur rosters.",
        presentationIg: "Farm-into-skirmish jungle — Lee / Jarvan / Xin / Sejuani, Thresh when filling support.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "platinum", division: "1", lp: 33 },
        flex: { tier: "gold", division: "1", lp: 90 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 32, code: "jarvaniv", kind: "pool", lane: "jungle" },
            { id: 81, code: "xinzhao", kind: "pool", lane: "jungle" },
            { id: 142, code: "sejuani", kind: "pool", lane: "jungle" },
            { id: 77, code: "viego", kind: "pool", lane: "jungle" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
        ],
        creationDate: "2024-04-11T21:00:00.000Z",
    },
    {
        who: "Ashveil",
        presentationIrl: "Flex mid/support on KR evenings. Clash weekends.",
        presentationIg: "Roaming mid — LeBlanc / Ahri / Akali / Twisted Fate, Thresh off-role.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "diamond", division: "3", lp: 18 },
        flex: { tier: "diamond", division: "4", lp: 5 },
        champions: [
            { id: 44, code: "leblanc", kind: "main", lane: "mid" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
            { id: 3, code: "akali", kind: "pool", lane: "mid" },
            { id: 158, code: "twistedfate", kind: "pool", lane: "mid" },
            { id: 85, code: "zed", kind: "pool", lane: "mid" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
        ],
        creationDate: "2024-07-22T14:10:00.000Z",
    },
    {
        who: "Rivenna",
        presentationIrl: "Top / mid flex. Happy to fill for Clash.",
        presentationIg: "Bruiser top — Yasuo / Yone / Riven / Aatrox, Ahri when mid is open.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "platinum", division: "2", lp: 61 },
        flex: { tier: "platinum", division: "3", lp: 14 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 83, code: "yone", kind: "pool", lane: "top" },
            { id: 62, code: "riven", kind: "pool", lane: "top" },
            { id: 1, code: "aatrox", kind: "pool", lane: "top" },
            { id: 30, code: "irelia", kind: "pool", lane: "top" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
        ],
        creationDate: "2025-01-08T11:00:00.000Z",
    },
    {
        who: "Hexar",
        presentationIrl: "NA mid laner, night owl. Duo queue welcome.",
        presentationIg: "Assassin mid — Zed / LeBlanc / Akali / Qiyana / Talon.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "diamond", division: "2", lp: 27 },
        flex: { tier: "emerald", division: "3", lp: 80 },
        champions: [
            { id: 85, code: "zed", kind: "main", lane: "mid" },
            { id: 44, code: "leblanc", kind: "pool", lane: "mid" },
            { id: 3, code: "akali", kind: "pool", lane: "mid" },
            { id: 132, code: "qiyana", kind: "pool", lane: "mid" },
            { id: 153, code: "talon", kind: "pool", lane: "mid" },
            { id: 39, code: "katarina", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-02-19T03:20:00.000Z",
    },
    {
        who: "Solenne",
        presentationIrl: "EUNE support main. Soft engagers preferred.",
        presentationIg: "Enchanter / soft engage — Thresh / Nami / Lulu / Milio / Janna.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "gold", division: "1", lp: 44 },
        flex: { tier: "gold", division: "2", lp: 9 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 53, code: "nami", kind: "pool", lane: "support" },
            { id: 47, code: "lulu", kind: "pool", lane: "support" },
            { id: 123, code: "milio", kind: "pool", lane: "support" },
            { id: 31, code: "janna", kind: "pool", lane: "support" },
            { id: 69, code: "soraka", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-03-04T17:45:00.000Z",
    },
    {
        who: "Bramble",
        presentationIrl: "Jungle / support fill. Theorycraft Discord addict.",
        presentationIg: "Skirmish jungle — Lee / Graves / Viego / Lillia, Thresh / Nautilus on fill.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "emerald", division: "1", lp: 3 },
        flex: { tier: "platinum", division: "1", lp: 70 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 27, code: "graves", kind: "pool", lane: "jungle" },
            { id: 77, code: "viego", kind: "pool", lane: "jungle" },
            { id: 115, code: "lillia", kind: "pool", lane: "jungle" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
            { id: 55, code: "nautilus", kind: "pool", lane: "support" },
        ],
        creationDate: "2025-04-16T08:05:00.000Z",
    },
    {
        who: "Myrren",
        presentationIrl: "KR ADC. Quiet comms, loud CS numbers.",
        presentationIg: "Scaling bot — Kai'Sa / Aphelios / Jinx / Smolder / Ashe, Zed mid for fun.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "master", division: null, lp: 210 },
        flex: { tier: "diamond", division: "1", lp: 11 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 8, code: "aphelios", kind: "pool", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
            { id: 148, code: "smolder", kind: "pool", lane: "bottom" },
            { id: 9, code: "ashe", kind: "pool", lane: "bottom" },
            { id: 85, code: "zed", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-05-02T13:30:00.000Z",
    },
    {
        who: "Torven",
        presentationIrl: "NA top laner. Weak side specialist.",
        presentationIg: "Side-lane top — Yasuo / Yone / Jax / Camille / Tryndamere.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "emerald", division: "4", lp: 52 },
        flex: { tier: "platinum", division: "4", lp: 0 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 83, code: "yone", kind: "pool", lane: "top" },
            { id: 33, code: "jax", kind: "pool", lane: "top" },
            { id: 16, code: "camille", kind: "pool", lane: "top" },
            { id: 157, code: "tryndamere", kind: "pool", lane: "top" },
            { id: 2, code: "ahri", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-06-11T22:15:00.000Z",
    },
    {
        who: "Elandra",
        presentationIrl: "EUW mid. Coaching VODs on the side.",
        presentationIg: "Control-mage mid — Orianna / Ahri / Syndra / Viktor / Azir / Hwei.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "diamond", division: "4", lp: 91 },
        flex: { tier: "diamond", division: "4", lp: 40 },
        champions: [
            { id: 57, code: "orianna", kind: "main", lane: "mid" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
            { id: 70, code: "syndra", kind: "pool", lane: "mid" },
            { id: 78, code: "viktor", kind: "pool", lane: "mid" },
            { id: 10, code: "azir", kind: "pool", lane: "mid" },
            { id: 106, code: "hwei", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-07-01T10:40:00.000Z",
    },
    {
        who: "Pike",
        presentationIrl: "EUNE support / jungle. Always down for Clash.",
        presentationIg: "Hard engage support — Thresh / Leona / Nautilus / Pyke / Alistar, Lee on jungle fill.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "silver", division: "1", lp: 67 },
        flex: { tier: "gold", division: "4", lp: 22 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 46, code: "leona", kind: "pool", lane: "support" },
            { id: 55, code: "nautilus", kind: "pool", lane: "support" },
            { id: 59, code: "pyke", kind: "pool", lane: "support" },
            { id: 4, code: "alistar", kind: "pool", lane: "support" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2025-08-20T19:00:00.000Z",
    },
    {
        who: "Vesper",
        presentationIrl: "KR jungle. Tracking every camp timer.",
        presentationIg: "Skirmish jungle — Lee / Bel'Veth / Kha'Zix / Kindred / Graves.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 1, code: "top" }],
        solo: { tier: "grandmaster", division: null, lp: 88 },
        flex: { tier: "master", division: null, lp: 12 },
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 93, code: "belveth", kind: "pool", lane: "jungle" },
            { id: 42, code: "khazix", kind: "pool", lane: "jungle" },
            { id: 43, code: "kindred", kind: "pool", lane: "jungle" },
            { id: 27, code: "graves", kind: "pool", lane: "jungle" },
            { id: 82, code: "yasuo", kind: "learning", lane: "top" },
        ],
        creationDate: "2025-09-09T07:25:00.000Z",
    },
    {
        who: "Corvin",
        presentationIrl: "NA ADC. Looking for a permanent duo.",
        presentationIg: "Lane + scale ADC — Kai'Sa / Caitlyn / Jinx / Ezreal / Ashe, Thresh for duo practice.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "platinum", division: "3", lp: 19 },
        flex: { tier: "emerald", division: "4", lp: 55 },
        champions: [
            { id: 36, code: "kaisa", kind: "main", lane: "bottom" },
            { id: 15, code: "caitlyn", kind: "pool", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
            { id: 23, code: "ezreal", kind: "pool", lane: "bottom" },
            { id: 9, code: "ashe", kind: "pool", lane: "bottom" },
            { id: 71, code: "thresh", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-10-14T01:50:00.000Z",
    },
    {
        who: "Fenric",
        presentationIrl: "EUW top. Scrim block Tue/Thu.",
        presentationIg: "Split-push top — Yasuo / Yone / Fiora / Camille / Jax, Lee when autofilled jungle.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "master", division: null, lp: 45 },
        flex: { tier: "diamond", division: "2", lp: 8 },
        champions: [
            { id: 82, code: "yasuo", kind: "main", lane: "top" },
            { id: 83, code: "yone", kind: "pool", lane: "top" },
            { id: 24, code: "fiora", kind: "pool", lane: "top" },
            { id: 16, code: "camille", kind: "pool", lane: "top" },
            { id: 33, code: "jax", kind: "pool", lane: "top" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
        ],
        creationDate: "2025-11-28T15:05:00.000Z",
    },
    {
        who: "Dravik",
        presentationIrl: "KR top. Quiet voice, loud TP timings.",
        presentationIg: "Tank / bruiser top — Ornn / K'Sante / Aatrox / Gwen / Ambessa.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "diamond", division: "1", lp: 72 },
        flex: { tier: "diamond", division: "3", lp: 18 },
        champions: [
            { id: 58, code: "ornn", kind: "main", lane: "top" },
            { id: 109, code: "ksante", kind: "pool", lane: "top" },
            { id: 1, code: "aatrox", kind: "pool", lane: "top" },
            { id: 104, code: "gwen", kind: "pool", lane: "top" },
            { id: 90, code: "ambessa", kind: "pool", lane: "top" },
            { id: 61, code: "renekton", kind: "learning", lane: "top" },
        ],
        creationDate: "2025-12-02T08:10:00.000Z",
    },
    {
        who: "Calyx",
        presentationIrl: "KR support. Ward score enjoyer.",
        presentationIg: "Playmaking support — Thresh / Rakan / Bard / Rell / Nautilus.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "master", division: null, lp: 34 },
        flex: { tier: "diamond", division: "2", lp: 55 },
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 60, code: "rakan", kind: "pool", lane: "support" },
            { id: 11, code: "bard", kind: "pool", lane: "support" },
            { id: 136, code: "rell", kind: "pool", lane: "support" },
            { id: 55, code: "nautilus", kind: "pool", lane: "support" },
            { id: 53, code: "nami", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-12-04T11:20:00.000Z",
    },
    {
        who: "Orin",
        presentationIrl: "EUW jungle. Scrim pathing sheets in Notion.",
        presentationIg: "Tempo jungle — Viego / Lee / Xin / Jarvan / Sejuani.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 1, code: "top" }],
        solo: { tier: "diamond", division: "2", lp: 41 },
        flex: { tier: "emerald", division: "1", lp: 88 },
        champions: [
            { id: 77, code: "viego", kind: "main", lane: "jungle" },
            { id: 45, code: "leesin", kind: "pool", lane: "jungle" },
            { id: 81, code: "xinzhao", kind: "pool", lane: "jungle" },
            { id: 32, code: "jarvaniv", kind: "pool", lane: "jungle" },
            { id: 142, code: "sejuani", kind: "pool", lane: "jungle" },
            { id: 27, code: "graves", kind: "learning", lane: "jungle" },
        ],
        creationDate: "2025-12-06T15:40:00.000Z",
    },
    {
        who: "Wisp",
        presentationIrl: "NA nights. Soft shotcalls, hard peel.",
        presentationIg: "Enchanter support — Lulu / Nami / Milio / Janna / Karma.",
        region: { id: 3, code: "na" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "emerald", division: "2", lp: 29 },
        flex: { tier: "platinum", division: "1", lp: 63 },
        champions: [
            { id: 47, code: "lulu", kind: "main", lane: "support" },
            { id: 53, code: "nami", kind: "pool", lane: "support" },
            { id: 123, code: "milio", kind: "pool", lane: "support" },
            { id: 31, code: "janna", kind: "pool", lane: "support" },
            { id: 37, code: "karma", kind: "pool", lane: "support" },
            { id: 71, code: "thresh", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-12-08T02:05:00.000Z",
    },
    {
        who: "Marrow",
        presentationIrl: "EUW mid. Clash drafts on Discord voice.",
        presentationIg: "Poke / control mid — Syndra / Orianna / Viktor / Azir / Hwei.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 4, code: "bottom" }],
        solo: { tier: "emerald", division: "1", lp: 51 },
        flex: { tier: "diamond", division: "4", lp: 7 },
        champions: [
            { id: 70, code: "syndra", kind: "main", lane: "mid" },
            { id: 57, code: "orianna", kind: "pool", lane: "mid" },
            { id: 78, code: "viktor", kind: "pool", lane: "mid" },
            { id: 10, code: "azir", kind: "pool", lane: "mid" },
            { id: 106, code: "hwei", kind: "pool", lane: "mid" },
            { id: 2, code: "ahri", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-12-10T17:25:00.000Z",
    },
    {
        who: "Jex",
        presentationIrl: "EUW ADC. Wave management spreadsheets, somehow.",
        presentationIg: "Lane-priority bot — Lucian / Kai'Sa / Draven / Jinx / Ezreal.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "diamond", division: "3", lp: 12 },
        flex: { tier: "emerald", division: "2", lp: 44 },
        champions: [
            { id: 118, code: "lucian", kind: "main", lane: "bottom" },
            { id: 36, code: "kaisa", kind: "pool", lane: "bottom" },
            { id: 20, code: "draven", kind: "pool", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
            { id: 23, code: "ezreal", kind: "pool", lane: "bottom" },
            { id: 80, code: "xayah", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2025-12-12T13:55:00.000Z",
    },
    {
        who: "Pell",
        presentationIrl: "EUW support. Happy to draft around the ADC.",
        presentationIg: "Engage support — Leona / Nautilus / Rell / Alistar / Thresh.",
        region: { id: 1, code: "euw" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "platinum", division: "1", lp: 81 },
        flex: { tier: "emerald", division: "4", lp: 19 },
        champions: [
            { id: 46, code: "leona", kind: "main", lane: "support" },
            { id: 55, code: "nautilus", kind: "pool", lane: "support" },
            { id: 136, code: "rell", kind: "pool", lane: "support" },
            { id: 4, code: "alistar", kind: "pool", lane: "support" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
            { id: 12, code: "blitzcrank", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-12-14T19:10:00.000Z",
    },
    {
        who: "Rook",
        presentationIrl: "KR top academy. Reviews every death VOD.",
        presentationIg: "Carry top — Aatrox / Jayce / Gwen / Camille / Jax.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "grandmaster", division: null, lp: 61 },
        flex: { tier: "master", division: null, lp: 22 },
        champions: [
            { id: 1, code: "aatrox", kind: "main", lane: "top" },
            { id: 108, code: "jayce", kind: "pool", lane: "top" },
            { id: 104, code: "gwen", kind: "pool", lane: "top" },
            { id: 16, code: "camille", kind: "pool", lane: "top" },
            { id: 33, code: "jax", kind: "pool", lane: "top" },
            { id: 83, code: "yone", kind: "learning", lane: "top" },
        ],
        creationDate: "2025-12-16T07:30:00.000Z",
    },
    {
        who: "Kestrel",
        presentationIrl: "KR mid. Roam timers before wave states.",
        presentationIg: "Assassin / roam mid — Akali / LeBlanc / Ahri / Qiyana / Talon.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 2, code: "jungle" }],
        solo: { tier: "master", division: null, lp: 119 },
        flex: { tier: "diamond", division: "1", lp: 4 },
        champions: [
            { id: 3, code: "akali", kind: "main", lane: "mid" },
            { id: 44, code: "leblanc", kind: "pool", lane: "mid" },
            { id: 2, code: "ahri", kind: "pool", lane: "mid" },
            { id: 132, code: "qiyana", kind: "pool", lane: "mid" },
            { id: 153, code: "talon", kind: "pool", lane: "mid" },
            { id: 85, code: "zed", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-12-18T09:45:00.000Z",
    },
    {
        who: "Vale",
        presentationIrl: "KR support. Vision control first, KDA second.",
        presentationIg: "Utility support — Bard / Thresh / Renata / Rakan / Zyra.",
        region: { id: 4, code: "kr" },
        primaryLane: { id: 5, code: "support" },
        secondaryLanes: [{ id: 3, code: "mid" }],
        solo: { tier: "diamond", division: "2", lp: 66 },
        flex: { tier: "diamond", division: "4", lp: 31 },
        champions: [
            { id: 11, code: "bard", kind: "main", lane: "support" },
            { id: 71, code: "thresh", kind: "pool", lane: "support" },
            { id: 137, code: "renata", kind: "pool", lane: "support" },
            { id: 60, code: "rakan", kind: "pool", lane: "support" },
            { id: 88, code: "zyra", kind: "pool", lane: "support" },
            { id: 59, code: "pyke", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-12-20T14:00:00.000Z",
    },
    {
        who: "Ivor",
        presentationIrl: "EUNE top. Clash captain energy without the title.",
        presentationIg: "Frontline top — Malphite / Ornn / Sion / Sett / Cho'Gath.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 1, code: "top" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "grandmaster", division: null, lp: 278 },
        flex: { tier: "master", division: null, lp: 40 },
        champions: [
            { id: 49, code: "malphite", kind: "main", lane: "top" },
            { id: 58, code: "ornn", kind: "pool", lane: "top" },
            { id: 66, code: "sion", kind: "pool", lane: "top" },
            { id: 65, code: "sett", kind: "pool", lane: "top" },
            { id: 95, code: "chogath", kind: "pool", lane: "top" },
            { id: 18, code: "darius", kind: "learning", lane: "top" },
        ],
        creationDate: "2025-12-22T16:35:00.000Z",
    },
    {
        who: "Nox",
        presentationIrl: "EUNE jungle. Always down for a third Clash game.",
        presentationIg: "Easy clear jungle — Warwick / Amumu / Xin / Jarvan / Nunu.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 2, code: "jungle" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "master", division: null, lp: 156 },
        flex: { tier: "diamond", division: "1", lp: 22 },
        champions: [
            { id: 79, code: "warwick", kind: "main", lane: "jungle" },
            { id: 5, code: "amumu", kind: "pool", lane: "jungle" },
            { id: 81, code: "xinzhao", kind: "pool", lane: "jungle" },
            { id: 32, code: "jarvaniv", kind: "pool", lane: "jungle" },
            { id: 128, code: "nunu", kind: "pool", lane: "jungle" },
            { id: 45, code: "leesin", kind: "learning", lane: "jungle" },
        ],
        creationDate: "2025-12-24T20:15:00.000Z",
    },
    {
        who: "Halcyon",
        presentationIrl: "EUNE mid. Friendly flame only.",
        presentationIg: "Safe mid — Annie / Lux / Veigar / Malzahar / Orianna.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "diamond", division: "2", lp: 64 },
        flex: { tier: "emerald", division: "1", lp: 18 },
        champions: [
            { id: 7, code: "annie", kind: "main", lane: "mid" },
            { id: 48, code: "lux", kind: "pool", lane: "mid" },
            { id: 76, code: "veigar", kind: "pool", lane: "mid" },
            { id: 119, code: "malzahar", kind: "pool", lane: "mid" },
            { id: 57, code: "orianna", kind: "pool", lane: "mid" },
            { id: 2, code: "ahri", kind: "learning", lane: "mid" },
        ],
        creationDate: "2025-12-26T12:50:00.000Z",
    },
    {
        who: "Wren",
        presentationIrl: "EUNE ADC. Duo queue preferred.",
        presentationIg: "Safe bot — Ashe / Jinx / Miss Fortune / Sivir / Twitch.",
        region: { id: 2, code: "eune" },
        primaryLane: { id: 4, code: "bottom" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "silver", division: "1", lp: 83 },
        flex: { tier: "gold", division: "3", lp: 15 },
        champions: [
            { id: 9, code: "ashe", kind: "main", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
            { id: 50, code: "missfortune", kind: "pool", lane: "bottom" },
            { id: 67, code: "sivir", kind: "pool", lane: "bottom" },
            { id: 73, code: "twitch", kind: "pool", lane: "bottom" },
            { id: 36, code: "kaisa", kind: "learning", lane: "bottom" },
        ],
        creationDate: "2025-12-28T18:05:00.000Z",
    },
    {
        who: "Galen",
        presentationIrl: "NA analyst / coach. Spreadsheet menace.",
        presentationIg: "Draft-first mind — still keeps a mid pocket (Ahri / Orianna / TF).",
        region: { id: 3, code: "na" },
        primaryLane: { id: 3, code: "mid" },
        secondaryLanes: [{ id: 5, code: "support" }],
        solo: { tier: "challenger", division: null, lp: 892 },
        flex: { tier: "grandmaster", division: null, lp: 30 },
        champions: [
            { id: 2, code: "ahri", kind: "main", lane: "mid" },
            { id: 57, code: "orianna", kind: "pool", lane: "mid" },
            { id: 158, code: "twistedfate", kind: "pool", lane: "mid" },
            { id: 70, code: "syndra", kind: "pool", lane: "mid" },
            { id: 100, code: "galio", kind: "pool", lane: "mid" },
            { id: 71, code: "thresh", kind: "learning", lane: "support" },
        ],
        creationDate: "2025-12-30T01:40:00.000Z",
    },
];

const FILL_LANES: { id: number; code: string; champions: SheetSeed["champions"] }[] = [
    {
        id: 1,
        code: "top",
        champions: [
            { id: 1, code: "aatrox", kind: "main", lane: "top" },
            { id: 16, code: "camille", kind: "pool", lane: "top" },
        ],
    },
    {
        id: 2,
        code: "jungle",
        champions: [
            { id: 45, code: "leesin", kind: "main", lane: "jungle" },
            { id: 27, code: "graves", kind: "pool", lane: "jungle" },
        ],
    },
    {
        id: 3,
        code: "mid",
        champions: [
            { id: 2, code: "ahri", kind: "main", lane: "mid" },
            { id: 70, code: "syndra", kind: "pool", lane: "mid" },
        ],
    },
    {
        id: 4,
        code: "bottom",
        champions: [
            { id: 9, code: "ashe", kind: "main", lane: "bottom" },
            { id: 35, code: "jinx", kind: "pool", lane: "bottom" },
        ],
    },
    {
        id: 5,
        code: "support",
        champions: [
            { id: 71, code: "thresh", kind: "main", lane: "support" },
            { id: 46, code: "leona", kind: "pool", lane: "support" },
        ],
    },
];

const FILL_REGIONS = [
    { id: 1, code: "euw" },
    { id: 2, code: "eune" },
    { id: 3, code: "na" },
    { id: 4, code: "kr" },
];

const FILL_TIERS = ["silver", "gold", "platinum", "emerald", "diamond", "bronze"] as const;

const seeded = new Set(SEEDS.map((seed) => seed.who));
let fillIndex = 0;
for (const who of MOCK_PERSONAS) {
    if (seeded.has(who.nickname)) {
        continue;
    }
    const lane = FILL_LANES[fillIndex % FILL_LANES.length];
    const tier = FILL_TIERS[fillIndex % FILL_TIERS.length];
    SEEDS.push({
        who: who.nickname,
        presentationIrl: "Ranked after work, voice when the lobby is calm.",
        presentationIg: `${lane.code} main, still filling the pool.`,
        region: FILL_REGIONS[fillIndex % FILL_REGIONS.length],
        primaryLane: { id: lane.id, code: lane.code },
        secondaryLanes: [],
        solo: { tier, division: "2", lp: 15 + fillIndex },
        flex: { tier: "gold", division: "4", lp: 8 },
        champions: lane.champions,
        creationDate: new Date(Date.UTC(2023, fillIndex % 12, 2 + fillIndex, 12, 0, 0)).toISOString(),
    });
    fillIndex++;
}

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
        solo: sheetDto.solo ?? null,
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

export function lfgSenderFields(
    nickname: string,
    current: PlayerSheetDto = mockPlayerSheet,
): Pick<
    LfgMessageDto,
    | "senderNickname"
    | "senderDiscriminator"
    | "playerPublicId"
    | "platformUserPublicId"
    | "senderAvatarUrl"
    | "regionCode"
    | "laneCode"
> {
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
