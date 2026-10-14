/// <reference types="@angular/localize" />

import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    PlaygroundPersonaCard,
    PlaygroundPersonaPickerComponent,
    PlaygroundPersonaPickerLabels,
} from "@bari77/gc-playground/components";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { personaCard } from "../../mocks/catalog/persona-preview";
import { MOCK_PERSONAS } from "../../mocks/catalog/personas";
import { getSessionPersona, setSessionPersonaId } from "../../mocks/catalog/session";

/** Playground stand-in for /users/login: mocks sign the visitor in as the active catalog persona. */
@Component({
    standalone: true,
    selector: "lol-playground-session",
    imports: [PlaygroundPersonaPickerComponent],
    templateUrl: "./playground-session.component.html",
})
export class PlaygroundSessionComponent {
    /** Profile embed drops the standalone page chrome so the persona picker stays in the card. */
    protected readonly embedded = !inject(Router).url.split(/[?#]/)[0].endsWith("/users/login");

    protected readonly gameUrl = LOL_GAME_URL;
    protected readonly activeId = getSessionPersona().id;
    protected readonly personas: PlaygroundPersonaCard[] = MOCK_PERSONAS.map(personaCard);
    protected readonly labels: Partial<PlaygroundPersonaPickerLabels> = {
        searchPlaceholder: $localize`:@@lol.playground.session.findPlaceholder:Name, team, rank, champion…`,
    };

    protected onPick(personaId: string): void {
        setSessionPersonaId(personaId);
        const next = MOCK_PERSONAS.find((persona) => persona.id === personaId);
        if (this.embedded && next) {
            location.assign(`/users/${next.platformUserPublicId}`);
            return;
        }
        location.reload();
    }
}
