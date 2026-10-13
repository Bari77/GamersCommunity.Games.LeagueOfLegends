export interface TeamSearchRequestDto {
    query?: string;
    idRegion?: number;
    minMembers?: number;
    idMissingLane?: number;
    openRoster?: boolean;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
