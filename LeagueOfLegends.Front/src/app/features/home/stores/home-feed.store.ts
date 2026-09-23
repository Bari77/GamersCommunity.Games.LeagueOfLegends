import { computed, inject, Injectable, resource } from "@angular/core";
import { HomeFeedService } from "@features/home/services/home-feed.service";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HomeFeedStore {
    public readonly feed = resource({
        loader: () => firstValueFrom(this.homeFeedService.get()),
    });

    public readonly loading = computed(() => ResourceUtils.isPending(this.feed));

    private readonly homeFeedService = inject(HomeFeedService);

    public reload(): void {
        this.feed.reload();
    }
}
