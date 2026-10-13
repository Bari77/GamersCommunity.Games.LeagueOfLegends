export interface TeamSearchRequestDto {
    query?: string;
    idRegion?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
