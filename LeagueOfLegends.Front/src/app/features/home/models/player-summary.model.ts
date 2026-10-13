import { PlayerSummaryDto } from "@features/home/dto/player-summary.dto";
import { PlayerRank } from "@features/players/models/player-rank.model";

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
        public solo: PlayerRank | null,
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
            PlayerRank.fromDto(dto.solo),
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
