import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { TeamSummaryDto } from "@features/teams/dto/team.dto";

export interface HomeFeedDto {
    latestLfg: LfgMessageDto[];
    latestPlayers: PlayerSummaryDto[];
    latestTeams: TeamSummaryDto[];
}

export interface PlayerSummaryDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    gameName?: string | null;
    tagLine?: string | null;
    regionCode?: string | null;
    primaryLaneCode?: string | null;
    creationDate: string;
}
