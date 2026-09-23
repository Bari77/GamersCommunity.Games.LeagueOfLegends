import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

/** Playground stand-in for /users/login: mocks already sign the visitor in as Faker. */
@Component({
    standalone: true,
    selector: "lol-playground-session",
    imports: [RouterLink, NbButtonModule, NbCardModule],
    template: `
        <section class="playground-session gc-enter">
            <nb-card>
                <nb-card-header i18n="@@lol.playground.session.title">Playground session</nb-card-header>
                <nb-card-body>
                    <p i18n="@@lol.playground.session.body">
                        You are signed in as Faker#0001. The playground mocks Authentik instead of sending you to the
                        real login.
                    </p>
                </nb-card-body>
                <nb-card-footer>
                    <a nbButton status="primary" [routerLink]="gameUrl">
                        <span i18n="@@lol.playground.session.back">Back to the game</span>
                    </a>
                </nb-card-footer>
            </nb-card>
        </section>
    `,
    styles: `
        .playground-session {
            width: 100%;
            max-width: 36rem;
            margin: 1.5rem auto;
            padding: 0 1rem;
        }
    `,
})
export class PlaygroundSessionComponent {
    protected readonly gameUrl = LOL_GAME_URL;
}
