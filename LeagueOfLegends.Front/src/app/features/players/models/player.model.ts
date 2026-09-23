import { PlayerResolveResultDto, PlayerSheetDto } from "@features/players/dto/player.dto";

export class PlayerSheet {
    public constructor(
        public publicId: string,
        public platformUserPublicId: string,
        public nickname: string,
        public discriminator: string,
        public avatarUrl: string,
        public presentationIrl: string | null,
        public presentationIg: string | null,
        public creationDate: Date,
        public layoutJson: string | null,
    ) {}

    public get handle(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public static fromDto(dto: PlayerSheetDto): PlayerSheet {
        return new PlayerSheet(
            dto.publicId,
            dto.platformUserPublicId,
            dto.nickname,
            dto.discriminator,
            dto.avatarUrl,
            dto.presentationIrl ?? null,
            dto.presentationIg ?? null,
            new Date(dto.creationDate),
            dto.layoutJson ?? null,
        );
    }
}

export class PlayerResolveResult {
    public constructor(
        public playerPublicId: string | null,
        public hasSheet: boolean,
    ) {}

    public static fromDto(dto: PlayerResolveResultDto): PlayerResolveResult {
        return new PlayerResolveResult(dto.playerPublicId ?? null, dto.hasSheet);
    }
}
