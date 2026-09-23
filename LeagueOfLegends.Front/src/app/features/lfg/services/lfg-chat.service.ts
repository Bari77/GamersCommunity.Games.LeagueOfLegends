import { Injectable } from "@angular/core";
import {
    CreateLfgMessageRequestDto,
    ListLfgBeforeRequestDto,
    LfgAdPageDto,
    LfgMessageDto,
    PostableTeamDto,
    SearchLfgRequestDto,
} from "@features/lfg/dto/lfg-message.dto";
import { LfgAdPage, LfgKind, LfgMessage, PostableTeam } from "@features/lfg/models/lfg-message.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const PAGE_SIZE = 50;

@Injectable({ providedIn: "root" })
export class LfgChatService extends BaseService {
    public constructor() {
        super("/leagueoflegends/LfgAds");
    }

    public listRecent(kind: LfgKind): Observable<LfgMessage[]> {
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListRecent"), { kind })
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public listBefore(kind: LfgKind, before: LfgMessage): Observable<LfgMessage[]> {
        const payload: ListLfgBeforeRequestDto = {
            kind,
            beforeCreationDate: before.creationDate.toISOString(),
            beforePublicId: before.publicId,
            take: PAGE_SIZE,
        };
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListBefore"), payload)
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public search(request: SearchLfgRequestDto): Observable<LfgAdPage> {
        return this.http.post<LfgAdPageDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => LfgMessage.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
    }

    public send(data: CreateLfgMessageRequestDto): Observable<LfgMessage> {
        return this.post<LfgMessageDto, LfgMessage>(LfgMessage, "actions/Create", data);
    }
}

@Injectable({ providedIn: "root" })
export class PostableTeamsService extends BaseService {
    public constructor() {
        super("/leagueoflegends/Teams");
    }

    /** Teams the current player may post for (captain / coach / manager). */
    public listPostable(): Observable<PostableTeam[]> {
        return this.http
            .post<PostableTeamDto[]>(this.getURL("actions/ListPostable"), {})
            .pipe(map((dtos) => dtos.map((dto) => PostableTeam.fromDto(dto))));
    }
}
