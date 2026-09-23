import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { TeamLinkCreateRequestDto, TeamLinkUpdateRequestDto } from "@features/teams/dto/team-link.dto";
import { TeamLink } from "@features/teams/models/team-link.model";
import { TeamLinkService } from "@features/teams/services/team-link.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TeamLinkStore {
    public readonly items = resource({
        params: () => this.teamPublicId(),
        loader: ({ params }) => firstValueFrom(this.service.list(params)),
        defaultValue: [] as TeamLink[],
    });

    public readonly loading = computed(() => this.items.isLoading());
    public readonly saving = signal(false);
    public readonly errorCode = signal<string | null>(null);

    private readonly teamPublicId = signal<string | undefined>(undefined);
    private readonly service = inject(TeamLinkService);

    public setContext(teamPublicId: string): void {
        this.teamPublicId.set(teamPublicId);
    }

    public create(data: Omit<TeamLinkCreateRequestDto, "teamPublicId">): Promise<boolean> {
        const teamPublicId = this.teamPublicId();
        if (!teamPublicId) {
            return Promise.resolve(false);
        }

        return this.run(() => firstValueFrom(this.service.create({ ...data, teamPublicId })));
    }

    public update(publicId: string, data: TeamLinkUpdateRequestDto): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.update(publicId, data)));
    }

    public remove(publicId: string): Promise<boolean> {
        return this.run(() => firstValueFrom(this.service.remove(publicId)));
    }

    public move(publicId: string, offset: number): Promise<boolean> {
        const teamPublicId = this.teamPublicId();
        const order = this.items.value().map((link) => link.publicId);
        const from = order.indexOf(publicId);
        const to = from + offset;
        if (!teamPublicId || from < 0 || to < 0 || to >= order.length) {
            return Promise.resolve(false);
        }

        order.splice(to, 0, ...order.splice(from, 1));
        return this.run(() => firstValueFrom(this.service.reorder(teamPublicId, order)));
    }

    private async run(action: () => Promise<unknown>): Promise<boolean> {
        this.saving.set(true);
        this.errorCode.set(null);
        try {
            await action();
            this.items.reload();
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        } finally {
            this.saving.set(false);
        }
    }
}
