/**
 * Seeded PRNG (FNV-1a seed + mulberry32): the same seed always yields the same sequence, so the
 * generated cast stays stable across reloads and deep links keep resolving.
 */
export function mockRandom(seed: string): () => number {
    let state = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        state ^= seed.charCodeAt(i);
        state = Math.imul(state, 16777619);
    }
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export const pickOne = <T>(random: () => number, items: readonly T[]): T => items[Math.floor(random() * items.length)];

export const randomInt = (random: () => number, min: number, max: number): number =>
    min + Math.floor(random() * (max - min + 1));

export function pickWeighted<T>(random: () => number, entries: readonly (readonly [T, number])[]): T {
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = random() * total;
    for (const [value, weight] of entries) {
        roll -= weight;
        if (roll < 0) {
            return value;
        }
    }
    return entries[entries.length - 1][0];
}

/** Fisher–Yates on a copy. */
export function shuffled<T>(random: () => number, items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
