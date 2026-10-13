import { Injectable } from "@angular/core";
import { TeamUpdateRequestDto } from "@features/teams/dto/team-update-request.dto";
import { TeamSheetDto } from "@features/teams/dto/team-sheet.dto";
import { TeamSetRosterRequestDto } from "@features/teams/dto/team-set-roster-request.dto";
import { TeamSetRankRequestDto } from "@features/teams/dto/team-set-rank-request.dto";
import { TeamSearchRequestDto } from "@features/teams/dto/team-search-request.dto";
import { TeamMemberTargetRequestDto } from "@features/teams/dto/team-member-target-request.dto";
import { TeamListByPlayerRequestDto } from "@features/teams/dto/team-list-by-player-request.dto";
import { TeamDisbandRequestDto } from "@features/teams/dto/team-disband-request.dto";
import { TeamCreateRequestDto } from "@features/teams/dto/team-create-request.dto";
import { TeamSheet } from "@features/teams/models/team-sheet.model";
import { TeamSearchPage } from "@features/teams/models/team-search-page.model";
import { TeamLeaveResult } from "@features/teams/models/team-leave-result.model";
import { TeamDisbandResult } from "@features/teams/models/team-disband-result.model";
import { PlayerTeam } from "@features/teams/models/player-team.model";
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
