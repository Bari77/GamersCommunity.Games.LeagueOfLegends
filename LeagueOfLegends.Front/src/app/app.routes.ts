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
            ],
        },
        children: leagueOfLegendsRoutes,
    },
];
