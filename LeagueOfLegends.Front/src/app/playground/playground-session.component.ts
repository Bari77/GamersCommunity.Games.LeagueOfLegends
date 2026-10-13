import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule, NbSelectModule } from "@nebular/theme";
import { MOCK_PERSONAS, mockPortraitUrl, MockPersona } from "../../mocks/catalog/personas";
import { getSessionPersona, setSessionPersonaId } from "../../mocks/catalog/session";

/** Playground stand-in for /users/login: mocks sign the visitor in as the active catalog persona. */
@Component({
    standalone: true,
    selector: "lol-playground-session",
    imports: [RouterLink, FormsModule, NbButtonModule, NbCardModule, NbSelectModule],
    templateUrl: "./playground-session.component.html",
    styleUrl: "./playground-session.component.scss",
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
