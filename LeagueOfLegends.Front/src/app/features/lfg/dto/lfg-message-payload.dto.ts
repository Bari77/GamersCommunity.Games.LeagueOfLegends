export interface LfgMessagePayloadDto {
    publicId: string;
    kind?: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt?: string;
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
