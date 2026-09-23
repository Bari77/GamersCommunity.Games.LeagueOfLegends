export interface LfgMessageDto {
    publicId: string;
    kind: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt: string;
    playerPublicId: string;
    platformUserPublicId: string;
    senderAvatarUrl?: string;
    regionCode?: string | null;
    laneCode?: string | null;
}

export interface ListLfgBeforeRequestDto {
    kind: string;
    beforeCreationDate: string;
    beforePublicId: string;
    take?: number;
}

export interface CreateLfgMessageRequestDto {
    body: string;
}
