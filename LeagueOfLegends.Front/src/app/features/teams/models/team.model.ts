import { PlayerRank } from "@features/players/models/player-rank.model";
import { PlayerChampion } from "@features/players/models/player-champion.model";
import { TeamMemberDto } from "@features/teams/dto/team-member.dto";
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
        public champions: PlayerChampion[],
        public solo: PlayerRank | null,
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
            (dto.champions ?? []).map((champion) => PlayerChampion.fromDto(champion)),
            PlayerRank.fromDto(dto.solo),
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
