/// <reference types="@angular/localize" />

import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PLAYGROUND_BANNER } from "@bari77/gc-playground";
import { PlaygroundHeaderComponent } from "@bari77/gc-playground/components";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { NbLayoutModule } from "@nebular/theme";
import { environment } from "../environments/environment";
import { PlaygroundContextBarComponent } from "./playground/playground-context-bar.component";

@Component({
    selector: "lol-root",
    standalone: true,
    imports: [RouterOutlet, NbLayoutModule, PlaygroundContextBarComponent, PlaygroundHeaderComponent],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    protected readonly gameUrl = LOL_GAME_URL;
    protected readonly mark = environment.useMocks
        ? PLAYGROUND_BANNER
        : $localize`:@@lol.playground.banner:League of Legends`;
    protected readonly membership = inject(GameMembershipStore);
}
