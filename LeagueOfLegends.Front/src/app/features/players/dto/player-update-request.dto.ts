import { PlayerChampionUpdateDto } from "./player-champion-update.dto";
import { PlayerRankUpdateDto } from "./player-rank-update.dto";

export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
    layoutJson?: string | null;
    gameName?: string | null;
    tagLine?: string | null;
    idRegion?: number | null;
    idPrimaryLane?: number | null;
    secondaryLaneIds?: number[];
    solo?: PlayerRankUpdateDto | null;
    flex?: PlayerRankUpdateDto | null;
    champions?: PlayerChampionUpdateDto[];
}
