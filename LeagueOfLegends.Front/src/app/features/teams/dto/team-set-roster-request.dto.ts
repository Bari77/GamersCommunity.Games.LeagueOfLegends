export interface TeamSetRosterRequestDto {
    teamPublicId: string;
    playerPublicId: string;
    idLane: number;
    rosterKind: string;
}
