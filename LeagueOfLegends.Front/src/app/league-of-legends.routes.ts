/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import {
  GameMembershipStore,
  PlatformGamesService,
  PlatformSessionService,
  provideGameRemoteKernel,
} from "@bari77/gc-sdk";
import { LOL_GAME_ID, LOL_GAME_URL } from "@core/constants/game.constants";
import { HomeFeedService } from "@features/home/services/home-feed.service";
import { LfgChatService, PostableTeamsService } from "@features/lfg/services/lfg-chat.service";
import { PlayerMediaService } from "@features/media/services/player-media.service";
import { PlayersService } from "@features/players/services/players.service";
import { GamePostsService } from "@features/teams/services/game-posts.service";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { TeamLinkService } from "@features/teams/services/team-link.service";
import { TeamsService } from "@features/teams/services/teams.service";
import { environment } from "../environments/environment";
import { HomeContainerComponent } from "./pages/home-container/home-container.component";

/**
 * Federation loads these routes into the Platform shell without the remote `app.config`.
 * `providedIn: "root"` would hit the host root (no GC_ENVIRONMENT) — shadow those services here.
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
  PlatformSessionService,
  PlatformGamesService,
  GameMembershipStore,
  HomeFeedService,
  PlayersService,
  TeamsService,
  TeamLinkService,
  GamePostsService,
  TeamApplicationsService,
  LfgChatService,
  PostableTeamsService,
  PlayerMediaService,
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
