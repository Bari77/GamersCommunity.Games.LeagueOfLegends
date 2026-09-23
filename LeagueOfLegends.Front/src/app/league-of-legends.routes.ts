/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { provideGameRemoteKernel } from "@bari77/gc-sdk";
import { LOL_GAME_ID, LOL_GAME_URL } from "@core/constants/game.constants";
import { HomeFeedService } from "@features/home/services/home-feed.service";
import { LfgChatService, PostableTeamsService } from "@features/lfg/services/lfg-chat.service";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { PlayersService } from "@features/players/services/players.service";
import { GamePostsService } from "@features/teams/services/game-posts.service";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { TeamLinkService } from "@features/teams/services/team-link.service";
import { TeamsService } from "@features/teams/services/teams.service";
import { environment } from "../environments/environment";
import { HomeContainerComponent } from "./pages/home-container/home-container.component";

/**
 * Game services live on this remote injector (not providedIn: "root") so federation
 * into the Platform shell does not resolve them against the host root.
 * SDK kernel services come from provideGameRemoteKernel.
 */
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
  HomeFeedService,
  PlayersService,
  TeamsService,
  TeamLinkService,
  GamePostsService,
  TeamApplicationsService,
  LfgChatService,
  PostableTeamsService,
  LfgRealtimeService,
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
