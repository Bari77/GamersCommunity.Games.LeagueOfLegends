import { CreateWallComponent } from "@bari77/gc-ui";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { GameMembershipStore } from "@core/stores/game-membership.store";

@Component({
    standalone: true,
    selector: "lol-create-sheet-wall",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CreateWallComponent],
    templateUrl: "./create-sheet-wall.component.html",
    styleUrl: "./create-sheet-wall.component.scss",
})
export class CreateSheetWallComponent {
    public readonly variant = input<"block" | "inline">("block");

    public readonly heading = input($localize`:@@lol.sheet.wall.heading:No player profile yet`);

    public readonly message = input(
        $localize`:@@lol.sheet.wall.message:Create your player profile to show your lanes, your champions and join a team.`,
    );

    protected readonly actionLabel = $localize`:@@lol.sheet.wall.action:Create my profile`;

    protected readonly membership = inject(GameMembershipStore);

    protected create(): void {
        void this.membership.createSheetAndOpen();
    }
}
