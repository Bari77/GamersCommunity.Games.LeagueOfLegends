export interface GamePostDto {
    publicId: string;
    teamPublicId: string;
    body: string;
    status: string;
    creationDate: string;
    authorPlayerPublicId: string;
    authorPlatformUserPublicId: string;
    authorNickname: string;
    authorDiscriminator: string;
    authorAvatarUrl: string;
    moderationReason?: string | null;
    moderatedAt?: string | null;
}

export interface GamePostPageDto {
    items?: GamePostDto[];
    hasMore?: boolean;
}

export interface TeamWallRequestDto {
    teamPublicId: string;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface GamePostCreateRequestDto {
    teamPublicId: string;
    body: string;
}

export interface GamePostUpdateRequestDto {
    publicId: string;
    body: string;
}

export interface GamePostModerateRequestDto {
    publicId: string;
    approve: boolean;
    reason?: string | null;
}

export interface GamePostTargetRequestDto {
    publicId: string;
}
