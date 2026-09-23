import { GamePostDto, GamePostPageDto } from "@features/teams/dto/game-post.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const POST_PENDING = "pending";

export class GamePost {
    public constructor(
        public publicId: string,
        public teamPublicId: string,
        public body: string,
        public status: string,
        public creationDate: Date,
        public authorPlayerPublicId: string,
        public authorPlatformUserPublicId: string,
        public authorNickname: string,
        public authorDiscriminator: string,
        public authorAvatarUrl: string,
        public moderationReason: string | null,
        public moderatedAt: Date | null,
    ) {}

    public static fromDto(dto: GamePostDto): GamePost {
        return new GamePost(
            dto.publicId,
            dto.teamPublicId,
            dto.body,
            dto.status,
            new Date(dto.creationDate),
            dto.authorPlayerPublicId,
            dto.authorPlatformUserPublicId,
            dto.authorNickname,
            dto.authorDiscriminator,
            dto.authorAvatarUrl ?? "",
            dto.moderationReason ?? null,
            dto.moderatedAt ? new Date(dto.moderatedAt) : null,
        );
    }

    public authorHandleLabel(): string {
        return this.authorDiscriminator
            ? `${this.authorNickname}#${this.authorDiscriminator}`
            : this.authorNickname;
    }

    public isContactable(): boolean {
        return !!this.authorPlatformUserPublicId && this.authorPlatformUserPublicId !== EMPTY_GUID;
    }

    public isPending(): boolean {
        return this.status === POST_PENDING;
    }

    public isMine(playerPublicId: string | null | undefined): boolean {
        return !!playerPublicId && this.authorPlayerPublicId === playerPublicId;
    }
}

export class GamePostPage {
    public constructor(
        public items: GamePost[],
        public hasMore: boolean,
    ) {}

    public static fromDto(dto: GamePostPageDto): GamePostPage {
        return new GamePostPage((dto.items ?? []).map((item) => GamePost.fromDto(item)), dto.hasMore ?? false);
    }
}
