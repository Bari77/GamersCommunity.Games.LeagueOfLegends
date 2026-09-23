import { Component, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { PlayerTeam } from "@features/teams/models/team.model";
import { TeamsService } from "@features/teams/services/teams.service";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "lol-player-teams",
    imports: [RouterLink, GameTermPipe, LaneIconComponent, SkeletonComponent],
    templateUrl: "./player-teams.component.html",
    styleUrl: "./player-teams.component.scss",
})
export class PlayerTeamsComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly previewTeams = input<PlayerTeam[] | null>(null);

    protected readonly placeholders = [0, 1];

    private readonly teamsService = inject(TeamsService);

    protected readonly teams = resource({
        params: () => {
            if (this.previewTeams()) {
                return undefined;
            }
            return { playerPublicId: this.playerPublicId() };
        },
        loader: ({ params }) => firstValueFrom(this.teamsService.listByPlayer(params.playerPublicId)),
        defaultValue: [] as PlayerTeam[],
    });

    protected items(): PlayerTeam[] {
        return this.previewTeams() ?? this.teams.value();
    }

    protected loading(): boolean {
        return !this.previewTeams() && this.teams.isLoading();
    }

    protected teamLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/teams`, publicId];
    }
}
