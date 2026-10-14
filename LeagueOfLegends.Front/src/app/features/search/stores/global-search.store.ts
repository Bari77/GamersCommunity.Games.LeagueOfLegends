import { computed, inject, Injectable, signal } from "@angular/core";
import { PlayerSummary } from "@features/home/models/player-summary.model";
import { PlayerSearchRequestDto } from "@features/players/dto/player-search-request.dto";
import { PlayersService } from "@features/players/services/players.service";
import { TeamSearchRequestDto } from "@features/teams/dto/team-search-request.dto";
import { TeamSummary } from "@features/teams/models/team-summary.model";
import { TeamsService } from "@features/teams/services/teams.service";
import { firstValueFrom } from "rxjs";
import { SearchCriteria } from "../models/search-criteria.model";
import { SearchHit } from "../models/search-hit.model";

export type SearchScope = "all" | "teams" | "players";
export const EMPTY_CRITERIA: SearchCriteria = {
    query: "",
    scope: "all",
    idRegion: null,
    idLane: null,
    idMissingLane: null,
    minSoloTier: null,
    minMembers: null,
    openRoster: false,
    lookingForTeam: false,
};

/** First page of each type. Further pages stay on the dedicated tab. */
const PAGE_SIZE = 20;

/**
 * Cross-entity search, one tab per type.
 *
 * Each type keeps the cursor pagination of its own endpoint instead of being merged into a single
 * ranked list.
 */
@Injectable()
export class GlobalSearchStore {
    public readonly teams = computed(() => this.$teams());
    public readonly players = computed(() => this.$players());

    public readonly loading = computed(() => this.$loading());
    public readonly loadingMore = computed(() => this.$loadingMore());

    /** Only meaningful on a single-type scope; the overview offers "see all" links instead. */
    public readonly hasMore = computed(() => this.$hasMore());

    public readonly criteria = computed(() => this.$criteria());

    public readonly isEmpty = computed(() => this.$teams().length === 0 && this.$players().length === 0);

    /**
     * The single team or player answering a handle search, which is what typing `Name#1234` asks
     * for.
     */
    public readonly handleMatch = computed<SearchHit | null>(() => {
        const criteria = this.$criteria();
        if (criteria.scope !== "all" || !criteria.query.includes("#")) {
            return null;
        }

        const teams = this.$teams();
        const players = this.$players();
        if (teams.length + players.length !== 1) {
            return null;
        }

        return teams.length === 1
            ? { kind: "team", publicId: teams[0].publicId }
            : { kind: "player", publicId: players[0].publicId };
    });

    private readonly teamsService = inject(TeamsService);
    private readonly playersService = inject(PlayersService);

    /**
     * Search token of the running request. Criteria changed while a page is in flight makes the
     * late answer obsolete, and applying it would show results for a term no longer on screen.
     */
    private token = 0;
    private readonly $teams = signal<TeamSummary[]>([]);
    private readonly $players = signal<PlayerSummary[]>([]);
    private readonly $loading = signal(true);
    private readonly $loadingMore = signal(false);
    private readonly $hasMore = signal(false);
    private readonly $criteria = signal<SearchCriteria>(EMPTY_CRITERIA);

    public async search(criteria: SearchCriteria): Promise<void> {
        const current = ++this.token;
        this.$criteria.set(criteria);
        this.$loading.set(true);

        const take = PAGE_SIZE;

        try {
            const [teams, players] = await Promise.all([
                this.wants(criteria, "teams")
                    ? firstValueFrom(this.teamsService.search({ ...this.teamRequest(criteria), take }))
                    : null,
                this.wants(criteria, "players")
                    ? firstValueFrom(this.playersService.search({ ...this.playerRequest(criteria), take }))
                    : null,
            ]);

            if (current !== this.token) {
                return;
            }

            this.$teams.set(teams?.items ?? []);
            this.$players.set(players?.items ?? []);
            this.$hasMore.set(criteria.scope === "all" ? false : (teams ?? players)?.hasMore === true);
        } finally {
            if (current === this.token) {
                this.$loading.set(false);
            }
        }
    }

    public async loadMore(): Promise<void> {
        const criteria = this.$criteria();
        if (criteria.scope === "all" || !this.$hasMore() || this.$loadingMore()) {
            return;
        }

        const token = this.token;
        this.$loadingMore.set(true);

        try {
            if (criteria.scope === "teams") {
                await this.appendTeams(criteria, token);
            } else if (criteria.scope === "players") {
                await this.appendPlayers(criteria, token);
            }
        } finally {
            this.$loadingMore.set(false);
        }
    }

    private async appendTeams(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.$teams();
        const last = current.at(-1);
        if (!last) {
            return;
        }

        const page = await firstValueFrom(
            this.teamsService.search({
                ...this.teamRequest(criteria),
                take: PAGE_SIZE,
                beforeCreationDate: last.creationDate.toISOString(),
                beforePublicId: last.publicId,
            }),
        );

        if (token !== this.token) {
            return;
        }

        const known = new Set(current.map((item) => item.publicId));
        this.$teams.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.$hasMore.set(page.hasMore);
    }

    private async appendPlayers(criteria: SearchCriteria, token: number): Promise<void> {
        const current = this.$players();
        const last = current.at(-1);
        if (!last) {
            return;
        }

        const page = await firstValueFrom(
            this.playersService.search({
                ...this.playerRequest(criteria),
                take: PAGE_SIZE,
                beforeCreationDate: last.creationDate.toISOString(),
                beforePublicId: last.publicId,
            }),
        );

        if (token !== this.token) {
            return;
        }

        const known = new Set(current.map((item) => item.publicId));
        this.$players.set([...current, ...page.items.filter((item) => !known.has(item.publicId))]);
        this.$hasMore.set(page.hasMore);
    }

    private wants(criteria: SearchCriteria, type: Exclude<SearchScope, "all">): boolean {
        return criteria.scope === "all" || criteria.scope === type;
    }

    private teamRequest(criteria: SearchCriteria): TeamSearchRequestDto {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idRegion !== null ? { idRegion: criteria.idRegion } : {}),
            ...(criteria.minMembers !== null ? { minMembers: criteria.minMembers } : {}),
            ...(criteria.idMissingLane !== null ? { idMissingLane: criteria.idMissingLane } : {}),
            ...(criteria.openRoster ? { openRoster: true } : {}),
        };
    }

    private playerRequest(criteria: SearchCriteria): PlayerSearchRequestDto {
        const query = criteria.query.trim();
        return {
            ...(query ? { query } : {}),
            ...(criteria.idRegion !== null ? { idRegion: criteria.idRegion } : {}),
            ...(criteria.idLane !== null ? { idLane: criteria.idLane } : {}),
            ...(criteria.minSoloTier ? { minSoloTier: criteria.minSoloTier } : {}),
            ...(criteria.lookingForTeam ? { lookingForTeam: true } : {}),
        };
    }
}
