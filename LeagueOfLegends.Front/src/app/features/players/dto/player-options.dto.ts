import { CatalogItemDto } from "./player.dto";

export interface PlayerOptionsDto {
    lanes: CatalogItemDto[];
    regions: CatalogItemDto[];
    champions: CatalogItemDto[];
    championKinds: CatalogItemDto[];
    tiers: CatalogItemDto[];
    divisions: CatalogItemDto[];
}
