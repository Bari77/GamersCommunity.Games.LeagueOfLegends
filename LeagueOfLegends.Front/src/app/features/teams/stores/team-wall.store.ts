import { computed, inject, Injectable, signal } from "@angular/core";
import { GamePost } from "@features/teams/models/game-post.model";
import { GamePostsService } from "@features/teams/services/game-posts.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 20;

export interface GamePostDraft {
    body: string;
}

@Injectable()
export class TeamWallStore {
    public readonly posts = signal<GamePost[]>([]);
    public readonly loading = signal(true);
    public readonly loadingMore = signal(false);
    public readonly hasMore = signal(false);
    public readonly pending = signal<GamePost[]>([]);
    public readonly loadingPending = signal(false);
    public readonly posting = signal(false);
    public readonly errorCode = signal<string | null>(null);
    public readonly pendingCount = computed(() => this.pending().length);

    private readonly gamePosts = inject(GamePostsService);
    private teamPublicId: string | null = null;

    public async load(teamPublicId: string, withPending: boolean): Promise<void> {
        this.teamPublicId = teamPublicId;
        this.loading.set(true);
        try {
            const page = await firstValueFrom(this.gamePosts.listTeamWall({ teamPublicId, take: PAGE_SIZE }));
            this.posts.set(page.items);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loading.set(false);
        }

        if (withPending) {
            await this.loadPending();
        }
    }

    public async loadPending(): Promise<void> {
        const teamPublicId = this.teamPublicId;
        if (!teamPublicId) {
            return;
        }

        this.loadingPending.set(true);
        try {
            const page = await firstValueFrom(this.gamePosts.listPending({ teamPublicId, take: PAGE_SIZE }));
            this.pending.set(page.items);
        } catch {
            this.pending.set([]);
        } finally {
            this.loadingPending.set(false);
        }
    }

    public async loadMore(): Promise<void> {
        const teamPublicId = this.teamPublicId;
        const current = this.posts();
        const last = current.at(-1);
        if (!teamPublicId || !last || !this.hasMore() || this.loadingMore()) {
            return;
        }

        this.loadingMore.set(true);
        try {
            const page = await firstValueFrom(
                this.gamePosts.listTeamWall({
                    teamPublicId,
                    beforeCreationDate: last.creationDate.toISOString(),
                    beforePublicId: last.publicId,
                    take: PAGE_SIZE,
                }),
            );
            const known = new Set(current.map((post) => post.publicId));
            this.posts.set([...current, ...page.items.filter((post) => !known.has(post.publicId))]);
            this.hasMore.set(page.hasMore);
        } finally {
            this.loadingMore.set(false);
        }
    }

    public async publish(draft: GamePostDraft): Promise<GamePost | null> {
        const teamPublicId = this.teamPublicId;
        if (!teamPublicId) {
            return null;
        }

        this.posting.set(true);
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(this.gamePosts.create({ teamPublicId, body: draft.body }));
            if (post.isPending()) {
                this.pending.update((current) => [post, ...current]);
            } else {
                this.posts.update((current) => [post, ...current]);
            }
            return post;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return null;
        } finally {
            this.posting.set(false);
        }
    }

    public async edit(publicId: string, draft: GamePostDraft): Promise<GamePost | null> {
        this.posting.set(true);
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(this.gamePosts.update({ publicId, body: draft.body }));
            this.posts.update((current) => current.filter((item) => item.publicId !== publicId));
            this.pending.update((current) => current.filter((item) => item.publicId !== publicId));
            if (post.isPending()) {
                this.pending.update((current) => [post, ...current]);
            } else {
                this.posts.update((current) => [post, ...current]);
            }
            return post;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return null;
        } finally {
            this.posting.set(false);
        }
    }

    public async moderate(publicId: string, approve: boolean): Promise<boolean> {
        this.errorCode.set(null);
        try {
            const post = await firstValueFrom(this.gamePosts.moderate({ publicId, approve }));
            this.pending.update((current) => current.filter((item) => item.publicId !== publicId));
            if (approve) {
                this.posts.update((current) => [post, ...current]);
            }
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        }
    }

    public async remove(publicId: string): Promise<boolean> {
        this.errorCode.set(null);
        try {
            await firstValueFrom(this.gamePosts.remove({ publicId }));
            this.posts.update((current) => current.filter((item) => item.publicId !== publicId));
            this.pending.update((current) => current.filter((item) => item.publicId !== publicId));
            return true;
        } catch (err: unknown) {
            this.errorCode.set((err as { error?: { Code?: string } })?.error?.Code ?? "UNKNOWN");
            return false;
        }
    }
}
