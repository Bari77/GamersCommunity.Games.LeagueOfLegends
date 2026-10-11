import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule, NbSelectModule } from "@nebular/theme";
import { MOCK_PERSONAS, mockPortraitUrl, type MockPersona } from "../../mocks/catalog/personas";
import { getSessionPersona, setSessionPersonaId } from "../../mocks/catalog/session";

/** Playground stand-in for /users/login: mocks sign the visitor in as the active catalog persona. */
@Component({
    standalone: true,
    selector: "lol-playground-session",
    imports: [RouterLink, FormsModule, NbButtonModule, NbCardModule, NbSelectModule],
    template: `
        <section class="playground-session gc-enter">
            <nb-card>
                <nb-card-header i18n="@@lol.playground.session.title">Playground session</nb-card-header>
                <nb-card-body>
                    <p i18n="@@lol.playground.session.body">
                        Choose which mock persona Authentik signs you in as. The page reloads so MSW handlers pick up
                        the new session.
                    </p>
                    <label class="playground-session__label" i18n="@@lol.playground.session.persona">Active persona</label>
                    <nb-select
                        class="playground-session__select"
                        [selected]="selectedId"
                        (selectedChange)="onPersonaChange($event)"
                    >
                        @for (persona of personas; track persona.id) {
                            <nb-option [value]="persona.id">
                                <span class="playground-session__option">
                                    <img [src]="portraitUrl(persona)" [alt]="persona.nickname" />
                                    {{ persona.nickname }}#{{ persona.discriminator }}
                                </span>
                            </nb-option>
                        }
                    </nb-select>
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

        .playground-session__label {
            display: block;
            margin: 1rem 0 0.35rem;
            font-size: 0.85rem;
            opacity: 0.75;
        }

        .playground-session__select {
            width: 100%;
        }

        .playground-session__option {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .playground-session__option img {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 999px;
            object-fit: cover;
        }
    `,
})
export class PlaygroundSessionComponent {
    protected readonly gameUrl = LOL_GAME_URL;
    protected readonly personas = MOCK_PERSONAS;
    protected readonly selectedId = getSessionPersona().id;

    protected portraitUrl(persona: MockPersona): string {
        return mockPortraitUrl(persona.nickname);
    }

    protected onPersonaChange(personaId: string): void {
        if (!personaId || personaId === this.selectedId) {
            return;
        }
        setSessionPersonaId(personaId);
        location.reload();
    }
}
