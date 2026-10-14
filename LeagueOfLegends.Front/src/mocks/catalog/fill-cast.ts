import { PlayerChampionDto } from "@features/players/dto/player-champion.dto";
import { FillPlayer } from "./fill-player";
import { FillTeam } from "./fill-team";
import { mockPlayerOptions } from "./options";
import { mockRandom, pickOne, pickWeighted, randomInt, shuffled } from "./random";
import { MAX_SKILL_SCORE, sampleSkillScore, soloFromScore } from "./rank-ladder";
import { MAIN_LANES, TeamMemberSeed } from "./team-member-seed";

type Lane = (typeof MAIN_LANES)[number];

const DAY = 86_400_000;
const CAST_START = Date.UTC(2020, 0, 1);
const CAST_END = Date.UTC(2026, 9, 1);

const REGION_WEIGHTS: readonly (readonly [string, number])[] = [
    ["euw", 35],
    ["na", 25],
    ["eune", 20],
    ["kr", 20],
];
const DEFAULT_TAGS: Record<string, string> = { euw: "EUW", eune: "EUNE", na: "NA1", kr: "KR1" };
const CUSTOM_TAGS = ["FR1", "GG", "MID", "2003", "777", "LUL", "XD", "0420", "TOP", "SUPP", "EZ", "1v9", "CAT", "ZZZ"];

const LANE_POOLS: Record<Lane, readonly string[]> = {
    top: [
        "aatrox",
        "camille",
        "darius",
        "fiora",
        "garen",
        "gnar",
        "gwen",
        "illaoi",
        "irelia",
        "jax",
        "jayce",
        "kennen",
        "kled",
        "ksante",
        "malphite",
        "mordekaiser",
        "nasus",
        "ornn",
        "poppy",
        "renekton",
        "riven",
        "sett",
        "shen",
        "sion",
        "teemo",
        "tryndamere",
        "urgot",
        "volibear",
        "yorick",
    ],
    jungle: [
        "amumu",
        "belveth",
        "briar",
        "diana",
        "ekko",
        "elise",
        "evelynn",
        "fiddlesticks",
        "graves",
        "hecarim",
        "ivern",
        "jarvaniv",
        "karthus",
        "kayn",
        "khazix",
        "kindred",
        "leesin",
        "lillia",
        "masteryi",
        "nidalee",
        "nocturne",
        "nunu",
        "rammus",
        "reksai",
        "rengar",
        "sejuani",
        "shaco",
        "udyr",
        "vi",
        "viego",
        "warwick",
        "xinzhao",
        "zac",
    ],
    mid: [
        "ahri",
        "akali",
        "anivia",
        "annie",
        "aurelionsol",
        "aurora",
        "azir",
        "cassiopeia",
        "fizz",
        "galio",
        "hwei",
        "kassadin",
        "katarina",
        "leblanc",
        "lissandra",
        "malzahar",
        "mel",
        "naafiri",
        "orianna",
        "qiyana",
        "ryze",
        "sylas",
        "syndra",
        "taliyah",
        "talon",
        "twistedfate",
        "veigar",
        "vex",
        "viktor",
        "vladimir",
        "yasuo",
        "yone",
        "zed",
        "zoe",
    ],
    bottom: [
        "aphelios",
        "ashe",
        "caitlyn",
        "corki",
        "draven",
        "ezreal",
        "jhin",
        "jinx",
        "kaisa",
        "kalista",
        "kogmaw",
        "lucian",
        "missfortune",
        "nilah",
        "samira",
        "sivir",
        "smolder",
        "tristana",
        "twitch",
        "varus",
        "vayne",
        "xayah",
        "zeri",
        "ziggs",
    ],
    support: [
        "alistar",
        "bard",
        "blitzcrank",
        "brand",
        "braum",
        "janna",
        "karma",
        "leona",
        "lulu",
        "lux",
        "milio",
        "morgana",
        "nami",
        "nautilus",
        "pyke",
        "rakan",
        "rell",
        "renata",
        "senna",
        "seraphine",
        "sona",
        "soraka",
        "taric",
        "thresh",
        "velkoz",
        "xerath",
        "yuumi",
        "zilean",
        "zyra",
    ],
};

