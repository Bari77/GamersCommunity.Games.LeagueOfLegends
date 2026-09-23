import { PlayerSheetDto } from "@features/players/dto/player.dto";

export const PLATFORM_USER_PUBLIC_ID = "11111111-1111-1111-1111-111111111111";
export const PLAYER_PUBLIC_ID = "33333333-3333-3333-3333-333333333333";

export const mockPlayerSheet: PlayerSheetDto = {
    publicId: PLAYER_PUBLIC_ID,
    platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
    nickname: "Faker",
    discriminator: "0001",
    avatarUrl: "",
    presentationIrl: null,
    presentationIg: null,
    creationDate: new Date().toISOString(),
    layoutJson: null,
};
