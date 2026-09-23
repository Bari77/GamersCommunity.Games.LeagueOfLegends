import { Injectable } from "@angular/core";
import { CreateLfgMessageRequestDto, ListLfgBeforeRequestDto, LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { LFG_KIND_PLAYER, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

const PAGE_SIZE = 50;

@Injectable({ providedIn: "root" })
export class LfgChatService extends BaseService {
    public constructor() {
        super("/leagueoflegends/LfgAds");
    }

    public listRecent(): Observable<LfgMessage[]> {
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListRecent"), { kind: LFG_KIND_PLAYER })
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public listBefore(before: LfgMessage): Observable<LfgMessage[]> {
        const payload: ListLfgBeforeRequestDto = {
            kind: LFG_KIND_PLAYER,
            beforeCreationDate: before.creationDate.toISOString(),
            beforePublicId: before.publicId,
            take: PAGE_SIZE,
        };
        return this.http
            .post<LfgMessageDto[]>(this.getURL("actions/ListBefore"), payload)
            .pipe(map((dtos) => dtos.map((dto) => LfgMessage.fromDto(dto))));
    }

    public send(data: CreateLfgMessageRequestDto): Observable<LfgMessage> {
        return this.post<LfgMessageDto, LfgMessage>(LfgMessage, "actions/Create", data);
    }
}
