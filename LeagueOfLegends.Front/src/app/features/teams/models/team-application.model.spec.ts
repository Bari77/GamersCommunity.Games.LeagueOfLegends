import { TeamApplication } from "./team-application.model";

describe("TeamApplication", () => {
    it("maps pending status and player-sheet presence", () => {
        const pending = TeamApplication.fromDto({
            publicId: "app-1",
            message: "hi",
            status: "pending",
            soughtRank: "player",
            laneCode: "mid",
            creationDate: "2026-10-12T00:00:00Z",
            reviewedAt: null,
            teamPublicId: "team-1",
            teamName: "Alpha",
            teamDiscriminator: "0001",
            playerPublicId: "player-1",
            platformUserPublicId: "user-1",
            nickname: "Ada",
            discriminator: "0001",
            avatarUrl: "",
        });

        expect(pending.isPending()).toBeTrue();
        expect(pending.hasPlayerSheet()).toBeTrue();
        expect(pending.teamHandleLabel()).toBe("Alpha#0001");
        expect(pending.playerHandleLabel()).toBe("Ada#0001");
    });

    it("rejects empty player sheet guids", () => {
        const orphan = TeamApplication.fromDto({
            publicId: "app-2",
            message: "",
            status: "accepted",
            soughtRank: "player",
            laneCode: null,
            creationDate: "2026-10-12T00:00:00Z",
            reviewedAt: "2026-10-12T01:00:00Z",
            teamPublicId: "team-1",
            teamName: "Alpha",
            teamDiscriminator: "0001",
            playerPublicId: "00000000-0000-0000-0000-000000000000",
            platformUserPublicId: "user-1",
            nickname: "Ada",
            discriminator: "0001",
            avatarUrl: "",
        });

        expect(orphan.isPending()).toBeFalse();
        expect(orphan.hasPlayerSheet()).toBeFalse();
    });
});
