import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { PLAYGROUND_BANNER } from "@bari77/gc-playground";
import { SkeletonComponent } from "@bari77/gc-ui";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { NbLayoutModule } from "@nebular/theme";
import { environment } from "../environments/environment";
import { PlaygroundContextBarComponent } from "./playground/playground-context-bar.component";

@Component({
    selector: "lol-root",
    standalone: true,
    imports: [RouterOutlet, RouterLink, NbLayoutModule, SkeletonComponent, PlaygroundContextBarComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    protected readonly showBanner = environment.useMocks === true;
    protected readonly banner = PLAYGROUND_BANNER;
    protected readonly membership = inject(GameMembershipStore);
}
