import { DatePipe } from "@angular/common";
import { Component, input, model } from "@angular/core";
import { TeamSheet } from "@features/teams/models/team.model";
import { NbButtonModule, NbIconModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-team-hero",
    imports: [DatePipe, GameTermPipe, NbButtonModule, NbIconModule],
    templateUrl: "./team-hero.component.html",
    styleUrl: "./team-hero.component.scss",
})
export class TeamHeroComponent {
    public readonly team = input.required<TeamSheet>();
    public readonly canEdit = input(false);
    public readonly settingsOpen = model(false);

    protected readonly gameName = $localize`:@@lol.game.name:League of Legends`;
}
