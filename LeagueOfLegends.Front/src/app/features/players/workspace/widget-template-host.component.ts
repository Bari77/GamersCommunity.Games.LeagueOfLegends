import { DatePipe } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { WidgetDefDirective } from "@bari77/gc-widgets";
import { ChampionBoardComponent } from "@features/players/components/champion-board/champion-board.component";
import { PlayerPresentationComponent } from "@features/players/components/player-presentation/player-presentation.component";
import { PlayerStatsComponent } from "@features/players/components/player-stats/player-stats.component";
import { PlayerChampionUpdateDto, PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { PlayerOptions, PlayerSheet } from "@features/players/models/player.model";
import { WORKSPACE_PREVIEW_OPTIONS, WORKSPACE_PREVIEW_PLAYER } from "@features/players/workspace/preview-player";
import { NbButtonModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-widget-template-host",
    imports: [
        ChampionBoardComponent,
        DatePipe,
        NbButtonModule,
        PlayerPresentationComponent,
        PlayerStatsComponent,
        RouterLink,
        WidgetDefDirective,
    ],
    templateUrl: "./widget-template-host.component.html",
    styleUrl: "./widget-template-host.component.scss",
})
export class LolWidgetTemplateHostComponent {
    public readonly preview = input(false);
    public readonly player = input<PlayerSheet | null>(null);
    public readonly options = input<PlayerOptions | null>(null);
    public readonly isOwner = input(false);
    public readonly editing = input(false);
    public readonly savingField = input(false);

    public readonly saveField = output<PlayerUpdateRequestDto>();

    protected readonly view = computed(() =>
        this.preview() || !this.player() ? WORKSPACE_PREVIEW_PLAYER : this.player()!,
    );
    protected readonly catalog = computed(() => this.options() ?? WORKSPACE_PREVIEW_OPTIONS);
    protected readonly canEditFields = computed(() => this.isOwner() && !this.editing() && !this.preview());
    protected readonly lanePriority = computed(() => {
        const player = this.view();
        const codes: string[] = [];
        if (player.primaryLane) {
            codes.push(player.primaryLane.code);
        }
        for (const lane of player.secondaryLanes) {
            if (!codes.includes(lane.code)) {
                codes.push(lane.code);
            }
        }
        return codes;
    });

    protected saveChampions(champions: PlayerChampionUpdateDto[]): void {
        this.saveField.emit({ champions });
    }
}
