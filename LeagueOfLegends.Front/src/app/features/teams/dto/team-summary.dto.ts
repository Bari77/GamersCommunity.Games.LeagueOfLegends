export interface TeamSummaryDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    tag?: string | null;
    sentence?: string | null;
    regionCode?: string | null;
    creationDate: string;
    memberCount: number;
    playerSlotCount: number;
}
