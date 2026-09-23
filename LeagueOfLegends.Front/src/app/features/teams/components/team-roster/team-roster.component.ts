import { Component, computed, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SkeletonComponent } from "@bari77/gc-ui";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { CatalogItem } from "@features/players/models/player.model";
import {
    isPlayerSlotRank,
    ROSTER_KIND_MAIN,
    ROSTER_KIND_SUB,
    TEAM_RANK_CAPTAIN,
    TEAM_RANK_COACH,
    TEAM_RANK_MANAGER,
    TEAM_RANK_PLAYER,
    TeamMember,
    teamRankWeight,
} from "@features/teams/models/team.model";
import { NbButtonModule, NbSelectModule } from "@nebular/theme";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";

export interface TeamRankChange {
    playerPublicId: string;
    rank: string;
}

export interface TeamRosterChange {
    playerPublicId: string;
    idLane: number;
    rosterKind: string;
}

@Component({
    standalone: true,
    selector: "lol-team-roster",
    imports: [FormsModule, RouterLink, GameTermPipe, NbButtonModule, NbSelectModule, SkeletonComponent, LaneIconComponent],
    templateUrl: "./team-roster.component.html",
    styleUrl: "./team-roster.component.scss",
})
export class TeamRosterComponent {
    public readonly members = input.required<TeamMember[]>();
    public readonly viewerRank = input<string | null>(null);
    public readonly viewerPlayerPublicId = input<string | null>(null);
    public readonly lanes = input<CatalogItem[]>([]);
    public readonly loading = input(false);
    public readonly busy = input(false);

    public readonly setRank = output<TeamRankChange>();
    public readonly setRoster = output<TeamRosterChange>();
    public readonly kick = output<string>();
    public readonly transfer = output<string>();
    public readonly leave = output<string>();

    protected readonly memberPlaceholders = [0, 1, 2, 3, 4];
    protected readonly rankPlayer = TEAM_RANK_PLAYER;
    protected readonly rankCoach = TEAM_RANK_COACH;
    protected readonly rankManager = TEAM_RANK_MANAGER;
    protected readonly kindMain = ROSTER_KIND_MAIN;
    protected readonly kindSub = ROSTER_KIND_SUB;
    protected readonly laneFieldName = $localize`:@@lol.team.roster.lane:Lane`;

    protected readonly isCaptain = computed(() => this.viewerRank() === TEAM_RANK_CAPTAIN);
    protected readonly canModerate = computed(
        () => teamRankWeight(this.viewerRank()) >= teamRankWeight(TEAM_RANK_COACH),
    );

    protected playerLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/players`, publicId];
    }

    protected isMine(member: TeamMember): boolean {
        return this.viewerPlayerPublicId() === member.playerPublicId;
    }

    protected canKick(member: TeamMember): boolean {
        if (!this.canModerate() || this.isMine(member) || member.isCaptain()) {
            return false;
        }

        if (this.viewerRank() === TEAM_RANK_CAPTAIN) {
            return true;
        }

        return member.rank === TEAM_RANK_PLAYER;
    }

    protected canSetRank(member: TeamMember, rank: string): boolean {
        return this.isCaptain() && !member.isCaptain() && member.rank !== rank;
    }

    protected canSetRoster(member: TeamMember): boolean {
        return this.isCaptain() && member.isPlayerSeat() && this.lanes().length > 0;
    }

    /** Captaincy can only move to a remaining player slot, never to staff. */
    protected canTransfer(member: TeamMember): boolean {
        return this.isCaptain() && isPlayerSlotRank(member.rank) && !member.isCaptain();
    }

    protected canLeave(member: TeamMember): boolean {
        return this.isMine(member) && !member.isCaptain();
    }

    protected hasActions(member: TeamMember): boolean {
        return (
            this.canSetRoster(member) ||
            this.canSetRank(member, TEAM_RANK_PLAYER) ||
            this.canSetRank(member, TEAM_RANK_COACH) ||
            this.canSetRank(member, TEAM_RANK_MANAGER) ||
            this.canTransfer(member) ||
            this.canKick(member) ||
            this.canLeave(member)
        );
    }

    protected onLaneChange(member: TeamMember, idLane: number | null): void {
        if (!idLane || idLane === member.idLane) {
            return;
        }

        this.setRoster.emit({
            playerPublicId: member.playerPublicId,
            idLane,
            rosterKind: member.rosterKind ?? ROSTER_KIND_SUB,
        });
    }

    protected onKind(member: TeamMember, rosterKind: string): void {
        if (!member.idLane || member.rosterKind === rosterKind) {
            return;
        }

        this.setRoster.emit({
            playerPublicId: member.playerPublicId,
            idLane: member.idLane,
            rosterKind,
        });
    }
}
