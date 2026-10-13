export interface PlayerSearchRequestDto {
    query?: string;
    idRegion?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
