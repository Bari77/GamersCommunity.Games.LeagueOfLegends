import { PostableTeamDto } from "@features/lfg/dto/postable-team.dto";

export class PostableTeam {
    public constructor(
        public publicId: string,
        public entitled: string,
        public discriminator: string,
        public rank: string,
    ) {}

    public static fromDto(dto: PostableTeamDto): PostableTeam {
        return new PostableTeam(dto.publicId, dto.entitled, dto.discriminator, dto.rank);
    }

    public handleLabel(): string {
        return `${this.entitled}#${this.discriminator}`;
    }
}
