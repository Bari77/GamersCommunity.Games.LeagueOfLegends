import { Component, input } from "@angular/core";
import { PlayerSummary } from "@features/home/models/home-feed.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { EntityRowComponent } from "@shared/components/entity-row/entity-row.component";

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