const SINGLE_NAMES = [
    "Arden",
    "Blythe",
    "Cassian",
    "Diora",
    "Elowen",
    "Faris",
    "Gwyn",
    "Hester",
    "Idris",
    "Jorah",
    "Keira",
    "Lumen",
    "Merin",
    "Nalia",
    "Oskar",
    "Perrin",
    "Quenna",
    "Rhosyn",
    "Sable",
    "Tamsin",
    "Ulric",
    "Veda",
    "Wynn",
    "Xara",
    "Yorick",
    "Zephyr",
    "Auden",
];

const NAME_HEADS = [
    "Lazy",
    "Silent",
    "Neon",
    "Tilted",
    "Crimson",
    "Lucky",
    "Mini",
    "Void",
    "Salty",
    "Sleepy",
    "Frost",
    "Dusk",
    "Echo",
    "Faded",
    "Glass",
    "Haze",
    "Kite",
    "Lunar",
    "Mild",
    "Odd",
    "Pixel",
    "Rusty",
    "Velvet",
    "Wild",
    "Zen",
    "Mochi",
    "Feral",
    "Tiny",
    "Noisy",
    "Cozy",
    "Grumpy",
    "Shy",
];

const NAME_TAILS = [
    "Fox",
    "Owl",
    "Wolf",
    "Blade",
    "Mage",
    "Ward",
    "Tide",
    "Bean",
    "Moth",
    "Kitten",
    "Ronin",
    "Sage",
    "Spark",
    "Toast",
    "Hydra",
    "Crow",
    "Lotus",
    "Pebble",
    "Nova",
    "Gank",
    "Penguin",
    "Muffin",
    "Lancer",
    "Otter",
];

const IRL_LINES = [
    "Student, ranked between two exams.",
    "Night shift worker, queues at weird hours.",
    "Dad of two, games after bedtime.",
    "Mic on, tilt off. Usually.",
    "Plays with a coffee, not an energy drink.",
    "Back after a two-year break.",
    "Clash every weekend with IRL friends.",
    "Engineer by day, inting by night (only sometimes).",
    "Main account, no smurfs, promise.",
    "Streams sometimes, nobody watches, still fun.",
    "French / English, happy to queue with anyone chill.",
    "Remote worker, flexible schedule.",
    "Started in season 4, still not over that Worlds.",
    "Goal this split: one tier up, no matter what.",
    "Here for Clash and the occasional ARAM.",
    "Ex-WoW raider, now enjoying shorter games.",
    "Usually online after 21:00.",
    "Muted all chat since 2019, best decision ever.",
    "Plays on a laptop, don't judge the FPS.",
    "Duo partner wanted, preferably someone who pings back.",
];

const FREE_AGENT_LINES = [
    "Looking for a team to scrim with, two nights a week.",
    "LFT — reliable, on time, decent comms.",
    "Searching for a Clash squad that actually shows up.",
    "Old team disbanded, open to new rosters.",
];

const COACH_LINES = [
    "Former high-elo player, now coaching amateur rosters.",
    "Draft nerd. Spreadsheets everywhere.",
    "VOD review every Monday, no excuses.",
];

const MANAGER_LINES = [
    "Handles scrim schedules, the Discord and the snacks.",
    "Keeps the roster organised so the players can just play.",
    "Books scrims, chases sign-ups, files Clash entries.",
];

const LANE_LINES: Record<Lane, readonly string[]> = {
    top: [
        "Weak side top, happy to play tanks for the team.",
        "Carry top when the draft allows.",
        "Split-push enjoyer, TP timings matter.",
        "Bruiser main, island life suits me.",
    ],
    jungle: [
        "Full-clear jungler, tracks every camp timer.",
        "Gank-heavy pathing, lives in the river.",
        "Plays for objectives, not for kills.",
        "Invade first, ask questions later.",
    ],
    mid: [
        "Control mage mid, waves before roams.",
        "Assassin mid, roams when the wave allows.",
        "Plays safe mid and scales into teamfights.",
        "Pocket pick for every draft, sometimes too many.",
    ],
    bottom: [
        "Scaling ADC, farms until late game.",
        "Lane bully ADC, wants a support who plays forward.",
        "Positioning first, damage second.",
        "Still learning to say no to bad fights.",
    ],
    support: [
        "Engage support, looks for picks around wards.",
        "Enchanter main, peel is love.",
        "Roaming support, vision score enjoyer.",
        "Plays whatever the ADC needs.",
    ],
};

