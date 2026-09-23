import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerChampionUpdateDto } from "@features/players/dto/player.dto";
import { PlayerChampion, PlayerOptions } from "@features/players/models/player.model";
import { ChampionCardComponent } from "@features/players/components/champion-card/champion-card.component";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbSelectModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-champion-board",
    imports: [ChampionCardComponent, FormsModule, GameTermPipe, LaneIconComponent, NbButtonModule, NbSelectModule],
    templateUrl: "./champion-board.component.html",
    styleUrl: "./champion-board.component.scss",
})
export class ChampionBoardComponent {
    public readonly champions = input.required<PlayerChampion[]>();
    public readonly options = input.required<PlayerOptions>();
    public readonly editable = input(false);
    public readonly saving = input(false);

    public readonly save = output<PlayerChampionUpdateDto[]>();

    public readonly draftChampionId = signal<number | null>(null);
    public readonly draftKind = signal("pool");
    public readonly draftLaneId = signal<number | null>(null);

    public readonly available = computed(() => {
        const taken = new Set(this.champions().map((champion) => champion.id));
        return this.options().champions.filter((champion) => !taken.has(champion.id));
    });

    public add(): void {
        const id = this.draftChampionId();
        if (id == null) {
            return;
        }

        this.save.emit([
            ...this.toPayload(this.champions()),
            { idChampion: id, kind: this.draftKind(), idLane: this.draftLaneId() },
        ]);
        this.draftChampionId.set(null);
    }

    public remove(id: number): void {
        this.save.emit(this.toPayload(this.champions().filter((champion) => champion.id !== id)));
    }

    private toPayload(rows: PlayerChampion[]): PlayerChampionUpdateDto[] {
        return rows.map((champion) => ({
            idChampion: champion.id,
            kind: champion.kind,
            idLane: this.options().lanes.find((lane) => lane.code === champion.lane)?.id ?? null,
        }));
    }
}
