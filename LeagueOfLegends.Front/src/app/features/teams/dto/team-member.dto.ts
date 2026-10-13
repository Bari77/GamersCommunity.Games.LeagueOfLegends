import { TeamMemberChampionDto } from "./team.dto";
import { TeamMemberRankDto } from "./team-member-rank.dto";

export interface TeamMemberDto {
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    rank: string;
    gameName?: string | null;
    tagLine?: string | null;
    idLane?: number | null;
    laneCode?: string | null;
    primaryLaneCode?: string | null;
    rosterKind?: string | null;
    joinedAt: string;
    /** Solo/Duo ladder when known (players and staff). */
    solo?: TeamMemberRankDto | null;
    champions?: TeamMemberChampionDto[];
}