const LOW_ELO_LINES = ["Hardstuck, but improving every week.", "Learning wave management, slowly."];
const HIGH_ELO_LINES = ["Peaked one tier higher last split.", "Reviews own VODs after every loss."];

const TEAM_NAMES = [
    "Ash Choir",
    "Blue Wardens",
    "Cinder Draft",
    "Driftline",
    "Echo Five",
    "Farstride",
    "Gold Lantern",
    "Hollow Ace",
    "Ivory Tempo",
    "Jade Barrage",
    "Kite Theory",
    "Low Economy",
    "Mirror Call",
    "North Gate",
    "Open Nexus",
    "Pale Engage",
    "Quiet Baron",
    "Red Buff Club",
    "Second Wave",
    "Tower Dive",
    "Under Siege",
    "Vision Denied",
    "Wardless",
    "Zero Flash",
];

const FULL_SENTENCES = [
    "Scrims Tue/Thu 20:00, ranked the rest of the week.",
    "Clash every weekend, VOD review on Mondays.",
    "Five friends, one Discord, too many inside jokes.",
    "Tournament prep: two scrim blocks a week, no tilt allowed.",
];

const STAFFED_SENTENCES = [
    "Full roster and staff, aiming for the next amateur cup.",
    "Coached roster — drafts prepared, VODs reviewed, egos parked.",
];

const FORMING_SENTENCES = [
    "Just started — building the roster, most lanes open.",
    "Duo looking for three more to queue Flex and Clash.",
    "New team, chill vibes first, results later.",
];

const LANE_LABELS: Record<Lane, string> = {
    top: "top laner",
    jungle: "jungler",
    mid: "mid laner",
    bottom: "ADC",
    support: "support",
};

/** How many fill rosters land in each state, so devs always get full, partial and brand-new teams. */
const TEAM_STATUS_COUNTS: readonly (readonly ["full" | "complete" | "recruiting" | "forming", number])[] = [
    ["full", 9],
    ["complete", 5],
    ["recruiting", 7],
    ["forming", 3],
];

/** Apex rosters are a handful worldwide; fill teams top out around Master. */
const MAX_TEAM_CENTER = 28;

const FREE_AGENT_COUNT = 30;

const random = mockRandom("lol:fill-cast");
const regionIds = new Map(mockPlayerOptions.regions.map((region) => [region.code, region.id]));
const laneIds = new Map(mockPlayerOptions.lanes.map((lane) => [lane.code, lane.id]));
const championIds = new Map(mockPlayerOptions.champions.map((champion) => [champion.code, champion.id]));
const usedNames = new Set<string>();
const singleNames = shuffled(random, SINGLE_NAMES);

const clampScore = (score: number): number => Math.min(Math.max(score, 0), MAX_SKILL_SCORE);
const isoAt = (time: number): string => new Date(time).toISOString();
const tierLabel = (score: number): string => {
    const tier = soloFromScore(score, random).tier ?? "gold";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
};

function nextName(): { nickname: string; gameName: string } {
    const single = singleNames.shift();
    if (single) {
        usedNames.add(single);
        return { nickname: single, gameName: single };
    }
    for (;;) {
        const head = pickOne(random, NAME_HEADS);
        const tail = pickOne(random, NAME_TAILS);
        const style = random();
        const nickname =
            style < 0.15
                ? `${head}${tail}${randomInt(random, 1, 99)}`
                : style < 0.3
                  ? `${head}${tail}`.toLowerCase()
                  : `${head}${tail}`;
        if (usedNames.has(nickname.toLowerCase())) {
            continue;
        }
        usedNames.add(nickname.toLowerCase());
        return { nickname, gameName: random() < 0.2 ? `${head} ${tail}` : nickname };
    }
}

function champion(code: string, kind: string, lane: Lane): PlayerChampionDto {
    const id = championIds.get(code);
    if (id === undefined) {
        throw new Error(`Unknown mock champion ${code}`);
    }
    return { id, code, kind, lane };
}

