import { gatewayUrl } from "@bari77/gc-msw";
import {
    PlayerMediaCreateRequestDto,
    PlayerMediaDto,
    PlayerMediaListRequestDto,
} from "@bari77/gc-sdk";
import { PlayerLoadRequestDto, PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import {
    TeamApplicationCreateRequestDto,
    TeamApplicationListRequestDto,
    TeamApplicationReviewRequestDto,
    TeamApplicationTargetRequestDto,
} from "@features/teams/dto/team-application.dto";
import {
    PlayerTeamDto,
    TeamCreateRequestDto,
    TeamDisbandRequestDto,
    TeamListByPlayerRequestDto,
    TeamMemberTargetRequestDto,
    TeamSearchRequestDto,
    TeamSetRankRequestDto,
    TeamSetRosterRequestDto,
    TeamSheetDto,
    TeamUpdateRequestDto,
} from "@features/teams/dto/team.dto";
import { http, HttpResponse } from "msw";
import { environment } from "../environments/environment";
import { mockPlayerPictures, mockPlayerStreams, mockPlayerVideos } from "./data/media";
import { CreateLfgMessageRequestDto } from "@features/lfg/dto/lfg-message.dto";
import { mockHomeFeed, mockLfgMessages } from "./data/home-feed";
import { pickRosterChampions } from "@features/players/models/player.model";
import { mockPlayerOptions } from "./data/options";
import { mockPlayerSheet, PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID } from "./data/players";
import { mockTeamApplications, mockTeamSheet, mockTeamSummaries, TEAM_PUBLIC_ID } from "./data/teams";
import { mockTeamLinks, mockTeamPosts } from "./data/team-wall";
import {
    GamePostCreateRequestDto,
    GamePostModerateRequestDto,
    GamePostTargetRequestDto,
    GamePostUpdateRequestDto,
    TeamWallRequestDto,
} from "@features/teams/dto/game-post.dto";
import {
    TeamLinkCreateRequestDto,
    TeamLinkListRequestDto,
    TeamLinkReorderRequestDto,
    TeamLinkUpdateRequestDto,
} from "@features/teams/dto/team-link.dto";

const playersUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "Players");
const teamsUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "Teams");
const teamApplicationsUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "TeamApplications");
const gamePostsUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "GamePosts");
const teamLinksUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "TeamLinks");
const lfgAdsUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "LfgAds");

let player = { ...mockPlayerSheet };
let hasPlayerSheet = !new URLSearchParams(location.search).has("noSheet");
let lfgMessages = [...mockLfgMessages];
let teams: TeamSheetDto[] = [{ ...mockTeamSheet, members: [...(mockTeamSheet.members ?? [])] }];
let teamApplications = [...mockTeamApplications];
let teamPosts = [...mockTeamPosts];
let teamLinks = [...mockTeamLinks];

function filterLfgByKind(kind: string | undefined) {
    const resolved = kind?.trim().toLowerCase() || "player";
    return lfgMessages.filter((item) => item.kind === resolved);
}

function laneCodeForId(idLane: number | null | undefined): string | null {
    if (idLane == null) {
        return null;
    }
    return mockPlayerOptions.lanes.find((lane) => lane.id === idLane)?.code ?? null;
}

function rosterChampions(laneCode: string | null | undefined) {
    return pickRosterChampions(player.champions ?? [], laneCode);
}

function teamSummary(team: TeamSheetDto) {
    return {
        publicId: team.publicId,
        entitled: team.entitled,
        discriminator: team.discriminator,
        tag: team.tag,
        sentence: team.sentence,
        regionCode: team.regionCode,
        creationDate: team.creationDate,
        memberCount: team.memberCount,
        playerSlotCount: team.playerSlotCount,
    };
}

function withViewer(team: TeamSheetDto): TeamSheetDto {
    const member = team.members?.find((item) => item.playerPublicId === PLAYER_PUBLIC_ID);
    const application = teamApplications.find(
        (item) => item.teamPublicId === team.publicId && item.playerPublicId === PLAYER_PUBLIC_ID,
    );
    return {
        ...team,
        viewerRank: member?.rank ?? null,
        viewerApplicationStatus: application?.status ?? null,
        viewerApplicationPublicId: application?.publicId ?? null,
        pendingApplicationCount: teamApplications.filter(
            (item) => item.teamPublicId === team.publicId && item.status === "pending",
        ).length,
    };
}

