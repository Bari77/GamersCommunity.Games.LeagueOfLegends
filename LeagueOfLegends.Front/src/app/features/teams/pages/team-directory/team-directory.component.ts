import { Component, computed, inject, OnInit, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { RichContentComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { PlayerOptions } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { TeamCreateFormComponent } from "@features/teams/components/team-create-form/team-create-form.component";
import { TeamCreateRequestDto } from "@features/teams/dto/team.dto";
import { TeamApplication } from "@features/teams/models/team-application.model";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { TeamsService } from "@features/teams/services/teams.service";
import { TeamDirectoryStore } from "@features/teams/stores/team-directory.store";
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const NO_OPTIONS = new PlayerOptions([], [], [], [], [], []);

@Component({
    standalone: true,
    selector: "lol-team-directory",
    imports: [
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        NbInputModule,
        NbSelectModule,
        RichContentComponent,
        SkeletonComponent,
        SkeletonTextComponent,
        CreateSheetWallComponent,
        TeamCreateFormComponent,
    ],
    providers: [TeamDirectoryStore],
    templateUrl: "./team-directory.component.html",
    styleUrl: "./team-directory.component.scss",
})
export class TeamDirectoryComponent implements OnInit {
    protected readonly store = inject(TeamDirectoryStore);
    protected readonly membership = inject(GameMembershipStore);

    protected readonly searchPlaceholder = $localize`:@@lol.team.directory.searchPlaceholder:Team name, tag or Name#1234`;
    protected readonly sheetWallMessage = $localize`:@@lol.team.directory.sheetWall:Create your player profile to found a team or apply to one.`;

    protected readonly teamPlaceholders = [0, 1, 2, 3, 4, 5];
    protected readonly creating = signal(false);
    protected readonly createErrorCode = signal<string | null>(null);
    protected readonly formOpen = signal(false);

    protected readonly options = resource({
        loader: () => firstValueFrom(this.players.options()),
        defaultValue: NO_OPTIONS,
    });

    protected readonly loadingOptions = computed(() => ResourceUtils.isPending(this.options));

    protected readonly pendingApplications = computed(() =>
        this.myApplications.value().filter((application) => application.isPending()),
    );

    private readonly applications = inject(TeamApplicationsService);
    private readonly players = inject(PlayersService);
    private readonly teams = inject(TeamsService);
    private readonly router = inject(Router);

    private readonly myApplications = resource({
        params: () => this.membership.playerPublicId() ?? undefined,
        loader: () => firstValueFrom(this.applications.listMine()),
        defaultValue: [] as TeamApplication[],
    });

    public async ngOnInit(): Promise<void> {
        await this.store.search();
    }

    protected closeForm(): void {
        this.formOpen.set(false);
    }

    protected applicationLink(application: TeamApplication): string[] {
        return this.teamLink(application.teamPublicId);
    }

    protected onSearchSubmit(): void {
        void this.store.search();
    }

    protected onFilterChange(): void {
        void this.store.search();
    }

    protected async onCreate(request: TeamCreateRequestDto): Promise<void> {
        this.creating.set(true);
        this.createErrorCode.set(null);
        try {
            const sheet = await firstValueFrom(this.teams.create(request));
            this.formOpen.set(false);
            await this.router.navigate([`${LOL_GAME_URL}/teams`, sheet.publicId]);
        } catch (err: unknown) {
            this.createErrorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
        } finally {
            this.creating.set(false);
        }
    }

    protected teamLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/teams`, publicId];
    }
}
