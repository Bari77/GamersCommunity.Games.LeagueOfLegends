/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { LOL_GAME_ID, LOL_GAME_URL } from "@core/constants/game.constants";
import { PlayersService } from "@features/players/services/players.service";
import { environment } from "../environments/environment";
import { HomeContainerComponent } from "./pages/home-container/home-container.component";

/** Kernel for the whole remote tree (standalone playground and Platform federation). */
const lolRemoteProviders = [
  provideGameRemoteKernel({
    environment: {
      apiUrl: environment.apiUrl,
      assetsBaseUrl: environment.assetsBaseUrl,
    },
    membership: {
      gameId: LOL_GAME_ID,
      gameUrl: LOL_GAME_URL,
      apiSegment: "leagueoflegends",
    },
    playerSheetApi: PlayersService,
  }),
];

export const leagueOfLegendsRoutes: Routes = [
  {
    path: "",
    providers: lolRemoteProviders,
    children: [
      { path: "", component: HomeContainerComponent },
      {
        path: "sheet",
        loadComponent: () =>
          import("./features/players/pages/my-sheet/my-sheet.component").then((m) => m.MySheetComponent),
      },
      {
        path: "players/:publicId",
        data: { breadcrumb: $localize`:@@lol.breadcrumb.player:Player` },
        loadComponent: () =>
          import("./features/players/pages/player-sheet/player-sheet.component").then(
            (m) => m.PlayerSheetComponent,
          ),
      },
      {
        path: "lfg",
        data: { breadcrumb: $localize`:@@lol.breadcrumb.lfg:LFG` },
        loadComponent: () =>
          import("./features/lfg/pages/lfg-board/lfg-board.component").then((m) => m.LfgBoardComponent),
      },
      {
        path: "search",
        data: { breadcrumb: $localize`:@@lol.breadcrumb.search:Search` },
        loadComponent: () =>
          import("./features/search/pages/global-search/global-search.component").then(
            (m) => m.GlobalSearchComponent,
          ),
      },
      {
        path: "teams",
        data: { breadcrumb: $localize`:@@lol.breadcrumb.teams:Teams` },
        loadComponent: () =>
          import("./features/teams/pages/team-directory/team-directory.component").then(
            (m) => m.TeamDirectoryComponent,
          ),
      },
      {
        path: "teams/:publicId",
        data: { breadcrumb: $localize`:@@lol.breadcrumb.team:Team` },
        loadComponent: () =>
          import("./features/teams/pages/team-sheet/team-sheet.component").then(
            (m) => m.TeamSheetComponent,
          ),
      },
    ],
  },
];
