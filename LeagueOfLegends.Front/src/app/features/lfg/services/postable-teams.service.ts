import { Injectable } from "@angular/core";
import { PostableTeam } from "@features/lfg/models/postable-team.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class PostableTeamsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/Teams");
    }

    /** Teams the current player may post for (captain / coach / manager). */
    public listPostable(): Observable<PostableTeam[]> {
        return this.postList(PostableTeam, "actions/ListPostable", {});
    }
}
