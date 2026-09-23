import { HomeFeedDto, PlayerSummaryDto } from "@features/home/dto/home-feed.dto";
import { LfgMessage } from "@features/lfg/models/lfg-message.model";
import { TeamSummary } from "@features/teams/models/team.model";

export class PlayerSummary {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public gameName: string | null,
        public tagLine: string | null,
        public regionCode: string | null,
        public primaryLaneCode: string | null,
        public creationDate: Date,
    ) {}

    public static fromDto(dto: PlayerSummaryDto): PlayerSummary {
        return new PlayerSummary(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl ?? null,
            dto.gameName ?? null,
            dto.tagLine ?? null,
            dto.regionCode ?? null,
            dto.primaryLaneCode ?? null,
            new Date(dto.creationDate),
        );
    }

    public handleLabel(): string {
        return `${this.nickname}#${this.discriminator}`;
    }

    public riotId(): string | null {
        return this.gameName && this.tagLine ? `${this.gameName}#${this.tagLine}` : null;
    }

    public initials(): string {
        return this.nickname.charAt(0) || "?";
    }
}

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
