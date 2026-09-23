import { Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DecisionPromptComponent } from "@bari77/gc-ui";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { NbButtonModule } from "@nebular/theme";

@Component({
    selector: "lol-home-container",
    standalone: true,
    imports: [NbButtonModule, RouterLink, CreateSheetWallComponent, DecisionPromptComponent, LaneIconComponent],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly membership = inject(GameMembershipStore);

    public readonly promptOpen = computed(() => this.membership.shouldPromptSheetCreation() && !this.promptAnswered());

    public readonly promptHeading = $localize`:@@lol.sheet.prompt.heading:Create your player profile?`;
    public readonly promptMessage = $localize`:@@lol.sheet.prompt.message:A player profile lets you register your lanes, your champions and join a team. Without one you can still browse the game freely.`;
    public readonly promptCreateLabel = $localize`:@@lol.sheet.prompt.create:Create my profile`;
    public readonly promptBrowseLabel = $localize`:@@lol.sheet.prompt.browse:Keep browsing anonymously`;
    public readonly promptOptOutLabel = $localize`:@@lol.sheet.prompt.optOut:Don't ask again`;
    public readonly promptBusyLabel = $localize`:@@lol.sheet.prompt.creating:Creating…`;
    public readonly wallHomeMessage = $localize`:@@lol.sheet.wall.homeMessage:Create your player profile to take part in the game community.`;
    public readonly lanes = ["top", "jungle", "mid", "bottom", "support"] as const;

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
