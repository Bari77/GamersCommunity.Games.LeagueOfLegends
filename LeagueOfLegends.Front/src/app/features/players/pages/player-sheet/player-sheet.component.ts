import { Component, computed, signal } from "@angular/core";
import { parseWorkspace, WidgetWorkspace, WidgetWorkspaceComponent } from "@bari77/gc-widgets";
import defaultLayout from "../../../../../../config/player/workspace.default.json";
import {
    PLAYER_WIDGET_CATALOG,
    PLAYER_WORKSPACE_COLUMNS,
    PLAYER_WORKSPACE_ROW_HEIGHT,
} from "../../workspace/widget-catalog";

@Component({
    selector: "lol-player-sheet",
    standalone: true,
    imports: [WidgetWorkspaceComponent],
    templateUrl: "./player-sheet.component.html",
    styleUrl: "./player-sheet.component.scss",
})
export class PlayerSheetComponent {
    public readonly catalog = PLAYER_WIDGET_CATALOG;
    public readonly columns = PLAYER_WORKSPACE_COLUMNS;
    public readonly rowHeight = PLAYER_WORKSPACE_ROW_HEIGHT;
    public readonly editing = signal(false);

    public readonly workspace = computed(
        () =>
            this.savedWorkspace() ??
            parseWorkspace(
                this.layoutJson(),
                defaultLayout as WidgetWorkspace,
                PLAYER_WORKSPACE_COLUMNS,
                PLAYER_WIDGET_CATALOG.map((entry) => entry.type),
            ),
    );

    private readonly layoutJson = signal<string | null>(null);
    private readonly savedWorkspace = signal<WidgetWorkspace | null>(null);

    public onSave(workspace: WidgetWorkspace): void {
        this.savedWorkspace.set(workspace);
        this.editing.set(false);
    }
}
