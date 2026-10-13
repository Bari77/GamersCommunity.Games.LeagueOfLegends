export interface TeamApplicationDto {
    publicId: string;
    message: string;
    status: string;
    soughtRank: string;
    laneCode?: string | null;
    creationDate: string;
    reviewedAt?: string | null;
    teamPublicId: string;
    teamName: string;
    teamDiscriminator: string;
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
}
