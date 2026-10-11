import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { DecisionPromptComponent, SkeletonComponent } from "@bari77/gc-ui";
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
import { championSquareUrl } from "@shared/utils/lol-art";

export interface TeamRankChange {
    playerPublicId: string;
    rank: string;
}

export interface TeamRosterChange {
    playerPublicId: string;
    idLane: number;
    rosterKind: string;
}

const ACTION_REMOVE = "__remove__";
const ACTION_LEAVE = "__leave__";

type RankOption = { value: string; label: string };

type PendingAction = {
    playerPublicId: string;
    value: string;
    heading: string;
    message: string;
    primaryLabel: string;
};

@Component({
    standalone: true,
    selector: "lol-team-roster",
    imports: [
        FormsModule,
        RouterLink,
        GameTermPipe,
        NbButtonModule,
        NbSelectModule,
        SkeletonComponent,
        LaneIconComponent,
        DecisionPromptComponent,
    ],
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
    protected readonly kindMain = ROSTER_KIND_MAIN;
    protected readonly kindSub = ROSTER_KIND_SUB;
    protected readonly laneFieldName = $localize`:@@lol.team.roster.lane:Lane`;
    protected readonly rankFieldName = $localize`:@@lol.team.roster.rank:Rank`;
    protected readonly cancelLabel = $localize`:@@lol.team.roster.cancel:Cancel`;

    protected readonly pending = signal<PendingAction | null>(null);

    protected readonly isCaptain = computed(() => this.viewerRank() === TEAM_RANK_CAPTAIN);
    protected readonly canModerate = computed(
        () => teamRankWeight(this.viewerRank()) >= teamRankWeight(TEAM_RANK_COACH),
    );

    protected playerLink(publicId: string): string[] {
        return [`${LOL_GAME_URL}/players`, publicId];
    }

    protected championSquare(code: string): string {
        return championSquareUrl(code);
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

    protected rankOptions(member: TeamMember): RankOption[] {
        const options: RankOption[] = [{ value: member.rank, label: this.rankLabel(member.rank) }];

        for (const rank of [TEAM_RANK_PLAYER, TEAM_RANK_COACH, TEAM_RANK_MANAGER]) {
            if (this.canSetRank(member, rank)) {
                options.push({ value: rank, label: this.rankLabel(rank) });
            }
        }

        if (this.canTransfer(member)) {
            options.push({
                value: TEAM_RANK_CAPTAIN,
                label: $localize`:@@lol.team.roster.transfer:Make captain`,
            });
        }

        if (this.canKick(member)) {
            options.push({
                value: ACTION_REMOVE,
                label: $localize`:@@lol.team.roster.kick:Remove`,
            });
        }

        if (this.canLeave(member)) {
            options.push({
                value: ACTION_LEAVE,
                label: $localize`:@@lol.team.roster.leave:Leave`,
            });
        }

        return options;
    }

    protected canManageMembership(member: TeamMember): boolean {
        return this.rankOptions(member).length > 1;
    }

    protected hasActions(member: TeamMember): boolean {
        return this.canSetRoster(member) || this.canManageMembership(member);
    }

    protected selectValue(member: TeamMember): string {
        const pending = this.pending();
        if (pending?.playerPublicId === member.playerPublicId) {
            return pending.value;
        }
        return member.rank;
    }

    protected onRankSelect(member: TeamMember, value: string | null): void {
        if (!value || value === member.rank) {
            this.pending.set(null);
            return;
        }

        const name = member.displayName();
        if (value === ACTION_REMOVE) {
            this.pending.set({
                playerPublicId: member.playerPublicId,
                value,
                heading: $localize`:@@lol.team.roster.confirm.remove.heading:Remove member?`,
                message: $localize`:@@lol.team.roster.confirm.remove.message:Remove ${name}:name: from the team?`,
                primaryLabel: $localize`:@@lol.team.roster.kick:Remove`,
            });
            return;
        }

        if (value === ACTION_LEAVE) {
            this.pending.set({
                playerPublicId: member.playerPublicId,
                value,
                heading: $localize`:@@lol.team.roster.confirm.leave.heading:Leave team?`,
                message: $localize`:@@lol.team.roster.confirm.leave.message:Leave this team? You can rejoin later if invited.`,
                primaryLabel: $localize`:@@lol.team.roster.leave:Leave`,
            });
            return;
        }

        if (value === TEAM_RANK_CAPTAIN) {
            this.pending.set({
                playerPublicId: member.playerPublicId,
                value,
                heading: $localize`:@@lol.team.roster.confirm.transfer.heading:Transfer captaincy?`,
                message: $localize`:@@lol.team.roster.confirm.transfer.message:Make ${name}:name: the new captain? You will become a player.`,
                primaryLabel: $localize`:@@lol.team.roster.transfer:Make captain`,
            });
            return;
        }

        const rank = this.rankLabel(value);
        this.pending.set({
            playerPublicId: member.playerPublicId,
            value,
            heading: $localize`:@@lol.team.roster.confirm.rank.heading:Change rank?`,
            message: $localize`:@@lol.team.roster.confirm.rank.message:Set ${name}:name: to ${rank}:rank:?`,
            primaryLabel: $localize`:@@lol.team.roster.confirm.rank.action:Change rank`,
        });
    }

    protected confirmPending(): void {
        const pending = this.pending();
        if (!pending) {
            return;
        }

        const { playerPublicId, value } = pending;
        this.pending.set(null);

        if (value === ACTION_REMOVE) {
            this.kick.emit(playerPublicId);
            return;
        }
        if (value === ACTION_LEAVE) {
            this.leave.emit(playerPublicId);
            return;
        }
        if (value === TEAM_RANK_CAPTAIN) {
            this.transfer.emit(playerPublicId);
            return;
        }
        this.setRank.emit({ playerPublicId, rank: value });
    }

    protected cancelPending(): void {
        this.pending.set(null);
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

    private rankLabel(rank: string): string {
        switch (rank) {
            case TEAM_RANK_CAPTAIN:
                return $localize`:@@lol.team.rank.captain:Captain`;
            case TEAM_RANK_MANAGER:
                return $localize`:@@lol.team.rank.manager:Manager`;
            case TEAM_RANK_COACH:
                return $localize`:@@lol.team.rank.coach:Coach`;
            case TEAM_RANK_PLAYER:
                return $localize`:@@lol.team.rank.player:Player`;
            default:
                return rank;
        }
    }
}
