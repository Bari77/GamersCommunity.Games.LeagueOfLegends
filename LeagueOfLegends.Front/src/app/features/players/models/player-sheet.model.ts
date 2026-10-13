import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";
import { CatalogItem, sortChampionsByLanePriority } from "./player.model";
import { PlayerLane } from "./player-lane.model";
import { PlayerChampion } from "./player-champion.model";
import { PlayerRank } from "./player-rank.model";

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
        public gameName: string | null,
        public tagLine: string | null,
        public region: CatalogItem | null,
        public primaryLane: PlayerLane | null,
        public secondaryLanes: PlayerLane[],
        public solo: PlayerRank | null,
        public flex: PlayerRank | null,
        public champions: PlayerChampion[],
    ) {}

    public get handle(): string {
        return this.discriminator ? `${this.nickname}#${this.discriminator}` : this.nickname;
    }

    public get riotId(): string | null {
        return this.gameName && this.tagLine ? `${this.gameName}#${this.tagLine}` : null;
    }

    public static fromDto(dto: PlayerSheetDto): PlayerSheet {
        const primaryLane = dto.primaryLane ? PlayerLane.fromDto(dto.primaryLane) : null;
        const secondaryLanes = (dto.secondaryLanes ?? []).map((lane) => PlayerLane.fromDto(lane));

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
            dto.gameName ?? null,
            dto.tagLine ?? null,
            dto.region ? CatalogItem.fromDto(dto.region) : null,
            primaryLane,
            secondaryLanes,
            PlayerRank.fromDto(dto.solo),
            PlayerRank.fromDto(dto.flex),
            sortChampionsByLanePriority(
                (dto.champions ?? []).map((champion) => PlayerChampion.fromDto(champion)),
                primaryLane?.code,
                secondaryLanes.map((lane) => lane.code),
            ),
        );
    }
}
