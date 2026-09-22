import type { WidgetCatalog } from '@bari77/gc-widgets';

export const LOL_WIDGETS = {
    links: 'gc-links',
} as const;

/** Plain catalog consumed by the player sheet, the CLI validator and the workspace editor. */
export const gameWorkspaceRegistry = {
    catalog: [
        {
            type: LOL_WIDGETS.links,
            label: 'Links',
            description: 'Drawn by gc-widgets itself, icons guessed from each address.',
            cols: 6,
            rows: 3,
            fields: [
                {
                    key: 'links',
                    type: 'list',
                    label: 'Links',
                    addLabel: 'Add a link',
                    itemFields: [
                        { key: 'url', type: 'url', label: 'Address', placeholder: 'https://…' },
                        { key: 'label', type: 'text', label: 'Label', hint: 'Falls back to the domain.' },
                    ],
                },
            ],
        },
    ] satisfies WidgetCatalog,
    columns: 12,
    rowHeight: 90,
};

export const PLAYER_WIDGET_CATALOG = gameWorkspaceRegistry.catalog;
export const PLAYER_WORKSPACE_COLUMNS = gameWorkspaceRegistry.columns;
export const PLAYER_WORKSPACE_ROW_HEIGHT = gameWorkspaceRegistry.rowHeight;
