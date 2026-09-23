import { PlayerTeamDto, TeamMemberDto, TeamSheetDto, TeamSummaryDto } from "@features/teams/dto/team.dto";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const TEAM_RANK_CAPTAIN = "captain";
export const TEAM_RANK_PLAYER = "player";
export const TEAM_RANK_COACH = "coach";
export const TEAM_RANK_MANAGER = "manager";

export const ROSTER_KIND_MAIN = "main";
export const ROSTER_KIND_SUB = "sub";

const RANK_WEIGHTS: Record<string, number> = {
    [TEAM_RANK_CAPTAIN]: 4,
    [TEAM_RANK_MANAGER]: 3,
    [TEAM_RANK_COACH]: 2,
    [TEAM_RANK_PLAYER]: 1,
};

export function teamRankWeight(rank: string | null | undefined): number {
    return rank ? (RANK_WEIGHTS[rank] ?? 0) : 0;
}

export function isPlayerSlotRank(rank: string | null | undefined): boolean {
    return rank === TEAM_RANK_CAPTAIN || rank === TEAM_RANK_PLAYER;
}

export class TeamMember {
    public constructor(
        public playerPublicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public rank: string,
        public gameName: string | null,
        public tagLine: string | null,
        public idLane: number | null,
        public laneCode: string | null,
        public rosterKind: string | null,
        public joinedAt: Date,
    ) {}

    public static fromDto(dto: TeamMemberDto): TeamMember {
        return new TeamMember(
            dto.playerPublicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.rank,
            dto.gameName ?? null,
            dto.tagLine ?? null,
            dto.idLane ?? null,
            dto.laneCode ?? dto.primaryLaneCode ?? null,
            dto.rosterKind ?? null,
            new Date(dto.joinedAt),
        );
    }

    public handleLabel(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public riotId(): string | null {
        return this.gameName && this.tagLine ? `${this.gameName}#${this.tagLine}` : null;
    }

    public isContactable(): boolean {
        return !!this.platformUserPublicId && this.platformUserPublicId !== EMPTY_GUID;
    }

    public isCaptain(): boolean {
        return this.rank === TEAM_RANK_CAPTAIN;
    }

    public displayName(): string {
        return this.riotId() ?? this.handleLabel();
    }

    public isPlayerSeat(): boolean {
        return isPlayerSlotRank(this.rank);
    }

    public isMain(): boolean {
        return this.rosterKind === ROSTER_KIND_MAIN;
    }

    public isSub(): boolean {
        return this.rosterKind === ROSTER_KIND_SUB;
    }
}

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

export class TeamSummary {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public tag: string | null,
        public sentence: string | null,
        public regionCode: string | null,
        public creationDate: Date,
        public memberCount: number,
        public playerSlotCount: number,
    ) {}

    public static fromDto(dto: TeamSummaryDto): TeamSummary {
        return new TeamSummary(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.tag ?? null,
            dto.sentence ?? null,
            dto.regionCode ?? null,
            new Date(dto.creationDate),
            dto.memberCount,
            dto.playerSlotCount,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}

export class PlayerTeam {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public tag: string | null,
        public regionCode: string | null,
        public rank: string,
        public laneCode: string | null,
        public rosterKind: string | null,
        public memberCount: number,
        public playerSlotCount: number,
    ) {}

    public static fromDto(dto: PlayerTeamDto): PlayerTeam {
        return new PlayerTeam(
            dto.publicId,
            dto.entitled,
            dto.discriminator,
            dto.tag ?? null,
            dto.regionCode ?? null,
            dto.rank,
            dto.laneCode ?? null,
            dto.rosterKind ?? null,
            dto.memberCount,
            dto.playerSlotCount,
        );
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
