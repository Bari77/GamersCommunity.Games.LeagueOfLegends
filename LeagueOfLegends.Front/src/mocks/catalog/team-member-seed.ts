export const MAIN_LANES = ["top", "jungle", "mid", "bottom", "support"] as const;

export interface TeamMemberSeed {
    who: string;
    rank: string;
    joinedAt: string;
    /** Required for captain/player seats; omitted for coach/manager. */
    lane?: (typeof MAIN_LANES)[number];
    rosterKind?: "main" | "sub";
}
