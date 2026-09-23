import { DatePipe } from "@angular/common";
import {
    afterRenderEffect,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    signal,
    viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgChatStore } from "@features/lfg/stores/lfg-chat.store";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { NbChatModule } from "@nebular/theme";
import { SkeletonComponent } from "@bari77/gc-ui";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";

const NEAR_BOTTOM_PX = 48;
const NEAR_TOP_PX = 48;

@Component({
    standalone: true,
    selector: "lol-lfg-chat",
    imports: [DatePipe, RouterLink, NbChatModule, SkeletonComponent, CreateSheetWallComponent],
    providers: [LfgChatStore],
    templateUrl: "./lfg-chat.component.html",
    styleUrl: "./lfg-chat.component.scss",
})
export class LfgChatComponent implements OnInit, OnDestroy {
    public readonly store = inject(LfgChatStore);
    public readonly realtime = inject(LfgRealtimeService);
    public readonly composePlaceholder = $localize`:@@lol.home.lfg.bodyPlaceholder:Type a message…`;
    public readonly newMessagesLabel = $localize`:@@lol.home.lfg.newMessages:New messages`;
    public readonly loadingOlderLabel = $localize`:@@lol.home.lfg.loadingOlder:Loading older messages…`;
    public readonly sheetWallMessage = $localize`:@@lol.sheet.wall.lfgMessage:Create your player profile to post in this chat.`;

    protected readonly messagePlaceholders = [0, 1, 2, 3];

    public readonly stickToBottom = signal(true);
    public readonly pendingBelowCount = signal(0);

    private readonly viewport = viewChild<ElementRef<HTMLElement>>("viewport");
    private lastTailPublicId: string | null = null;
    private loadingOlder = false;

    public constructor() {
        afterRenderEffect(() => {
            const messages = this.store.messages();
            const loading = this.store.loading();
            const tailPublicId = messages.at(-1)?.publicId ?? null;

            if (loading || messages.length === 0) {
                return;
            }

            if (tailPublicId == null || tailPublicId === this.lastTailPublicId) {
                if (messages.length > 0 && this.lastTailPublicId == null) {
                    this.lastTailPublicId = tailPublicId;
                    this.scrollToBottom(false);
                }
                return;
            }

            const isInitialPin = this.lastTailPublicId == null;
            this.lastTailPublicId = tailPublicId;
            if (this.stickToBottom()) {
                this.pendingBelowCount.set(0);
                this.scrollToBottom(!isInitialPin);
                return;
            }

            this.pendingBelowCount.update((count) => count + 1);
        });
    }

    public async ngOnInit(): Promise<void> {
        await this.store.init();
    }

    public ngOnDestroy(): void {
        this.store.destroy();
    }

    public messageAvatar(message: LfgMessage): string {
        const session = this.store.session();
        if (session && message.platformUserPublicId === session.publicId && session.avatarUrl) {
            return session.avatarUrl;
        }
        return message.senderAvatarUrl;
    }

    public onChatSend(event: { message: string; files: File[] }): void {
        const text = event.message.trim();
        if (!text || !this.store.canSend()) {
            return;
        }
        this.stickToBottom.set(true);
        this.pendingBelowCount.set(0);
        void this.store.send(text);
        this.scrollToBottom(true);
    }

    public onViewportScroll(): void {
        const el = this.viewport()?.nativeElement;
        if (!el) {
            return;
        }

        const distanceBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const nearBottom = distanceBottom <= NEAR_BOTTOM_PX;
        this.stickToBottom.set(nearBottom);
        if (nearBottom) {
            this.pendingBelowCount.set(0);
        }

        if (el.scrollTop <= NEAR_TOP_PX) {
            void this.tryLoadOlder(el);
        }
    }

    public jumpToLatest(): void {
        this.pendingBelowCount.set(0);
        this.stickToBottom.set(true);
        this.scrollToBottom(true);
    }

    private scrollToBottom(smooth: boolean): void {
        const el = this.viewport()?.nativeElement;
        if (!el) {
            return;
        }
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    }

    private async tryLoadOlder(el: HTMLElement): Promise<void> {
        if (this.loadingOlder || !this.store.hasMore() || this.store.loadingOlder()) {
            return;
        }

        this.loadingOlder = true;
        const previousHeight = el.scrollHeight;
        const previousTop = el.scrollTop;
        try {
            const loaded = await this.store.loadOlder();
            if (!loaded) {
                return;
            }
            queueMicrotask(() => {
                const next = this.viewport()?.nativeElement;
                if (!next) {
                    return;
                }
                next.scrollTop = next.scrollHeight - previousHeight + previousTop;
            });
        } finally {
            this.loadingOlder = false;
        }
    }
}
