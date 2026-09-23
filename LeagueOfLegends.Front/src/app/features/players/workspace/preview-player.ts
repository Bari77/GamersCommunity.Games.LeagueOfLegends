import {
    CatalogItem,
    PlayerChampion,
    PlayerLane,
    PlayerOptions,
    PlayerRank,
    PlayerSheet,
} from "@features/players/models/player.model";

export const WORKSPACE_PREVIEW_OPTIONS = new PlayerOptions(
    [
        new CatalogItem(1, "top"),
        new CatalogItem(2, "jungle"),
        new CatalogItem(3, "mid"),
        new CatalogItem(4, "bottom"),
        new CatalogItem(5, "support"),
    ],
    [
        new CatalogItem(1, "euw"),
        new CatalogItem(4, "kr"),
    ],
    [
        new CatalogItem(2, "ahri"),
        new CatalogItem(36, "kaisa"),
        new CatalogItem(85, "zed"),
    ],
    [new CatalogItem(1, "main"), new CatalogItem(2, "pool"), new CatalogItem(3, "learning")],
    [new CatalogItem(7, "diamond"), new CatalogItem(10, "challenger")],
    [new CatalogItem(1, "1")],
);

export const WORKSPACE_PREVIEW_PLAYER = new PlayerSheet(
    "00000000-0000-0000-0000-000000000099",
    "00000000-0000-0000-0000-000000000001",
    "Faker",
    "0001",
    "",
    "<p>Coach and player, mostly in the evenings.</p>",
    "<p>Mid lane, control mage, and a bit of assassin.</p>",
    new Date("2024-01-15T12:00:00Z"),
    null,
    "Hide on bush",
    "KR1",
    new CatalogItem(4, "kr"),
    new PlayerLane(3, "mid"),
    [new PlayerLane(2, "jungle"), new PlayerLane(5, "support")],
    new PlayerRank("challenger", null, 1247),
    new PlayerRank("diamond", "1", 42),
    [
        new PlayerChampion(36, "kaisa", "learning", "bottom"),
        new PlayerChampion(85, "zed", "pool", "mid"),
        new PlayerChampion(2, "ahri", "main", "mid"),
    ],
);
