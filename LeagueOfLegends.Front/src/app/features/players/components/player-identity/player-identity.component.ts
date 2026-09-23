import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { PlayerOptions, PlayerRank, PlayerSheet } from "@features/players/models/player.model";
import { gameTerm, GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

const APEX_TIERS = new Set(["master", "grandmaster", "challenger"]);

@Component({
    standalone: true,
    selector: "lol-player-identity",
    imports: [FormsModule, GameTermPipe, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./player-identity.component.html",
    styleUrl: "./player-identity.component.scss",
})
export class PlayerIdentityComponent {
    public readonly player = input.required<PlayerSheet>();
    public readonly options = input.required<PlayerOptions>();
    public readonly editable = input(false);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<PlayerUpdateRequestDto>();

    public readonly editing = signal(false);
    public readonly gameName = signal("");
    public readonly tagLine = signal("");
    public readonly idRegion = signal<number | null>(null);
    public readonly idPrimaryLane = signal<number | null>(null);
    public readonly secondaryLaneIds = signal<number[]>([]);
    public readonly soloTier = signal<string | null>(null);
    public readonly soloDivision = signal<string | null>(null);
    public readonly soloLp = signal<number | null>(null);
    public readonly flexTier = signal<string | null>(null);
    public readonly flexDivision = signal<string | null>(null);
    public readonly flexLp = signal<number | null>(null);
    public readonly pool = signal<{ id: number; kind: string }[]>([]);
    public readonly draftChampionId = signal<number | null>(null);
    public readonly draftKind = signal("pool");

    public readonly secondaryChoices = computed(() =>
        this.options().lanes.filter((lane) => lane.id !== this.idPrimaryLane()),
    );
    public readonly availableChampions = computed(() => {
        const taken = new Set(this.pool().map((row) => row.id));
        return this.options().champions.filter((champion) => !taken.has(champion.id));
    });
    public readonly canSave = computed(() => {
        const name = this.gameName().trim();
        const tag = this.tagLine().trim();
        return (
            !this.saving() &&
            name.length >= 3 &&
            name.length <= 16 &&
            /^[A-Za-z0-9]{2,5}$/.test(tag) &&
            this.idRegion() != null &&
            this.idPrimaryLane() != null
        );
    });

    public constructor() {
        effect(() => {
            this.player();
            untracked(() => {
                if (!this.editing()) {
                    this.hydrate();
                }
            });
        });
    }

    public startEdit(): void {
        this.hydrate();
        this.editing.set(true);
    }

    public cancel(): void {
        this.hydrate();
        this.editing.set(false);
    }

    public onPrimaryLaneChange(id: number | null): void {
        this.idPrimaryLane.set(id);
        this.secondaryLaneIds.update((ids) => ids.filter((laneId) => laneId !== id));
    }

    public onSoloTierChange(tier: string | null): void {
        this.soloTier.set(tier);
        if (!tier || APEX_TIERS.has(tier)) {
            this.soloDivision.set(null);
        }
    }

    public onFlexTierChange(tier: string | null): void {
        this.flexTier.set(tier);
        if (!tier || APEX_TIERS.has(tier)) {
            this.flexDivision.set(null);
        }
    }

    public needsDivision(tier: string | null): boolean {
        return !!tier && !APEX_TIERS.has(tier);
    }

    public addChampion(): void {
        const id = this.draftChampionId();
        if (id == null) {
            return;
        }

        this.pool.update((rows) => [...rows, { id, kind: this.draftKind() }]);
        this.draftChampionId.set(null);
    }

    public removeChampion(id: number): void {
        this.pool.update((rows) => rows.filter((row) => row.id !== id));
    }

    public championCode(id: number): string {
        return this.options().champions.find((champion) => champion.id === id)?.code ?? "";
    }

    public errorMessage(code: string): string {
        switch (code) {
            case "RIOT_ID_TAKEN":
                return $localize`:@@lol.player.identity.error.taken:Ce Riot ID est déjà pris sur cette région.`;
            case "RIOT_ID_INCOMPLETE":
                return $localize`:@@lol.player.identity.error.incomplete:Il faut un nom, un tag et une région.`;
            case "LANE_OVERLAP":
                return $localize`:@@lol.player.identity.error.overlap:Une lane secondaire ne peut pas être la lane prioritaire.`;
            case "PRIMARY_LANE_REQUIRED":
                return $localize`:@@lol.player.identity.error.primary:Choisis une lane prioritaire.`;
            default:
                return $localize`:@@lol.player.identity.error.save:La fiche n’a pas pu être enregistrée.`;
        }
    }

    public formatRank(rank: PlayerRank | null): string {
        if (!rank?.tier) {
            return "";
        }

        const tier = gameTerm(rank.tier);
        const division = rank.division ? gameTerm(rank.division) : "";
        const lp = rank.lp != null ? `${rank.lp} LP` : "";
        return [tier, division, lp].filter(Boolean).join(" ");
    }

    public submit(): void {
        if (!this.canSave()) {
            return;
        }

        this.save.emit({
            gameName: this.gameName().trim(),
            tagLine: this.tagLine().trim(),
            idRegion: this.idRegion(),
            idPrimaryLane: this.idPrimaryLane(),
            secondaryLaneIds: this.secondaryLaneIds(),
            solo: this.toRankPayload(this.soloTier(), this.soloDivision(), this.soloLp()),
            flex: this.toRankPayload(this.flexTier(), this.flexDivision(), this.flexLp()),
            champions: this.pool().map((row) => ({ idChampion: row.id, kind: row.kind })),
        });
    }

    private hydrate(): void {
        const sheet = this.player();
        this.gameName.set(sheet.gameName ?? "");
        this.tagLine.set(sheet.tagLine ?? "");
        this.idRegion.set(sheet.region?.id ?? null);
        this.idPrimaryLane.set(sheet.primaryLane?.id ?? null);
        this.secondaryLaneIds.set(sheet.secondaryLanes.map((lane) => lane.id));
        this.soloTier.set(sheet.solo?.tier ?? null);
        this.soloDivision.set(sheet.solo?.division ?? null);
        this.soloLp.set(sheet.solo?.lp ?? null);
        this.flexTier.set(sheet.flex?.tier ?? null);
        this.flexDivision.set(sheet.flex?.division ?? null);
        this.flexLp.set(sheet.flex?.lp ?? null);
        this.pool.set(sheet.champions.map((champion) => ({ id: champion.id, kind: champion.kind })));
        this.draftChampionId.set(null);
        this.draftKind.set("pool");
    }

    private toRankPayload(tier: string | null, division: string | null, lp: number | null) {
        if (!tier) {
            return null;
        }

        return {
            tier,
            division: this.needsDivision(tier) ? division : null,
            lp,
        };
    }
}
