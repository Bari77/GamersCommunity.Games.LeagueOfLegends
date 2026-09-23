export interface CatalogItemDto {
    id: number;
    code: string;
}

export interface PlayerLaneDto {
    id: number;
    code: string;
}

export interface PlayerChampionDto {
    id: number;
    code: string;
    kind: string;
}

export interface PlayerRankDto {
    tier?: string | null;
    division?: string | null;
    lp?: number | null;
}

export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    presentationIg?: string | null;
    creationDate: string;
    layoutJson?: string | null;
    gameName?: string | null;
    tagLine?: string | null;
    region?: CatalogItemDto | null;
    primaryLane?: PlayerLaneDto | null;
    secondaryLanes?: PlayerLaneDto[];
    solo?: PlayerRankDto | null;
    flex?: PlayerRankDto | null;
    champions?: PlayerChampionDto[];
}

export interface PlayerResolveResultDto {
    playerPublicId?: string | null;
    hasSheet: boolean;
}

export interface PlayerLoadRequestDto {
    platformUserId: number;
    platformUserPublicId: string;
}

export interface PlayerChampionUpdateDto {
    idChampion: number;
    kind: string;
}

export interface PlayerRankUpdateDto {
    tier?: string | null;
    division?: string | null;
    lp?: number | null;
}

export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
    layoutJson?: string | null;
    gameName?: string | null;
    tagLine?: string | null;
    idRegion?: number | null;
    idPrimaryLane?: number | null;
    secondaryLaneIds?: number[];
    solo?: PlayerRankUpdateDto | null;
    flex?: PlayerRankUpdateDto | null;
    champions?: PlayerChampionUpdateDto[];
}

export interface PlayerOptionsDto {
    lanes: CatalogItemDto[];
    regions: CatalogItemDto[];
    champions: CatalogItemDto[];
    championKinds: CatalogItemDto[];
    tiers: CatalogItemDto[];
    divisions: CatalogItemDto[];
}
