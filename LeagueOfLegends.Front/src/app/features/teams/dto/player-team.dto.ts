export interface PlayerTeamDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    tag?: string | null;
    regionCode?: string | null;
    rank: string;
    laneCode?: string | null;
    rosterKind?: string | null;
    memberCount: number;
    playerSlotCount: number;
}
