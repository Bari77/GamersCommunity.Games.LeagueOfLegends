import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { LOL_GAME_ID, LOL_GAME_URL } from "@core/constants/game.constants";
import { PlayersService } from "@features/players/services/players.service";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";
import { providePlaygroundUi } from "./playground/provide-playground-ui";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideGameRemoteKernel({
      environment: {
        apiUrl: environment.apiUrl,
        assetsBaseUrl: environment.assetsBaseUrl,
      },
      membership: { gameId: LOL_GAME_ID, gameUrl: LOL_GAME_URL },
      playerSheetApi: PlayersService,
    }),
    providePlaygroundUi("cosmic"),
  ],
};