function championsFor(primary: Lane, secondaries: Lane[]): PlayerChampionDto[] {
    const pool = shuffled(random, LANE_POOLS[primary]);
    const picks = [champion(pool[0], "main", primary)];
    if (random() < 0.25) {
        picks.push(champion(pool[1], "main", primary));
    }
    for (const code of pool.slice(picks.length, picks.length + randomInt(random, 1, 4))) {
        picks.push(champion(code, "pool", primary));
    }
    const offRole = secondaries[0];
    if (offRole && random() < 0.6) {
        const code = shuffled(random, LANE_POOLS[offRole]).find((item) => !picks.some((pick) => pick.code === item));
        if (code) {
            picks.push(champion(code, "pool", offRole));
        }
    }
    if (random() < 0.5) {
        const code = pool.find((item) => !picks.some((pick) => pick.code === item));
        if (code) {
            picks.push(champion(code, "learning", primary));
        }
    }
    return picks;
}

function makePlayer(opts: {
    region: string;
    lane: Lane;
    score: number;
    role?: "coach" | "manager" | "free";
    before: number;
}): FillPlayer {
    const { nickname, gameName } = nextName();
    const others = shuffled(
        random,
        MAIN_LANES.filter((lane) => lane !== opts.lane),
    );
    const secondaries = others.slice(
        0,
        pickWeighted(random, [
            [0, 2],
            [1, 6],
            [2, 2],
        ]),
    );
    const score = clampScore(opts.score);
    const flavour =
        score < 10 && random() < 0.5
            ? ` ${pickOne(random, LOW_ELO_LINES)}`
            : score >= 24 && random() < 0.5
              ? ` ${pickOne(random, HIGH_ELO_LINES)}`
              : "";
    const irl =
        opts.role === "coach"
            ? pickOne(random, COACH_LINES)
            : opts.role === "manager"
              ? pickOne(random, MANAGER_LINES)
              : opts.role === "free" && random() < 0.6
                ? pickOne(random, FREE_AGENT_LINES)
                : pickOne(random, IRL_LINES);
    const earliest = Math.min(CAST_START + 365 * DAY, opts.before - 30 * DAY);
    const created = earliest + Math.floor(random() * Math.max(opts.before - 30 * DAY - earliest, DAY));
    return {
        who: nickname,
        gameName,
        tagLine: random() < 0.75 ? DEFAULT_TAGS[opts.region] : pickOne(random, CUSTOM_TAGS),
        discriminator: String(randomInt(random, 1, 9999)).padStart(4, "0"),
        presentationIrl: irl,
        presentationIg: `${pickOne(random, LANE_LINES[opts.lane])}${flavour}`,
        region: { id: regionIds.get(opts.region) ?? 1, code: opts.region },
        primaryLane: { id: laneIds.get(opts.lane) ?? 1, code: opts.lane },
        secondaryLanes: secondaries.map((lane) => ({ id: laneIds.get(lane) ?? 1, code: lane })),
        solo: soloFromScore(score, random),
        flex: soloFromScore(score + randomInt(random, -3, 2), random),
        champions: championsFor(opts.lane, secondaries),
        creationDate: isoAt(created),
    };
}

function teamTag(entitled: string): string {
    const words = entitled.split(/\s+/).filter(Boolean);
    return (words.length > 1 ? words.map((word) => word[0]).join("") : entitled.slice(0, 3)).toUpperCase();
}

function teamSentence(status: string, missing: Lane[], score: number, hasStaff: boolean): string {
    if (status === "forming") {
        return missing.length === 4
            ? "Captain looking for four players to build a roster from scratch."
            : pickOne(random, FORMING_SENTENCES);
    }
    if (status === "recruiting") {
        const labels = missing.map((lane) => LANE_LABELS[lane]).join(" and ");
        const wanted = `${/^[AEIOU]/i.test(labels) ? "an" : "a"} ${labels}`;
        return pickOne(random, [
            `Recruiting ${wanted} around ${tierLabel(score)} — scrims Wed/Sun.`,
            `Almost there: we still need ${wanted} to start Clash.`,
            `Looking for ${wanted} with a mic and a regular schedule.`,
        ]);
    }
    return hasStaff ? pickOne(random, [...FULL_SENTENCES, ...STAFFED_SENTENCES]) : pickOne(random, FULL_SENTENCES);
}

