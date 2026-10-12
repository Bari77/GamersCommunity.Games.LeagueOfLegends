import { leagueOfLegendsRoutes } from "./league-of-legends.routes";

describe("leagueOfLegendsRoutes", () => {
    const children = leagueOfLegendsRoutes[0]?.children ?? [];

    function child(path: string) {
        return children.find((entry) => entry.path === path);
    }

    it("mounts the remote kernel on the game root", () => {
        expect(leagueOfLegendsRoutes[0]?.providers?.length).toBeGreaterThan(0);
        expect(child("")?.component).toBeTruthy();
    });

    it("keeps the sheet, directory, and search entry points", () => {
        expect(child("sheet")?.loadComponent).toBeTruthy();
        expect(child("players/:publicId")?.loadComponent).toBeTruthy();
        expect(child("search")?.loadComponent).toBeTruthy();
        expect(child("teams")?.loadComponent).toBeTruthy();
        expect(child("teams/:publicId")?.loadComponent).toBeTruthy();
    });
});
