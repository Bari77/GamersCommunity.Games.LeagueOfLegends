import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerUpdateRequestDto } from "@features/players/dto/player.dto";
import { PlayerOptions, PlayerRank, PlayerSheet } from "@features/players/models/player.model";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { RankEmblemComponent } from "@shared/components/rank-emblem/rank-emblem.component";
import { gameTerm, GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

const APEX_TIERS = new Set(["master", "grandmaster", "challenger"]);

@Component({
    standalone: true,
    selector: "lol-player-stats",
    imports: [FormsModule, GameTermPipe, LaneIconComponent, RankEmblemComponent, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./player-stats.component.html",
    styleUrl: "./player-stats.component.scss",
})
export class PlayerStatsComponent {
    public readonly sheet = input.required<PlayerSheet>();
    public readonly options = input.required<PlayerOptions>();
    public readonly editing = input(false);
    public readonly saving = input(false);

    public readonly save = output<PlayerUpdateRequestDto>();
    public readonly cancel = output<void>();

    protected readonly unrankedLabel = $localize`:@@lol.player.stats.unranked:Unranked`;

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

    public constructor() {
        effect(() => {
            const editing = this.editing();
            untracked(() => {
                if (editing) {
                    this.hydrate();
                }
            });
        });
    }

    public secondaryChoices() {
        return this.options().lanes.filter((lane) => lane.id !== this.idPrimaryLane());
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

    public formatRank(rank: PlayerRank | null): string {
        if (!rank?.tier) {
            return "";
        }

        return this.formatRankLabel(rank.tier, rank.division, rank.lp);
    }

    public formatRankLabel(tier: string | null, division: string | null, lp: number | null = null): string {
        if (!tier) {
            return "";
        }

        const parts = [gameTerm(tier)];
        if (division) {
            parts.push(gameTerm(division));
        }
        if (lp != null) {
            parts.push(`${lp} LP`);
        }
        return parts.join(" ");
    }

    public submit(): void {
        this.save.emit({
            gameName: this.gameName().trim() || null,
            tagLine: this.tagLine().trim() || null,
            idRegion: this.idRegion(),
            idPrimaryLane: this.idPrimaryLane(),
            secondaryLaneIds: this.secondaryLaneIds(),
            solo: this.toRank(this.soloTier(), this.soloDivision(), this.soloLp()),
            flex: this.toRank(this.flexTier(), this.flexDivision(), this.flexLp()),
        });
        this.cancel.emit();
    }

    private hydrate(): void {
        const sheet = this.sheet();
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
    }

    private toRank(tier: string | null, division: string | null, lp: number | null) {
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
