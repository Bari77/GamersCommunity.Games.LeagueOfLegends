import { HomeFeedDto } from "@features/home/dto/home-feed.dto";
import { LfgMessage } from "@features/lfg/models/lfg-message.model";
import { TeamSummary } from "@features/teams/models/team-summary.model";
import { PlayerSummary } from "./player-summary.model";

export class HomeFeed {
    public constructor(
        public latestLfg: LfgMessage[],
        public latestPlayers: PlayerSummary[],
        public latestTeams: TeamSummary[],
    ) {}

    public static fromDto(dto: HomeFeedDto): HomeFeed {
        return new HomeFeed(
            (dto.latestLfg ?? []).map((item) => LfgMessage.fromDto(item)),
            (dto.latestPlayers ?? []).map((item) => PlayerSummary.fromDto(item)),
            (dto.latestTeams ?? []).map((item) => TeamSummary.fromDto(item)),
        );
    }
}
