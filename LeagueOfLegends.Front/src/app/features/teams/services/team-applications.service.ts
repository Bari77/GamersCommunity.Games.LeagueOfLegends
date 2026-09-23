import { Injectable } from "@angular/core";
import {
    TeamApplicationCreateRequestDto,
    TeamApplicationDto,
    TeamApplicationListRequestDto,
    TeamApplicationReviewRequestDto,
    TeamApplicationTargetRequestDto,
} from "@features/teams/dto/team-application.dto";
import { TeamApplication } from "@features/teams/models/team-application.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

@Injectable()
export class TeamApplicationsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/TeamApplications");
    }

    public create(request: TeamApplicationCreateRequestDto): Observable<TeamApplication> {
        return this.post<TeamApplicationDto, TeamApplication>(TeamApplication, "actions/Create", request);
    }

    public listMine(): Observable<TeamApplication[]> {
        return this.listAt("actions/ListMine", {});
    }

    public listForTeam(request: TeamApplicationListRequestDto): Observable<TeamApplication[]> {
        return this.listAt("actions/List", request);
    }

    public review(request: TeamApplicationReviewRequestDto): Observable<TeamApplication> {
        return this.post<TeamApplicationDto, TeamApplication>(TeamApplication, "actions/Review", request);
    }

    public withdraw(request: TeamApplicationTargetRequestDto): Observable<TeamApplication> {
        return this.post<TeamApplicationDto, TeamApplication>(TeamApplication, "actions/Withdraw", request);
    }

    private listAt(action: string, payload: object): Observable<TeamApplication[]> {
        return this.http
            .post<TeamApplicationDto[]>(this.getURL(action), payload)
            .pipe(map((dtos) => dtos.map((dto) => TeamApplication.fromDto(dto))));
    }
}
