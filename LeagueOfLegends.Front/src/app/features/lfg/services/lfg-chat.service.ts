import { Injectable } from "@angular/core";
import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { ListLfgBeforeRequestDto } from "@features/lfg/dto/list-lfg-before-request.dto";
import { CreateLfgMessageRequestDto } from "@features/lfg/dto/create-lfg-message-request.dto";
import { LfgKind, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

const PAGE_SIZE = 50;

@Injectable()
export class LfgChatService extends BaseService {
    public constructor() {
        super("/leagueoflegends/LfgAds");
    }

    public listRecent(kind: LfgKind): Observable<LfgMessage[]> {
        return this.postList(LfgMessage, "actions/ListRecent", { kind });
    }

    public listBefore(kind: LfgKind, before: LfgMessage): Observable<LfgMessage[]> {
        const payload: ListLfgBeforeRequestDto = {
            kind,
            beforeCreationDate: before.creationDate.toISOString(),
            beforePublicId: before.publicId,
            take: PAGE_SIZE,
        };
        return this.postList(LfgMessage, "actions/ListBefore", payload);
    }

    public send(data: CreateLfgMessageRequestDto): Observable<LfgMessage> {
        return this.post<LfgMessageDto, LfgMessage>(LfgMessage, "actions/Create", data);
    }
}
