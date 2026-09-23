import { Injectable } from "@angular/core";
import { HomeFeedDto } from "@features/home/dto/home-feed.dto";
import { HomeFeed } from "@features/home/models/home-feed.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class HomeFeedService extends BaseService {
    public constructor() {
        super("/leagueoflegends/HomeFeed");
    }

    public get(): Observable<HomeFeed> {
        return this.post<HomeFeedDto, HomeFeed>(HomeFeed, "actions/Get", {});
    }
}
