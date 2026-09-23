import { Injectable } from "@angular/core";
import {
    GamePostCreateRequestDto,
    GamePostDto,
    GamePostModerateRequestDto,
    GamePostPageDto,
    GamePostTargetRequestDto,
    GamePostUpdateRequestDto,
    TeamWallRequestDto,
} from "@features/teams/dto/game-post.dto";
import { GamePost, GamePostPage } from "@features/teams/models/game-post.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GamePostsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/GamePosts");
    }

    public listTeamWall(request: TeamWallRequestDto): Observable<GamePostPage> {
        return this.pageAt("actions/ListTeamWall", request);
    }

    public listPending(request: TeamWallRequestDto): Observable<GamePostPage> {
        return this.pageAt("actions/ListPending", request);
    }

    public create(request: GamePostCreateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Create", request);
    }

    public update(request: GamePostUpdateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Update", request);
    }

    public moderate(request: GamePostModerateRequestDto): Observable<GamePost> {
        return this.post<GamePostDto, GamePost>(GamePost, "actions/Moderate", request);
    }

    public remove(request: GamePostTargetRequestDto): Observable<GamePostTargetRequestDto> {
        return this.http.post<GamePostTargetRequestDto>(this.getURL("actions/Delete"), request);
    }

    private pageAt(action: string, payload: TeamWallRequestDto): Observable<GamePostPage> {
        return this.http
            .post<GamePostPageDto>(this.getURL(action), payload)
            .pipe(map((dto) => GamePostPage.fromDto(dto)));
    }
}
