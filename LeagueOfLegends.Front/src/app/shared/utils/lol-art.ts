const CDRAGON = "https://raw.communitydragon.org/latest/plugins";

const RANK_ASSETS = `${CDRAGON}/rcp-fe-lol-static-assets/global/default/images`;
const LANE_ASSETS = `${CDRAGON}/rcp-fe-lol-static-assets/global/default/svg`;

const KNOWN_TIERS = new Set([
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "emerald",
    "diamond",
    "master",
    "grandmaster",
    "challenger",
]);

/** Solid accent hex per solo/duo tier (roster badges, home rails, etc.). */
const RANK_SOLID: Record<string, string> = {
    iron: "#9a9a9a",
    bronze: "#b88a5a",
    silver: "#b0c0cc",
    gold: "#d4af37",
    platinum: "#5ec8c8",
    emerald: "#3dbf7a",
    diamond: "#5aa8ff",
    master: "#9b59d0",
    grandmaster: "#c0392b",
    challenger: "#f1c40f",
};

const LANE_FILES: Record<string, string> = {
    top: "position-top",
    jungle: "position-jungle",
    mid: "position-middle",
    middle: "position-middle",
    bottom: "position-bottom",
    adc: "position-bottom",
    support: "position-utility",
    utility: "position-utility",
};

export function championSplashUrl(code: string): string {
    return `https://cdn.communitydragon.org/latest/champion/${encodeURIComponent(code)}/splash-art`;
}

export function championSquareUrl(code: string): string {
    return `https://cdn.communitydragon.org/latest/champion/${encodeURIComponent(code)}/square`;
}

export function normalizeTier(tier: string | null | undefined): string {
    const code = (tier ?? "").trim().toLowerCase();
    return KNOWN_TIERS.has(code) ? code : "unranked";
}

export function rankSolidColor(tier: string | null | undefined): string | null {
    const code = (tier ?? "").trim().toLowerCase();
    return RANK_SOLID[code] ?? null;
}

export function rankCrestUrl(tier: string | null | undefined): string {
    return `${RANK_ASSETS}/ranked-mini-crests/${normalizeTier(tier)}.svg`;
}

export function rankEmblemUrl(tier: string | null | undefined): string {
    const code = normalizeTier(tier);
    if (code === "unranked") {
        return rankCrestUrl(code);
    }

    return `${RANK_ASSETS}/ranked-emblem/emblem-${code}.png`;
}

export function laneIconUrl(code: string | null | undefined): string | null {
    const key = (code ?? "").trim().toLowerCase();
    const file = LANE_FILES[key];
    return file ? `${LANE_ASSETS}/${file}.svg` : null;
}
