import { Component, computed, input, output } from "@angular/core";
import { PlayerChampion } from "@features/players/models/player.model";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { championSplashUrl } from "@shared/utils/champion-art";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-champion-card",
    imports: [GameTermPipe, LaneIconComponent],
    templateUrl: "./champion-card.component.html",
    styleUrl: "./champion-card.component.scss",
})
export class ChampionCardComponent {
    public readonly champion = input.required<PlayerChampion>();
    public readonly editable = input(false);
    public readonly remove = output<void>();

    protected readonly splash = computed(() => championSplashUrl(this.champion().code));
}
