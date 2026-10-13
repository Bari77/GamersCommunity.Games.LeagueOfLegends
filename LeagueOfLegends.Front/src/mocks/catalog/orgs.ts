import { pickRosterChampions } from "@features/players/models/player.model";
import { TeamApplicationDto } from "@features/teams/dto/team-application.dto";
import { TeamSummaryDto } from "@features/teams/dto/team-summary.dto";
import { TeamSheetDto } from "@features/teams/dto/team-sheet.dto";
import { TeamMemberDto } from "@features/teams/dto/team-member.dto";
import { mockUuid } from "./ids";
import { mockPlayerOptions } from "./options";
import { mockPlayerSheet, sheetByNickname } from "./players";

export const TEAM_PUBLIC_ID = mockUuid("lol:team:Nightveil");
export const IRON_CIRCUIT_TEAM_PUBLIC_ID = mockUuid("lol:team:Iron Circuit");
export const FROSTBYTE_TEAM_PUBLIC_ID = mockUuid("lol:team:Frostbyte");
export const EMBERLANE_TEAM_PUBLIC_ID = mockUuid("lol:team:Emberlane");
export const SILENT_WARD_TEAM_PUBLIC_ID = mockUuid("lol:team:Silent Ward");
export const DAWNBREAK_TEAM_PUBLIC_ID = mockUuid("lol:team:Dawnbreak");

const LANE_IDS = Object.fromEntries(mockPlayerOptions.lanes.map((lane) => [lane.code, lane.id])) as Record<
    string,
    number
>;

const MAIN_LANES = ["top", "jungle", "mid", "bottom", "support"] as const;

interface MemberSeed {
    who: string;
    rank: string;
    joinedAt: string;
    /** Required for captain/player seats; omitted for coach/manager. */
    lane?: (typeof MAIN_LANES)[number];
    rosterKind?: "main" | "sub";
}

function isPlayerSlot(rank: string): boolean {
    return rank === "captain" || rank === "player";
}

function memberFromSheet(seed: MemberSeed, current = mockPlayerSheet): TeamMemberDto {
    const sheet = sheetByNickname(seed.who, current);
    const playerSlot = isPlayerSlot(seed.rank);
    const laneCode = playerSlot ? (seed.lane ?? sheet.primaryLane?.code ?? "mid") : null;
    const idLane = laneCode ? (LANE_IDS[laneCode] ?? null) : null;
    const rosterKind = playerSlot ? (seed.rosterKind ?? "main") : null;

    return {
        playerPublicId: sheet.publicId,
        platformUserPublicId: sheet.platformUserPublicId,
        nickname: sheet.nickname,
        discriminator: sheet.discriminator,
        avatarUrl: sheet.avatarUrl,
        rank: seed.rank,
        gameName: sheet.gameName,
        tagLine: sheet.tagLine,
        idLane,
        laneCode,
        rosterKind,
        joinedAt: seed.joinedAt,
        solo: sheet.solo ?? null,
        champions: playerSlot && laneCode ? pickRosterChampions(sheet.champions ?? [], laneCode) : [],
    };
}

function assertCompleteMainRoster(teamName: string, members: TeamMemberDto[]): void {
    const mains = members.filter((member) => isPlayerSlot(member.rank) && member.rosterKind === "main");
    for (const lane of MAIN_LANES) {
        const count = mains.filter((member) => member.laneCode === lane).length;
        if (count !== 1) {
            throw new Error(`${teamName}: expected exactly one main ${lane}, got ${count}`);
        }
    }
}

function toSummary(team: TeamSheetDto): TeamSummaryDto {
    return {
        publicId: team.publicId,
        entitled: team.entitled,
        discriminator: team.discriminator,
        tag: team.tag,
        sentence: team.sentence,
        regionCode: team.regionCode,
        creationDate: team.creationDate,
        memberCount: team.memberCount,
        playerSlotCount: team.playerSlotCount,
    };
}

