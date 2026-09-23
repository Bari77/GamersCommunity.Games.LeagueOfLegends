import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { TeamSheet } from "@features/teams/models/team.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-team-stats",
    imports: [DatePipe, GameTermPipe],
    templateUrl: "./team-stats.component.html",
    styleUrl: "./team-stats.component.scss",
})
export class TeamStatsComponent {
    public readonly sheet = input.required<TeamSheet>();
}
