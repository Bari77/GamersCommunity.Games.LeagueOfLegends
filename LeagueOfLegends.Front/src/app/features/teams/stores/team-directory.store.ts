import { computed, inject, Injectable, signal } from "@angular/core";
import { TeamSearchRequestDto } from "@features/teams/dto/team-search-request.dto";
import { TeamSummary } from "@features/teams/models/team-summary.model";
import { TeamsService } from "@features/teams/services/teams.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 20;

@Injectable()
export class TeamDirectoryStore {
    public readonly teams = computed(() => this.$teams());
    public readonly loading = computed(() => this.$loading());
    public readonly loadingMore = computed(() => this.$loadingMore());
    public readonly hasMore = computed(() => this.$hasMore());

    public readonly query = computed(() => this.$query());
    public readonly idRegion = computed(() => this.$idRegion());

    public readonly isFiltered = computed(() => this.$query().trim().length > 0 || this.$idRegion() !== null);

    private readonly teamsService = inject(TeamsService);

    /**
     * Search token of the running request. A filter changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for criteria no longer on screen.
     */
    private token = 0;
    private readonly $teams = signal<TeamSummary[]>([]);
    private readonly $loading = signal(true);
    private readonly $loadingMore = signal(false);
    private readonly $hasMore = signal(false);
    private readonly $query = signal("");
    private readonly $idRegion = signal<number | null>(null);

    public async search(): Promise<void> {
        const current = ++this.token;
        this.$loading.set(true);
        try {
            const page = await firstValueFrom(this.teamsService.search(this.buildRequest()));
            if (current !== this.token) {
                return;
            }
            this.$teams.set(page.items);
            this.$hasMore.set(page.hasMore);
        } finally {
            if (current === this.token) {
                this.$loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const current = this.$teams();
        const last = current.at(-1);
        if (!this.$hasMore() || this.$loadingMore() || !last) {
            return;
        }

        const token = this.token;
        this.$loadingMore.set(true);
        try {
            const page = await firstValueFrom(
                this.teamsService.search({
                    ...this.buildRequest(),
                    beforeCreationDate: last.creationDate.toISOString(),
                    beforePublicId: last.publicId,
                }),
            );
            if (token !== this.token) {
                return;
            }
            const known = new Set(current.map((team) => team.publicId));
            this.$teams.set([...current, ...page.items.filter((team) => !known.has(team.publicId))]);
            this.$hasMore.set(page.hasMore);
        } finally {
            this.$loadingMore.set(false);
        }
    }

    public setQuery(query: string): void {
        this.$query.set(query);
    }

    public setIdRegion(idRegion: number | null): void {
        this.$idRegion.set(idRegion);
    }

    public resetFilters(): void {
        this.$query.set("");
        this.$idRegion.set(null);
        void this.search();
    }

    private buildRequest(): TeamSearchRequestDto {
        const query = this.$query().trim();
        return {
            take: PAGE_SIZE,
            ...(query ? { query } : {}),
            ...(this.$idRegion() !== null ? { idRegion: this.$idRegion()! } : {}),
        };
    }
}
