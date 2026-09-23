import { Component, computed, effect, inject, input, OnInit, resource, signal, untracked } from "@angular/core";
import { Router } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import {
    parseWorkspace,
    serializeWorkspace,
    WidgetWorkspace,
    WidgetWorkspaceComponent,
} from "@bari77/gc-widgets";
import defaultLayout from "../../../../../../config/team/workspace.default.json";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { PlayerOptions } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { TeamAdminComponent } from "@features/teams/components/team-admin/team-admin.component";
import { TeamApplicationDraft } from "@features/teams/components/team-apply-form/team-apply-form.component";
import { TeamHeroComponent } from "@features/teams/components/team-hero/team-hero.component";
import { TeamRankChange, TeamRosterChange } from "@features/teams/components/team-roster/team-roster.component";
import { TeamUpdateRequestDto } from "@features/teams/dto/team.dto";
import { TeamLinkStore } from "@features/teams/stores/team-link.store";
import { TeamSheetStore } from "@features/teams/stores/team-sheet.store";
import {
    TEAM_PAGE_VISIBILITY_OPTIONS,
    TEAM_WIDGET_CATALOG,
    TEAM_WORKSPACE_COLUMNS,
    TEAM_WORKSPACE_ROW_HEIGHT,
} from "@features/teams/workspace/widget-catalog";
import { LolTeamWidgetTemplateHostComponent } from "@features/teams/workspace/widget-template-host.component";
import { NbCardModule } from "@nebular/theme";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const NO_OPTIONS = new PlayerOptions([], [], [], [], [], []);

@Component({
    standalone: true,
    selector: "lol-team-sheet",
    imports: [
        NbCardModule,
        SkeletonComponent,
        TeamAdminComponent,
        TeamHeroComponent,
        LolTeamWidgetTemplateHostComponent,
        WidgetWorkspaceComponent,
    ],
    providers: [TeamSheetStore, TeamLinkStore],
    templateUrl: "./team-sheet.component.html",
    styleUrl: "./team-sheet.component.scss",
})
export class TeamSheetComponent implements OnInit {
    public readonly publicId = input.required<string>();

    public readonly catalog = TEAM_WIDGET_CATALOG;
    public readonly columns = TEAM_WORKSPACE_COLUMNS;
    public readonly rowHeight = TEAM_WORKSPACE_ROW_HEIGHT;
    public readonly pageVisibilityOptions = TEAM_PAGE_VISIBILITY_OPTIONS;

    protected readonly store = inject(TeamSheetStore);
    protected readonly membership = inject(GameMembershipStore);

    /** The page belongs to the captain; managers still get the pencil and the gear. */
    protected readonly canEditLayout = computed(() => this.store.isCaptain());

    protected readonly editing = signal(false);
    protected readonly settingsOpen = signal(false);
    protected readonly saveFailed = signal(false);

    /** A saved layout comes back on the refreshed sheet, so the server stays the single source. */
    protected readonly workspace = computed(() =>
        parseWorkspace(
            this.store.sheet()?.layoutJson,
            defaultLayout as WidgetWorkspace,
            TEAM_WORKSPACE_COLUMNS,
            TEAM_WIDGET_CATALOG.map((entry) => entry.type),
        ),
    );

    protected readonly options = resource({
        loader: () => firstValueFrom(this.players.options()),
        defaultValue: NO_OPTIONS,
    });

    protected readonly applyLoading = computed(() => ResourceUtils.isPending(this.options));

    private readonly players = inject(PlayersService);
    private readonly router = inject(Router);

    public constructor() {
        effect(() => {
            this.publicId();
            untracked(() => {
                this.editing.set(false);
                this.settingsOpen.set(false);
                this.saveFailed.set(false);
            });
        });
    }

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.publicId());
    }

    protected async onSaveLayout(workspace: WidgetWorkspace): Promise<void> {
        this.saveFailed.set(false);

        if (await this.store.updateProfile({ layoutJson: serializeWorkspace(workspace) })) {
            this.editing.set(false);
        } else {
            this.saveFailed.set(true);
        }
    }

    protected onSave(request: TeamUpdateRequestDto): void {
        void this.store.updateProfile(request);
    }

    protected onSetRank(change: TeamRankChange): void {
        void this.store.setRank(change.playerPublicId, change.rank);
    }

    protected onSetRoster(change: TeamRosterChange): void {
        void this.store.setRoster(change.playerPublicId, change.idLane, change.rosterKind);
    }

    protected onKick(playerPublicId: string): void {
        void this.store.kick(playerPublicId);
    }

    protected onTransfer(playerPublicId: string): void {
        void this.store.transferCaptaincy(playerPublicId);
    }

    protected onLeave(playerPublicId: string): void {
        void this.store.leave(playerPublicId);
    }

    protected onApply(draft: TeamApplicationDraft): void {
        void this.store.apply(draft.message, draft.soughtRank, draft.idLane);
    }

    protected onWithdraw(): void {
        void this.store.withdrawApplication();
    }

    /** The sheet no longer exists once disbanded, so the visitor lands back on the directory. */
    protected async onDisband(confirmation: string): Promise<void> {
        if (await this.store.disband(confirmation)) {
            await this.router.navigate([`${LOL_GAME_URL}/teams`]);
        }
    }

    protected onRosterChanged(): void {
        void this.store.refresh();
    }
}
