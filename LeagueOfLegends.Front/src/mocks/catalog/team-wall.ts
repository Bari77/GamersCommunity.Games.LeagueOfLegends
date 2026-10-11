import { GamePostDto } from "@features/teams/dto/game-post.dto";
import { TeamLinkDto } from "@features/teams/dto/team-link.dto";
import { mockUuid } from "./ids";
import { sheetByNickname } from "./players";
import {
    DAWNBREAK_TEAM_PUBLIC_ID,
    EMBERLANE_TEAM_PUBLIC_ID,
    FROSTBYTE_TEAM_PUBLIC_ID,
    IRON_CIRCUIT_TEAM_PUBLIC_ID,
    SILENT_WARD_TEAM_PUBLIC_ID,
    TEAM_PUBLIC_ID,
} from "./orgs";

function post(opts: {
    publicId: string;
    teamPublicId: string;
    author: string;
    body: string;
    hoursAgo: number;
}): GamePostDto {
    const author = sheetByNickname(opts.author);
    const at = new Date(Date.now() - opts.hoursAgo * 3600000).toISOString();
    return {
        publicId: opts.publicId,
        teamPublicId: opts.teamPublicId,
        body: opts.body,
        status: "approved",
        creationDate: at,
        authorPlayerPublicId: author.publicId,
        authorPlatformUserPublicId: author.platformUserPublicId,
        authorNickname: author.nickname,
        authorDiscriminator: author.discriminator,
        authorAvatarUrl: author.avatarUrl,
        moderationReason: null,
        moderatedAt: at,
    };
}

export const mockTeamPosts: GamePostDto[] = [
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-666666666666"),
        teamPublicId: TEAM_PUBLIC_ID,
        author: "Nyxara",
        body: "<p>Scrim tonight at 21:00 KST. Mid and jungle, be on time.</p>",
        hoursAgo: 1,
    }),
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-666666666667"),
        teamPublicId: IRON_CIRCUIT_TEAM_PUBLIC_ID,
        author: "Lirael",
        body: "<p>Clash signup closes Friday. Confirm availability in Discord.</p>",
        hoursAgo: 2,
    }),
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-666666666668"),
        teamPublicId: FROSTBYTE_TEAM_PUBLIC_ID,
        author: "Quill",
        body: "<p>VOD review Sunday — bring one clip of a lost fight.</p>",
        hoursAgo: 5,
    }),
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-666666666669"),
        teamPublicId: EMBERLANE_TEAM_PUBLIC_ID,
        author: "Bramble",
        body: "<p>Bot lane drills tonight. Supports bring engage options.</p>",
        hoursAgo: 8,
    }),
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-66666666666a"),
        teamPublicId: SILENT_WARD_TEAM_PUBLIC_ID,
        author: "Vesper",
        body: "<p>Tryout custom games Thursday. Top applicants ping me.</p>",
        hoursAgo: 12,
    }),
    post({
        publicId: mockUuid("lol:wall:66666666-6666-6666-6666-66666666666b"),
        teamPublicId: DAWNBREAK_TEAM_PUBLIC_ID,
        author: "Solenne",
        body: "<p>Social Clash lock-in tomorrow. No stress, just vibes.</p>",
        hoursAgo: 20,
    }),
];

export const mockTeamLinks: TeamLinkDto[] = [
    {
        publicId: mockUuid("lol:wall:77777777-7777-7777-7777-777777777777"),
        teamPublicId: TEAM_PUBLIC_ID,
        url: "https://discord.gg/nightveil-mock",
        label: "Nightveil Discord",
        icon: "discord",
        position: 0,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-888888888888"),
        teamPublicId: TEAM_PUBLIC_ID,
        url: "https://www.twitch.tv/nightveil",
        label: "Scrim VODs",
        icon: "twitch",
        position: 1,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-888888888889"),
        teamPublicId: IRON_CIRCUIT_TEAM_PUBLIC_ID,
        url: "https://discord.gg/ironcircuit-mock",
        label: "Iron Circuit Discord",
        icon: "discord",
        position: 0,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-88888888888a"),
        teamPublicId: FROSTBYTE_TEAM_PUBLIC_ID,
        url: "https://discord.gg/frostbyte-mock",
        label: "Frostbyte Discord",
        icon: "discord",
        position: 0,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-88888888888b"),
        teamPublicId: EMBERLANE_TEAM_PUBLIC_ID,
        url: "https://www.youtube.com/@emberlane",
        label: "Emberlane VODs",
        icon: "youtube",
        position: 0,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-88888888888c"),
        teamPublicId: SILENT_WARD_TEAM_PUBLIC_ID,
        url: "https://discord.gg/silentward-mock",
        label: "Silent Ward Discord",
        icon: "discord",
        position: 0,
    },
    {
        publicId: mockUuid("lol:wall:88888888-8888-8888-8888-88888888888d"),
        teamPublicId: DAWNBREAK_TEAM_PUBLIC_ID,
        url: "https://discord.gg/dawnbreak-mock",
        label: "Dawnbreak Discord",
        icon: "discord",
        position: 0,
    },
];