const mediaStore: Record<string, PlayerMediaDto[]> = {
    PlayerPictures: [...mockPlayerPictures],
    PlayerVideos: [...mockPlayerVideos],
    PlayerStreams: [...mockPlayerStreams],
};

const mediaHandlers = Object.keys(mediaStore).flatMap((resource) => {
    const base = gatewayUrl(environment.apiUrl, "leagueoflegends", resource);
    return [
        http.post(`${base}/actions/List`, async ({ request }) => {
            const body = (await request.json()) as PlayerMediaListRequestDto;
            return HttpResponse.json(
                mediaStore[resource].filter((item) => item.playerPublicId === body.playerPublicId),
            );
        }),
        http.post(`${base}/actions/Create`, async ({ request }) => {
            const body = (await request.json()) as PlayerMediaCreateRequestDto;
            const created: PlayerMediaDto = {
                publicId: crypto.randomUUID(),
                playerPublicId: PLAYER_PUBLIC_ID,
                url: body.url,
                caption: body.caption,
                share: body.share,
                creationDate: new Date().toISOString(),
            };
            mediaStore[resource] = [created, ...mediaStore[resource]];
            return HttpResponse.json(created);
        }),
        http.put(`${base}/:publicId`, async ({ request, params }) => {
            const publicId = params["publicId"] as string;
            const body = (await request.json()) as Partial<PlayerMediaCreateRequestDto>;
            mediaStore[resource] = mediaStore[resource].map((item) =>
                item.publicId === publicId ? { ...item, ...body } : item,
            );
            return HttpResponse.json(mediaStore[resource].find((item) => item.publicId === publicId));
        }),
        http.delete(`${base}/:publicId`, ({ params }) => {
            const publicId = params["publicId"] as string;
            mediaStore[resource] = mediaStore[resource].filter((item) => item.publicId !== publicId);
            return new HttpResponse(null, { status: 204 });
        }),
    ];
});

function catalogItem(items: { id: number; code: string }[], id: number | null | undefined) {
    return id == null ? null : (items.find((item) => item.id === id) ?? null);
}

