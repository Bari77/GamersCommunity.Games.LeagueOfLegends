import type { WidgetCatalog, WidgetPageVisibilityOption } from "@bari77/gc-widgets";
import {
    TEAM_RANK_CAPTAIN,
    TEAM_RANK_COACH,
    TEAM_RANK_MANAGER,
    TEAM_RANK_PLAYER,
} from "@features/teams/models/team.model";

export const PAGE_VISIBILITY_PUBLIC = "public";

export const TEAM_PAGE_VISIBILITY_OPTIONS: WidgetPageVisibilityOption[] = [
    { value: PAGE_VISIBILITY_PUBLIC, label: $localize`:@@lol.team.page.visibility.public:Public` },
    { value: TEAM_RANK_PLAYER, label: $localize`:@@lol.team.page.visibility.player:Members` },
    { value: TEAM_RANK_COACH, label: $localize`:@@lol.team.page.visibility.coach:Staff` },
    { value: TEAM_RANK_MANAGER, label: $localize`:@@lol.team.page.visibility.manager:Managers` },
    { value: TEAM_RANK_CAPTAIN, label: $localize`:@@lol.team.page.visibility.captain:Captain only` },
];

export const TEAM_WIDGETS = {
    presentation: "team-presentation",
    stats: "team-stats",
    roster: "team-roster",
    wall: "team-wall",
    applications: "team-applications",
    recruitment: "team-recruitment",
    photos: "team-photos",
    videos: "team-videos",
    twitch: "gc-twitch",
    links: "gc-links",
} as const;

export const gameWorkspaceRegistry = {
    catalog: [
        {
            type: TEAM_WIDGETS.presentation,
            label: $localize`:@@lol.team.widget.presentation:Presentation`,
            description: $localize`:@@lol.team.widget.presentation.desc:The catchphrase visitors read, edited from the widget.`,
            cols: 8,
            rows: 3,
        },
        {
            type: TEAM_WIDGETS.stats,
            label: $localize`:@@lol.team.widget.stats:Stats`,
            description: $localize`:@@lol.team.widget.stats.desc:Region, players, mains and founding date.`,
            cols: 4,
            rows: 3,
            unique: true,
        },
        {
            type: TEAM_WIDGETS.roster,
            label: $localize`:@@lol.team.widget.roster:Roster`,
            cols: 12,
            rows: 7,
            unique: true,
        },
        {
            type: TEAM_WIDGETS.wall,
            label: $localize`:@@lol.team.widget.wall:Team wall`,
            cols: 12,
            rows: 8,
            unique: true,
        },
        {
            type: TEAM_WIDGETS.applications,
            label: $localize`:@@lol.team.widget.applications:Applications`,
            description: $localize`:@@lol.team.widget.applications.desc:Only the staff ever see this one.`,
            cols: 6,
            rows: 6,
            unique: true,
        },
        {
            type: TEAM_WIDGETS.recruitment,
            label: $localize`:@@lol.team.widget.recruitment:Recruitment`,
            description: $localize`:@@lol.team.widget.recruitment.desc:Lets a visitor apply as a player or as staff.`,
            cols: 6,
            rows: 6,
            unique: true,
        },
        {
            type: TEAM_WIDGETS.photos,
            label: $localize`:@@lol.team.widget.photos:Photo gallery`,
            cols: 12,
            rows: 6,
        },
        {
            type: TEAM_WIDGETS.videos,
            label: $localize`:@@lol.team.widget.videos:Video gallery`,
            description: $localize`:@@lol.team.widget.videos.desc:YouTube, Vimeo, Twitch clips and VODs.`,
            cols: 12,
            rows: 6,
        },
        {
            type: TEAM_WIDGETS.twitch,
            label: $localize`:@@lol.team.widget.twitch:Twitch player`,
            description: $localize`:@@lol.team.widget.twitch.desc:Embeds the channel the team streams on.`,
            cols: 6,
            rows: 5,
            fields: [
                {
                    key: "channel",
                    type: "url",
                    label: $localize`:@@lol.team.widget.twitch.channel:Channel or twitch.tv address`,
                    placeholder: "https://twitch.tv/…",
                },
            ],
        },
        {
            type: TEAM_WIDGETS.links,
            label: $localize`:@@lol.team.widget.links:Links`,
            description: $localize`:@@lol.team.widget.links.desc:Discord, social networks…`,
            cols: 6,
            rows: 4,
        },
    ] satisfies WidgetCatalog,
    columns: 12,
    rowHeight: 90,
    pageVisibilityOptions: TEAM_PAGE_VISIBILITY_OPTIONS,
};

export const TEAM_WIDGET_CATALOG = gameWorkspaceRegistry.catalog;
export const TEAM_WORKSPACE_COLUMNS = gameWorkspaceRegistry.columns;
export const TEAM_WORKSPACE_ROW_HEIGHT = gameWorkspaceRegistry.rowHeight;
