import {
    TEAM_RANK_CAPTAIN,
    TEAM_RANK_COACH,
    TEAM_RANK_MANAGER,
    TEAM_RANK_PLAYER,
    TeamSheet,
    isPlayerSlotRank,
    teamRankWeight,
} from "./team.model";

describe("team ranks", () => {
    it("orders captain > manager > coach > player", () => {
        expect(teamRankWeight(TEAM_RANK_CAPTAIN)).toBeGreaterThan(teamRankWeight(TEAM_RANK_MANAGER));
        expect(teamRankWeight(TEAM_RANK_MANAGER)).toBeGreaterThan(teamRankWeight(TEAM_RANK_COACH));
        expect(teamRankWeight(TEAM_RANK_COACH)).toBeGreaterThan(teamRankWeight(TEAM_RANK_PLAYER));
        expect(teamRankWeight(null)).toBe(0);
    });

    it("treats captain and player as playable seats", () => {
        expect(isPlayerSlotRank(TEAM_RANK_CAPTAIN)).toBeTrue();
        expect(isPlayerSlotRank(TEAM_RANK_PLAYER)).toBeTrue();
        expect(isPlayerSlotRank(TEAM_RANK_COACH)).toBeFalse();
    });
});

describe("TeamSheet permissions", () => {
    function sheet(viewerRank: string | null): TeamSheet {
        return TeamSheet.fromDto({
            publicId: "team-1",
            entitled: "Alpha",
            discriminator: "0001",
            creationDate: "2026-10-12T00:00:00Z",
            memberCount: 0,
            playerSlotCount: 5,
            members: [],
            viewerRank,
        });
    }

    it("derives membership and moderation from viewer rank", () => {
        expect(sheet(null).isMember()).toBeFalse();
        expect(sheet(TEAM_RANK_PLAYER).isMember()).toBeTrue();
        expect(sheet(TEAM_RANK_PLAYER).canModerate()).toBeFalse();
        expect(sheet(TEAM_RANK_COACH).canModerate()).toBeTrue();
        expect(sheet(TEAM_RANK_MANAGER).canEditSheet()).toBeTrue();
        expect(sheet(TEAM_RANK_COACH).canEditSheet()).toBeFalse();
        expect(sheet(TEAM_RANK_CAPTAIN).isCaptain()).toBeTrue();
    });
});
