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

export interface TeamApplicationCreateRequestDto {
    teamPublicId: string;
    message: string;
    soughtRank: string;
    idLane?: number | null;
}

export interface TeamApplicationListRequestDto {
    teamPublicId: string;
    status?: string;
}

export interface TeamApplicationReviewRequestDto {
    publicId: string;
    accept: boolean;
}

export interface TeamApplicationTargetRequestDto {
    publicId: string;
}