function buildTeam(opts: {
    publicId: string;
    entitled: string;
    discriminator: string;
    tag: string;
    sentence: string;
    regionCode: string;
    creationDate: string;
    members: MemberSeed[];
    viewerRank?: string | null;
    pendingApplicationCount?: number;
}): TeamSheetDto {
    const members = opts.members.map((seed) => memberFromSheet(seed));
    assertCompleteMainRoster(opts.entitled, members);
    return {
        publicId: opts.publicId,
        entitled: opts.entitled,
        discriminator: opts.discriminator,
        tag: opts.tag,
        sentence: opts.sentence,
        layoutJson: null,
        regionCode: opts.regionCode,
        creationDate: opts.creationDate,
        memberCount: members.length,
        playerSlotCount: members.filter((member) => isPlayerSlot(member.rank)).length,
        members,
        viewerRank: opts.viewerRank ?? null,
        viewerApplicationStatus: null,
        viewerApplicationPublicId: null,
        pendingApplicationCount: opts.pendingApplicationCount ?? 0,
    };
}

/** Session player's amateur roster (KR) — full five + mid sub + coach. */
export const mockTeamSheet: TeamSheetDto = buildTeam({
    publicId: TEAM_PUBLIC_ID,
    entitled: "Nightveil",
    discriminator: "0001",
    tag: "NV",
    sentence: "<p>Amateur KR stack. Scrims Tue/Thu, ranked grind the rest.</p>",
    regionCode: "kr",
    creationDate: "2024-11-02T12:00:00.000Z",
    viewerRank: "captain",
    pendingApplicationCount: 1,
    members: [
        { who: "Nyxara", rank: "captain", lane: "mid", rosterKind: "main", joinedAt: "2024-11-02T12:00:00.000Z" },
        { who: "Vexthorn", rank: "player", lane: "jungle", rosterKind: "main", joinedAt: "2024-11-08T19:00:00.000Z" },
        { who: "Dravik", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2025-12-03T10:00:00.000Z" },
        { who: "Myrren", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2025-05-10T09:00:00.000Z" },
        { who: "Calyx", rank: "player", lane: "support", rosterKind: "main", joinedAt: "2025-12-05T16:30:00.000Z" },
        { who: "Ashveil", rank: "player", lane: "mid", rosterKind: "sub", joinedAt: "2025-01-14T17:30:00.000Z" },
        { who: "Vesper", rank: "coach", joinedAt: "2025-09-12T11:00:00.000Z" },
    ],
});

export const mockIronCircuitSheet: TeamSheetDto = buildTeam({
    publicId: IRON_CIRCUIT_TEAM_PUBLIC_ID,
    entitled: "Iron Circuit",
    discriminator: "0002",
    tag: "IC",
    sentence: "<p>EUW clash + Flex. Looking for committed laners.</p>",
    regionCode: "euw",
    creationDate: "2024-10-18T09:00:00.000Z",
    members: [
        { who: "Lirael", rank: "captain", lane: "support", rosterKind: "main", joinedAt: "2024-10-18T09:00:00.000Z" },
        { who: "Kaelith", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2024-12-01T11:00:00.000Z" },
        { who: "Orin", rank: "player", lane: "jungle", rosterKind: "main", joinedAt: "2025-12-07T18:00:00.000Z" },
        { who: "Elandra", rank: "player", lane: "mid", rosterKind: "main", joinedAt: "2025-07-05T18:00:00.000Z" },
        { who: "Soryn", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2024-10-20T20:15:00.000Z" },
        { who: "Pell", rank: "player", lane: "support", rosterKind: "sub", joinedAt: "2025-12-15T12:00:00.000Z" },
        { who: "Galen", rank: "coach", joinedAt: "2025-12-31T09:00:00.000Z" },
    ],
});

export const mockFrostbyteSheet: TeamSheetDto = buildTeam({
    publicId: FROSTBYTE_TEAM_PUBLIC_ID,
    entitled: "Frostbyte",
    discriminator: "0003",
    tag: "FB",
    sentence: "<p>NA night stack. Shotcalls welcome, toxicity not.</p>",
    regionCode: "na",
    creationDate: "2025-01-22T02:00:00.000Z",
    members: [
        { who: "Quill", rank: "captain", lane: "jungle", rosterKind: "main", joinedAt: "2025-01-22T02:00:00.000Z" },
        { who: "Torven", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2025-06-15T01:00:00.000Z" },
        { who: "Hexar", rank: "player", lane: "mid", rosterKind: "main", joinedAt: "2025-02-20T04:30:00.000Z" },
        { who: "Corvin", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2025-10-16T03:45:00.000Z" },
        { who: "Wisp", rank: "player", lane: "support", rosterKind: "main", joinedAt: "2025-12-09T05:10:00.000Z" },
        { who: "Galen", rank: "manager", joinedAt: "2025-12-31T04:00:00.000Z" },
    ],
});

export const mockEmberlaneSheet: TeamSheetDto = buildTeam({
    publicId: EMBERLANE_TEAM_PUBLIC_ID,
    entitled: "Emberlane",
    discriminator: "0004",
    tag: "EL",
    sentence: "<p>EUW bot-lane theorycraft crew expanding into full Clash.</p>",
    regionCode: "euw",
    creationDate: "2025-03-08T16:00:00.000Z",
    members: [
        { who: "Bramble", rank: "captain", lane: "jungle", rosterKind: "main", joinedAt: "2025-03-08T16:00:00.000Z" },
        { who: "Rivenna", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2025-03-09T19:20:00.000Z" },
        { who: "Marrow", rank: "player", lane: "mid", rosterKind: "main", joinedAt: "2025-12-11T14:00:00.000Z" },
        { who: "Jex", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2025-12-13T10:30:00.000Z" },
        { who: "Pell", rank: "player", lane: "support", rosterKind: "main", joinedAt: "2025-12-15T11:00:00.000Z" },
        { who: "Fenric", rank: "player", lane: "top", rosterKind: "sub", joinedAt: "2025-11-30T12:00:00.000Z" },
        { who: "Lirael", rank: "coach", joinedAt: "2025-12-16T20:00:00.000Z" },
    ],
});

export const mockSilentWardSheet: TeamSheetDto = buildTeam({
    publicId: SILENT_WARD_TEAM_PUBLIC_ID,
    entitled: "Silent Ward",
    discriminator: "0005",
    tag: "SW",
    sentence: "<p>KR vision / jungle academy. Duo mid-jungle focus.</p>",
    regionCode: "kr",
    creationDate: "2025-04-01T08:30:00.000Z",
    members: [
        { who: "Vesper", rank: "captain", lane: "jungle", rosterKind: "main", joinedAt: "2025-04-01T08:30:00.000Z" },
        { who: "Rook", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2025-12-17T08:00:00.000Z" },
        { who: "Kestrel", rank: "player", lane: "mid", rosterKind: "main", joinedAt: "2025-12-19T12:00:00.000Z" },
        { who: "Myrren", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2025-05-03T14:00:00.000Z" },
        { who: "Vale", rank: "player", lane: "support", rosterKind: "main", joinedAt: "2025-12-21T09:30:00.000Z" },
        { who: "Ashveil", rank: "manager", joinedAt: "2025-07-24T10:00:00.000Z" },
    ],
});

export const mockDawnbreakSheet: TeamSheetDto = buildTeam({
    publicId: DAWNBREAK_TEAM_PUBLIC_ID,
    entitled: "Dawnbreak",
    discriminator: "0006",
    tag: "DB",
    sentence: "<p>EUNE social Clash team. Soft timers, hard vibes.</p>",
    regionCode: "eune",
    creationDate: "2025-05-17T18:45:00.000Z",
    members: [
        { who: "Solenne", rank: "captain", lane: "support", rosterKind: "main", joinedAt: "2025-05-17T18:45:00.000Z" },
        { who: "Ivor", rank: "player", lane: "top", rosterKind: "main", joinedAt: "2025-12-23T17:00:00.000Z" },
        { who: "Nox", rank: "player", lane: "jungle", rosterKind: "main", joinedAt: "2025-12-25T19:30:00.000Z" },
        { who: "Halcyon", rank: "player", lane: "mid", rosterKind: "main", joinedAt: "2025-12-27T14:00:00.000Z" },
        { who: "Wren", rank: "player", lane: "bottom", rosterKind: "main", joinedAt: "2025-12-29T16:20:00.000Z" },
        { who: "Pike", rank: "player", lane: "support", rosterKind: "sub", joinedAt: "2025-08-21T20:00:00.000Z" },
        { who: "Wisp", rank: "coach", joinedAt: "2026-01-02T18:00:00.000Z" },
    ],
});

export const mockTeamSheets: TeamSheetDto[] = [
    mockTeamSheet,
    mockIronCircuitSheet,
    mockFrostbyteSheet,
    mockEmberlaneSheet,
    mockSilentWardSheet,
    mockDawnbreakSheet,
];

export const mockTeamSummaries: TeamSummaryDto[] = mockTeamSheets.map(toSummary);

const FILL_TEAM_POOL = ["Nyxara", "Vexthorn", "Lirael", "Kaelith", "Soryn", "Quill", "Dravik", "Myrren", "Calyx", "Bramble"];
const FILL_TEAM_LANES = ["top", "jungle", "mid", "bottom", "support"] as const;
const FILL_TEAM_REGIONS = ["euw", "eune", "na", "kr"];
const FILL_TEAM_NAMES = [
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
    "Quiet Reset",
    "Red Tempo",
    "Soft Throw",
    "Third Drake",
    "Under Turret",
    "Void Tempo",
    "White Ward",
    "Yellow Trinket",
    "Zero Sum",
    "Arc Second",
    "Baron Bait",
    "Crash Course",
    "Deep Vision",
    "Even Trade",
    "First Blood",
    "Good Angle",
    "Hard Reset",
    "Inner Turret",
    "Jungle Gap",
    "Last Pick",
];

for (const [index, entitled] of FILL_TEAM_NAMES.entries()) {
    const sheet = buildTeam({
        publicId: mockUuid(`lol:team:${entitled}`),
        entitled,
        discriminator: String(1100 + index).padStart(4, "0"),
        tag: entitled.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase(),
        sentence: "Scrim block, two nights a week.",
        regionCode: FILL_TEAM_REGIONS[index % FILL_TEAM_REGIONS.length],
        creationDate: new Date(Date.UTC(2023, index % 12, 1 + (index % 27), 18, 0, 0)).toISOString(),
        members: FILL_TEAM_LANES.map((lane, laneIndex) => ({
            who: FILL_TEAM_POOL[(index + laneIndex) % FILL_TEAM_POOL.length],
            rank: laneIndex === 0 ? "captain" : "player",
            lane,
            rosterKind: "main" as const,
            joinedAt: "2023-06-01T12:00:00.000Z",
        })),
    });
    mockTeamSheets.push(sheet);
    mockTeamSummaries.push(toSummary(sheet));
}

const quill = sheetByNickname("Quill");

export const mockTeamApplications: TeamApplicationDto[] = [
    {
        publicId: mockUuid("lol:app:99999999-9999-9999-9999-999999999901"),
        teamPublicId: TEAM_PUBLIC_ID,
        teamName: mockTeamSheet.entitled,
        teamDiscriminator: mockTeamSheet.discriminator,
        playerPublicId: quill.publicId,
        platformUserPublicId: quill.platformUserPublicId,
        nickname: quill.nickname,
        discriminator: quill.discriminator,
        avatarUrl: quill.avatarUrl,
        message: "NA jungler visiting KR friends — happy to sit as jungle sub for scrims this month.",
        status: "pending",
        soughtRank: "player",
        laneCode: "jungle",
        creationDate: new Date(Date.now() - 3 * 3600000).toISOString(),
        reviewedAt: null,
    },
];

export function teamSheetByPublicId(publicId: string): TeamSheetDto | undefined {
    return mockTeamSheets.find((team) => team.publicId === publicId);
}
