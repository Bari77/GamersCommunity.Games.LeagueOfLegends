export interface TeamWallRequestDto {
    teamPublicId: string;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}
