import { CatalogItemDto } from "@features/players/dto/player.dto";
import { PlayerChampion } from "./player-champion.model";

export class CatalogItem {
    public constructor(
        public id: number,
        public code: string,
    ) {}

    public static fromDto(dto: CatalogItemDto): CatalogItem {
        return new CatalogItem(dto.id, dto.code);
    }
}

const CHAMPION_KIND_RANK: Record<string, number> = {
    main: 0,
    pool: 1,
    learning: 2,
    training: 2,
};

export function pickRosterChampions<T extends { code: string; kind: string; lane?: string | null }>(
    champions: readonly T[],
    laneCode: string | null | undefined,
    limit = 5,
): T[] {
    if (!laneCode) {
        return [];
    }

    return [...champions]
        .filter((champion) => champion.lane === laneCode)
        .sort((left, right) => {
            const kinds = (CHAMPION_KIND_RANK[left.kind] ?? 3) - (CHAMPION_KIND_RANK[right.kind] ?? 3);
            return kinds !== 0 ? kinds : left.code.localeCompare(right.code);
        })
        .slice(0, limit);
}

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
