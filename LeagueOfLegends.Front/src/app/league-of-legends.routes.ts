import { Routes } from "@angular/router";
import { HomeContainerComponent } from "./pages/home-container/home-container.component";

export const leagueOfLegendsRoutes: Routes = [
  { path: "", component: HomeContainerComponent },
  {
    path: "sheet",
    loadComponent: () =>
      import("./features/players/pages/player-sheet/player-sheet.component").then(
        (m) => m.PlayerSheetComponent,
      ),
  },
];
