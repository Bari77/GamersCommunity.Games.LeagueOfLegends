import { GcLink } from "@bari77/gc-widgets";
import { TeamLinkDto } from "@features/teams/dto/team-link.dto";

export class TeamLink {
    public readonly publicId: string;
    public readonly teamPublicId: string;
    public readonly url: string;
    public readonly label: string;
    public readonly icon: string | null;
    public readonly position: number;

    public constructor(dto: TeamLinkDto) {
        this.publicId = dto.publicId;
        this.teamPublicId = dto.teamPublicId;
        this.url = dto.url;
        this.label = dto.label;
        this.icon = dto.icon ?? null;
        this.position = dto.position ?? 0;
    }

    public get card(): GcLink {
        return { id: this.publicId, url: this.url, label: this.label, icon: this.icon };
    }

    public static fromDto(dto: TeamLinkDto): TeamLink {
        return new TeamLink(dto);
    }
}
