import { Injectable } from "@angular/core";
import { PlayerSummary } from "@features/home/models/home-feed.model";
import {
    PlayerLoadRequestDto,
    PlayerOptionsDto,
    PlayerResolveResultDto,
    PlayerSearchRequestDto,
    PlayerSearchResultDto,
    PlayerSheetDto,
    PlayerUpdateRequestDto,
} from "@features/players/dto/player.dto";
import { PlayerOptions, PlayerResolveResult, PlayerSheet } from "@features/players/models/player.model";
import { BaseService } from "@shared/services/base.service";
import { map, Observable } from "rxjs";

export interface PlayerSearchPage {
    items: PlayerSummary[];
    hasMore: boolean;
}

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
        return this.http.post<PlayerSearchResultDto>(this.getURL("actions/Search"), request).pipe(
            map((dto) => ({
                items: (dto.items ?? []).map((item) => PlayerSummary.fromDto(item)),
                hasMore: dto.hasMore ?? false,
            })),
        );
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
