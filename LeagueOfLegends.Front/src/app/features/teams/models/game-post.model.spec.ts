import { GamePost } from "./game-post.model";

describe("GamePost", () => {
    it("maps pending ownership and contactability", () => {
        const post = GamePost.fromDto({
            publicId: "post-1",
            teamPublicId: "team-1",
            body: "scrim tonight",
            status: "pending",
            creationDate: "2026-10-12T00:00:00Z",
            authorPlayerPublicId: "player-1",
            authorPlatformUserPublicId: "user-1",
            authorNickname: "Ada",
            authorDiscriminator: "0001",
            authorAvatarUrl: "",
            moderationReason: null,
            moderatedAt: null,
        });

        expect(post.isPending()).toBeTrue();
        expect(post.isMine("player-1")).toBeTrue();
        expect(post.isContactable()).toBeTrue();
        expect(post.authorHandleLabel()).toBe("Ada#0001");
    });
});
