import { Injectable } from "@angular/core";
import { GamePostDto } from "@features/teams/dto/game-post.dto";
import { TeamWallRequestDto } from "@features/teams/dto/team-wall-request.dto";
import { GamePostUpdateRequestDto } from "@features/teams/dto/game-post-update-request.dto";
import { GamePostTargetRequestDto } from "@features/teams/dto/game-post-target-request.dto";
import { GamePostModerateRequestDto } from "@features/teams/dto/game-post-moderate-request.dto";
import { GamePostCreateRequestDto } from "@features/teams/dto/game-post-create-request.dto";
import { GamePost } from "@features/teams/models/game-post.model";
import { GamePostPage } from "@features/teams/models/game-post-page.model";
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
