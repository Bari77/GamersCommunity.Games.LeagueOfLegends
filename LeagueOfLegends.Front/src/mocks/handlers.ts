import { gatewayUrl } from "@bari77/gc-msw";
import { PlayerLoadRequestDto, PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { http, HttpResponse } from "msw";
import { environment } from "../environments/environment";
import { mockPlayerSheet, PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID } from "./data/players";

const playersUrl = gatewayUrl(environment.apiUrl, "leagueoflegends", "Players");

let player = { ...mockPlayerSheet };
let hasPlayerSheet = !new URLSearchParams(location.search).has("noSheet");

export const handlers = [
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
    http.get(`${playersUrl}/:publicId`, ({ params }) => {
        if (params["publicId"] !== player.publicId) {
            return HttpResponse.json({ message: "NOT_FOUND" }, { status: 404 });
        }
        return HttpResponse.json(player);
    }),
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
        };
        return HttpResponse.json(player);
    }),
];
