import { LfgMessageDto, PostableTeamDto } from "@features/lfg/dto/lfg-message.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export type LfgKind = "player" | "team";

export const LFG_KIND_PLAYER: LfgKind = "player";
export const LFG_KIND_TEAM: LfgKind = "team";

export class LfgMessage {
    public constructor(
        public publicId: string,
        public kind: string,
        public body: string,
        public senderNickname: string,
        public senderDiscriminator: string,
        public creationDate: Date,
        public expiresAt: Date,
        public playerPublicId: string,
        public platformUserPublicId: string,
        public senderAvatarUrl: string,
        public regionCode: string | null,
        public laneCode: string | null,
        public teamPublicId: string | null,
        public teamName: string | null,
        public teamDiscriminator: string | null,
        public teamTag: string | null,
    ) {}

    public static fromDto(dto: LfgMessageDto): LfgMessage {
        return new LfgMessage(
            dto.publicId,
            dto.kind,
            dto.body,
            dto.senderNickname,
            dto.senderDiscriminator,
            new Date(dto.creationDate),
            new Date(dto.expiresAt),
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.senderAvatarUrl ?? "",
            dto.regionCode ?? null,
            dto.laneCode ?? null,
            dto.teamPublicId ?? null,
            dto.teamName ?? null,
            dto.teamDiscriminator ?? null,
            dto.teamTag ?? null,
        );
    }

    public isTeamAd(): boolean {
        return this.kind === LFG_KIND_TEAM && !!this.teamPublicId;
    }

    /**
     * Team ads are displayed under the team handle; the author stays reachable through
     * {@link playerPublicId} for moderation.
     */
    public handleLabel(): string {
        return this.isTeamAd()
            ? `${this.teamName}#${this.teamDiscriminator}`
            : `${this.senderNickname}#${this.senderDiscriminator}`;
    }

    public initial(): string {
        if (this.isTeamAd() && this.teamTag) {
            return this.teamTag.charAt(0);
        }
        return this.handleLabel().charAt(0);
    }

    public hasPlatformProfile(): boolean {
        return !!this.platformUserPublicId && this.platformUserPublicId !== EMPTY_GUID;
    }

    public isMine(sessionPublicId: string | null | undefined, playerPublicId?: string | null): boolean {
        if (playerPublicId && this.playerPublicId === playerPublicId) {
            return true;
        }
        return !!sessionPublicId && this.hasPlatformProfile() && this.platformUserPublicId === sessionPublicId;
    }
}

export class PostableTeam {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
    ) {}

    public static fromDto(dto: PostableTeamDto): PostableTeam {
        return new PostableTeam(dto.publicId, dto.entitled, dto.discriminator, dto.rank);
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}

export interface LfgAdPage {
    items: LfgMessage[];
    hasMore: boolean;
}
