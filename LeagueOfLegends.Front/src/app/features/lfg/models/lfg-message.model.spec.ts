import { LfgMessage } from "./lfg-message.model";

describe("LfgMessage", () => {
    it("labels team ads under the team handle", () => {
        const ad = LfgMessage.fromDto({
            publicId: "lfg-1",
            kind: "team",
            body: "looking for mid",
            senderNickname: "Ada",
            senderDiscriminator: "0001",
            creationDate: "2026-10-12T00:00:00Z",
            expiresAt: "2026-10-13T00:00:00Z",
            playerPublicId: "player-1",
            platformUserPublicId: "user-1",
            senderAvatarUrl: "",
            teamPublicId: "team-1",
            teamName: "Alpha",
            teamDiscriminator: "0001",
            teamTag: "ALP",
        });

        expect(ad.isTeamAd()).toBeTrue();
        expect(ad.handleLabel()).toBe("Alpha#0001");
        expect(ad.isMine("user-1")).toBeTrue();
        expect(ad.isMine("other")).toBeFalse();
        expect(ad.isMine(null, "player-1")).toBeTrue();
    });

    it("labels player ads under the sender handle", () => {
        const ad = LfgMessage.fromDto({
            publicId: "lfg-2",
            kind: "player",
            body: "lf team",
            senderNickname: "Ada",
            senderDiscriminator: "0001",
            creationDate: "2026-10-12T00:00:00Z",
            expiresAt: "2026-10-13T00:00:00Z",
            playerPublicId: "player-1",
            platformUserPublicId: "00000000-0000-0000-0000-000000000000",
            senderAvatarUrl: "",
        });

        expect(ad.isTeamAd()).toBeFalse();
        expect(ad.handleLabel()).toBe("Ada#0001");
        expect(ad.hasPlatformProfile()).toBeFalse();
    });
});
