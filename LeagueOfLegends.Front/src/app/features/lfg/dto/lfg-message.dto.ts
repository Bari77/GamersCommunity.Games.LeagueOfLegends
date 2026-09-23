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
    teamPublicId?: string | null;
    teamName?: string | null;
    teamDiscriminator?: string | null;
    teamTag?: string | null;
}

export interface ListLfgBeforeRequestDto {
    kind: string;
    beforeCreationDate: string;
    beforePublicId: string;
    take?: number;
}

export interface SearchLfgRequestDto {
    kind?: string;
    query?: string;
    idRegion?: number;
    idLane?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface LfgAdPageDto {
    items: LfgMessageDto[];
    hasMore: boolean;
}

export interface CreateLfgMessageRequestDto {
    body: string;
    teamPublicId?: string;
    idLane?: number;
}

export interface PostableTeamDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    rank: string;
}
