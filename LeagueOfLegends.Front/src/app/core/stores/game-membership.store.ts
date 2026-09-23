import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LOL_GAME_ID, LOL_GAME_URL } from "@core/constants/game.constants";
import { PlatformSession, PlatformSessionService } from "@core/services/platform-session.service";
import { PlayerResolveResult } from "@features/players/models/player.model";
import { PlayersService } from "@features/players/services/players.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { ResourceUtils } from "@shared/utils/resource.utils";
import { firstValueFrom } from "rxjs";

const PROMPT_DISMISSED_KEY = `gc.game-sheet-prompt.dismissed.${LOL_GAME_ID}`;
const NO_SHEET = new PlayerResolveResult(null, false);

@Injectable({ providedIn: "root" })
export class GameMembershipStore {
    public readonly session = computed(() => this.sessionResource.value());
    public readonly isAuthenticated = computed(() => this.session() !== null);

    public readonly playerPublicId = computed(
        () => this.createdPlayerPublicId() ?? this.resolutionResource.value().playerPublicId,
    );
    public readonly hasSheet = computed(
        () => this.createdPlayerPublicId() !== null || this.resolutionResource.value().hasSheet,
    );

    public readonly loading = computed(
        () =>
            ResourceUtils.isPending(this.sessionResource) ||
            (this.isAuthenticated() && ResourceUtils.isPending(this.resolutionResource)),
    );

    public readonly resolved = computed(() => this.isAuthenticated() && !this.loading());

    public readonly needsSheet = computed(() => this.resolved() && !this.hasSheet());

    public readonly creating = signal(false);

    public readonly promptDismissed = computed(() => this.dismissed());
    public readonly shouldPromptSheetCreation = computed(() => this.needsSheet() && !this.promptDismissed());

    private readonly platformSession = inject(PlatformSessionService);
    private readonly players = inject(PlayersService);
    private readonly router = inject(Router);

    private readonly sessionResource = resource({
        loader: () => firstValueFrom(this.platformSession.touch()).catch(() => null),
        defaultValue: null as PlatformSession | null,
    });

    private readonly resolutionResource = resource({
        params: () => this.session()?.publicId,
        loader: ({ params }) => firstValueFrom(this.players.resolve(params)).catch(() => NO_SHEET),
        defaultValue: NO_SHEET,
    });

    private readonly createdPlayerPublicId = signal<string | null>(null);
    private readonly dismissed = signal(this.readDismissed());

    public whenResolved(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.loading());
    }

    public async createSheet(): Promise<string | null> {
        const session = this.session();
        if (!session || this.creating()) {
            return null;
        }

        const existing = this.playerPublicId();
        if (existing) {
            return existing;
        }

        this.creating.set(true);
        try {
            const sheet = await firstValueFrom(
                this.players.load({
                    platformUserId: session.id,
                    platformUserPublicId: session.publicId,
                }),
            );
            this.createdPlayerPublicId.set(sheet.publicId);
            return sheet.publicId;
        } catch {
            return null;
        } finally {
            this.creating.set(false);
        }
    }

    public async createSheetAndOpen(): Promise<void> {
        const playerPublicId = await this.createSheet();
        if (playerPublicId) {
            await this.router.navigate([`${LOL_GAME_URL}/players`, playerPublicId]);
        }
    }

    public dismissPrompt(): void {
        this.dismissed.set(true);
        this.writeDismissed();
    }

    private readDismissed(): boolean {
        try {
            return localStorage.getItem(PROMPT_DISMISSED_KEY) === "true";
        } catch {
            return false;
        }
    }

    private writeDismissed(): void {
        try {
            localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
        } catch {
            // Private browsing: the refusal is lost next visit.
        }
    }
}
