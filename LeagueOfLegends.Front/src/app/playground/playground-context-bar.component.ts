/// <reference types="@angular/localize" />

import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink } from "@angular/router";
import { BreadcrumbComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbFormFieldModule, NbIconModule, NbInputModule } from "@nebular/theme";
import { GameLink } from "./game-link.model";
import { ContextBarState } from "./context-bar-state.model";

function isGameLink(value: unknown): value is GameLink {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as GameLink).path === "string" &&
        typeof (value as GameLink).label === "string"
    );
}

function isGameLinkList(value: unknown): value is GameLink[] {
    return Array.isArray(value) && value.every(isGameLink);
}

function isGameLinkActive(link: GameLink, url: string): boolean {
    const [path, query = ""] = url.split("#")[0].split("?");
    const params = new URLSearchParams(query);

    if (link.activePrefix && (path === link.activePrefix || path.startsWith(`${link.activePrefix}/`))) {
        return true;
    }

    if (path !== link.path) {
        return false;
    }

    if (!link.queryParams) {
        return true;
    }

    return Object.entries(link.queryParams).every(([key, value]) => params.get(key) === value);
}

/**
 * Playground stand-in for Platform's context bar: breadcrumb, My profile / Teams, and search.
 * Collapses on routes that declare none of that data.
 */
@Component({
    standalone: true,
    selector: "lol-playground-context-bar",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        RouterLink,
        BreadcrumbComponent,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
    ],
    templateUrl: "./playground-context-bar.component.html",
    styleUrl: "./playground-context-bar.component.scss",
    host: {
        "[class.context-bar--empty]": "!hasTrail() && !gameSearch() && gameNav().length === 0",
    },
})
export class PlaygroundContextBarComponent {
    protected readonly homeLabel = $localize`:@@lol.playground.breadcrumb.home:Home`;
    protected readonly homeLink = LOL_GAME_URL;
    protected readonly navLabel = $localize`:@@lol.playground.nav.sections:Game sections`;
    protected readonly term = signal("");

    protected readonly hasTrail = computed(() => this.state().hasTrail);
    protected readonly gameNav = computed(() => this.state().nav);
    protected readonly gameSearch = computed(() => this.state().search);

    private readonly router = inject(Router);
    private readonly url = signal(this.router.url.split("#")[0]);
    private readonly state = signal<ContextBarState>(this.read());

    public constructor() {
        const subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.url.set(this.router.url.split("#")[0]);
                this.state.set(this.read());
                this.syncTerm();
            }
        });

        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }

    protected linkActive(link: GameLink): boolean {
        return isGameLinkActive(link, this.url());
    }

    protected submit(): void {
        const target = this.gameSearch();
        const term = this.term().trim();

        if (!target || !term) {
            return;
        }

        const path = this.router.url.split("#")[0].split("?")[0];
        const current = path === target.path ? this.router.parseUrl(this.router.url).queryParams : {};
        void this.router.navigate([target.path], { queryParams: { ...current, q: term } });
    }

    private read(): ContextBarState {
        let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
        let hasTrail = false;
        let nav: GameLink[] = [];
        let search: GameLink | null = null;

        while (snapshot) {
            const data = snapshot.routeConfig?.data;
            const label: unknown = data?.["breadcrumb"];

            if (typeof label === "string" && label.length > 0) {
                hasTrail = true;
            }

            if (isGameLinkList(data?.["gameNav"])) {
                nav = data["gameNav"];
            }

            if (isGameLink(data?.["gameSearch"])) {
                search = data["gameSearch"];
            }

            snapshot = snapshot.firstChild;
        }

        return { hasTrail, nav, search };
    }

    private syncTerm(): void {
        const target = this.state().search;

        if (!target || !this.router.url.split("?")[0].startsWith(target.path)) {
            return;
        }

        this.term.set(this.router.routerState.snapshot.root.queryParamMap.get("q") ?? "");
    }
}
