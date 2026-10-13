import { Injectable } from "@angular/core";
import { PlayerUpdateRequestDto } from "@features/players/dto/player-update-request.dto";
import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";
import { PlayerSearchRequestDto } from "@features/players/dto/player-search-request.dto";
import { PlayerResolveResultDto } from "@features/players/dto/player-resolve-result.dto";
import { PlayerOptionsDto } from "@features/players/dto/player-options.dto";
import { PlayerLoadRequestDto } from "@features/players/dto/player-load-request.dto";
import { PlayerSheet } from "@features/players/models/player-sheet.model";
import { PlayerSearchPage } from "@features/players/models/player-search-page.model";
import { PlayerResolveResult } from "@features/players/models/player-resolve-result.model";
import { PlayerOptions } from "@features/players/models/player-options.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class PlayersService extends BaseService {
    public constructor() {
        super("/leagueoflegends/Players");
    }

    public load(data: PlayerLoadRequestDto): Observable<PlayerSheet> {
        return this.post<PlayerSheetDto, PlayerSheet>(PlayerSheet, "actions/Load", data);
    }

    public getByPublicId(publicId: string): Observable<PlayerSheet> {
        return this.getOne<PlayerSheetDto, PlayerSheet>(PlayerSheet, publicId);
    }

    public search(request: PlayerSearchRequestDto): Observable<PlayerSearchPage> {
        return this.post(PlayerSearchPage, "actions/Search", request);
    }

    public resolve(platformUserPublicId: string): Observable<PlayerResolveResult> {
        return this.post<PlayerResolveResultDto, PlayerResolveResult>(PlayerResolveResult, "actions/Resolve", {
            platformUserPublicId,
        });
    }

    public update(publicId: string, data: PlayerUpdateRequestDto): Observable<PlayerSheet> {
        return this.put<PlayerSheetDto, PlayerSheet>(PlayerSheet, publicId, data);
    }

    public options(): Observable<PlayerOptions> {
        return this.post<PlayerOptionsDto, PlayerOptions>(PlayerOptions, "actions/Options", {});
    }
}
