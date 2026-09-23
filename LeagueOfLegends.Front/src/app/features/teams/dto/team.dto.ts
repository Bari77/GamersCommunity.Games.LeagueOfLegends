export interface TeamMemberChampionDto {
    id: number;
    code: string;
    kind: string;
    lane?: string | null;
}

export interface TeamMemberDto {
    playerPublicId: string;
    platformUserPublicId: string;
    nickname: string;
    discriminator: string;
    avatarUrl: string;
    rank: string;
    gameName?: string | null;
    tagLine?: string | null;
    idLane?: number | null;
    laneCode?: string | null;
    primaryLaneCode?: string | null;
    rosterKind?: string | null;
    joinedAt: string;
    champions?: TeamMemberChampionDto[];
}

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

export interface TeamSearchRequestDto {
    query?: string;
    idRegion?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
    take?: number;
}

export interface TeamSearchResultDto {
    items?: TeamSummaryDto[];
    hasMore?: boolean;
}

export interface TeamListByPlayerRequestDto {
    playerPublicId: string;
}

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

export interface TeamCreateRequestDto {
    entitled: string;
    tag?: string | null;
    sentence?: string | null;
}

export interface TeamUpdateRequestDto {
    entitled?: string;
    tag?: string | null;
    sentence?: string | null;
    layoutJson?: string | null;
}

export interface TeamSetRankRequestDto {
    teamPublicId: string;
    playerPublicId: string;
    rank: string;
}

export interface TeamSetRosterRequestDto {
    teamPublicId: string;
    playerPublicId: string;
    idLane: number;
    rosterKind: string;
}

export interface TeamMemberTargetRequestDto {
    teamPublicId: string;
    playerPublicId: string;
}

export interface TeamDisbandRequestDto {
    teamPublicId: string;
    confirmation: string;
}

export interface TeamLeaveResultDto {
    teamPublicId: string;
}

export interface TeamDisbandResultDto {
    publicId: string;
    handle: string;
}
