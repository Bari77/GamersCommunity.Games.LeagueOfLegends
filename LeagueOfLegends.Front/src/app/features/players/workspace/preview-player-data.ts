import { GcGalleryItem, GcLink } from "@bari77/gc-widgets";
import { PlayerTeam } from "@features/teams/models/player-team.model";
import { mockPlayerPictures, mockPlayerStreams, mockPlayerVideos } from "../../../../mocks/catalog/media";
import { mockTeamSheet, TEAM_PUBLIC_ID } from "../../../../mocks/catalog/orgs";
import { PLAYER_PUBLIC_ID } from "../../../../mocks/catalog/players";

function mediaToGallery(items: { url: string; caption?: string | null }[]): GcGalleryItem[] {
    return items.map((item) => ({ url: item.url, title: item.caption ?? undefined }));
}

const sessionPictures = mockPlayerPictures.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
const sessionVideos = mockPlayerVideos.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
const sessionStreams = mockPlayerStreams.filter((item) => item.playerPublicId === PLAYER_PUBLIC_ID);

export const WORKSPACE_PREVIEW_LINKS: GcLink[] = [
    { url: "https://www.youtube.com/@gamerscommunity", label: "YouTube channel" },
    { url: "https://discord.gg/example", label: "Discord server" },
    { url: "https://www.twitch.tv/riotgames", label: "Live streams" },
    { url: "https://x.com/leagueoflegends", label: "News on X" },
];

export const WORKSPACE_PREVIEW_PHOTOS: GcGalleryItem[] = mediaToGallery(sessionPictures);
export const WORKSPACE_PREVIEW_VIDEOS: GcGalleryItem[] = mediaToGallery(sessionVideos);
export const WORKSPACE_PREVIEW_STREAMS: GcGalleryItem[] = mediaToGallery(sessionStreams);

const nightveilMember = mockTeamSheet.members?.find((member) => member.playerPublicId === PLAYER_PUBLIC_ID);

export const WORKSPACE_PREVIEW_PLAYER_TEAMS: PlayerTeam[] = nightveilMember
    ? [
          PlayerTeam.fromDto({
              publicId: TEAM_PUBLIC_ID,
              entitled: mockTeamSheet.entitled,
              discriminator: mockTeamSheet.discriminator,
              tag: mockTeamSheet.tag,
              regionCode: mockTeamSheet.regionCode,
              rank: nightveilMember.rank,
              laneCode: nightveilMember.laneCode,
              rosterKind: nightveilMember.rosterKind,
              memberCount: mockTeamSheet.memberCount,
              playerSlotCount: mockTeamSheet.playerSlotCount,
          }),
      ]
    : [];
