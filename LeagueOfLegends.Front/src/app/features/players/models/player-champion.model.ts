import { PlayerChampionDto } from "@features/players/dto/player-champion.dto";

export class PlayerChampion {
    public constructor(
        public id: number,
        public code: string,
        public kind: string,
        public lane: string | null,
    ) {}

    public static fromDto(dto: PlayerChampionDto): PlayerChampion {
        return new PlayerChampion(dto.id, dto.code, dto.kind, dto.lane ?? null);
    }
}
