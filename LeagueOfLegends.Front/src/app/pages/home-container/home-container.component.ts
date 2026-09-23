import { Component, computed, inject, signal } from "@angular/core";
import { DecisionPromptComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { HomeLatestPlayersComponent } from "@features/home/components/home-latest-players/home-latest-players.component";
import { HomeLatestTeamsComponent } from "@features/home/components/home-latest-teams/home-latest-teams.component";
import { HomeFeedStore } from "@features/home/stores/home-feed.store";
import { LfgChatComponent } from "@features/lfg/components/lfg-chat/lfg-chat.component";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { NbCardModule } from "@nebular/theme";

@Component({
    selector: "lol-home-container",
    standalone: true,
    imports: [
        NbCardModule,
        CreateSheetWallComponent,
        DecisionPromptComponent,
        LfgChatComponent,
        HomeLatestPlayersComponent,
        HomeLatestTeamsComponent,
        SkeletonComponent,
        SkeletonTextComponent,
    ],
    providers: [HomeFeedStore],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly store = inject(HomeFeedStore);
    public readonly membership = inject(GameMembershipStore);

    public readonly feedLoading = computed(() => this.store.loading() || this.membership.creating());
    public readonly promptOpen = computed(() => this.membership.shouldPromptSheetCreation() && !this.promptAnswered());

    public readonly promptHeading = $localize`:@@lol.sheet.prompt.heading:Create your player profile?`;
    public readonly promptMessage = $localize`:@@lol.sheet.prompt.message:A player profile lets you register your lanes, your champions and join a team. Without one you can still browse the game freely.`;
    public readonly promptCreateLabel = $localize`:@@lol.sheet.prompt.create:Create my profile`;
    public readonly promptBrowseLabel = $localize`:@@lol.sheet.prompt.browse:Keep browsing anonymously`;
    public readonly promptOptOutLabel = $localize`:@@lol.sheet.prompt.optOut:Don't ask again`;
    public readonly promptBusyLabel = $localize`:@@lol.sheet.prompt.creating:Creating…`;
    public readonly wallHomeMessage = $localize`:@@lol.sheet.wall.homeMessage:Create your player profile to take part in the game community.`;
    protected readonly rowPlaceholders = [0, 1, 2];

    public readonly optOut = signal(false);

    private readonly promptAnswered = signal(false);

    public onPromptCreate(): void {
        this.promptAnswered.set(true);
        void this.membership.createSheetAndOpen();
    }

    public onPromptDismiss(): void {
        if (this.optOut()) {
            this.membership.dismissPrompt();
        }
        this.promptAnswered.set(true);
    }
}
