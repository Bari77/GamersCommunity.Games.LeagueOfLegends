import { Injectable } from "@angular/core";
import {
    TeamCreateRequestDto,
    TeamDisbandRequestDto,
    TeamListByPlayerRequestDto,
    TeamMemberTargetRequestDto,
    TeamSearchRequestDto,
    TeamSetRankRequestDto,
    TeamSetRosterRequestDto,
    TeamSheetDto,
    TeamUpdateRequestDto,
} from "@features/teams/dto/team.dto";
import {
    PlayerTeam,
    TeamDisbandResult,
    TeamLeaveResult,
    TeamSearchPage,
    TeamSheet,
} from "@features/teams/models/team.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

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
        return this.postList(PlayerTeam, "actions/ListByPlayer", payload);
    }

    public search(request: TeamSearchRequestDto): Observable<TeamSearchPage> {
        return this.post(TeamSearchPage, "actions/Search", request);
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

    public leave(request: TeamMemberTargetRequestDto): Observable<TeamLeaveResult> {
        return this.post(TeamLeaveResult, "actions/Leave", request);
    }

    public disband(request: TeamDisbandRequestDto): Observable<TeamDisbandResult> {
        return this.post(TeamDisbandResult, "actions/Disband", request);
    }
}
