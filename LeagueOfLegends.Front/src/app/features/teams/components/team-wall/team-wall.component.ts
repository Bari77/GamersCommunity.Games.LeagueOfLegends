import { Component, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import {
    EntityWallComponent,
    EntityWallComposerDirective,
    EntityWallEditDirective,
    type EntityWallLabels,
} from "@bari77/gc-widgets";
import { TeamPostFormComponent } from "@features/teams/components/team-post-form/team-post-form.component";
import { GamePost } from "@features/teams/models/game-post.model";
import { GamePostDraft, TeamWallStore } from "@features/teams/stores/team-wall.store";

@Component({
    standalone: true,
    selector: "lol-team-wall",
    imports: [
        EntityWallComponent,
        EntityWallComposerDirective,
        EntityWallEditDirective,
        TeamPostFormComponent,
    ],
    providers: [TeamWallStore],
    templateUrl: "./team-wall.component.html",
})
export class TeamWallComponent implements OnInit {
    public readonly teamPublicId = input.required<string>();
    public readonly canPublish = input(false);
    public readonly canModerate = input(false);
    public readonly playerPublicId = input<string | null>(null);
    public readonly moderated = output<void>();

    protected readonly store = inject(TeamWallStore);
    protected readonly queuedNotice = signal(false);
    protected readonly labels: EntityWallLabels = {
        title: $localize`:@@lol.team.wall.title:Team wall`,
        queue: $localize`:@@lol.team.wall.queue:Awaiting review`,
        queueEmpty: $localize`:@@lol.team.wall.queueEmpty:Nothing waiting for a decision.`,
        empty: $localize`:@@lol.team.wall.empty:The wall is empty for now.`,
        queued: $localize`:@@lol.team.wall.queued:Sent. Staff will review it shortly.`,
        edit: $localize`:@@lol.team.wall.edit:Edit`,
        approve: $localize`:@@lol.team.wall.approve:Approve`,
        reject: $localize`:@@lol.team.wall.reject:Reject`,
        delete: $localize`:@@lol.team.wall.delete:Delete`,
        loadMore: $localize`:@@lol.team.wall.loadMore:Load more`,
    };

    private readonly composer = viewChild<TeamPostFormComponent>("composer");
    private readonly wall = viewChild(EntityWallComponent);

    public async ngOnInit(): Promise<void> {
        await this.store.load(this.teamPublicId(), this.canModerate());
    }

    protected async publish(draft: GamePostDraft): Promise<void> {
        const post = await this.store.publish(draft);
        if (!post) {
            return;
        }

        this.composer()?.reset();
        this.queuedNotice.set(post.isPending());
    }

    protected async saveEdit(post: GamePost, draft: GamePostDraft): Promise<void> {
        const saved = await this.store.edit(post.publicId, draft);
        if (!saved) {
            return;
        }

        this.wall()?.clearEditing();
        this.queuedNotice.set(saved.isPending() && !this.canModerate());
    }

    protected cancelEdit(): void {
        this.wall()?.clearEditing();
    }

    protected onEditStart(): void {
        this.store.errorCode.set(null);
        this.queuedNotice.set(false);
    }

    protected async moderate(event: { post: { publicId: string }; approve: boolean }): Promise<void> {
        if (await this.store.moderate(event.post.publicId, event.approve)) {
            this.moderated.emit();
        }
    }

    protected async remove(post: { publicId: string }): Promise<void> {
        if (await this.store.remove(post.publicId)) {
            this.moderated.emit();
        }
    }
}
