import { computed, inject, Injectable, signal } from "@angular/core";
import { TeamUpdateRequestDto } from "@features/teams/dto/team.dto";
import { TeamSheet } from "@features/teams/models/team.model";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { TeamsService } from "@features/teams/services/teams.service";
import { firstValueFrom, Observable } from "rxjs";

@Injectable()
export class TeamSheetStore {
    public readonly sheet = signal<TeamSheet | null>(null);
    public readonly loading = signal(true);
    public readonly notFound = signal(false);
    public readonly saving = signal(false);
    public readonly errorCode = signal<string | null>(null);

    public readonly canModerate = computed(() => this.sheet()?.canModerate() ?? false);
    public readonly canEditSheet = computed(() => this.sheet()?.canEditSheet() ?? false);
    public readonly isCaptain = computed(() => this.sheet()?.isCaptain() ?? false);
    public readonly isMember = computed(() => this.sheet()?.isMember() ?? false);

    private readonly teams = inject(TeamsService);
    private readonly applications = inject(TeamApplicationsService);
    private publicId: string | null = null;

    public async load(publicId: string): Promise<void> {
        this.publicId = publicId;
        this.loading.set(true);
        this.notFound.set(false);
        try {
            this.sheet.set(await firstValueFrom(this.teams.getByPublicId(publicId)));
        } catch {
            this.sheet.set(null);
            this.notFound.set(true);
        } finally {
            this.loading.set(false);
        }
    }

    /** Re-reads the sheet so counters and the viewer standing follow a change made elsewhere. */
    public async refresh(): Promise<void> {
        if (!this.publicId) {
            return;
        }
        try {
            this.sheet.set(await firstValueFrom(this.teams.getByPublicId(this.publicId)));
        } catch {
            // The displayed sheet stays valid; only the counters are one action behind.
        }
    }

    public updateProfile(request: TeamUpdateRequestDto): Promise<boolean> {
        return this.mutate((publicId) => this.teams.update(publicId, request));
    }

    public setRank(playerPublicId: string, rank: string): Promise<boolean> {
        return this.mutate((teamPublicId) => this.teams.setRank({ teamPublicId, playerPublicId, rank }));
    }

    public setRoster(playerPublicId: string, idLane: number, rosterKind: string): Promise<boolean> {
        return this.mutate((teamPublicId) => this.teams.setRoster({ teamPublicId, playerPublicId, idLane, rosterKind }));
    }

    public kick(playerPublicId: string): Promise<boolean> {
        return this.mutate((teamPublicId) => this.teams.kick({ teamPublicId, playerPublicId }));
    }

    public transferCaptaincy(playerPublicId: string): Promise<boolean> {
        return this.mutate((teamPublicId) => this.teams.transferCaptaincy({ teamPublicId, playerPublicId }));
    }

    public async leave(playerPublicId: string): Promise<boolean> {
        const teamPublicId = this.publicId;
        if (!teamPublicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(this.teams.leave({ teamPublicId, playerPublicId }));
            await this.refresh();
        });
    }

    public async disband(confirmation: string): Promise<boolean> {
        const teamPublicId = this.publicId;
        if (!teamPublicId) {
            return false;
        }

        return this.run(() => firstValueFrom(this.teams.disband({ teamPublicId, confirmation })));
    }

    public async apply(message: string, soughtRank: string, idLane: number | null): Promise<boolean> {
        const teamPublicId = this.publicId;
        if (!teamPublicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(
                this.applications.create({
                    teamPublicId,
                    message,
                    soughtRank,
                    ...(idLane !== null ? { idLane } : {}),
                }),
            );
            await this.refresh();
        });
    }

    public async withdrawApplication(): Promise<boolean> {
        const publicId = this.sheet()?.viewerApplicationPublicId;
        if (!publicId) {
            return false;
        }

        return this.run(async () => {
            await firstValueFrom(this.applications.withdraw({ publicId }));
            await this.refresh();
        });
    }

    private mutate(action: (teamPublicId: string) => Observable<TeamSheet>): Promise<boolean> {
        const teamPublicId = this.publicId;
        if (!teamPublicId) {
            return Promise.resolve(false);
        }

        return this.run(async () => {
            this.sheet.set(await firstValueFrom(action(teamPublicId)));
        });
    }

    private async run(action: () => Promise<unknown>): Promise<boolean> {
        this.saving.set(true);
        this.errorCode.set(null);
        try {
            await action();
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.saving.set(false);
        }
    }
}
