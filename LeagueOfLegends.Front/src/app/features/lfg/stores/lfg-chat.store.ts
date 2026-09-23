import { computed, Injectable, inject, signal } from "@angular/core";
import { GameMembershipStore } from "@core/stores/game-membership.store";
import { LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgChatService } from "@features/lfg/services/lfg-chat.service";
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

    public readonly canPost = computed(() => this.membership.isAuthenticated() && this.membership.hasSheet());
    public readonly needsSheet = computed(() => this.membership.needsSheet());
    public readonly canSend = computed(
        () => this.canPost() && !this.isMuted() && !this.posting() && Date.now() >= this.cooldownUntil(),
    );

    private readonly chat = inject(LfgChatService);
    private readonly membership = inject(GameMembershipStore);
    private readonly realtime = inject(LfgRealtimeService);
    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    public async init(): Promise<void> {
        this.loading.set(true);
        try {
            await this.membership.whenResolved();
            const messages = await firstValueFrom(this.chat.listRecent());
            this.messages.set(messages);
            this.hasMore.set(messages.length >= PAGE_SIZE);
            this.syncCooldownFromMessages(messages);
            await this.realtime.connect((message) => this.appendMessage(message));
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
            const message = await firstValueFrom(this.chat.send({ body: trimmed }));
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
            const page = await firstValueFrom(this.chat.listBefore(oldest));
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
        void this.realtime.disconnect();
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
