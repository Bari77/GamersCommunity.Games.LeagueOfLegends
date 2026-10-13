import { Injectable } from "@angular/core";
import { TeamLinkUpdateRequestDto } from "@features/teams/dto/team-link.dto";
import { TeamLinkReorderRequestDto } from "@features/teams/dto/team-link-reorder-request.dto";
import { TeamLinkListRequestDto } from "@features/teams/dto/team-link-list-request.dto";
import { TeamLinkCreateRequestDto } from "@features/teams/dto/team-link-create-request.dto";
import { TeamLink } from "@features/teams/models/team-link.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

const RESOURCE = "TeamLinks";

@Injectable()
export class TeamLinkService extends BaseService {
    public constructor() {
        super("/leagueoflegends");
    }

    public list(teamPublicId: string): Observable<TeamLink[]> {
        const payload: TeamLinkListRequestDto = { teamPublicId };
        return this.postList(TeamLink, `${RESOURCE}/actions/List`, payload);
    }

    public create(data: TeamLinkCreateRequestDto): Observable<TeamLink> {
        return this.post(TeamLink, `${RESOURCE}/actions/Create`, data);
    }

    public update(publicId: string, data: TeamLinkUpdateRequestDto): Observable<TeamLink> {
        return this.put(TeamLink, `${RESOURCE}/${publicId}`, data);
    }

    public remove(publicId: string): Observable<void> {
        return this.delete(`${RESOURCE}/${publicId}`);
    }

    public reorder(teamPublicId: string, publicIds: string[]): Observable<TeamLink[]> {
        const payload: TeamLinkReorderRequestDto = { teamPublicId, publicIds };
        return this.postList(TeamLink, `${RESOURCE}/actions/Reorder`, payload);
    }
}
