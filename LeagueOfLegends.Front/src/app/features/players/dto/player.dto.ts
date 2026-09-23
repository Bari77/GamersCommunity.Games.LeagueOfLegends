export interface PlayerSheetDto {
    publicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    presentationIrl?: string | null;
    presentationIg?: string | null;
    creationDate: string;
    layoutJson?: string | null;
}

export interface PlayerResolveResultDto {
    playerPublicId?: string | null;
    hasSheet: boolean;
}

export interface PlayerLoadRequestDto {
    platformUserId: number;
    platformUserPublicId: string;
}

export interface PlayerUpdateRequestDto {
    presentationIrl?: string | null;
    presentationIg?: string | null;
    layoutJson?: string | null;
}
