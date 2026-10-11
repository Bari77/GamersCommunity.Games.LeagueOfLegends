import { mockUuid } from "./ids";
import { HomeFeedDto, PlayerSummaryDto } from "@features/home/dto/home-feed.dto";
import { LfgMessageDto } from "@features/lfg/dto/lfg-message.dto";
import { TeamSummaryDto } from "@features/teams/dto/team.dto";
import { allPlayerSheets, lfgSenderFields, toPlayerSummary } from "./players";
import {
    mockDawnbreakSheet,
    mockEmberlaneSheet,
    mockFrostbyteSheet,
    mockIronCircuitSheet,
    mockSilentWardSheet,
    mockTeamSheet,
    mockTeamSummaries,
} from "./orgs";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const tomorrow = () => new Date(Date.now() + 86400000).toISOString();
const FEED_TAKE = 5;

function playerAd(opts: {
    publicId: string;
    who: string;
    body: string;
    hoursAgo: number;
    laneCode?: string | null;
}): LfgMessageDto {
    const sender = lfgSenderFields(opts.who);
    return {
        publicId: opts.publicId,
        kind: "player",
        body: opts.body,
        creationDate: hoursAgo(opts.hoursAgo),
        expiresAt: tomorrow(),
        senderAvatarUrl: sender.senderAvatarUrl,
        senderNickname: sender.senderNickname,
        senderDiscriminator: sender.senderDiscriminator,
        playerPublicId: sender.playerPublicId,
        platformUserPublicId: sender.platformUserPublicId,
        regionCode: sender.regionCode,
        laneCode: opts.laneCode ?? sender.laneCode,
    };
}

function teamAd(opts: {
    publicId: string;
    who: string;
    body: string;
    hoursAgo: number;
    laneCode: string;
    team: typeof mockTeamSheet;
}): LfgMessageDto {
    const sender = lfgSenderFields(opts.who);
    return {
        publicId: opts.publicId,
        kind: "team",
        body: opts.body,
        creationDate: hoursAgo(opts.hoursAgo),
        expiresAt: tomorrow(),
        senderAvatarUrl: sender.senderAvatarUrl,
        senderNickname: sender.senderNickname,
        senderDiscriminator: sender.senderDiscriminator,
        playerPublicId: sender.playerPublicId,
        platformUserPublicId: sender.platformUserPublicId,
        regionCode: opts.team.regionCode,
        laneCode: opts.laneCode,
        teamPublicId: opts.team.publicId,
        teamName: opts.team.entitled,
        teamDiscriminator: opts.team.discriminator,
        teamTag: opts.team.tag,
    };
}

export const mockLfgMessages: LfgMessageDto[] = [
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111111"),
        who: "Nyxara",
        body: "Mid looking for a jungle duo — ranked Flex tonight after 21:00 KST.",
        hoursAgo: 2,
        laneCode: "mid",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111112"),
        who: "Vexthorn",
        body: "Jungle main LF duo mid, Emerald+. Pathing-focused, voice preferred.",
        hoursAgo: 1,
        laneCode: "jungle",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111113"),
        who: "Lirael",
        body: "Support looking for a bot duo on EUW. Engage or enchanter, your call.",
        hoursAgo: 0.4,
        laneCode: "support",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111115"),
        who: "Soryn",
        body: "ADC free for Clash practice. Need a sticky support who tracks timers.",
        hoursAgo: 0.6,
        laneCode: "bottom",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111116"),
        who: "Quill",
        body: "NA jungler online for a few hours — Flex or norms, shotcalling OK.",
        hoursAgo: 3.2,
        laneCode: "jungle",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111118"),
        who: "Hexar",
        body: "NA mid LF duo jungle. Assassin drafts preferred.",
        hoursAgo: 5,
        laneCode: "mid",
    }),
    playerAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111119"),
        who: "Corvin",
        body: "ADC looking for a permanent duo support on NA.",
        hoursAgo: 6.5,
        laneCode: "bottom",
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111114"),
        who: "Lirael",
        body: "Iron Circuit looking for a top sub, Emerald+, scrims Tue/Thu.",
        hoursAgo: 0.8,
        laneCode: "top",
        team: mockIronCircuitSheet,
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-111111111117"),
        who: "Nyxara",
        body: "Nightveil recruiting a jungle sub for KR evening ranked blocks.",
        hoursAgo: 4,
        laneCode: "jungle",
        team: mockTeamSheet,
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-11111111111a"),
        who: "Quill",
        body: "Frostbyte (NA) open for a second coach / analyst on weekend Clash.",
        hoursAgo: 7,
        laneCode: "jungle",
        team: mockFrostbyteSheet,
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-11111111111b"),
        who: "Bramble",
        body: "Emberlane wants a mid sub for EUW Clash — Emerald+.",
        hoursAgo: 8.5,
        laneCode: "mid",
        team: mockEmberlaneSheet,
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-11111111111c"),
        who: "Vesper",
        body: "Silent Ward (KR) tryouts for a top sub this week.",
        hoursAgo: 9,
        laneCode: "top",
        team: mockSilentWardSheet,
    }),
    teamAd({
        publicId: mockUuid("lol:feed:41111111-1111-1111-1111-11111111111d"),
        who: "Solenne",
        body: "Dawnbreak (EUNE) recruiting a manager for social Clash nights.",
        hoursAgo: 10,
        laneCode: "support",
        team: mockDawnbreakSheet,
    }),
];

export const mockLatestPlayers: PlayerSummaryDto[] = [...allPlayerSheets()]
    .sort((left, right) => right.creationDate.localeCompare(left.creationDate))
    .slice(0, FEED_TAKE)
    .map(toPlayerSummary);

export const mockLatestTeams: TeamSummaryDto[] = [...mockTeamSummaries]
    .sort((left, right) => right.creationDate.localeCompare(left.creationDate))
    .slice(0, FEED_TAKE);

export const mockHomeFeed: HomeFeedDto = {
    latestLfg: mockLfgMessages,
    latestPlayers: mockLatestPlayers,
    latestTeams: mockLatestTeams,
};
