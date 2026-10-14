import { Component, computed, effect, inject, resource, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { TeamApplication } from "@features/teams/models/team-application.model";
import { TeamCreateFormComponent } from "@features/teams/components/team-create-form/team-create-form.component";
import { TeamCreateRequestDto } from "@features/teams/dto/team-create-request.dto";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { TeamsService } from "@features/teams/services/teams.service";
import { CatalogItem } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { SearchHit } from "@features/search/models/search-hit.model";
import { SearchCriteria } from "@features/search/models/search-criteria.model";
import { GlobalSearchStore, SearchScope } from "@features/search/stores/global-search.store";
import {
    NbButtonModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
} from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { RankEmblemComponent } from "@shared/components/rank-emblem/rank-emblem.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const SCOPES: readonly SearchScope[] = ["all", "teams", "players"];

const TIER_ORDER = [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "emerald",
    "diamond",
    "master",
    "grandmaster",
    "challenger",
];

function readScope(value: string | null): SearchScope {
    return SCOPES.includes(value as SearchScope) ? (value as SearchScope) : "all";
}

function readNumber(value: string | null): number | null {
    if (value === null || value.trim() === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function readPositive(value: string | null): number | null {
    const parsed = readNumber(value);
    return parsed !== null && parsed > 0 ? parsed : null;
}

function coercePositive(value: number | string | null): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    return readPositive(value);
}

function readTier(value: string | null): string | null {
    const tier = value?.trim().toLowerCase() ?? "";
    return TIER_ORDER.includes(tier) ? tier : null;
}

/**
 * Cross-entity search page. The URL is the single source of truth for the criteria, so the shell
 * search bar, the in-page form and a shared link all drive the same code path.
 */
@Component({
    standalone: true,
    selector: "lol-global-search",
    imports: [
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
        NbSelectModule,
        LaneIconComponent,
        RankEmblemComponent,
        SkeletonComponent,
        CreateSheetWallComponent,
        TeamCreateFormComponent,
    ],
    providers: [GlobalSearchStore],
    templateUrl: "./global-search.component.html",
    styleUrl: "./global-search.component.scss",
})
export class GlobalSearchComponent {
    protected readonly store = inject(GlobalSearchStore);
    protected readonly membership = inject(GameMembershipStore);

    protected readonly searchPlaceholder = $localize`:@@lol.search.placeholder:Name, or Name#1234`;
    protected readonly minMembersPlaceholder = $localize`:@@lol.search.minMembers:Min. members`;
    protected readonly tabsLabel = $localize`:@@lol.search.tabsLabel:Result type`;
    protected readonly sheetWallMessage = $localize`:@@lol.team.directory.sheetWall:Create your player profile to found a team or apply to one.`;
    protected readonly resultPlaceholders = [0, 1, 2];

    /** Bound to the in-page field, which only commits to the URL on submit. */
    protected readonly term = signal("");
    protected readonly moreOpen = signal(false);
    protected readonly creating = signal(false);
    protected readonly createErrorCode = signal<string | null>(null);
    protected readonly formOpen = signal(false);

    protected readonly options = resource({
        loader: () => firstValueFrom(this.players.options()),
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    /**
     * Nebular drops a value written while only the empty option exists and never retries.
     * Options are rendered once the catalog is actually loaded.
     */
    protected readonly optionsReady = computed(() => this.options.hasValue() && !this.loadingOptions());

    protected readonly scope = computed(() => this.store.criteria().scope);

    protected readonly showsTeams = computed(() => this.scope() === "all" || this.scope() === "teams");
    protected readonly showsPlayers = computed(() => this.scope() === "all" || this.scope() === "players");

    protected readonly tiers = computed(() =>
        (this.options.value()?.tiers ?? [])
            .map((tier) => tier.code)
            .filter((code) => TIER_ORDER.includes(code))
            .sort((left, right) => TIER_ORDER.indexOf(left) - TIER_ORDER.indexOf(right)),
    );

    /** Secondary filters stay behind the toggle unless one of them is already set. */
    protected readonly extraCount = computed(() => {
        const criteria = this.store.criteria();
        let count = 0;
        if (this.showsPlayers() && criteria.lookingForTeam) {
            count += 1;
        }
        if (this.showsTeams() && criteria.minMembers !== null) {
            count += 1;
        }
        if (this.showsTeams() && criteria.openRoster) {
            count += 1;
        }
        return count;
    });

    protected readonly showMore = computed(() => this.moreOpen() || (this.extraCount() > 0 && !this.moreDismissed()));

    protected readonly hasFilters = computed(() => {
        const criteria = this.store.criteria();
        return (
            criteria.idRegion !== null ||
            criteria.idLane !== null ||
            criteria.idMissingLane !== null ||
            criteria.minSoloTier !== null ||
            criteria.minMembers !== null ||
            criteria.openRoster ||
            criteria.lookingForTeam
        );
    });

    protected readonly pendingApplications = computed(() =>
        this.myApplications.hasValue()
            ? this.myApplications.value().filter((application) => application.isPending())
            : [],
    );

    private readonly moreDismissed = signal(false);
    private readonly players = inject(PlayersService);
    private readonly applications = inject(TeamApplicationsService);
    private readonly teams = inject(TeamsService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly queryParams = toSignal(this.route.queryParamMap);

    /** Set once the visitor clears a deduced filter, so it does not snap back during this visit. */
    private readonly suppressDefaults = signal(false);

    private readonly viewerSheet = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: ({ params }) => firstValueFrom(this.players.getByPublicId(params)),
    });

    private readonly resetMoreDismissal = effect(() => {
        if (this.extraCount() === 0) {
            this.moreDismissed.set(false);
        }
    });

    private readonly myApplications = resource({
        params: () => (this.scope() === "teams" ? (this.membership.playerPublicId() ?? undefined) : undefined),
        loader: () => firstValueFrom(this.applications.listMine()),
        defaultValue: [] as TeamApplication[],
    });

    /**
     * The URL stays the source of truth. When it does not name a region yet, the visitor's own
     * region is written in once their sheet is known, then the search runs.
     */
    private readonly applyDefaults = effect(() => {
        const params = this.queryParams();
        if (!params) {
            return;
        }

        const criteria = this.readCriteria(params);
        this.term.set(criteria.query);

        if (!params.has("region") && !this.suppressDefaults()) {
            const regionId = this.inferredRegion();
            if (regionId === undefined) {
                return;
            }
            if (regionId !== null) {
                this.patchCriteria({ region: regionId });
                return;
            }
        }

        void this.runSearch(criteria);
    });

    protected toggleMore(): void {
        const open = !this.showMore();
        this.moreOpen.set(open);
        this.moreDismissed.set(!open);
    }

    protected submitTerm(): void {
        this.patchCriteria({ q: this.term().trim() || null });
    }

    protected setScope(scope: SearchScope): void {
        if (scope !== "teams") {
            this.formOpen.set(false);
        }
        this.patchCriteria({ type: scope === "all" ? null : scope });
    }

    protected setRegion(idRegion: number | null): void {
        if (idRegion === null) {
            this.suppressDefaults.set(true);
        }
        this.patchCriteria({ region: idRegion });
    }

    protected setLane(idLane: number | null): void {
        this.patchCriteria({ lane: idLane });
    }

    protected setMissingLane(idLane: number | null): void {
        this.patchCriteria({ need: idLane });
    }

    protected setTier(tier: string | null): void {
        this.patchCriteria({ tier: readTier(tier) });
    }

    protected setMinMembers(value: number | string | null): void {
        this.patchCriteria({ members: coercePositive(value) });
    }

    protected setOpenRoster(value: string | null): void {
        this.patchCriteria({ open: value === "yes" ? "yes" : null });
    }

    protected setLookingForTeam(value: string | null): void {
        this.patchCriteria({ lft: value === "yes" ? "yes" : null });
    }

    protected openChoice(): string | null {
        return this.store.criteria().openRoster ? "yes" : null;
    }

    protected lookingChoice(): string | null {
        return this.store.criteria().lookingForTeam ? "yes" : null;
    }

    protected laneById(id: number | null): CatalogItem | null {
        if (id === null) {
            return null;
        }

        return this.options.value()?.lanes.find((lane) => lane.id === id) ?? null;
    }

    protected clearFilters(): void {
        this.suppressDefaults.set(true);
        this.patchCriteria({
            region: null,
            lane: null,
            need: null,
            tier: null,
            members: null,
            open: null,
            lft: null,
        });
    }

    protected closeForm(): void {
        this.formOpen.set(false);
    }

    protected async onCreate(request: TeamCreateRequestDto): Promise<void> {
        this.creating.set(true);
        this.createErrorCode.set(null);
        try {
            const sheet = await firstValueFrom(this.teams.create(request));
            this.formOpen.set(false);
            await this.router.navigate([`${LOL_GAME_URL}/teams`, sheet.publicId]);
        } catch (err: unknown) {
            this.createErrorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
        } finally {
            this.creating.set(false);
        }
    }

    protected teamLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/teams`, publicId];
    }

    protected playerLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/players`, publicId];
    }

    private async runSearch(criteria: SearchCriteria): Promise<void> {
        await this.store.search(criteria);

        const hit = this.store.handleMatch();
        if (hit) {
            await this.router.navigate(this.hitLink(hit), { replaceUrl: true });
        }
    }

    private hitLink(hit: SearchHit): string[] {
        return hit.kind === "team" ? this.teamLink(hit.publicId) : this.playerLink(hit.publicId);
    }

    /**
     * `undefined` while the sheet is still loading, `null` when there is nothing to deduce.
     */
    private inferredRegion(): number | null | undefined {
        if (this.membership.loading()) {
            return undefined;
        }
        if (!this.membership.playerPublicId()) {
            return null;
        }
        if (!this.viewerSheet.hasValue()) {
            return this.viewerSheet.status() === "error" ? null : undefined;
        }
        return this.viewerSheet.value().region?.id ?? null;
    }

    private readCriteria(params: ParamMap): SearchCriteria {
        return {
            query: params.get("q") ?? "",
            scope: readScope(params.get("type")),
            idRegion: readNumber(params.get("region")),
            idLane: readNumber(params.get("lane")),
            idMissingLane: readNumber(params.get("need")),
            minSoloTier: readTier(params.get("tier")),
            minMembers: readPositive(params.get("members")),
            openRoster: params.get("open") === "yes",
            lookingForTeam: params.get("lft") === "yes",
        };
    }

    private patchCriteria(patch: Record<string, string | number | null>): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: patch,
            queryParamsHandling: "merge",
            replaceUrl: true,
        });
    }
}
