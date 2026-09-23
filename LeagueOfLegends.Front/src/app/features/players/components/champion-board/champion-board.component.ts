import { Component, computed, HostListener, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerChampionUpdateDto } from "@features/players/dto/player.dto";
import { PlayerChampion, PlayerOptions, sortChampionsByLanePriority } from "@features/players/models/player.model";
import { ChampionCardComponent } from "@features/players/components/champion-card/champion-card.component";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { gameTerm, GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-champion-board",
    imports: [
        ChampionCardComponent,
        FormsModule,
        GameTermPipe,
        LaneIconComponent,
        NbButtonModule,
        NbInputModule,
        NbSelectModule,
    ],
    templateUrl: "./champion-board.component.html",
    styleUrl: "./champion-board.component.scss",
})
export class ChampionBoardComponent {
    public readonly champions = input.required<PlayerChampion[]>();
    public readonly options = input.required<PlayerOptions>();
    public readonly lanePriority = input<readonly string[]>([]);
    public readonly editable = input(false);
    public readonly saving = input(false);

    public readonly save = output<PlayerChampionUpdateDto[]>();

    public readonly draftChampionId = signal<number | null>(null);
    public readonly championQuery = signal("");
    public readonly searchOpen = signal(false);
    public readonly draftKind = signal("pool");
    public readonly draftLaneId = signal<number | null>(null);
    protected readonly championPlaceholder = $localize`:@@lol.player.champions.search:Search a champion`;

    public readonly sortedChampions = computed(() => {
        const [primary, ...secondaries] = this.lanePriority();
        return sortChampionsByLanePriority(this.champions(), primary, secondaries);
    });

    public readonly available = computed(() => {
        const taken = new Set(this.champions().map((champion) => champion.id));
        return this.options().champions.filter((champion) => !taken.has(champion.id));
    });

    public readonly filteredChampions = computed(() => {
        const needle = normalizeChampionQuery(this.championQuery());
        if (!needle) {
            return this.available();
        }

        return this.available()
            .filter((champion) => {
                const code = normalizeChampionQuery(champion.code);
                const label = normalizeChampionQuery(gameTerm(champion.code));
                return code.includes(needle) || label.includes(needle);
            })
            .sort((left, right) => gameTerm(left.code).localeCompare(gameTerm(right.code)));
    });

    public openSearch(): void {
        this.searchOpen.set(true);
    }

    public onChampionQuery(value: string): void {
        this.championQuery.set(value);
        this.searchOpen.set(true);
        const exact = this.available().find(
            (champion) => normalizeChampionQuery(gameTerm(champion.code)) === normalizeChampionQuery(value),
        );
        this.draftChampionId.set(exact?.id ?? null);
    }

    public selectChampion(id: number): void {
        const champion = this.options().champions.find((item) => item.id === id);
        this.draftChampionId.set(id);
        this.championQuery.set(champion ? gameTerm(champion.code) : "");
        this.searchOpen.set(false);
    }

    @HostListener("document:mousedown", ["$event"])
    public onDocumentMouseDown(event: MouseEvent): void {
        const host = event.target as HTMLElement | null;
        if (!host?.closest(".champion-board__search")) {
            this.searchOpen.set(false);
        }
    }

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
        this.championQuery.set("");
        this.searchOpen.set(false);
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

function normalizeChampionQuery(value: string): string {
    return value.trim().toLowerCase().replace(/['’\s\-_.]/g, "");
}
