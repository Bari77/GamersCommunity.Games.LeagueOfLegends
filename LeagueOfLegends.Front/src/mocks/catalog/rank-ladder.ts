import { PlayerRankDto } from "@features/players/dto/player-rank.dto";
import { pickWeighted, randomInt } from "./random";

const DIVIDED_TIERS = ["iron", "bronze", "silver", "gold", "platinum", "emerald", "diamond"] as const;

const APEX_SCORES: Record<string, number> = { master: 28, grandmaster: 30, challenger: 32 };

export const MAX_SKILL_SCORE = 32;

/**
 * Rough share of the ranked ladder per tier: the bulk sits in Gold → Emerald, the ends (Iron,
 * apex tiers) stay thin like on the live servers.
 */
const TIER_WEIGHTS: readonly (readonly [string, number])[] = [
    ["iron", 3],
    ["bronze", 8],
    ["silver", 13],
    ["gold", 17],
    ["platinum", 21],
    ["emerald", 19],
    ["diamond", 12],
    ["master", 4],
    ["grandmaster", 2],
    ["challenger", 1],
];

/** One point per division from Iron IV (0) to Diamond I (27); apex tiers sit above. */
export function skillScore(solo: PlayerRankDto | null | undefined): number {
    if (!solo) {
        return 0;
    }
    const apex = APEX_SCORES[solo.tier ?? ""];
    if (apex !== undefined) {
        return apex;
    }
    const tier = DIVIDED_TIERS.indexOf(solo.tier as (typeof DIVIDED_TIERS)[number]);
    return Math.max(tier, 0) * 4 + (4 - Number(solo.division ?? 4));
}

export function soloFromScore(score: number, random: () => number): PlayerRankDto {
    const clamped = Math.min(Math.max(Math.round(score), 0), MAX_SKILL_SCORE);
    if (clamped >= 32) {
        return { tier: "challenger", division: null, lp: randomInt(random, 820, 1650) };
    }
    if (clamped >= 30) {
        return { tier: "grandmaster", division: null, lp: randomInt(random, 330, 790) };
    }
    if (clamped >= 28) {
        return { tier: "master", division: null, lp: randomInt(random, 0, 320) };
    }
    return {
        tier: DIVIDED_TIERS[Math.floor(clamped / 4)],
        division: String(4 - (clamped % 4)),
        lp: randomInt(random, 0, 99),
    };
}

export function sampleSkillScore(random: () => number): number {
    const tier = pickWeighted(random, TIER_WEIGHTS);
    const apex = APEX_SCORES[tier];
    return apex ?? DIVIDED_TIERS.indexOf(tier as (typeof DIVIDED_TIERS)[number]) * 4 + randomInt(random, 0, 3);
}
