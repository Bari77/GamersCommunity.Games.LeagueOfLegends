import { PlayerSummaryRankDto } from "./player-summary-rank.dto";

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
    solo?: PlayerSummaryRankDto | null;
    creationDate: string;
}
