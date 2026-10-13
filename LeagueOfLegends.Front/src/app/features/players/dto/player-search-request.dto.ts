export interface PlayerSearchRequestDto {
    query?: string;
    idRegion?: number;
    idLane?: number;
    minSoloTier?: string;
    lookingForTeam?: boolean;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
