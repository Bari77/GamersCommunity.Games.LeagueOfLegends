import { Injectable } from "@angular/core";
import {
    PlayerMediaCreateRequestDto,
    PlayerMediaDto,
    PlayerMediaKind,
    PlayerMediaListRequestDto,
    PlayerMediaUpdateRequestDto,
} from "@features/media/dto/player-media.dto";
import { PlayerMedia } from "@features/media/models/player-media.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const RESOURCE: Record<PlayerMediaKind, string> = {
    photo: "PlayerPictures",
    video: "PlayerVideos",
    stream: "PlayerStreams",
};

@Injectable({ providedIn: "root" })
export class PlayerMediaService extends BaseService {
    public constructor() {
        super("/leagueoflegends");
    }

    public list(kind: PlayerMediaKind, playerPublicId: string): Observable<PlayerMedia[]> {
        const payload: PlayerMediaListRequestDto = { playerPublicId };
        return this.http
            .post<PlayerMediaDto[]>(this.getURL(`${RESOURCE[kind]}/actions/List`), payload)
            .pipe(map((dtos) => dtos.map((dto) => PlayerMedia.fromDto(dto))));
    }

    public create(kind: PlayerMediaKind, data: PlayerMediaCreateRequestDto): Observable<PlayerMedia> {
        return this.http
            .post<PlayerMediaDto>(this.getURL(`${RESOURCE[kind]}/actions/Create`), data)
            .pipe(map((dto) => PlayerMedia.fromDto(dto)));
    }

    public update(
        kind: PlayerMediaKind,
        publicId: string,
        data: PlayerMediaUpdateRequestDto,
    ): Observable<PlayerMedia> {
        return this.http
            .put<PlayerMediaDto>(this.getURL(`${RESOURCE[kind]}/${publicId}`), data)
            .pipe(map((dto) => PlayerMedia.fromDto(dto)));
    }

    public remove(kind: PlayerMediaKind, publicId: string): Observable<void> {
        return this.http.delete<void>(this.getURL(`${RESOURCE[kind]}/${publicId}`));
    }
}
