import { PlayerLaneDto } from "@features/players/dto/player-lane.dto";

export class PlayerLane {
    public constructor(
        public id: number,
        public code: string,
    ) {}

    public static fromDto(dto: PlayerLaneDto): PlayerLane {
        return new PlayerLane(dto.id, dto.code);
    }
}
