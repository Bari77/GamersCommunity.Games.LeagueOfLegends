import { PlayerSummary } from "@features/home/models/player-summary.model";
import { PlayerSearchResultDto } from "@features/players/dto/player-search-result.dto";

export class PlayerSearchPage {
    public constructor(
        public items: PlayerSummary[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: PlayerSearchResultDto): PlayerSearchPage {
        return new PlayerSearchPage(
            (dto.items ?? []).map((item) => PlayerSummary.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
