import { inject, Injectable, signal } from "@angular/core";
import { APPLICATION_PENDING, TeamApplication } from "@features/teams/models/team-application.model";
import { TeamApplicationsService } from "@features/teams/services/team-applications.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TeamApplicationsStore {
    public readonly applications = signal<TeamApplication[]>([]);
    public readonly loading = signal(true);
    public readonly reviewing = signal<string | null>(null);
    public readonly errorCode = signal<string | null>(null);

    private readonly service = inject(TeamApplicationsService);

    public async load(teamPublicId: string): Promise<void> {
        this.loading.set(true);
        try {
            this.applications.set(
                await firstValueFrom(this.service.listForTeam({ teamPublicId, status: APPLICATION_PENDING })),
            );
        } catch {
            this.applications.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    public async review(publicId: string, accept: boolean): Promise<boolean> {
        if (this.reviewing()) {
            return false;
        }

        this.reviewing.set(publicId);
        this.errorCode.set(null);
        try {
            await firstValueFrom(this.service.review({ publicId, accept }));
            this.applications.update((current) => current.filter((item) => item.publicId !== publicId));
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.reviewing.set(null);
        }
    }
}
