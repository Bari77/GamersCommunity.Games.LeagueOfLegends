import { PlayerTeamDto } from "@features/teams/dto/player-team.dto";

export class PlayerTeam {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public tag: string | null,
        public regionCode: string | null,
        public rank: string,
        public laneCode: string | null,
        public rosterKind: string | null,
        public memberCount: number,
        public playerSlotCount: number,
    ) {}

    public static fromDto(dto: PlayerTeamDto): PlayerTeam {
        return new PlayerTeam(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.tag ?? null,
            dto.regionCode ?? null,
            dto.rank,
            dto.laneCode ?? null,
            dto.rosterKind ?? null,
            dto.memberCount,
            dto.playerSlotCount,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
