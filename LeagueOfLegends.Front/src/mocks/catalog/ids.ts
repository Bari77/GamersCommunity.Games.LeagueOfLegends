/**
 * Deterministic UUID v4 lookalike from a seed.
 * Stable across reloads (deep links / MSW) but reads as a real random GUID.
 */
export function mockUuid(seed: string): string {
    const bytes = new Uint8Array(16);
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    for (let i = 0; i < 16; i++) {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        bytes[i] = h & 0xff;
        h = Math.imul(h, 2246822519) + (i + 1) * 2654435761;
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
