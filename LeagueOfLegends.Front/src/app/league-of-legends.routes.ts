/// <reference types="@angular/localize" />

import { Routes } from "@angular/router";
import { HomeContainerComponent } from "./pages/home-container/home-container.component";

export const leagueOfLegendsRoutes: Routes = [
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
];
