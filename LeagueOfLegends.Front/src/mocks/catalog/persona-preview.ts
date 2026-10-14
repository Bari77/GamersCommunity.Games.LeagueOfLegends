/// <reference types="@angular/localize" />

import { PlaygroundPersonaCard, PlaygroundPersonaTag } from "@bari77/gc-playground/components";
import { gameTerm } from "@shared/pipes/game-term.pipe";
import { mockTeamSheets } from "./orgs";
import { MockPersona, mockPortraitUrl } from "./personas";
import { sheetByNickname } from "./players";

type QueueRank = { tier?: string | null; division?: string | null; lp?: number | null } | null | undefined;

export function personaCard(persona: MockPersona): PlaygroundPersonaCard {
    const sheet = sheetByNickname(persona.nickname);
    const champions = sheet.champions ?? [];
    const mains = champions.filter((champion) => champion.kind === "main");
    const teams = teamTags(sheet.publicId);
    const unranked = $localize`:@@lol.playground.persona.unranked:Unranked`;

    return {
        id: persona.id,
        nickname: persona.nickname,
        discriminator: persona.discriminator,
        avatarUrl: sheet.avatarUrl || mockPortraitUrl(persona.nickname),
        headline: [summonerName(sheet.gameName, sheet.tagLine), gameTerm(sheet.region?.code)]
            .filter(Boolean)
            .join(" · "),
        stats: [
            { label: $localize`:@@lol.playground.persona.stat.champions:Champions`, value: champions.length },
            { label: $localize`:@@lol.playground.persona.stat.mains:Mains`, value: mains.length },
            { label: $localize`:@@lol.playground.persona.stat.teams:Teams`, value: teams.length },
        ],
        details: [
            {
                label: $localize`:@@lol.playground.persona.detail.solo:Solo/Duo`,
                tags: rankTags(sheet.solo),
                empty: unranked,
            },
            {
                label: $localize`:@@lol.playground.persona.detail.flex:Flex`,
                tags: rankTags(sheet.flex),
                empty: unranked,
            },
            {
                label: $localize`:@@lol.playground.persona.detail.lanes:Lanes`,
                tags: [
                    ...(sheet.primaryLane
                        ? [
                              {
                                  text: gameTerm(sheet.primaryLane.code),
                                  hint: $localize`:@@lol.playground.persona.primary:primary`,
                              },
                          ]
                        : []),
                    ...(sheet.secondaryLanes ?? []).map((lane) => ({ text: gameTerm(lane.code) })),
                ],
            },
            {
                label: $localize`:@@lol.playground.persona.detail.mains:Mains`,
                tags: mains.map((champion) => ({ text: gameTerm(champion.code) })),
                empty: $localize`:@@lol.playground.persona.noMain:No main yet`,
            },
            {
                label: $localize`:@@lol.playground.persona.detail.teams:Teams`,
                tags: teams,
                empty: $localize`:@@lol.playground.persona.noTeam:No team`,
            },
        ],
    };
}

function summonerName(gameName: string | null | undefined, tagLine: string | null | undefined): string {
    if (gameName && tagLine) {
        return `${gameName}#${tagLine}`;
    }
    return gameName ?? "";
}

function rankTags(rank: QueueRank): PlaygroundPersonaTag[] {
    if (!rank?.tier) {
        return [];
    }
    const label = [gameTerm(rank.tier), rank.division ? gameTerm(rank.division) : ""].filter(Boolean).join(" ");
    return [{ text: label, hint: rank.lp != null ? `${rank.lp} LP` : null }];
}

function teamTags(playerPublicId: string): PlaygroundPersonaTag[] {
    const tags: PlaygroundPersonaTag[] = [];
    for (const team of mockTeamSheets) {
        const member = team.members?.find((item) => item.playerPublicId === playerPublicId);
        if (member) {
            tags.push({ text: team.entitled, hint: gameTerm(member.rank) });
        }
    }
    return tags;
}
