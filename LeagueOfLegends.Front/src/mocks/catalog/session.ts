import {
    resolveActivePersona,
    setActivePersonaId as storeActivePersonaId,
    PlaygroundPersona,
} from "@bari77/gc-playground";
import { DEFAULT_PERSONA_ID, MOCK_PERSONAS, MockPersona } from "./personas";

/** Gateway API segment / playground session key for this front. */
export const LOL_MOCK_GAME_KEY = "leagueoflegends";

export function getSessionPersona(): MockPersona {
    return resolveActivePersona(LOL_MOCK_GAME_KEY, MOCK_PERSONAS, DEFAULT_PERSONA_ID);
}

export function setSessionPersonaId(personaId: string): void {
    storeActivePersonaId(LOL_MOCK_GAME_KEY, personaId);
}

export function sessionPersonaOptions(): readonly PlaygroundPersona[] {
    return MOCK_PERSONAS;
}
