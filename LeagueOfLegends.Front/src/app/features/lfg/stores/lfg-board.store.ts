import { inject, Injectable, signal } from "@angular/core";
import { SearchLfgRequestDto } from "@features/lfg/dto/lfg-message.dto";
import { LFG_KIND_PLAYER, LfgKind, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgChatService } from "@features/lfg/services/lfg-chat.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 20;

@Injectable()
export class LfgBoardStore {
    public readonly ads = signal<LfgMessage[]>([]);
    public readonly loading = signal(true);
    public readonly loadingMore = signal(false);
    public readonly hasMore = signal(false);

    public readonly kind = signal<LfgKind>(LFG_KIND_PLAYER);
    public readonly query = signal("");
    public readonly idRegion = signal<number | null>(null);
    public readonly idLane = signal<number | null>(null);

    private readonly chat = inject(LfgChatService);

    /**
     * Search token of the running request. A filter changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for criteria no longer on screen.
     */
    private token = 0;

    public isFiltered(): boolean {
        return this.query().trim().length > 0 || this.idRegion() !== null || this.idLane() !== null;
    }

    public async search(): Promise<void> {
        const current = ++this.token;
        this.loading.set(true);
        try {
            const page = await firstValueFrom(this.chat.search(this.buildRequest()));
            if (current !== this.token) {
                return;
            }
            this.ads.set(page.items);
            this.hasMore.set(page.hasMore);
        } finally {
            if (current === this.token) {
                this.loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const current = this.ads();
        const last = current.at(-1);
        if (!this.hasMore() || this.loadingMore() || !last) {
            return;
        }

        const token = this.token;
        this.loadingMore.set(true);
        try {
            const page = await firstValueFrom(
                this.chat.search({
                    ...this.buildRequest(),
                    beforeCreationDate: last.creationDate.toISOString(),
                    beforePublicId: last.publicId,
                }),
            );
            if (token !== this.token) {
                return;
            }
            const known = new Set(current.map((ad) => ad.publicId));
            this.ads.set([...current, ...page.items.filter((ad) => !known.has(ad.publicId))]);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loadingMore.set(false);
        }
    }

    public resetFilters(): void {
        this.query.set("");
        this.idRegion.set(null);
        this.idLane.set(null);
        void this.search();
    }

    private buildRequest(): SearchLfgRequestDto {
        const query = this.query().trim();
        return {
            kind: this.kind(),
            take: PAGE_SIZE,
            ...(query ? { query } : {}),
            ...(this.idRegion() !== null ? { idRegion: this.idRegion()! } : {}),
            ...(this.idLane() !== null ? { idLane: this.idLane()! } : {}),
        };
    }
}
