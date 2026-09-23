import { GamePostDto } from "@features/teams/dto/game-post.dto";
import { TeamLinkDto } from "@features/teams/dto/team-link.dto";
import { PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID, mockPlayerSheet } from "./players";
import { TEAM_PUBLIC_ID } from "./teams";

export const mockTeamPosts: GamePostDto[] = [
    {
        publicId: "66666666-6666-6666-6666-666666666666",
        teamPublicId: TEAM_PUBLIC_ID,
        body: "<p>Scrim tonight at 21:00. Mid and support, be on time.</p>",
        status: "approved",
        creationDate: new Date(Date.now() - 3600000).toISOString(),
        authorPlayerPublicId: PLAYER_PUBLIC_ID,
        authorPlatformUserPublicId: PLATFORM_USER_PUBLIC_ID,
        authorNickname: mockPlayerSheet.nickname,
        authorDiscriminator: mockPlayerSheet.discriminator,
        authorAvatarUrl: mockPlayerSheet.avatarUrl,
        moderationReason: null,
        moderatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

export const mockTeamLinks: TeamLinkDto[] = [
    {
        publicId: "77777777-7777-7777-7777-777777777777",
        teamPublicId: TEAM_PUBLIC_ID,
        url: "https://discord.gg/t1",
        label: "Team Discord",
        icon: "discord",
        position: 0,
    },
    {
        publicId: "88888888-8888-8888-8888-888888888888",
        teamPublicId: TEAM_PUBLIC_ID,
        url: "https://www.twitch.tv/t1",
        label: "Twitch",
        icon: "twitch",
        position: 1,
    },
];
