/// <reference types="@angular/localize" />

import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BreadcrumbComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbFormFieldModule, NbIconModule, NbInputModule } from "@nebular/theme";

interface GameLink {
    path: string;
    label: string;
}

interface ContextBarState {
    hasTrail: boolean;
    nav: GameLink[];
    search: GameLink | null;
}

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
        RouterLinkActive,
        BreadcrumbComponent,
        NbFormFieldModule,
        NbIconModule,
        NbInputModule,
    ],
    template: `
        <gc-breadcrumb [rootLabel]="homeLabel" [rootLink]="homeLink" />

        <div class="context-bar__game">
            @if (gameNav().length > 0) {
                <nav class="context-bar__nav" [attr.aria-label]="navLabel">
                    @for (link of gameNav(); track link.path) {
                        <a
                            class="context-bar__link"
                            [routerLink]="link.path"
                            routerLinkActive="context-bar__link--active"
                        >
                            {{ link.label }}
                        </a>
                    }
                </nav>
            }

            @if (gameSearch(); as search) {
                <form class="context-bar__search" (ngSubmit)="submit()">
                    <nb-form-field>
                        <nb-icon nbPrefix icon="search-outline"></nb-icon>
                        <input
                            nbInput
                            fieldSize="small"
                            type="search"
                            [placeholder]="search.label"
                            [attr.aria-label]="search.label"
                            [ngModel]="term()"
                            (ngModelChange)="term.set($event)"
                            [ngModelOptions]="{ standalone: true }"
                        />
                    </nb-form-field>
                </form>
            }
        </div>
    `,
    styles: `
        :host {
            --context-bar-gutter: 2.25rem;
            --gc-breadcrumb-padding: 0;

            position: sticky;
            top: 4.75rem;
            z-index: 1030;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin: calc(-1 * var(--context-bar-gutter)) calc(-1 * var(--context-bar-gutter)) 1.25rem;
            padding: 0.5rem var(--context-bar-gutter);
            background: var(--gc-surface-1, #0e1524);
            border-bottom: 1px solid rgb(255 255 255 / 6%);
        }

        :host(.context-bar--empty) {
            display: none;
        }

        .context-bar__game {
            display: flex;
            flex: 1 1 auto;
            align-items: center;
            justify-content: flex-end;
            gap: 1rem;
            min-width: 0;
        }

        .context-bar__nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .context-bar__link {
            padding: 0.3rem 0.7rem;
            border-radius: 999px;
            color: var(--text-hint-color);
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            white-space: nowrap;
        }

        .context-bar__link:hover,
        .context-bar__link:focus-visible {
            background: rgb(255 255 255 / 6%);
            color: var(--text-basic-color);
        }

        .context-bar__link--active {
            background: color-mix(in srgb, var(--gc-accent) 18%, transparent);
            color: var(--gc-accent);
        }

        .context-bar__search {
            flex: 0 1 22rem;
            min-width: 0;
        }

        .context-bar__search nb-form-field,
        .context-bar__search input {
            width: 100%;
        }

        @media (max-width: 991px) {
            :host {
                --context-bar-gutter: 1.5rem;
            }
        }

        @media (max-width: 767px) {
            :host {
                --context-bar-gutter: 1rem;

                flex-wrap: wrap;
            }

            .context-bar__game {
                flex-wrap: wrap;
                justify-content: flex-start;
                gap: 0.5rem;
            }

            .context-bar__search {
                flex-basis: 100%;
            }
        }
    `,
    host: {
        "[class.context-bar--empty]": "!hasTrail() && !gameSearch() && gameNav().length === 0",
    },
})
export class PlaygroundContextBarComponent {
    protected readonly homeLabel = $localize`:@@lol.playground.breadcrumb.home:Home`;
    protected readonly homeLink = LOL_GAME_URL;
    protected readonly navLabel = $localize`:@@lol.playground.nav.sections:Game sections`;
    protected readonly term = signal("");

    private readonly router = inject(Router);
    private readonly state = signal<ContextBarState>(this.read());

    protected readonly hasTrail = computed(() => this.state().hasTrail);
    protected readonly gameNav = computed(() => this.state().nav);
    protected readonly gameSearch = computed(() => this.state().search);

    public constructor() {
        const subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.state.set(this.read());
                this.syncTerm();
            }
        });

        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }

    protected submit(): void {
        const target = this.gameSearch();
        const term = this.term().trim();

        if (!target || !term) {
            return;
        }

        void this.router.navigate([target.path], { queryParams: { q: term } });
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
