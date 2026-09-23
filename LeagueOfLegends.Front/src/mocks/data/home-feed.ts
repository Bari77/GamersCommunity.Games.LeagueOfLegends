import { HomeFeedDto, PlayerSummaryDto } from "@features/home/dto/home-feed.dto";
import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID, mockPlayerSheet } from "./players";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const tomorrow = () => new Date(Date.now() + 86400000).toISOString();

export const mockLfgMessages: LfgMessageDto[] = [
    {
        publicId: "41111111-1111-1111-1111-111111111111",
        kind: "player",
        body: "ADC looking for a support, ranked Flex tonight.",
        senderNickname: "Faker",
        senderDiscriminator: "0001",
        creationDate: hoursAgo(2),
        expiresAt: tomorrow(),
        playerPublicId: PLAYER_PUBLIC_ID,
        platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
        senderAvatarUrl: "",
        regionCode: "kr",
        laneCode: "mid",
    },
    {
        publicId: "41111111-1111-1111-1111-111111111112",
        kind: "player",
        body: "Jungle main LF duo mid, Emerald+.",
        senderNickname: "Canyon",
        senderDiscriminator: "0412",
        creationDate: hoursAgo(1),
        expiresAt: tomorrow(),
        playerPublicId: "33333333-3333-3333-3333-333333333334",
        platformUserPublicId: "11111111-1111-1111-1111-111111111112",
        senderAvatarUrl: "",
        regionCode: "kr",
        laneCode: "jungle",
    },
    {
        publicId: "41111111-1111-1111-1111-111111111113",
        kind: "player",
        body: "Support looking for a bot duo, EUW.",
        senderNickname: "Keria",
        senderDiscriminator: "0808",
        creationDate: hoursAgo(0.4),
        expiresAt: tomorrow(),
        playerPublicId: "33333333-3333-3333-3333-333333333335",
        platformUserPublicId: "11111111-1111-1111-1111-111111111113",
        senderAvatarUrl: "",
        regionCode: "euw",
        laneCode: "support",
    },
];

export const mockLatestPlayers: PlayerSummaryDto[] = [
    {
        publicId: mockPlayerSheet.publicId,
        platformUserPublicId: mockPlayerSheet.platformUserPublicId,
        nickname: mockPlayerSheet.nickname,
        discriminator: mockPlayerSheet.discriminator,
        avatarUrl: mockPlayerSheet.avatarUrl,
        presentationIrl: mockPlayerSheet.presentationIrl,
        gameName: mockPlayerSheet.gameName,
        tagLine: mockPlayerSheet.tagLine,
        regionCode: mockPlayerSheet.region?.code ?? null,
        primaryLaneCode: mockPlayerSheet.primaryLane?.code ?? null,
        creationDate: mockPlayerSheet.creationDate,
    },
];

export const mockHomeFeed: HomeFeedDto = {
    latestLfg: mockLfgMessages,
    latestPlayers: mockLatestPlayers,
};
