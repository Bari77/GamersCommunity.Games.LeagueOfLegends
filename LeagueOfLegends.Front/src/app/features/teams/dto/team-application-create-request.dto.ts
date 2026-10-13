export interface TeamApplicationCreateRequestDto {
    teamPublicId: string;
    message: string;
    soughtRank: string;
    idLane?: number | null;
}
