import { DatePipe } from "@angular/common";
import { Component, computed, ElementRef, HostListener, inject, input, resource, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { PlatformGame, PlatformGamesService } from "@core/services/platform-games.service";
import { PlayerSheet } from "@features/players/models/player.model";
import { GameTermPipe } from "@shared/pipes/game-term.pipe";
import { firstValueFrom } from "rxjs";

@Component({
    standalone: true,
    selector: "lol-player-hero",
    imports: [DatePipe, GameTermPipe, RouterLink],
    templateUrl: "./player-hero.component.html",
    styleUrl: "./player-hero.component.scss",
})
export class PlayerHeroComponent {
    public readonly player = input.required<PlayerSheet>();

    protected readonly switchLabel = $localize`:@@lol.player.hero.switch:Changer de jeu`;
    protected readonly unavailableLabel = $localize`:@@lol.player.hero.unavailable:Temporairement indisponible`;
    protected readonly menuOpen = signal(false);

    public readonly handle = computed(
        () => this.player().handle || $localize`:@@lol.player.hero.unknown:Unknown player`,
    );

    public readonly games = resource({
        params: () => this.player().platformUserPublicId,
        loader: ({ params }) => firstValueFrom(this.platformGames.listForPlayer(params)).catch(() => []),
        defaultValue: [],
    });

    public readonly currentGame = computed(() => this.games.value().find((game) => game.url === LOL_GAME_URL));
    public readonly otherGames = computed(() => this.games.value().filter((game) => game.url !== LOL_GAME_URL));
    public readonly canSwitch = computed(() => this.otherGames().length > 0);

    private readonly platformGames = inject(PlatformGamesService);
    private readonly host = inject(ElementRef<HTMLElement>);

    public toggleMenu(): void {
        if (!this.canSwitch()) {
            return;
        }

        this.menuOpen.update((open) => !open);
    }

    public closeMenu(): void {
        this.menuOpen.set(false);
    }

    public gameLink(game: PlatformGame): string[] {
        return game.playerPublicId ? [game.url, "players", game.playerPublicId] : [game.url];
    }

    @HostListener("document:click", ["$event"])
    protected onDocumentClick(event: MouseEvent): void {
        if (!this.host.nativeElement.contains(event.target as Node)) {
            this.closeMenu();
        }
    }

    @HostListener("document:keydown.escape")
    protected onEscape(): void {
        this.closeMenu();
    }
}
