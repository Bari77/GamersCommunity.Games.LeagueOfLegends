import { Route } from "@angular/router";
import { leagueOfLegendsRoutes } from "./league-of-legends.routes";

describe("leagueOfLegendsRoutes", () => {
    const children = leagueOfLegendsRoutes[0]?.children ?? [];

    function child(path: string): Route | undefined {
        return children.find((entry) => entry.path === path);
    }

    it("mounts the remote kernel on the game root", () => {
        expect(leagueOfLegendsRoutes[0]?.providers?.length).toBeGreaterThan(0);
        expect(child("")?.component).toBeTruthy();
    });

    it("keeps the sheet and search entry points, and folds the team directory into search", () => {
        expect(child("sheet")?.loadComponent).toBeTruthy();
        expect(child("players/:publicId")?.loadComponent).toBeTruthy();
        expect(child("search")?.loadComponent).toBeTruthy();
        expect(child("teams")?.redirectTo).toBeTruthy();
        expect(child("teams")?.pathMatch).toBe("full");
        expect(child("teams/:publicId")?.loadComponent).toBeTruthy();
    });
});
