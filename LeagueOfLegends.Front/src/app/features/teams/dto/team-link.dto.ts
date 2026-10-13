import { TeamLinkCreateRequestDto } from "./team-link-create-request.dto";

export interface TeamLinkDto {
    publicId: string;
    teamPublicId: string;
    url: string;
    label: string;
    icon: string | null;
    position: number;
}

export type TeamLinkUpdateRequestDto = Partial<Omit<TeamLinkCreateRequestDto, "teamPublicId">>;
