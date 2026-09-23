import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RichContentComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { TeamApplicationsStore } from "@features/teams/stores/team-applications.store";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-team-applications",
    imports: [
        DatePipe,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbCardModule,
        SkeletonComponent,
        SkeletonTextComponent,
        RichContentComponent,
    ],
    providers: [TeamApplicationsStore],
    templateUrl: "./team-applications.component.html",
    styleUrl: "./team-applications.component.scss",
})
export class TeamApplicationsComponent implements OnInit {
    public readonly teamPublicId = input.required<string>();

    /** Fired after a decision so the sheet can refresh its roster and counters. */
    public readonly reviewed = output<void>();

    protected readonly store = inject(TeamApplicationsStore);
    protected readonly applicationPlaceholders = [0, 1];

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.teamPublicId());
    }

    protected playerLink(playerPublicId: string): string[] {
        return [`${LOL_GAME_URL}/players`, playerPublicId];
    }

    protected async review(publicId: string, accept: boolean): Promise<void> {
        if (await this.store.review(publicId, accept)) {
            this.reviewed.emit();
        }
    }
}
