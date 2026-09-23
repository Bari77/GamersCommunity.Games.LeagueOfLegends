import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { PLAYGROUND_BANNER } from "@bari77/gc-playground";
import { SkeletonComponent } from "@bari77/gc-ui";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { NbLayoutModule } from "@nebular/theme";
import { environment } from "../environments/environment";
import { PlaygroundContextBarComponent } from "./playground/playground-context-bar.component";

@Component({
    selector: "lol-root",
    standalone: true,
    imports: [RouterOutlet, RouterLink, NbLayoutModule, SkeletonComponent, PlaygroundContextBarComponent],
    template: `
        <nb-layout>
            <nb-layout-header fixed>
                <div class="playground-header">
                    @if (showBanner) {
                        <span class="playground-banner gc-display">{{ banner }}</span>
                    } @else {
                        <span class="playground-banner gc-display" i18n="@@lol.playground.banner">League of Legends</span>
                    }

                    @if (membership.loading() && !membership.session()) {
                        <div class="playground-session playground-session--loading" aria-busy="true">
                            <gc-skeleton width="7.5rem" height="1.15rem" />
                            <gc-skeleton width="2.5rem" height="2.5rem" shape="circle" />
                        </div>
                    } @else if (membership.session(); as session) {
                        <a class="playground-session" [routerLink]="['/users', session.publicId]">
                            <span class="playground-session__handle">
                                {{ session.nickname }}#{{ session.discriminator }}
                            </span>
                            @if (session.avatarUrl) {
                                <img
                                    class="playground-session__avatar"
                                    [src]="session.avatarUrl"
                                    [alt]="session.nickname"
                                />
                            } @else {
                                <span class="playground-session__avatar playground-session__avatar--fallback">
                                    {{ session.nickname.charAt(0) }}
                                </span>
                            }
                        </a>
                    }
                </div>
            </nb-layout-header>
            <nb-layout-column>
                <lol-playground-context-bar />
                <router-outlet />
            </nb-layout-column>
        </nb-layout>
    `,
    styles: `
        .playground-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            width: 100%;
        }

        .playground-banner {
            font-size: 0.8rem;
            font-weight: 600;
            line-height: 1.2;
        }

        .playground-session {
            display: inline-flex;
            align-items: center;
            gap: 0.65rem;
            color: inherit;
            text-decoration: none;
        }

        .playground-session--loading {
            pointer-events: none;
        }

        .playground-session__handle {
            font-size: 0.9rem;
            font-weight: 600;
        }

        .playground-session__avatar {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgb(255 255 255 / 16%);
        }

        .playground-session__avatar--fallback {
            display: grid;
            place-items: center;
            background: rgb(255 255 255 / 10%);
            font-size: 0.85rem;
            font-weight: 700;
        }
    `,
})
export class App {
    protected readonly showBanner = environment.useMocks === true;
    protected readonly banner = PLAYGROUND_BANNER;
    protected readonly membership = inject(GameMembershipStore);
}
