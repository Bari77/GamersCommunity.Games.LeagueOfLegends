import { TeamApplicationDto } from "@features/teams/dto/team-application.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const APPLICATION_PENDING = "pending";

export class TeamApplication {
    public constructor(
        public publicId: string,
        public message: string,
        public status: string,
        public soughtRank: string,
        public laneCode: string | null,
        public creationDate: Date,
        public reviewedAt: Date | null,
        public teamPublicId: string,
        public teamName: string,
        public teamDiscriminator: string,
        public playerPublicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
    ) {}

    public static fromDto(dto: TeamApplicationDto): TeamApplication {
        return new TeamApplication(
            dto.publicId,
            dto.message,
            dto.status,
            dto.soughtRank,
            dto.laneCode ?? null,
            new Date(dto.creationDate),
            dto.reviewedAt ? new Date(dto.reviewedAt) : null,
            dto.teamPublicId,
            dto.teamName,
            dto.teamDiscriminator,
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
        );
    }

    public teamHandleLabel(): string {
        return `${this.teamName}#${this.teamDiscriminator}`;
    }

    public playerHandleLabel(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public isPending(): boolean {
        return this.status === APPLICATION_PENDING;
    }

    public hasPlayerSheet(): boolean {
        return !!this.playerPublicId && this.playerPublicId !== EMPTY_GUID;
    }

    public initials(): string {
        return this.nickname.charAt(0) || "?";
    }
}
