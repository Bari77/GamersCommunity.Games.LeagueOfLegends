export interface TeamLinkDto {
    publicId: string;
    teamPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export interface TeamLinkListRequestDto {
    teamPublicId: string;
}

export interface TeamLinkCreateRequestDto {
    teamPublicId: string;
    url: string;
    label: string;
    icon: string | null;
}

export type TeamLinkUpdateRequestDto = Partial<Omit<TeamLinkCreateRequestDto, "teamPublicId">>;

export interface TeamLinkReorderRequestDto {
    teamPublicId: string;
    publicIds: string[];
}
