import { CreateWallComponent } from "@bari77/gc-ui";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { GameMembershipStore } from "@core/stores/game-membership.store";

@Component({
    standalone: true,
    selector: "lol-create-sheet-wall",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CreateWallComponent],
    template: `
        <gc-create-wall
            [variant]="variant()"
            [heading]="heading()"
            [message]="message()"
            [actionLabel]="actionLabel"
            [busy]="membership.creating()"
            (action)="create()"
        />
    `,
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],
})
export class CreateSheetWallComponent {
    public readonly variant = input<"block" | "inline">("block");

    public readonly heading = input("Pas encore de fiche");

    public readonly message = input(
        "Crée ta fiche joueur pour afficher tes lanes, tes champions et rejoindre une team.",
    );

    protected readonly actionLabel = "Créer ma fiche";

    protected readonly membership = inject(GameMembershipStore);

    protected create(): void {
        void this.membership.createSheetAndOpen();
    }
}
