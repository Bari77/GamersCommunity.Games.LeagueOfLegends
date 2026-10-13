import { CatalogItemDto } from "./player.dto";
import { PlayerLaneDto } from "./player-lane.dto";
import { PlayerChampionDto } from "./player-champion.dto";
import { PlayerRankDto } from "./player-rank.dto";

export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    presentationIg?: string | null;
    creationDate: string;
    layoutJson?: string | null;
    gameName?: string | null;
    tagLine?: string | null;
    region?: CatalogItemDto | null;
    primaryLane?: PlayerLaneDto | null;
    secondaryLanes?: PlayerLaneDto[];
    solo?: PlayerRankDto | null;
    flex?: PlayerRankDto | null;
    champions?: PlayerChampionDto[];
}
