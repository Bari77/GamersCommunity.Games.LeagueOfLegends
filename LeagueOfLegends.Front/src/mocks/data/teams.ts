import { TeamApplicationDto } from "@features/teams/dto/team-application.dto";
import { TeamSheetDto, TeamSummaryDto } from "@features/teams/dto/team.dto";
import { PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID, mockPlayerSheet } from "./players";

export const TEAM_PUBLIC_ID = "44444444-4444-4444-4444-444444444444";

export const mockTeamSheet: TeamSheetDto = {
    publicId: TEAM_PUBLIC_ID,
    entitled: "T1",
    discriminator: "0001",
    tag: "T1",
    sentence: "<p>We play to win.</p>",
    layoutJson: null,
    regionCode: "kr",
    creationDate: new Date().toISOString(),
    memberCount: 1,
    playerSlotCount: 1,
    members: [
        {
            playerPublicId: PLAYER_PUBLIC_ID,
            platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
            nickname: mockPlayerSheet.nickname,
            discriminator: mockPlayerSheet.discriminator,
            avatarUrl: mockPlayerSheet.avatarUrl,
            rank: "captain",
            gameName: mockPlayerSheet.gameName,
            tagLine: mockPlayerSheet.tagLine,
            idLane: mockPlayerSheet.primaryLane?.id ?? 3,
            laneCode: mockPlayerSheet.primaryLane?.code ?? "mid",
            rosterKind: "main",
            joinedAt: new Date().toISOString(),
        },
    ],
    viewerRank: "captain",
    viewerApplicationStatus: null,
    viewerApplicationPublicId: null,
    pendingApplicationCount: 0,
};

export const mockTeamSummaries: TeamSummaryDto[] = [
    {
        publicId: TEAM_PUBLIC_ID,
        entitled: mockTeamSheet.entitled,
        discriminator: mockTeamSheet.discriminator,
        tag: mockTeamSheet.tag,
        sentence: mockTeamSheet.sentence,
        regionCode: mockTeamSheet.regionCode,
        creationDate: mockTeamSheet.creationDate,
        memberCount: mockTeamSheet.memberCount,
        playerSlotCount: mockTeamSheet.playerSlotCount,
    },
    {
        publicId: "55555555-5555-5555-5555-555555555555",
        entitled: "G2 Esports",
        discriminator: "0002",
        tag: "G2",
        sentence: "<p>Come for the memes, stay for the fights.</p>",
        regionCode: "euw",
        creationDate: new Date(Date.now() - 86400000).toISOString(),
        memberCount: 3,
        playerSlotCount: 3,
    },
];

export const mockTeamApplications: TeamApplicationDto[] = [];
