import { DatePipe } from "@angular/common";
import { Component, inject, OnInit, resource } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { LFG_KIND_PLAYER, LFG_KIND_TEAM, LfgKind, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgBoardStore } from "@features/lfg/stores/lfg-board.store";
import { PlayersService } from "@features/players/services/players.service";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "lol-lfg-board",
    imports: [
        DatePipe,
        FormsModule,
        RouterLink,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
        SkeletonComponent,
        SkeletonTextComponent,
        GameTermPipe,
    ],
    providers: [LfgBoardStore],
    templateUrl: "./lfg-board.component.html",
    styleUrl: "./lfg-board.component.scss",
})
export class LfgBoardComponent implements OnInit {
    protected readonly store = inject(LfgBoardStore);
    private readonly players = inject(PlayersService);

    protected readonly kindPlayer = LFG_KIND_PLAYER;
    protected readonly kindTeam = LFG_KIND_TEAM;
    protected readonly searchPlaceholder = $localize`:@@lol.lfg.board.searchPlaceholder:Search ads…`;
    protected readonly adPlaceholders = [0, 1, 2, 3, 4];

    protected readonly options = resource({
        loader: () => firstValueFrom(this.players.options()),
    });

    public ngOnInit(): void {
        void this.store.search();
    }

    protected loadingOptions(): boolean {
        return this.options.isLoading();
    }

    protected onSearchSubmit(): void {
        void this.store.search();
    }

    protected onFilterChange(): void {
        void this.store.search();
    }

    protected onKindChange(kind: LfgKind): void {
        this.store.kind.set(kind);
        void this.store.search();
    }

    protected adLink(ad: LfgMessage): string[] {
        if (ad.isTeamAd() && ad.teamPublicId) {
            return [`${LOL_GAME_URL}/teams`, ad.teamPublicId];
        }
        return [`${LOL_GAME_URL}/players`, ad.playerPublicId];
    }
}
