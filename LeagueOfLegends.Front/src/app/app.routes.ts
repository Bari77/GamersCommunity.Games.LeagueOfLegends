import { Routes } from "@angular/router";
import { LOL_GAME_URL } from "./core/constants/game.constants";
import { leagueOfLegendsRoutes } from "./league-of-legends.routes";

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "league-of-legends" },
    {
        path: "league-of-legends",
        data: {
            breadcrumb: $localize`:@@lol.playground.breadcrumb.game:League of Legends`,
            gameNav: [
                {
                    path: `${LOL_GAME_URL}/sheet`,
                    label: $localize`:@@lol.playground.nav.sheet:My profile`,
                },
                {
                    path: `${LOL_GAME_URL}/teams`,
                    label: $localize`:@@lol.playground.nav.teams:Teams`,
                },
            ],
            gameSearch: {
                path: `${LOL_GAME_URL}/search`,
                label: $localize`:@@lol.playground.search:Search a player or a team`,
            },
        },
        children: leagueOfLegendsRoutes,
    },
    {
        path: "users/login",
        loadComponent: () =>
            import("./playground/playground-session.component").then((m) => m.PlaygroundSessionComponent),
    },
    {
        path: "users/:publicId",
        loadComponent: () =>
            import("./playground/playground-user-profile.component").then((m) => m.PlaygroundUserProfileComponent),
    },
];
