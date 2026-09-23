import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { NbButtonModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-my-sheet",
    imports: [NbButtonModule, SkeletonComponent],
    templateUrl: "./my-sheet.component.html",
    styleUrl: "./my-sheet.component.scss",
})
export class MySheetComponent {
    public readonly loading = signal(true);
    public readonly needsLogin = signal(false);

    private readonly membership = inject(GameMembershipStore);
    private readonly router = inject(Router);

    public constructor() {
        void this.bootstrap();
    }

    private async bootstrap(): Promise<void> {
        try {
            await this.membership.whenResolved();
            if (!this.membership.isAuthenticated()) {
                this.needsLogin.set(true);
                return;
            }

            const playerPublicId = this.membership.playerPublicId();
            await this.router.navigate(
                playerPublicId ? [`${LOL_GAME_URL}/players`, playerPublicId] : [LOL_GAME_URL],
            );
        } catch {
            this.needsLogin.set(true);
        } finally {
            this.loading.set(false);
        }
    }
}
