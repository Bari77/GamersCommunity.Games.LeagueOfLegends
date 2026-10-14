import { pickRosterChampions } from "@features/players/models/player.model";
import { TeamApplicationDto } from "@features/teams/dto/team-application.dto";
import { TeamSummaryDto } from "@features/teams/dto/team-summary.dto";
import { TeamSheetDto } from "@features/teams/dto/team-sheet.dto";
import { TeamMemberDto } from "@features/teams/dto/team-member.dto";
import { FILL_TEAMS } from "./fill-cast";
import { mockUuid } from "./ids";
import { mockPlayerOptions } from "./options";
import { mockPlayerSheet, sheetByNickname } from "./players";
import { skillScore } from "./rank-ladder";
import { MAIN_LANES, TeamMemberSeed } from "./team-member-seed";

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

/** Divisions between the weakest and strongest player seat (staff excluded). */
const MAX_ROSTER_SKILL_SPREAD = 5;

function isPlayerSlot(rank: string): boolean {
    return rank === "captain" || rank === "player";
}

/** Coach, manager, then seats top → support, main before sub. */
export function sortRosterMembers(members: TeamMemberDto[]): TeamMemberDto[] {
    const group = (rank: string) => (rank === "coach" ? 0 : rank === "manager" ? 1 : 2);
    const lane = (code: string | null | undefined) => {
        const index = MAIN_LANES.indexOf(code as (typeof MAIN_LANES)[number]);
        return index === -1 ? MAIN_LANES.length : index;
    };
    const kind = (value: string | null | undefined) => (value === "main" ? 0 : value === "sub" ? 1 : 2);
    return [...members].sort(
        (a, b) =>
            group(a.rank) - group(b.rank) ||
            lane(a.laneCode) - lane(b.laneCode) ||
            kind(a.rosterKind) - kind(b.rosterKind) ||
            a.joinedAt.localeCompare(b.joinedAt),
    );
}

function memberFromSheet(seed: TeamMemberSeed, current = mockPlayerSheet): TeamMemberDto {
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

/**
 * Rosters may still be recruiting, but never field two mains on one lane, and the players must be
 * close enough on the ladder to queue together. Coaches and managers are exempt.
 */
function assertCoherentRoster(teamName: string, members: TeamMemberDto[]): void {
    const players = members.filter((member) => isPlayerSlot(member.rank));
    if (!players.some((member) => member.rank === "captain")) {
        throw new Error(`${teamName}: a roster needs a captain`);
    }
    for (const lane of MAIN_LANES) {
        const count = players.filter((member) => member.rosterKind === "main" && member.laneCode === lane).length;
        if (count > 1) {
            throw new Error(`${teamName}: expected at most one main ${lane}, got ${count}`);
        }
    }
    const scores = players.map((member) => skillScore(member.solo));
    const spread = Math.max(...scores) - Math.min(...scores);
    if (spread > MAX_ROSTER_SKILL_SPREAD) {
        throw new Error(`${teamName}: players span ${spread} divisions — keep a roster within one tier or so.`);
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
    members: TeamMemberSeed[];
    viewerRank?: string | null;
    pendingApplicationCount?: number;
}): TeamSheetDto {
    const members = sortRosterMembers(opts.members.map((seed) => memberFromSheet(seed)));
    assertCoherentRoster(opts.entitled, members);
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

/** Real players juggle scrims for one roster, two or three at most — mocks must not exceed that. */
const MAX_TEAMS_PER_PLAYER = 3;
const MAX_MAIN_SEATS_PER_PLAYER = 2;
type TeamLoad = Record<"teams" | "mains", number>;

function teamLoads(teams: TeamSheetDto[]): Map<string, TeamLoad> {
    const loads = new Map<string, TeamLoad>();
    for (const team of teams) {
        for (const member of team.members ?? []) {
            const load = loads.get(member.nickname) ?? { teams: 0, mains: 0 };
            load.teams++;
            if (isPlayerSlot(member.rank) && member.rosterKind === "main") {
                load.mains++;
            }
            loads.set(member.nickname, load);
        }
    }
    return loads;
}

function assertRealisticMemberships(teams: TeamSheetDto[]): void {
    for (const [nickname, load] of teamLoads(teams)) {
        if (load.teams > MAX_TEAMS_PER_PLAYER || load.mains > MAX_MAIN_SEATS_PER_PLAYER) {
            throw new Error(
                `${nickname} is in ${load.teams} teams (${load.mains} as main) — keep players to a few rosters.`,
            );
        }
    }
}

for (const fill of FILL_TEAMS) {
    const sheet = buildTeam({ publicId: mockUuid(`lol:team:${fill.entitled}`), ...fill });
    mockTeamSheets.push(sheet);
    mockTeamSummaries.push(toSummary(sheet));
}
assertRealisticMemberships(mockTeamSheets);

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
