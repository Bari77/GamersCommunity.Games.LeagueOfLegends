import { Component, input } from "@angular/core";
import { EntityRowComponent } from "@bari77/gc-ui";
import { PlayerSummary } from "@features/home/models/home-feed.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-home-latest-players",
    imports: [EntityRowComponent, GameTermPipe],
    templateUrl: "./home-latest-players.component.html",
    styleUrl: "./home-latest-players.component.scss",
})
export class HomeLatestPlayersComponent {
    public readonly players = input.required<PlayerSummary[]>();

    protected readonly discoverLabel = $localize`:@@lol.home.players.cta:Discover their player sheet`;
}
