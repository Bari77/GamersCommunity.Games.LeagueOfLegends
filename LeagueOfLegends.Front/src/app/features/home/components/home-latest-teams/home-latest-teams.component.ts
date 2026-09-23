import { Component, input } from "@angular/core";
import { EntityRowComponent } from "@bari77/gc-ui";
import { TeamSummary } from "@features/teams/models/team.model";
import { gameTerm } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-home-latest-teams",
    imports: [EntityRowComponent],
    templateUrl: "./home-latest-teams.component.html",
    styleUrl: "./home-latest-teams.component.scss",
})
export class HomeLatestTeamsComponent {
    public readonly teams = input.required<TeamSummary[]>();

    protected readonly discoverLabel = $localize`:@@lol.home.teams.cta:Discover this team`;
    protected readonly playersLabel = $localize`:@@lol.home.teams.players:players`;

    protected subtitle(team: TeamSummary): string {
        const parts: string[] = [];
        if (team.regionCode) {
            parts.push(gameTerm(team.regionCode));
        }
        parts.push(`${team.playerSlotCount} ${this.playersLabel}`);
        return parts.join(" · ");
    }

    protected visual(team: TeamSummary): string {
        return team.tag?.charAt(0) || team.entitled.charAt(0) || "?";
    }
}
