import { PlayerOptionsDto } from "@features/players/dto/player-options.dto";
import { CatalogItem } from "./player.model";

export class PlayerOptions {
    public constructor(
        public lanes: CatalogItem[],
        public regions: CatalogItem[],
        public champions: CatalogItem[],
        public championKinds: CatalogItem[],
        public tiers: CatalogItem[],
        public divisions: CatalogItem[],
    ) {}

    public static fromDto(dto: PlayerOptionsDto): PlayerOptions {
        return new PlayerOptions(
            dto.lanes.map(CatalogItem.fromDto),
            dto.regions.map(CatalogItem.fromDto),
            dto.champions.map(CatalogItem.fromDto),
            dto.championKinds.map(CatalogItem.fromDto),
            dto.tiers.map(CatalogItem.fromDto),
            dto.divisions.map(CatalogItem.fromDto),
        );
    }
}
