import { Routes } from "@angular/router";
import { leagueOfLegendsRoutes } from "./league-of-legends.routes";

export const routes: Routes = [
  { path: "", children: leagueOfLegendsRoutes },
];
