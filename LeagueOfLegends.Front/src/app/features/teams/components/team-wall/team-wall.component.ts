import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RichContentComponent, SkeletonComponent, SkeletonTextComponent } from "@bari77/gc-ui";
import { TeamPostFormComponent } from "@features/teams/components/team-post-form/team-post-form.component";
import { GamePost } from "@features/teams/models/game-post.model";
import { GamePostDraft, TeamWallStore } from "@features/teams/stores/team-wall.store";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-team-wall",
    imports: [
        DatePipe,
        RouterLink,
        TeamPostFormComponent,
        NbButtonModule,
        NbCardModule,
        SkeletonComponent,
        SkeletonTextComponent,
        RichContentComponent,
    ],
    providers: [TeamWallStore],
    templateUrl: "./team-wall.component.html",
    styleUrl: "./team-wall.component.scss",
})
export class TeamWallComponent implements OnInit {
    public readonly teamPublicId = input.required<string>();
    public readonly canPublish = input(false);
    public readonly canModerate = input(false);
    public readonly playerPublicId = input<string | null>(null);
    public readonly moderated = output<void>();

    protected readonly store = inject(TeamWallStore);
    protected readonly postPlaceholders = [0, 1, 2];
    protected readonly editingId = signal<string | null>(null);
    protected readonly queuedNotice = signal(false);

    private readonly composer = viewChild<TeamPostFormComponent>("composer");

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

        this.editingId.set(null);
        this.queuedNotice.set(saved.isPending() && !this.canModerate());
    }

    protected startEdit(post: GamePost): void {
        this.store.errorCode.set(null);
        this.queuedNotice.set(false);
        this.editingId.set(post.publicId);
    }

    protected cancelEdit(): void {
        this.editingId.set(null);
    }

    protected async moderate(post: GamePost, approve: boolean): Promise<void> {
        if (await this.store.moderate(post.publicId, approve)) {
            this.moderated.emit();
        }
    }

    protected async remove(post: GamePost): Promise<void> {
        if (await this.store.remove(post.publicId)) {
            this.moderated.emit();
        }
    }

    protected canDelete(post: GamePost): boolean {
        return this.canModerate() || this.isAuthor(post);
    }

    protected isAuthor(post: GamePost): boolean {
        return post.isMine(this.playerPublicId());
    }
}
