import { Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DecisionPromptComponent } from "@bari77/gc-ui";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

@Component({
    selector: "lol-home-container",
    standalone: true,
    imports: [NbCardModule, NbButtonModule, RouterLink, CreateSheetWallComponent, DecisionPromptComponent],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {
    public readonly membership = inject(GameMembershipStore);

    public readonly promptOpen = computed(() => this.membership.shouldPromptSheetCreation() && !this.promptAnswered());

    public readonly promptHeading = $localize`:@@lol.sheet.prompt.heading:Créer votre fiche joueur ?`;
    public readonly promptMessage = $localize`:@@lol.sheet.prompt.message:Une fiche joueur vous permet d'enregistrer vos lanes, vos champions et de rejoindre une team. Sans fiche, vous pouvez tout de même parcourir le jeu librement.`;
    public readonly promptCreateLabel = $localize`:@@lol.sheet.prompt.create:Créer ma fiche`;
    public readonly promptBrowseLabel = $localize`:@@lol.sheet.prompt.browse:Continuer anonymement`;
    public readonly promptOptOutLabel = $localize`:@@lol.sheet.prompt.optOut:Ne plus demander`;
    public readonly promptBusyLabel = $localize`:@@lol.sheet.prompt.creating:Création…`;
    public readonly wallHomeMessage = $localize`:@@lol.sheet.wall.homeMessage:Crée ta fiche joueur pour participer à la communauté.`;

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
