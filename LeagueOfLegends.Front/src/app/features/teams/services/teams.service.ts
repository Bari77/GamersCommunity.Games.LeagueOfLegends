import { Injectable } from "@angular/core";
import {
    TeamCreateRequestDto,
    TeamDisbandRequestDto,
    TeamDisbandResultDto,
    TeamLeaveResultDto,
    TeamListByPlayerRequestDto,
    TeamMemberTargetRequestDto,
    PlayerTeamDto,
    TeamSearchRequestDto,
    TeamSearchResultDto,
    TeamSetRankRequestDto,
    TeamSetRosterRequestDto,
    TeamSheetDto,
    TeamUpdateRequestDto,
} from "@features/teams/dto/team.dto";
import { PlayerTeam, TeamSheet, TeamSummary } from "@features/teams/models/team.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

export interface TeamSearchPage {
    items: TeamSummary[];
    hasMore: boolean;
}

@Injectable()
export class TeamsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/Teams");
    }

    public getByPublicId(publicId: string): Observable<TeamSheet> {
        return this.getOne<TeamSheetDto, TeamSheet>(TeamSheet, publicId);
    }

    public listByPlayer(playerPublicId: string): Observable<PlayerTeam[]> {
        const payload: TeamListByPlayerRequestDto = { playerPublicId };
        return this.http
            .post<PlayerTeamDto[]>(this.getURL("actions/ListByPlayer"), payload)
            .pipe(map((dtos) => dtos.map((dto) => PlayerTeam.fromDto(dto))));
    }

    public search(request: TeamSearchRequestDto): Observable<TeamSearchPage> {
        return this.http.post<TeamSearchResultDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => TeamSummary.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
    }

    public create(request: TeamCreateRequestDto): Observable<TeamSheet> {
        return this.post<TeamSheetDto, TeamSheet>(TeamSheet, null, request);
    }

    public update(publicId: string, request: TeamUpdateRequestDto): Observable<TeamSheet> {
        return this.put<TeamSheetDto, TeamSheet>(TeamSheet, publicId, request);
    }

    public setRank(request: TeamSetRankRequestDto): Observable<TeamSheet> {
        return this.post<TeamSheetDto, TeamSheet>(TeamSheet, "actions/SetRank", request);
    }

    public setRoster(request: TeamSetRosterRequestDto): Observable<TeamSheet> {
        return this.post<TeamSheetDto, TeamSheet>(TeamSheet, "actions/SetRoster", request);
    }

    public kick(request: TeamMemberTargetRequestDto): Observable<TeamSheet> {
        return this.post<TeamSheetDto, TeamSheet>(TeamSheet, "actions/Kick", request);
    }

    public transferCaptaincy(request: TeamMemberTargetRequestDto): Observable<TeamSheet> {
        return this.post<TeamSheetDto, TeamSheet>(TeamSheet, "actions/TransferCaptaincy", request);
    }

    public leave(request: TeamMemberTargetRequestDto): Observable<TeamLeaveResultDto> {
        return this.http.post<TeamLeaveResultDto>(this.getURL("actions/Leave"), request);
    }

    public disband(request: TeamDisbandRequestDto): Observable<TeamDisbandResultDto> {
        return this.http.post<TeamDisbandResultDto>(this.getURL("actions/Disband"), request);
    }
}
