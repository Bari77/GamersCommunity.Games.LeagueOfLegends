import { PlayerRankDto } from "@features/players/dto/player-rank.dto";

export class PlayerRank {
    public constructor(
        public tier: string | null,
        public division: string | null,
        public lp: number | null,
    ) {}

    public static fromDto(dto: PlayerRankDto | null | undefined): PlayerRank | null {
        if (!dto?.tier) {
            return null;
        }

        return new PlayerRank(dto.tier, dto.division ?? null, dto.lp ?? null);
    }
}
