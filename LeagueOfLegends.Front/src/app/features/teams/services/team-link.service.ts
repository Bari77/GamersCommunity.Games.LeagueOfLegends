import { Injectable } from "@angular/core";
import {
    TeamLinkCreateRequestDto,
    TeamLinkDto,
    TeamLinkListRequestDto,
    TeamLinkReorderRequestDto,
    TeamLinkUpdateRequestDto,
} from "@features/teams/dto/team-link.dto";
import { TeamLink } from "@features/teams/models/team-link.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const RESOURCE = "TeamLinks";

@Injectable({ providedIn: "root" })
export class TeamLinkService extends BaseService {
    public constructor() {
        super("/leagueoflegends");
    }

    public list(teamPublicId: string): Observable<TeamLink[]> {
        const payload: TeamLinkListRequestDto = { teamPublicId };
        return this.http
            .post<TeamLinkDto[]>(this.getURL(`${RESOURCE}/actions/List`), payload)
            .pipe(map((dtos) => dtos.map((dto) => TeamLink.fromDto(dto))));
    }

    public create(data: TeamLinkCreateRequestDto): Observable<TeamLink> {
        return this.http
            .post<TeamLinkDto>(this.getURL(`${RESOURCE}/actions/Create`), data)
            .pipe(map((dto) => TeamLink.fromDto(dto)));
    }

    public update(publicId: string, data: TeamLinkUpdateRequestDto): Observable<TeamLink> {
        return this.http
            .put<TeamLinkDto>(this.getURL(`${RESOURCE}/${publicId}`), data)
            .pipe(map((dto) => TeamLink.fromDto(dto)));
    }

    public remove(publicId: string): Observable<void> {
        return this.http.delete<void>(this.getURL(`${RESOURCE}/${publicId}`));
    }

    public reorder(teamPublicId: string, publicIds: string[]): Observable<TeamLink[]> {
        const payload: TeamLinkReorderRequestDto = { teamPublicId, publicIds };
        return this.http
            .post<TeamLinkDto[]>(this.getURL(`${RESOURCE}/actions/Reorder`), payload)
            .pipe(map((dtos) => dtos.map((dto) => TeamLink.fromDto(dto))));
    }
}
