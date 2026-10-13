import { PlayerSummaryDto } from "@features/home/dto/player-summary.dto";

export interface PlayerSearchResultDto {
    items: PlayerSummaryDto[];
    hasMore: boolean;
}
