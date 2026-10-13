import { TeamSummaryDto } from "@features/teams/dto/team-summary.dto";

export class TeamSummary {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public tag: string | null,
        public sentence: string | null,
        public regionCode: string | null,
        public creationDate: Date,
        public memberCount: number,
        public playerSlotCount: number,
    ) {}

    public static fromDto(dto: TeamSummaryDto): TeamSummary {
        return new TeamSummary(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.tag ?? null,
            dto.sentence ?? null,
            dto.regionCode ?? null,
            new Date(dto.creationDate),
            dto.memberCount,
            dto.playerSlotCount,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
