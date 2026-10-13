import { PlayerResolveResultDto } from "@features/players/dto/player-resolve-result.dto";

export class PlayerResolveResult {
    public constructor(
        public playerPublicId: string | null,
        public hasSheet: boolean,
    ) {}

    public static fromDto(dto: PlayerResolveResultDto): PlayerResolveResult {
        return new PlayerResolveResult(dto.playerPublicId ?? null, dto.hasSheet);
    }
}
