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
