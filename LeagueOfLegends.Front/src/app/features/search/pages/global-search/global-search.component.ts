import { Component, computed, DestroyRef, inject, OnInit, resource, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent, stripRichHtmlPlainText } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { PlayersService } from "@features/players/services/players.service";
import {
    GlobalSearchStore,
    SearchCriteria,
    SearchHit,
    SearchScope,
} from "@features/search/stores/global-search.store";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const SCOPES: readonly SearchScope[] = ["all", "teams", "players"];

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
        NbInputModule,
        NbSelectModule,
        SkeletonComponent,
        SkeletonTextComponent,
    ],
    providers: [GlobalSearchStore],
    templateUrl: "./global-search.component.html",
    styleUrl: "./global-search.component.scss",
})
export class GlobalSearchComponent implements OnInit {
    protected readonly store = inject(GlobalSearchStore);

    protected readonly searchPlaceholder = $localize`:@@lol.search.placeholder:Name, or Name#1234`;
    protected readonly tabsLabel = $localize`:@@lol.search.tabsLabel:Result type`;
    protected readonly resultPlaceholders = [0, 1, 2];

    /** Bound to the in-page field, which only commits to the URL on submit. */
    protected readonly term = signal("");

    protected readonly options = resource({
        loader: () => firstValueFrom(this.players.options()),
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    protected readonly scope = computed(() => this.store.criteria().scope);

    protected readonly showsTeams = computed(() => this.scope() === "all" || this.scope() === "teams");
    protected readonly showsPlayers = computed(() => this.scope() === "all" || this.scope() === "players");

    private readonly players = inject(PlayersService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public ngOnInit(): void {
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const criteria = this.readCriteria(params);
            this.term.set(criteria.query);
            void this.runSearch(criteria);
        });
    }

    protected submitTerm(): void {
        this.patchCriteria({ q: this.term().trim() || null });
    }

    protected setScope(scope: SearchScope): void {
        this.patchCriteria({ type: scope === "all" ? null : scope });
    }

    protected setRegion(idRegion: number | null): void {
        this.patchCriteria({ region: idRegion });
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

    private readCriteria(params: ParamMap): SearchCriteria {
        return {
            query: params.get("q") ?? "",
            scope: readScope(params.get("type")),
            idRegion: readNumber(params.get("region")),
        };
    }

    protected plainText(value: string | null | undefined): string {
        return stripRichHtmlPlainText(value ?? "");
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
