import { TeamMemberDto } from "./team-member.dto";

export interface TeamSheetDto {
    publicId: string;
    entitled: string;
    discriminator: string;
    tag?: string | null;
    sentence?: string | null;
    layoutJson?: string | null;
    regionCode?: string | null;
    creationDate: string;
    memberCount: number;
    playerSlotCount: number;
    members?: TeamMemberDto[];
    viewerRank?: string | null;
    viewerApplicationStatus?: string | null;
    viewerApplicationPublicId?: string | null;
    pendingApplicationCount?: number;
}
