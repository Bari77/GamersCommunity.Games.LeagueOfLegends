import { Injectable } from "@angular/core";
import {
    GamePostCreateRequestDto,
    GamePostDto,
    GamePostModerateRequestDto,
    GamePostTargetRequestDto,
    GamePostUpdateRequestDto,
    TeamWallRequestDto,
} from "@features/teams/dto/game-post.dto";
import { GamePost, GamePostPage } from "@features/teams/models/game-post.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class GamePostsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/GamePosts");
    }

    public listTeamWall(request: TeamWallRequestDto): Observable<GamePostPage> {
        return this.post(GamePostPage, "actions/ListTeamWall", request);
    }

    public listPending(request: TeamWallRequestDto): Observable<GamePostPage> {
        return this.post(GamePostPage, "actions/ListPending", request);
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

    public remove(request: GamePostTargetRequestDto): Observable<void> {
        return this.postVoid("actions/Delete", request);
    }
}
