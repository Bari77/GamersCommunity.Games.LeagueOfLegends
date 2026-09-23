import { PlayerSheetDto } from "@features/players/dto/player.dto";
import { environment } from "../../environments/environment";

export const PLATFORM_USER_PUBLIC_ID = "11111111-1111-1111-1111-111111111111";
export const PLAYER_PUBLIC_ID = "33333333-3333-3333-3333-333333333333";

export const mockPlayerSheet: PlayerSheetDto = {
    publicId: PLAYER_PUBLIC_ID,
    platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
    nickname: "Faker",
    discriminator: "0001",
    avatarUrl: `${environment.assetsBaseUrl}/Avatars/3.png`,
    presentationIrl: null,
    presentationIg: null,
    creationDate: new Date().toISOString(),
    layoutJson: null,
    gameName: "Hide on bush",
    tagLine: "KR1",
    region: { id: 4, code: "kr" },
    primaryLane: { id: 3, code: "mid" },
    secondaryLanes: [
        { id: 2, code: "jungle" },
        { id: 5, code: "support" },
    ],
    solo: { tier: "challenger", division: null, lp: 1247 },
    flex: { tier: "diamond", division: "1", lp: 42 },
    champions: [
        { id: 2, code: "ahri", kind: "main", lane: "mid" },
        { id: 85, code: "zed", kind: "pool", lane: "mid" },
        { id: 82, code: "yasuo", kind: "pool", lane: "mid" },
        { id: 7, code: "leblanc", kind: "learning", lane: "mid" },
        { id: 45, code: "leesin", kind: "learning", lane: "mid" },
        { id: 36, code: "kaisa", kind: "pool", lane: "bottom" },
    ],
};
