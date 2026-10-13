import { TeamSummaryDto } from "./team-summary.dto";

export interface TeamSearchResultDto {
    items?: TeamSummaryDto[];
    hasMore?: boolean;
}
