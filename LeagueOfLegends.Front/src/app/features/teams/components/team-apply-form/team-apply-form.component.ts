import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { isRichHtmlBlank, RichEditorComponent } from "@bari77/gc-ui";
import { CatalogItem } from "@features/players/models/player.model";
import { APPLICATION_PENDING } from "@features/teams/models/team-application.model";
import { TEAM_RANK_COACH, TEAM_RANK_MANAGER, TEAM_RANK_PLAYER } from "@features/teams/models/team.model";
import { NbButtonModule, NbCardModule, NbSelectModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

export interface TeamApplicationDraft {
    message: string;
    soughtRank: string;
    idLane: number | null;
}

@Component({
    standalone: true,
    selector: "lol-team-apply-form",
    imports: [FormsModule, GameTermPipe, RichEditorComponent, NbButtonModule, NbCardModule, NbSelectModule],
    templateUrl: "./team-apply-form.component.html",
    styleUrl: "./team-apply-form.component.scss",
})
export class TeamApplyFormComponent {
    public readonly lanes = input<CatalogItem[]>([]);
    public readonly loading = input(false);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);
    public readonly pendingStatus = input<string | null>(null);

    public readonly apply = output<TeamApplicationDraft>();
    public readonly withdraw = output<void>();

    protected readonly statusPending = APPLICATION_PENDING;
    protected readonly rankPlayer = TEAM_RANK_PLAYER;
    protected readonly ranks = [TEAM_RANK_PLAYER, TEAM_RANK_COACH, TEAM_RANK_MANAGER];

    protected readonly soughtRank = signal(TEAM_RANK_PLAYER);
    protected readonly idLane = signal<number | null>(null);
    protected readonly message = signal("");

    protected readonly messagePlaceholder = $localize`:@@lol.team.apply.messagePlaceholder:Introduce yourself to the staff…`;

    protected readonly canApply = computed(() => {
        const needsLane = this.soughtRank() === TEAM_RANK_PLAYER;
        return (
            !this.saving() &&
            !isRichHtmlBlank(this.message()) &&
            (!needsLane || this.idLane() !== null)
        );
    });

    protected submit(): void {
        if (!this.canApply()) {
            return;
        }

        this.apply.emit({
            message: this.message(),
            soughtRank: this.soughtRank(),
            idLane: this.soughtRank() === TEAM_RANK_PLAYER ? this.idLane() : null,
        });
    }
}
