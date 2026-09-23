import { gameWorkspaceRegistry } from "./widget-catalog";

/** Loaded by @bari77/gc-workspace-editor only — never imported from the game bootstrap. */
export const gameWorkspaceEditorRegistry = {
    ...gameWorkspaceRegistry,
    loadTemplateHost: () =>
        import("./widget-template-host.component").then((module) => module.LolTeamWidgetTemplateHostComponent),
};
