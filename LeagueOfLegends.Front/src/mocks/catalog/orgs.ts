import { pickRosterChampions } from "@features/players/models/player.model";
import { TeamApplicationDto } from "@features/teams/dto/team-application.dto";
import { TeamMemberDto, TeamSheetDto, TeamSummaryDto } from "@features/teams/dto/team.dto";
import { mockUuid } from "./ids";
import { mockPlayerSheet, sheetByNickname } from "./players";

export const TEAM_PUBLIC_ID = mockUuid("lol:team:Nightveil");
export const IRON_CIRCUIT_TEAM_PUBLIC_ID = mockUuid("lol:team:Iron Circuit");
export const FROSTBYTE_TEAM_PUBLIC_ID = mockUuid("lol:team:Frostbyte");
export const EMBERLANE_TEAM_PUBLIC_ID = mockUuid("lol:team:Emberlane");
export const SILENT_WARD_TEAM_PUBLIC_ID = mockUuid("lol:team:Silent Ward");
export const DAWNBREAK_TEAM_PUBLIC_ID = mockUuid("lol:team:Dawnbreak");

function memberFromSheet(
    nickname: string,
    rank: string,
    joinedAt: string,
    current = mockPlayerSheet,
): TeamMemberDto {
    const sheet = sheetByNickname(nickname, current);
    const laneCode = sheet.primaryLane?.code ?? "mid";
    return {
        playerPublicId: sheet.publicId,
        platformUserPublicId: sheet.platformUserPublicId,
        nickname: sheet.nickname,
        discriminator: sheet.discriminator,
        avatarUrl: sheet.avatarUrl,
        rank,
        gameName: sheet.gameName,
        tagLine: sheet.tagLine,
        idLane: sheet.primaryLane?.id ?? null,
        laneCode,
        rosterKind: "main",
        joinedAt,
        champions: pickRosterChampions(sheet.champions ?? [], laneCode),
    };
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
    members: [string, string, string][];
    viewerRank?: string | null;
    pendingApplicationCount?: number;
}): TeamSheetDto {
    const members = opts.members.map(([nickname, rank, joinedAt]) => memberFromSheet(nickname, rank, joinedAt));
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
        playerSlotCount: members.filter((member) => member.rank === "captain" || member.rank === "player").length,
        members,
        viewerRank: opts.viewerRank ?? null,
        viewerApplicationStatus: null,
        viewerApplicationPublicId: null,
        pendingApplicationCount: opts.pendingApplicationCount ?? 0,
    };
}

/** Session player's amateur roster (KR). */
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
        ["Nyxara", "captain", "2024-11-02T12:00:00.000Z"],
        ["Vexthorn", "player", "2024-11-08T19:00:00.000Z"],
        ["Ashveil", "player", "2025-01-14T17:30:00.000Z"],
        ["Myrren", "player", "2025-05-10T09:00:00.000Z"],
        ["Vesper", "coach", "2025-09-12T11:00:00.000Z"],
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
        ["Lirael", "captain", "2024-10-18T09:00:00.000Z"],
        ["Soryn", "player", "2024-10-20T20:15:00.000Z"],
        ["Kaelith", "player", "2024-12-01T11:00:00.000Z"],
        ["Elandra", "player", "2025-07-05T18:00:00.000Z"],
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
        ["Quill", "captain", "2025-01-22T02:00:00.000Z"],
        ["Hexar", "player", "2025-02-20T04:30:00.000Z"],
        ["Torven", "player", "2025-06-15T01:00:00.000Z"],
        ["Corvin", "player", "2025-10-16T03:45:00.000Z"],
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
        ["Bramble", "captain", "2025-03-08T16:00:00.000Z"],
        ["Rivenna", "player", "2025-03-09T19:20:00.000Z"],
        ["Fenric", "player", "2025-11-30T12:00:00.000Z"],
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
        ["Vesper", "captain", "2025-04-01T08:30:00.000Z"],
        ["Myrren", "player", "2025-05-03T14:00:00.000Z"],
        ["Ashveil", "manager", "2025-07-24T10:00:00.000Z"],
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
        ["Solenne", "captain", "2025-05-17T18:45:00.000Z"],
        ["Pike", "player", "2025-08-21T20:00:00.000Z"],
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
        message: "NA jungler visiting KR friends — can sub for scrims this month.",
        status: "pending",
        soughtRank: "player",
        laneCode: quill.primaryLane?.code ?? "jungle",
        creationDate: new Date(Date.now() - 3 * 3600000).toISOString(),
        reviewedAt: null,
    },
];

export function teamSheetByPublicId(publicId: string): TeamSheetDto | undefined {
    return mockTeamSheets.find((team) => team.publicId === publicId);
}
