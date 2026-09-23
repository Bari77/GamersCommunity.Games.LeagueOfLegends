import { PlayerOptionsDto } from "@features/players/dto/player.dto";

export const mockPlayerOptions: PlayerOptionsDto = {
    lanes: [
        { id: 1, code: "top" },
        { id: 2, code: "jungle" },
        { id: 3, code: "mid" },
        { id: 4, code: "bottom" },
        { id: 5, code: "support" },
    ],
    regions: [
        { id: 1, code: "euw" },
        { id: 2, code: "eune" },
        { id: 3, code: "na" },
        { id: 4, code: "kr" },
    ],
    champions: [
        { id: 2, code: "ahri" },
        { id: 36, code: "kaisa" },
        { id: 45, code: "leesin" },
        { id: 71, code: "thresh" },
        { id: 82, code: "yasuo" },
        { id: 85, code: "zed" },
    ],
    championKinds: [
        { id: 1, code: "main" },
        { id: 2, code: "pool" },
        { id: 3, code: "learning" },
    ],
    tiers: [
        { id: 1, code: "iron" },
        { id: 2, code: "bronze" },
        { id: 3, code: "silver" },
        { id: 4, code: "gold" },
        { id: 5, code: "platinum" },
        { id: 6, code: "emerald" },
        { id: 7, code: "diamond" },
        { id: 8, code: "master" },
        { id: 9, code: "grandmaster" },
        { id: 10, code: "challenger" },
    ],
    divisions: [
        { id: 4, code: "4" },
        { id: 3, code: "3" },
        { id: 2, code: "2" },
        { id: 1, code: "1" },
    ],
};
