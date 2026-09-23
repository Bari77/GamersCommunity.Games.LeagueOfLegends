import { Component, computed, inject, input, OnDestroy, OnInit } from "@angular/core";
import {
    LfgChatComponent as GcLfgChatComponent,
    LfgChatNeedsSheetDirective,
    LfgChatPublishErrorDirective,
    type LfgChatComposerState,
    type LfgChatLabels,
    type LfgChatMessage as GcLfgChatMessage,
    type LfgChatPosterOption,
} from "@bari77/gc-widgets";
import { LFG_KIND_TEAM, LfgKind, LfgMessage } from "@features/lfg/models/lfg-message.model";
import { LfgChatStore } from "@features/lfg/stores/lfg-chat.store";
import { LfgRealtimeService } from "@features/lfg/services/lfg-realtime.service";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";
import { gameTerm } from "@shared/pipes/game-term.pipe";

@Component({
    standalone: true,
    selector: "lol-lfg-chat",
    imports: [GcLfgChatComponent, LfgChatNeedsSheetDirective, LfgChatPublishErrorDirective, CreateSheetWallComponent],
    providers: [LfgChatStore],
    templateUrl: "./lfg-chat.component.html",
})
export class LfgChatComponent implements OnInit, OnDestroy {
    public readonly kind = input<LfgKind>("player");

    public readonly store = inject(LfgChatStore);
    public readonly realtime = inject(LfgRealtimeService);

    protected readonly sheetWallMessage = $localize`:@@lol.sheet.wall.lfgMessage:Create your player profile to post in this chat.`;

    protected readonly labels: LfgChatLabels = {
        live: $localize`:@@lol.home.lfg.live:Live`,
        empty: $localize`:@@lol.home.lfg.empty:No messages yet. Say hello!`,
        loadingOlder: $localize`:@@lol.home.lfg.loadingOlder:Loading older messages…`,
        newMessages: $localize`:@@lol.home.lfg.newMessages:New messages`,
        composePlaceholder: $localize`:@@lol.home.lfg.bodyPlaceholder:Type a message…`,
        posterPickerPlaceholder: $localize`:@@lol.home.recruit.teamPicker:Post as…`,
        muted: $localize`:@@lol.home.lfg.muted:You are muted and cannot post LFG messages.`,
        noPoster: $localize`:@@lol.home.recruit.noTeam:Only team captains, coaches and managers can post here.`,
        pickPoster: $localize`:@@lol.home.recruit.pickTeam:Pick the team you are posting for to enable the composer.`,
        cooldown: $localize`:@@lol.home.lfg.cooldown:Please wait`,
        cooldownHint: $localize`:@@lol.home.lfg.cooldownHint: before posting again.`,
        login: $localize`:@@lol.home.lfg.login:Log in`,
        loginHint: $localize`:@@lol.home.lfg.loginHint: to join the global LFG chat.`,
        loginHref: "/users/login",
    };

    protected readonly title = computed(() =>
        this.isTeamRecruitment()
            ? $localize`:@@lol.home.recruit:Team recruitment`
            : $localize`:@@lol.home.lfg:Looking for group`,
    );

    protected readonly viewMessages = computed((): GcLfgChatMessage[] => {
        const sessionId = this.store.session()?.publicId;
        const playerId = this.store.playerPublicId();
        return this.store.messages().map((message) => this.toViewMessage(message, sessionId, playerId));
    });

    protected readonly posterOptions = computed((): LfgChatPosterOption[] =>
        this.store.postableTeams().map((team) => ({
            publicId: team.publicId,
            handleLabel: team.handleLabel(),
        })),
    );

    protected readonly composerState = computed((): LfgChatComposerState => {
        if (this.store.loading()) {
            return "hidden";
        }
        if (this.store.isMuted()) {
            return "muted";
        }
        if (this.store.hasNoPostableTeam()) {
            return "noPoster";
        }
        if (this.store.canPost() && this.store.cooldownSeconds() > 0) {
            return "cooldown";
        }
        if (this.store.canSend()) {
            return "ready";
        }
        if (this.store.canPost() && this.isTeamRecruitment()) {
            return "pickPoster";
        }
        if (this.store.needsSheet()) {
            return "needsSheet";
        }
        if (!this.store.canPost()) {
            return "login";
        }
        return "hidden";
    });

    public async ngOnInit(): Promise<void> {
        await this.store.init(this.kind());
    }

    public ngOnDestroy(): void {
        this.store.destroy();
    }

    protected isTeamRecruitment(): boolean {
        return this.kind() === LFG_KIND_TEAM;
    }

    protected onSend(body: string): void {
        void this.store.send(body);
    }

    protected onRequestOlder(): void {
        void this.store.loadOlder();
    }

    private messageAvatar(message: LfgMessage): string {
        const session = this.store.session();
        if (session && message.platformUserPublicId === session.publicId && session.avatarUrl) {
            return session.avatarUrl;
        }
        return message.senderAvatarUrl;
    }

    private toViewMessage(
        message: LfgMessage,
        sessionId: string | null | undefined,
        playerId: string | null | undefined,
    ): GcLfgChatMessage {
        let senderLink: unknown[] | null = null;
        if (message.isTeamAd() && message.teamPublicId) {
            senderLink = ["/league-of-legends/teams", message.teamPublicId];
        } else if (message.playerPublicId) {
            senderLink = ["/league-of-legends/players", message.playerPublicId];
        }

        const metaParts: string[] = [];
        if (message.regionCode) {
            metaParts.push(gameTerm(message.regionCode));
        }
        if (message.laneCode) {
            metaParts.push(gameTerm(message.laneCode));
        }

        return {
            publicId: message.publicId,
            body: message.body,
            creationDate: message.creationDate,
            handleLabel: message.handleLabel(),
            initial: message.initial(),
            isMine: message.isMine(sessionId, playerId),
            avatarUrl: message.isTeamAd() ? null : this.messageAvatar(message) || null,
            metaParts: metaParts.length ? metaParts : undefined,
            senderLink,
        };
    }
}
