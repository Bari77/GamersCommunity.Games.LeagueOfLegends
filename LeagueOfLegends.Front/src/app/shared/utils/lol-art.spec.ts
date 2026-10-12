import { normalizeTier, rankSolidColor } from "./lol-art";

describe("lol-art", () => {
    it("normalizes known tiers and falls back to unranked", () => {
        expect(normalizeTier("Gold")).toBe("gold");
        expect(normalizeTier("mythic")).toBe("unranked");
        expect(normalizeTier(null)).toBe("unranked");
    });

    it("returns solid colors only for known tiers", () => {
        expect(rankSolidColor("diamond")).toBe("#5aa8ff");
        expect(rankSolidColor("unranked")).toBeNull();
    });
});