export const FILL_PLAYERS: FillPlayer[] = [];
export const FILL_TEAMS: FillTeam[] = [];

const teamStatuses = shuffled(
    random,
    TEAM_STATUS_COUNTS.flatMap(([status, count]) => Array.from({ length: count }, () => status)),
);
if (teamStatuses.length !== TEAM_NAMES.length) {
    throw new Error(`Fill team statuses (${teamStatuses.length}) must match team names (${TEAM_NAMES.length})`);
}

for (const [teamIndex, entitled] of TEAM_NAMES.entries()) {
    const region = pickWeighted(random, REGION_WEIGHTS);
    const status = teamStatuses[teamIndex];
    const center = Math.min(sampleSkillScore(random), MAX_TEAM_CENTER);
    const lanes = shuffled(random, MAIN_LANES);
    const mainCount =
        status === "forming" ? randomInt(random, 1, 2) : status === "recruiting" ? randomInt(random, 3, 4) : 5;
    const mainLanes = lanes.slice(0, mainCount);
    const missing = MAIN_LANES.filter((lane) => !mainLanes.includes(lane));
    const created =
        status === "forming"
            ? CAST_END - randomInt(random, 10, 120) * DAY
            : Date.UTC(2023, 0, 1) + Math.floor(random() * (CAST_END - 90 * DAY - Date.UTC(2023, 0, 1)));
    const joinedAt = (index: number): number =>
        index === 0 ? created : created + Math.floor(random() * Math.min(200 * DAY, CAST_END - created));

    const seats: { lane: Lane; rank: string; rosterKind?: "main" | "sub"; role?: "coach" | "manager" }[] = [
        ...mainLanes.map((lane, index) => ({
            lane,
            rank: index === 0 ? "captain" : "player",
            rosterKind: "main" as const,
        })),
    ];
    const subCount = status === "full" ? randomInt(random, 0, 2) : status === "recruiting" && random() < 0.3 ? 1 : 0;
    for (let i = 0; i < subCount; i++) {
        seats.push({ lane: pickOne(random, MAIN_LANES), rank: "player", rosterKind: "sub" });
    }
    const coachOdds = { full: 0.7, complete: 0.3, recruiting: 0.25, forming: 0.1 }[status];
    if (random() < coachOdds) {
        seats.push({ lane: pickOne(random, MAIN_LANES), rank: "coach", role: "coach" });
    }
    if (random() < (status === "full" ? 0.35 : 0.1)) {
        seats.push({ lane: pickOne(random, MAIN_LANES), rank: "manager", role: "manager" });
    }

    const members: TeamMemberSeed[] = seats.map((seat, index) => {
        const joined = joinedAt(index);
        const score =
            seat.role === "coach"
                ? center + randomInt(random, 3, 9)
                : seat.role === "manager"
                  ? center + randomInt(random, -4, 8)
                  : center + randomInt(random, -2, 2);
        const player = makePlayer({ region, lane: seat.lane, score, role: seat.role, before: joined });
        FILL_PLAYERS.push(player);
        return {
            who: player.who,
            rank: seat.rank,
            joinedAt: isoAt(joined),
            ...(seat.role ? {} : { lane: seat.lane, rosterKind: seat.rosterKind }),
        };
    });

    FILL_TEAMS.push({
        entitled,
        discriminator: String(randomInt(random, 1000, 9999)),
        tag: teamTag(entitled),
        sentence: `<p>${teamSentence(
            status,
            missing,
            center,
            seats.some((seat) => seat.role),
        )}</p>`,
        regionCode: region,
        creationDate: isoAt(created),
        members,
    });
}

for (let i = 0; i < FREE_AGENT_COUNT; i++) {
    FILL_PLAYERS.push(
        makePlayer({
            region: pickWeighted(random, REGION_WEIGHTS),
            lane: pickOne(random, MAIN_LANES),
            score: sampleSkillScore(random),
            role: "free",
            before: CAST_END,
        }),
    );
}
