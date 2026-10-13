import { TeamSearchResultDto } from "@features/teams/dto/team-search-result.dto";
import { TeamSummary } from "./team-summary.model";

export class TeamSearchPage {
    public constructor(
        public items: TeamSummary[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: TeamSearchResultDto): TeamSearchPage {
        return new TeamSearchPage(
            (dto.items ?? []).map((item) => TeamSummary.fromDto(item)),
            dto.hasMore ?? false,
        );
    }
}
