import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { environment } from "../../environments/environment";
import { mockPlayerSheet, PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID } from "../../mocks/data/players";

/** Stand-in for the Platform community profile while the game runs on its own playground. */
@Component({
    standalone: true,
    selector: "lol-playground-user-profile",
    imports: [RouterLink, NbButtonModule, NbCardModule],
    template: `
        <section class="playground-user gc-enter">
            <nb-card>
                <nb-card-header i18n="@@lol.playground.user.title">Community profile</nb-card-header>
                <nb-card-body class="playground-user__body">
                    <img class="playground-user__avatar" [src]="avatarUrl()" [alt]="handle()" />
                    <div>
                        <h1 class="playground-user__handle gc-display">{{ handle() }}</h1>
                        <p class="playground-user__hint" i18n="@@lol.playground.user.hint">
                            In production this page lives on the Platform. The playground only stubs it so game links
                            keep working.
                        </p>
                    </div>
                </nb-card-body>
                @if (playerPublicId(); as playerId) {
                    <nb-card-footer>
                        <a nbButton status="primary" [routerLink]="[gameUrl, 'players', playerId]">
                            <span i18n="@@lol.playground.user.sheet">Open the game sheet</span>
                        </a>
                    </nb-card-footer>
                }
            </nb-card>
        </section>
    `,
    styles: `
        .playground-user {
            width: 100%;
            max-width: 40rem;
            margin: 1.5rem auto;
            padding: 0 1rem;
        }

        .playground-user__body {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .playground-user__avatar {
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 999px;
            object-fit: cover;
        }

        .playground-user__handle {
            margin: 0;
            font-size: 1.4rem;
        }

        .playground-user__hint {
            margin: 0.35rem 0 0;
            font-size: 0.85rem;
            opacity: 0.7;
        }
    `,
})
export class PlaygroundUserProfileComponent {
    public readonly publicId = input.required<string>();

    protected readonly gameUrl = LOL_GAME_URL;

    protected readonly isSelf = computed(() => this.publicId() === PLATFORM_USER_PUBLIC_ID);

    protected readonly handle = computed(() =>
        this.isSelf()
            ? `${mockPlayerSheet.nickname}#${mockPlayerSheet.discriminator}`
            : this.publicId(),
    );

    protected readonly avatarUrl = computed(() =>
        this.isSelf() && mockPlayerSheet.avatarUrl
            ? mockPlayerSheet.avatarUrl
            : `${environment.assetsBaseUrl}/Avatars/1.png`,
    );

    protected readonly playerPublicId = computed(() => (this.isSelf() ? PLAYER_PUBLIC_ID : null));
}
