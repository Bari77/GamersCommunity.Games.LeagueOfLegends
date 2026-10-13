import { TeamSheetDto } from "@features/teams/dto/team-sheet.dto";
import { TEAM_RANK_CAPTAIN, TEAM_RANK_COACH, TEAM_RANK_MANAGER, TeamMember, teamRankWeight } from "./team.model";

export class TeamSheet {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public tag: string | null,
        public sentence: string | null,
        public layoutJson: string | null,
        public regionCode: string | null,
        public creationDate: Date,
        public memberCount: number,
        public playerSlotCount: number,
        public members: TeamMember[],
        public viewerRank: string | null,
        public viewerApplicationStatus: string | null,
        public viewerApplicationPublicId: string | null,
        public pendingApplicationCount: number,
    ) {}

    public static fromDto(dto: TeamSheetDto): TeamSheet {
        return new TeamSheet(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.tag ?? null,
            dto.sentence ?? null,
            dto.layoutJson ?? null,
            dto.regionCode ?? null,
            new Date(dto.creationDate),
            dto.memberCount ?? (dto.members ?? []).length,
            dto.playerSlotCount ?? 0,
            (dto.members ?? []).map((member) => TeamMember.fromDto(member)),
            dto.viewerRank ?? null,
            dto.viewerApplicationStatus ?? null,
            dto.viewerApplicationPublicId ?? null,
            dto.pendingApplicationCount ?? 0,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }

    public isMember(): boolean {
        return teamRankWeight(this.viewerRank) > 0;
    }

    public canModerate(): boolean {
        return teamRankWeight(this.viewerRank) >= teamRankWeight(TEAM_RANK_COACH);
    }

    public canEditSheet(): boolean {
        return this.viewerRank === TEAM_RANK_CAPTAIN || this.viewerRank === TEAM_RANK_MANAGER;
    }

    public isCaptain(): boolean {
        return this.viewerRank === TEAM_RANK_CAPTAIN;
    }

    public mainCount(): number {
        return this.members.filter((member) => member.isMain()).length;
    }
}
