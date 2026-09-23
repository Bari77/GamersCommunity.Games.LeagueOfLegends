import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const LFG_KIND_PLAYER = "player";

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
        );
    }

    public handleLabel(): string {
        return `${this.senderNickname}#${this.senderDiscriminator}`;
    }

    public initial(): string {
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
