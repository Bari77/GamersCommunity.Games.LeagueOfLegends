import { computed, Injectable, inject, signal } from "@angular/core";
import { CreateLfgMessageRequestDto } from "@features/lfg/dto/lfg-message.dto";
import { LFG_KIND_TEAM, LfgKind, LfgMessage, PostableTeam } from "@features/lfg/models/lfg-message.model";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { LfgChatService, PostableTeamsService } from "@features/lfg/services/lfg-chat.service";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { firstValueFrom } from "rxjs";

const PAGE_SIZE = 50;
const POST_COOLDOWN_MS = 3 * 60 * 1000;

@Injectable()
export class LfgChatStore {
    public readonly messages = signal<LfgMessage[]>([]);
    public readonly loading = signal(true);
    public readonly loadingOlder = signal(false);
    public readonly hasMore = signal(true);
    public readonly posting = signal(false);
    public readonly cooldownUntil = signal(0);
    public readonly cooldownSeconds = signal(0);

    public readonly session = computed(() => this.membership.session());
    public readonly playerPublicId = computed(() => this.membership.playerPublicId());
    public readonly isMuted = computed(() => this.session()?.activeMute != null);

    /** Posting an ad ties it to a player sheet, so a visitor without one may only read. */
    public readonly canPost = computed(() => this.membership.isAuthenticated() && this.membership.hasSheet());

    /** Logged in but sheet-less: the composer is replaced by an invitation to create it. */
    public readonly needsSheet = computed(() => this.membership.needsSheet());

    /** Teams the player may post for. Only loaded on the team recruitment thread. */
    public readonly postableTeams = signal<PostableTeam[]>([]);

    /** Public id of the team the next ad is published for. Always null on the player thread. */
    public readonly postingAs = signal<string | null>(null);

    public readonly canSend = computed(
        () =>
            this.canPost() &&
            !this.isMuted() &&
            !this.posting() &&
            (this.kind !== LFG_KIND_TEAM || this.postingAs() !== null) &&
            Date.now() >= this.cooldownUntil(),
    );

    /** No team grants captain/coach/manager, so the recruitment composer can never be unlocked. */
    public readonly hasNoPostableTeam = computed(
        () => this.kind === LFG_KIND_TEAM && this.canPost() && this.postableTeams().length === 0,
    );

    private kind: LfgKind = "player";
    private realtimeHandler: ((message: LfgMessage) => void) | null = null;

    private readonly chat = inject(LfgChatService);
    private readonly teams = inject(PostableTeamsService);
    private readonly membership = inject(GameMembershipStore);
    private readonly realtime = inject(LfgRealtimeService);
    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    public async init(kind: LfgKind): Promise<void> {
        this.kind = kind;
        this.loading.set(true);
        try {
            await this.loadSession();
            const messages = await firstValueFrom(this.chat.listRecent(kind));
            this.messages.set(messages);
            this.hasMore.set(messages.length >= PAGE_SIZE);
            this.syncCooldownFromMessages(messages);
            this.realtimeHandler = (message) => {
                if (message.kind === this.kind) {
                    this.appendMessage(message);
                }
            };
            await this.realtime.connect(this.realtimeHandler);
        } finally {
            this.loading.set(false);
        }
    }

    public async send(body: string): Promise<void> {
        const trimmed = body.trim();
        if (!trimmed || !this.canSend()) {
            return;
        }

        this.posting.set(true);
        try {
            const teamPublicId = this.postingAs();
            const payload: CreateLfgMessageRequestDto = {
                body: trimmed,
                ...(teamPublicId ? { teamPublicId } : {}),
            };
            const message = await firstValueFrom(this.chat.send(payload));
            this.appendMessage(message);
            this.cooldownUntil.set(Date.now() + POST_COOLDOWN_MS);
            this.startCooldownTicker();
        } catch (err: unknown) {
            const code = (err as { error?: { Code?: string } })?.error?.Code;
            if (code === "COOLDOWN") {
                this.cooldownUntil.set(Date.now() + POST_COOLDOWN_MS);
                this.startCooldownTicker();
            }
            throw err;
        } finally {
            this.posting.set(false);
        }
    }

    public async loadOlder(): Promise<boolean> {
        const current = this.messages();
        if (!this.hasMore() || this.loadingOlder() || current.length === 0) {
            return false;
        }

        const oldest = current[0];
        this.loadingOlder.set(true);
        try {
            const page = await firstValueFrom(this.chat.listBefore(this.kind, oldest));
            if (page.length === 0) {
                this.hasMore.set(false);
                return false;
            }

            const known = new Set(current.map((item) => item.publicId));
            const older = page.filter((item) => !known.has(item.publicId));
            this.messages.set([...older, ...current]);
            this.hasMore.set(page.length >= PAGE_SIZE);
            return older.length > 0;
        } finally {
            this.loadingOlder.set(false);
        }
    }

    public destroy(): void {
        this.stopCooldownTicker();
        if (this.realtimeHandler) {
            void this.realtime.disconnect(this.realtimeHandler);
            this.realtimeHandler = null;
        }
    }

    public selectTeam(teamPublicId: string): void {
        this.postingAs.set(teamPublicId);
    }

    /** Reading the chat must never create anything, so the sheet is only looked up, never loaded. */
    private async loadSession(): Promise<void> {
        await this.membership.whenResolved();
        const session = this.session();
        if (!session) {
            this.postableTeams.set([]);
            this.postingAs.set(null);
            return;
        }

        if (this.kind !== LFG_KIND_TEAM || !this.canPost()) {
            return;
        }

        try {
            await this.loadPostableTeams();
        } catch {
            this.postableTeams.set([]);
            this.postingAs.set(null);
        }
    }

    /**
     * A single team is pre-selected so nothing is asked of a player who only leads one. With
     * several, the composer waits for an explicit choice to avoid posting for the wrong team.
     */
    private async loadPostableTeams(): Promise<void> {
        const teams = await firstValueFrom(this.teams.listPostable());
        this.postableTeams.set(teams);
        this.postingAs.set(teams.length === 1 ? teams[0].publicId : null);
    }

    private appendMessage(message: LfgMessage): void {
        const current = this.messages();
        if (current.some((item) => item.publicId === message.publicId)) {
            return;
        }
        this.messages.set([...current, message]);
        if (message.isMine(this.session()?.publicId, this.playerPublicId())) {
            this.syncCooldownFromMessages([...current, message]);
        }
    }

    private syncCooldownFromMessages(messages: LfgMessage[]): void {
        const playerPublicId = this.playerPublicId();
        if (!playerPublicId) {
            return;
        }

        const lastMine = messages.filter((message) => message.playerPublicId === playerPublicId).at(-1);
        if (!lastMine) {
            return;
        }

        const until = lastMine.creationDate.getTime() + POST_COOLDOWN_MS;
        if (until > Date.now()) {
            this.cooldownUntil.set(until);
            this.startCooldownTicker();
        }
    }

    private startCooldownTicker(): void {
        this.tickCooldown();
        if (this.cooldownTimer) {
            return;
        }
        this.cooldownTimer = setInterval(() => this.tickCooldown(), 1000);
    }

    private tickCooldown(): void {
        const remaining = Math.max(0, Math.ceil((this.cooldownUntil() - Date.now()) / 1000));
        this.cooldownSeconds.set(remaining);
        if (remaining === 0) {
            this.stopCooldownTicker();
        }
    }

    private stopCooldownTicker(): void {
        if (!this.cooldownTimer) {
            return;
        }
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
    }
}
