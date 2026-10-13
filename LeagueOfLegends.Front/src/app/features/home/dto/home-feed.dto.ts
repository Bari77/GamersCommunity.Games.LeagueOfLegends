import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { TeamSummaryDto } from "@features/teams/dto/team-summary.dto";
import { PlayerSummaryDto } from "./player-summary.dto";

export interface HomeFeedDto {
    latestLfg: LfgMessageDto[];
    latestPlayers: PlayerSummaryDto[];
    latestTeams: TeamSummaryDto[];
}
