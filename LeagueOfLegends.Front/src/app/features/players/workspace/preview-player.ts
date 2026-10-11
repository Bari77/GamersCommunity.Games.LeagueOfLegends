import { PlayerOptions, PlayerSheet } from "@features/players/models/player.model";
import { mockPlayerOptions } from "../../../../mocks/catalog/options";
import { mockPlayerSheet } from "../../../../mocks/catalog/players";

export const WORKSPACE_PREVIEW_OPTIONS = PlayerOptions.fromDto(mockPlayerOptions);

export const WORKSPACE_PREVIEW_PLAYER = PlayerSheet.fromDto(mockPlayerSheet);
