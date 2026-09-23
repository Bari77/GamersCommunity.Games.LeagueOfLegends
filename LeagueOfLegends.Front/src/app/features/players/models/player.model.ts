import {
    CatalogItemDto,
    PlayerChampionDto,
    PlayerLaneDto,
    PlayerOptionsDto,
    PlayerRankDto,
    PlayerResolveResultDto,
    PlayerSheetDto,
} from "@features/players/dto/player.dto";

export class CatalogItem {
    public constructor(
        public id: number,
        public code: string,
    ) {}

    public static fromDto(dto: CatalogItemDto): CatalogItem {
        return new CatalogItem(dto.id, dto.code);
    }
}

export class PlayerLane {
    public constructor(
        public id: number,
        public code: string,
    ) {}

    public static fromDto(dto: PlayerLaneDto): PlayerLane {
        return new PlayerLane(dto.id, dto.code);
    }
}

export class PlayerChampion {
    public constructor(
        public id: number,
        public code: string,
        public kind: string,
        public lane: string | null,
    ) {}

    public static fromDto(dto: PlayerChampionDto): PlayerChampion {
        return new PlayerChampion(dto.id, dto.code, dto.kind, dto.lane ?? null);
    }
}

export class PlayerRank {
    public constructor(
        public tier: string | null,
        public division: string | null,
        public lp: number | null,
    ) {}

    public static fromDto(dto: PlayerRankDto | null | undefined): PlayerRank | null {
        if (!dto?.tier) {
            return null;
        }

        return new PlayerRank(dto.tier, dto.division ?? null, dto.lp ?? null);
    }
}

export class PlayerSheet {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public presentationIg: string | null,
        public creationDate: Date,
        public layoutJson: string | null,
        public gameName: string | null,
        public tagLine: string | null,
        public region: CatalogItem | null,
        public primaryLane: PlayerLane | null,
        public secondaryLanes: PlayerLane[],
        public solo: PlayerRank | null,
        public flex: PlayerRank | null,
        public champions: PlayerChampion[],
    ) {}

    public get handle(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public get riotId(): string | null {
        return this.gameName && this.tagLine ? `${this.gameName}#${this.tagLine}` : null;
    }

    public static fromDto(dto: PlayerSheetDto): PlayerSheet {
        const primaryLane = dto.primaryLane ? PlayerLane.fromDto(dto.primaryLane) : null;
        const secondaryLanes = (dto.secondaryLanes ?? []).map((lane) => PlayerLane.fromDto(lane));

        return new PlayerSheet(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl ?? null,
            dto.presentationIg ?? null,
            new Date(dto.creationDate),
            dto.layoutJson ?? null,
            dto.gameName ?? null,
            dto.tagLine ?? null,
            dto.region ? CatalogItem.fromDto(dto.region) : null,
            primaryLane,
            secondaryLanes,
            PlayerRank.fromDto(dto.solo),
            PlayerRank.fromDto(dto.flex),
            sortChampionsByLanePriority(
                (dto.champions ?? []).map((champion) => PlayerChampion.fromDto(champion)),
                primaryLane?.code,
                secondaryLanes.map((lane) => lane.code),
            ),
        );
    }
}

const CHAMPION_KIND_RANK: Record<string, number> = {
    main: 0,
    pool: 1,
    learning: 2,
    training: 2,
};

export function sortChampionsByLanePriority(
    champions: PlayerChampion[],
    primaryLane: string | null | undefined,
    secondaryLanes: readonly string[],
): PlayerChampion[] {
    const rank = new Map<string, number>();
    let next = 0;
    if (primaryLane) {
        rank.set(primaryLane, next++);
    }
    for (const code of secondaryLanes) {
        if (code && !rank.has(code)) {
            rank.set(code, next++);
        }
    }

    const laneRank = (lane: string | null): number =>
        lane != null && rank.has(lane) ? rank.get(lane)! : Number.MAX_SAFE_INTEGER;

    return [...champions].sort((left, right) => {
        const lanes = laneRank(left.lane) - laneRank(right.lane);
        if (lanes !== 0) {
            return lanes;
        }

        const kinds = (CHAMPION_KIND_RANK[left.kind] ?? 3) - (CHAMPION_KIND_RANK[right.kind] ?? 3);
        if (kinds !== 0) {
            return kinds;
        }

        return left.code.localeCompare(right.code);
    });
}

export class PlayerResolveResult {
    public constructor(
        public playerPublicId: string | null,
        public hasSheet: boolean,
    ) {}

    public static fromDto(dto: PlayerResolveResultDto): PlayerResolveResult {
        return new PlayerResolveResult(dto.playerPublicId ?? null, dto.hasSheet);
    }
}

export class PlayerOptions {
    public constructor(
        public lanes: CatalogItem[],
        public regions: CatalogItem[],
        public champions: CatalogItem[],
        public championKinds: CatalogItem[],
        public tiers: CatalogItem[],
        public divisions: CatalogItem[],
    ) {}

    public static fromDto(dto: PlayerOptionsDto): PlayerOptions {
        return new PlayerOptions(
            dto.lanes.map(CatalogItem.fromDto),
            dto.regions.map(CatalogItem.fromDto),
            dto.champions.map(CatalogItem.fromDto),
            dto.championKinds.map(CatalogItem.fromDto),
            dto.tiers.map(CatalogItem.fromDto),
            dto.divisions.map(CatalogItem.fromDto),
        );
    }
}