export const handlers = [
    ...mediaHandlers,
    http.post(`${teamsUrl}/actions/Search`, async ({ request }) => {
        const body = ((await request.json()) as TeamSearchRequestDto) ?? {};
        const query = (body.query ?? "").trim().toLowerCase();
        const region = body.idRegion != null ? mockPlayerOptions.regions.find((item) => item.id === body.idRegion) : null;
        const items = [
            ...teams.map(teamSummary),
            ...mockTeamSummaries.filter((item) => !teams.some((team) => team.publicId === item.publicId)),
        ].filter((team) => {
            const matchesQuery =
                !query ||
                team.entitled.toLowerCase().includes(query) ||
                (team.tag ?? "").toLowerCase().includes(query);
            const matchesRegion = !region || team.regionCode === region.code;
            return matchesQuery && matchesRegion;
        });
        return HttpResponse.json({ items, hasMore: false });
    }),
    http.post(`${teamsUrl}/actions/ListByPlayer`, async ({ request }) => {
        const body = ((await request.json()) as TeamListByPlayerRequestDto) ?? { playerPublicId: "" };
        const playerSlots = new Set(["captain", "player"]);
        const items: PlayerTeamDto[] = teams.flatMap((team) => {
            const member = (team.members ?? []).find((item) => item.playerPublicId === body.playerPublicId);
            if (!member) {
                return [];
            }
            return [
                {
                    publicId: team.publicId,
                    entitled: team.entitled,
                    discriminator: team.discriminator,
                    tag: team.tag,
                    regionCode: team.regionCode,
                    rank: member.rank,
                    laneCode: member.laneCode,
                    rosterKind: member.rosterKind,
                    memberCount: team.memberCount,
                    playerSlotCount: (team.members ?? []).filter((item) => playerSlots.has(item.rank)).length,
                },
            ];
        });
        return HttpResponse.json(items);
    }),
    http.post(`${teamsUrl}/actions/ListPostable`, () => {
        const postableRanks = new Set(["captain", "coach", "manager"]);
        const items = teams.flatMap((team) => {
            const member = (team.members ?? []).find(
                (item) => item.playerPublicId === PLAYER_PUBLIC_ID && postableRanks.has(item.rank),
            );
            if (!member) {
                return [];
            }
            return [
                {
                    publicId: team.publicId,
                    entitled: team.entitled,
                    discriminator: team.discriminator,
                    rank: member.rank,
                },
            ];
        });
        return HttpResponse.json(items);
    }),
    http.get(`${teamsUrl}/:publicId`, ({ params }) => {
        const team = teams.find((item) => item.publicId === params["publicId"]);
        if (!team) {
            const summary = mockTeamSummaries.find((item) => item.publicId === params["publicId"]);
            if (!summary) {
                return HttpResponse.json({ message: "NOT_FOUND" }, { status: 404 });
            }
            return HttpResponse.json(
                withViewer({
                    ...summary,
                    layoutJson: null,
                    members: [],
                    viewerRank: null,
                    viewerApplicationStatus: null,
                    viewerApplicationPublicId: null,
                    pendingApplicationCount: 0,
                }),
            );
        }
        return HttpResponse.json(withViewer(team));
    }),
    http.post(teamsUrl, async ({ request }) => {
        const body = (await request.json()) as TeamCreateRequestDto;
        const created: TeamSheetDto = {
            publicId: crypto.randomUUID(),
            entitled: body.entitled,
            discriminator: String(Math.floor(1000 + Math.random() * 9000)),
            tag: body.tag ?? null,
            sentence: body.sentence ?? null,
            layoutJson: null,
            regionCode: player.region?.code ?? null,
            creationDate: new Date().toISOString(),
            memberCount: 1,
            playerSlotCount: 1,
            members: [
                {
                    playerPublicId: PLAYER_PUBLIC_ID,
                    platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
                    nickname: player.nickname,
                    discriminator: player.discriminator,
                    avatarUrl: player.avatarUrl,
                    rank: "captain",
                    gameName: player.gameName,
                    tagLine: player.tagLine,
                    idLane: player.primaryLane?.id ?? null,
                    laneCode: player.primaryLane?.code ?? null,
                    rosterKind: "main",
                    joinedAt: new Date().toISOString(),
                    champions: rosterChampions(player.primaryLane?.code ?? null),
                },
            ],
            viewerRank: "captain",
            viewerApplicationStatus: null,
            viewerApplicationPublicId: null,
            pendingApplicationCount: 0,
        };
        teams = [created, ...teams];
        return HttpResponse.json(created);
    }),
    http.put(`${teamsUrl}/:publicId`, async ({ params, request }) => {
        const publicId = params["publicId"] as string;
        const body = (await request.json()) as TeamUpdateRequestDto;
        teams = teams.map((team) =>
            team.publicId === publicId
                ? {
                      ...team,
                      entitled: body.entitled !== undefined ? body.entitled : team.entitled,
                      tag: body.tag !== undefined ? body.tag : team.tag,
                      sentence: body.sentence !== undefined ? body.sentence : team.sentence,
                      layoutJson: body.layoutJson !== undefined ? body.layoutJson : team.layoutJson,
                  }
                : team,
        );
        const team = teams.find((item) => item.publicId === publicId);
        return team
            ? HttpResponse.json(withViewer(team))
            : HttpResponse.json({ message: "NOT_FOUND" }, { status: 404 });
    }),
    http.post(`${teamsUrl}/actions/SetRoster`, async ({ request }) => {
        const body = (await request.json()) as TeamSetRosterRequestDto;
        const lane = mockPlayerOptions.lanes.find((item) => item.id === body.idLane);
        teams = teams.map((team) =>
            team.publicId === body.teamPublicId
                ? {
                      ...team,
                      members: (team.members ?? []).map((member) => {
                          if (member.playerPublicId === body.playerPublicId) {
                              const laneCode = lane?.code ?? member.laneCode;
                              return {
                                  ...member,
                                  idLane: body.idLane,
                                  laneCode,
                                  rosterKind: body.rosterKind,
                                  champions: rosterChampions(laneCode),
                              };
                          }
                          if (
                              body.rosterKind === "main" &&
                              member.idLane === body.idLane &&
                              member.rosterKind === "main"
                          ) {
                              return { ...member, rosterKind: "sub" };
                          }
                          return member;
                      }),
                  }
                : team,
        );
        return HttpResponse.json(withViewer(teams.find((team) => team.publicId === body.teamPublicId)!));
    }),
    http.post(`${teamsUrl}/actions/SetRank`, async ({ request }) => {
        const body = (await request.json()) as TeamSetRankRequestDto;
        teams = teams.map((team) =>
            team.publicId === body.teamPublicId
                ? {
                      ...team,
                      members: (team.members ?? []).map((member) =>
                          member.playerPublicId === body.playerPublicId ? { ...member, rank: body.rank } : member,
                      ),
                  }
                : team,
        );
        return HttpResponse.json(withViewer(teams.find((team) => team.publicId === body.teamPublicId)!));
    }),
    http.post(`${teamsUrl}/actions/Kick`, async ({ request }) => {
        const body = (await request.json()) as TeamMemberTargetRequestDto;
        teams = teams.map((team) =>
            team.publicId === body.teamPublicId
                ? {
                      ...team,
                      members: (team.members ?? []).filter((member) => member.playerPublicId !== body.playerPublicId),
                      memberCount: Math.max(0, team.memberCount - 1),
                  }
                : team,
        );
        return HttpResponse.json(withViewer(teams.find((team) => team.publicId === body.teamPublicId)!));
    }),
    http.post(`${teamsUrl}/actions/Leave`, async ({ request }) => {
        const body = (await request.json()) as TeamMemberTargetRequestDto;
        teams = teams.map((team) =>
            team.publicId === body.teamPublicId
                ? {
                      ...team,
                      members: (team.members ?? []).filter((member) => member.playerPublicId !== body.playerPublicId),
                      memberCount: Math.max(0, team.memberCount - 1),
                  }
                : team,
        );
        return HttpResponse.json({ teamPublicId: body.teamPublicId });
    }),
    http.post(`${teamsUrl}/actions/TransferCaptaincy`, async ({ request }) => {
        const body = (await request.json()) as TeamMemberTargetRequestDto;
        teams = teams.map((team) =>
            team.publicId === body.teamPublicId
                ? {
                      ...team,
                      members: (team.members ?? []).map((member) => {
                          if (member.playerPublicId === body.playerPublicId) {
                              return { ...member, rank: "captain" };
                          }
                          return member.rank === "captain" ? { ...member, rank: "player" } : member;
                      }),
                  }
                : team,
        );
        return HttpResponse.json(withViewer(teams.find((team) => team.publicId === body.teamPublicId)!));
    }),
    http.post(`${teamsUrl}/actions/Disband`, async ({ request }) => {
        const body = (await request.json()) as TeamDisbandRequestDto;
        const team = teams.find((item) => item.publicId === body.teamPublicId);
        teams = teams.filter((item) => item.publicId !== body.teamPublicId);
        return HttpResponse.json({
            publicId: body.teamPublicId,
            handle: team ? `${team.entitled}#${team.discriminator}` : body.confirmation,
        });
    }),
    http.post(`${teamApplicationsUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as TeamApplicationCreateRequestDto;
        const team = teams.find((item) => item.publicId === body.teamPublicId) ?? mockTeamSheet;
        const created = {
            publicId: crypto.randomUUID(),
            message: body.message,
            status: "pending",
            soughtRank: body.soughtRank,
            laneCode: mockPlayerOptions.lanes.find((lane) => lane.id === body.idLane)?.code ?? null,
            creationDate: new Date().toISOString(),
            reviewedAt: null,
            teamPublicId: body.teamPublicId,
            teamName: team.entitled,
            teamDiscriminator: team.discriminator,
            playerPublicId: PLAYER_PUBLIC_ID,
            platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
            nickname: player.nickname,
            discriminator: player.discriminator,
            avatarUrl: player.avatarUrl,
        };
        teamApplications = [created, ...teamApplications];
        return HttpResponse.json(created);
    }),
    http.post(`${teamApplicationsUrl}/actions/ListMine`, () => HttpResponse.json(teamApplications)),
    http.post(`${teamApplicationsUrl}/actions/List`, async ({ request }) => {
        const body = (await request.json()) as TeamApplicationListRequestDto;
        return HttpResponse.json(
            teamApplications.filter(
                (item) => item.teamPublicId === body.teamPublicId && item.status === (body.status ?? "pending"),
            ),
        );
    }),
    http.post(`${teamApplicationsUrl}/actions/Review`, async ({ request }) => {
        const body = (await request.json()) as TeamApplicationReviewRequestDto;
        teamApplications = teamApplications.map((item) =>
            item.publicId === body.publicId
                ? { ...item, status: body.accept ? "accepted" : "rejected", reviewedAt: new Date().toISOString() }
                : item,
        );
        return HttpResponse.json(teamApplications.find((item) => item.publicId === body.publicId));
    }),
    http.post(`${teamApplicationsUrl}/actions/Withdraw`, async ({ request }) => {
        const body = (await request.json()) as TeamApplicationTargetRequestDto;
        teamApplications = teamApplications.map((item) =>
            item.publicId === body.publicId ? { ...item, status: "withdrawn" } : item,
        );
        return HttpResponse.json(teamApplications.find((item) => item.publicId === body.publicId));
    }),
    http.post(`${gamePostsUrl}/actions/ListTeamWall`, async ({ request }) => {
        const body = ((await request.json()) as TeamWallRequestDto) ?? { teamPublicId: "" };
        const items = teamPosts.filter(
            (item) => item.teamPublicId === body.teamPublicId && item.status === "approved",
        );
        return HttpResponse.json({ items, hasMore: false });
    }),
    http.post(`${gamePostsUrl}/actions/ListPending`, async ({ request }) => {
        const body = ((await request.json()) as TeamWallRequestDto) ?? { teamPublicId: "" };
        const items = teamPosts.filter(
            (item) => item.teamPublicId === body.teamPublicId && item.status === "pending",
        );
        return HttpResponse.json({ items, hasMore: false });
    }),
    http.post(`${gamePostsUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as GamePostCreateRequestDto;
        const created = {
            publicId: crypto.randomUUID(),
            teamPublicId: body.teamPublicId,
            body: body.body,
            status: "approved",
            creationDate: new Date().toISOString(),
            authorPlayerPublicId: PLAYER_PUBLIC_ID,
            authorPlatformUserPublicId: PLATFORM_USER_PUBLIC_ID,
            authorNickname: player.nickname,
            authorDiscriminator: player.discriminator,
            authorAvatarUrl: player.avatarUrl,
            moderationReason: null,
            moderatedAt: new Date().toISOString(),
        };
        teamPosts = [created, ...teamPosts];
        return HttpResponse.json(created);
    }),
    http.post(`${gamePostsUrl}/actions/Update`, async ({ request }) => {
        const body = (await request.json()) as GamePostUpdateRequestDto;
        teamPosts = teamPosts.map((item) =>
            item.publicId === body.publicId ? { ...item, body: body.body } : item,
        );
        return HttpResponse.json(teamPosts.find((item) => item.publicId === body.publicId));
    }),
    http.post(`${gamePostsUrl}/actions/Moderate`, async ({ request }) => {
        const body = (await request.json()) as GamePostModerateRequestDto;
        teamPosts = teamPosts.map((item) =>
            item.publicId === body.publicId
                ? {
                      ...item,
                      status: body.approve ? "approved" : "rejected",
                      moderatedAt: new Date().toISOString(),
                      moderationReason: body.reason ?? null,
                  }
                : item,
        );
        return HttpResponse.json(teamPosts.find((item) => item.publicId === body.publicId));
    }),
    http.post(`${gamePostsUrl}/actions/Delete`, async ({ request }) => {
        const body = (await request.json()) as GamePostTargetRequestDto;
        teamPosts = teamPosts.filter((item) => item.publicId !== body.publicId);
        return HttpResponse.json({ publicId: body.publicId });
    }),
    http.post(`${teamLinksUrl}/actions/List`, async ({ request }) => {
        const body = (await request.json()) as TeamLinkListRequestDto;
        return HttpResponse.json(
            teamLinks
                .filter((item) => item.teamPublicId === body.teamPublicId)
                .sort((left, right) => left.position - right.position),
        );
    }),
    http.post(`${teamLinksUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as TeamLinkCreateRequestDto;
        const created = {
            publicId: crypto.randomUUID(),
            teamPublicId: body.teamPublicId,
            url: body.url,
            label: body.label,
            icon: body.icon,
            position: teamLinks.filter((item) => item.teamPublicId === body.teamPublicId).length,
        };
        teamLinks = [...teamLinks, created];
        return HttpResponse.json(created);
    }),
    http.put(`${teamLinksUrl}/:publicId`, async ({ params, request }) => {
        const publicId = params["publicId"] as string;
        const body = (await request.json()) as TeamLinkUpdateRequestDto;
        teamLinks = teamLinks.map((item) =>
            item.publicId === publicId
                ? {
                      ...item,
                      url: body.url !== undefined ? body.url : item.url,
                      label: body.label !== undefined ? body.label : item.label,
                      icon: body.icon !== undefined ? body.icon : item.icon,
                  }
                : item,
        );
        return HttpResponse.json(teamLinks.find((item) => item.publicId === publicId));
    }),
    http.delete(`${teamLinksUrl}/:publicId`, ({ params }) => {
        const publicId = params["publicId"] as string;
        teamLinks = teamLinks.filter((item) => item.publicId !== publicId);
        return new HttpResponse(null, { status: 204 });
    }),
    http.post(`${teamLinksUrl}/actions/Reorder`, async ({ request }) => {
        const body = (await request.json()) as TeamLinkReorderRequestDto;
        teamLinks = teamLinks.map((item) => {
            const rank = body.publicIds.indexOf(item.publicId);
            return item.teamPublicId === body.teamPublicId && rank >= 0 ? { ...item, position: rank } : item;
        });
        return HttpResponse.json(
            teamLinks
                .filter((item) => item.teamPublicId === body.teamPublicId)
                .sort((left, right) => left.position - right.position),
        );
    }),
    http.post(gatewayUrl(environment.apiUrl, "leagueoflegends", "HomeFeed", "actions", "Get"), () =>
        HttpResponse.json({
            ...mockHomeFeed,
            latestLfg: lfgMessages.slice(-5),
            latestPlayers: hasPlayerSheet ? mockHomeFeed.latestPlayers : [],
            latestTeams: mockHomeFeed.latestTeams,
        }),
    ),
    http.post(`${lfgAdsUrl}/actions/ListRecent`, async ({ request }) => {
        const body = ((await request.json()) as { kind?: string }) ?? {};
        return HttpResponse.json(filterLfgByKind(body.kind));
    }),
    http.post(`${lfgAdsUrl}/actions/ListBefore`, () => HttpResponse.json([])),
    http.post(`${lfgAdsUrl}/actions/Create`, async ({ request }) => {
        const body = (await request.json()) as CreateLfgMessageRequestDto;
        const team =
            body.teamPublicId != null
                ? teams.find((item) => item.publicId === body.teamPublicId) ??
                  (body.teamPublicId === TEAM_PUBLIC_ID ? mockTeamSheet : null)
                : null;
        const created = {
            publicId: crypto.randomUUID(),
            kind: team ? "team" : "player",
            body: body.body,
            senderNickname: player.nickname,
            senderDiscriminator: player.discriminator,
            creationDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
            playerPublicId: PLAYER_PUBLIC_ID,
            platformUserPublicId: PLATFORM_USER_PUBLIC_ID,
            senderAvatarUrl: player.avatarUrl,
            regionCode: team?.regionCode ?? player.region?.code ?? null,
            laneCode: laneCodeForId(body.idLane) ?? player.primaryLane?.code ?? null,
            ...(team
                ? {
                      teamPublicId: team.publicId,
                      teamName: team.entitled,
                      teamDiscriminator: team.discriminator,
                      teamTag: team.tag,
                  }
                : {}),
        };
        lfgMessages = [...lfgMessages, created];
        return HttpResponse.json(created);
    }),
    http.post(`${playersUrl}/actions/Resolve`, async ({ request }) => {
        const body = (await request.json()) as { platformUserPublicId?: string };
        const match = body.platformUserPublicId === PLATFORM_USER_PUBLIC_ID && hasPlayerSheet;
        return HttpResponse.json({
            hasSheet: match,
            ...(match ? { playerPublicId: PLAYER_PUBLIC_ID } : {}),
        });
    }),
    http.post(`${playersUrl}/actions/Load`, async ({ request }) => {
        const body = (await request.json()) as PlayerLoadRequestDto;
        hasPlayerSheet = true;
        player = {
            ...player,
            platformUserPublicId: body.platformUserPublicId || PLATFORM_USER_PUBLIC_ID,
        };
        return HttpResponse.json(player);
    }),
    http.post(`${playersUrl}/actions/Options`, () => HttpResponse.json(mockPlayerOptions)),
    http.post(`${playersUrl}/actions/Search`, async ({ request }) => {
        const body = ((await request.json()) as { query?: string; idRegion?: number; take?: number }) ?? {};
        const query = (body.query ?? "").trim().toLowerCase();
        const region = body.idRegion != null ? mockPlayerOptions.regions.find((item) => item.id === body.idRegion) : null;
        const items = mockHomeFeed.latestPlayers.filter((item) => {
            const handle = `${item.nickname}#${item.discriminator}`.toLowerCase();
            const riot =
                item.gameName && item.tagLine ? `${item.gameName}#${item.tagLine}`.toLowerCase() : "";
            const matchesQuery =
                !query ||
                handle.includes(query) ||
                item.nickname.toLowerCase().includes(query) ||
                (item.gameName ?? "").toLowerCase().includes(query) ||
                riot.includes(query);
            const matchesRegion = !region || item.regionCode === region.code;
            return matchesQuery && matchesRegion;
        });
        const take = body.take && body.take > 0 ? body.take : 20;
        return HttpResponse.json({ items: items.slice(0, take), hasMore: items.length > take });
    }),
    http.get(`${playersUrl}/:publicId`, ({ params }) => {
        if (params["publicId"] !== player.publicId) {
            return HttpResponse.json({ message: "NOT_FOUND" }, { status: 404 });
        }
        return HttpResponse.json(player);
    }),
    http.get(`${environment.apiUrl}/gateway/availability`, () =>
        HttpResponse.json({
            items: [
                { id: "platform", available: true },
                { id: "worldofwarcraft", available: true },
                { id: "leagueoflegends", available: true },
            ],
        }),
    ),
    http.get(`${environment.apiUrl}/platform/games`, () =>
        HttpResponse.json([
            { id: 1, title: "World Of Warcraft", urlValue: "/world-of-warcraft", picture: "world-of-warcraft" },
            { id: 2, title: "League Of Legends", urlValue: "/league-of-legends", picture: "league-of-legends" },
        ]),
    ),
    http.post(gatewayUrl(environment.apiUrl, "worldofwarcraft", "Players", "actions", "Resolve"), () =>
        HttpResponse.json({
            hasSheet: true,
            playerPublicId: "22222222-2222-2222-2222-222222222222",
        }),
    ),
    http.put(`${playersUrl}/:publicId`, async ({ params, request }) => {
        if (params["publicId"] !== player.publicId) {
            return HttpResponse.json({ message: "NOT_FOUND" }, { status: 404 });
        }
        const body = (await request.json()) as PlayerUpdateRequestDto;
        player = {
            ...player,
            presentationIrl: body.presentationIrl !== undefined ? body.presentationIrl : player.presentationIrl,
            presentationIg: body.presentationIg !== undefined ? body.presentationIg : player.presentationIg,
            layoutJson: body.layoutJson !== undefined ? body.layoutJson : player.layoutJson,
            gameName: body.gameName !== undefined ? body.gameName : player.gameName,
            tagLine: body.tagLine !== undefined ? body.tagLine?.toUpperCase() : player.tagLine,
            region: body.idRegion !== undefined ? catalogItem(mockPlayerOptions.regions, body.idRegion) : player.region,
            primaryLane:
                body.idPrimaryLane !== undefined
                    ? catalogItem(mockPlayerOptions.lanes, body.idPrimaryLane)
                    : player.primaryLane,
            secondaryLanes:
                body.secondaryLaneIds !== undefined
                    ? body.secondaryLaneIds
                          .map((id) => catalogItem(mockPlayerOptions.lanes, id))
                          .filter((lane): lane is NonNullable<typeof lane> => !!lane)
                    : player.secondaryLanes,
            solo: body.solo !== undefined ? body.solo : player.solo,
            flex: body.flex !== undefined ? body.flex : player.flex,
            champions:
                body.champions !== undefined
                    ? body.champions.flatMap((row) => {
                          const champion = catalogItem(mockPlayerOptions.champions, row.idChampion);
                          const lane = mockPlayerOptions.lanes.find((item) => item.id === row.idLane);
                          return champion ? [{ ...champion, kind: row.kind, lane: lane?.code ?? null }] : [];
                      })
                    : player.champions,
        };
        return HttpResponse.json(player);
    }),
];
