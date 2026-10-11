import { Component, input } from "@angular/core";
import { EntityRowComponent } from "@bari77/gc-ui";
import { PlayerSummary } from "@features/home/models/home-feed.model";
import { PlayerRank } from "@features/players/models/player.model";
import { LaneIconComponent } from "@shared/components/lane-icon/lane-icon.component";
import { RankEmblemComponent } from "@shared/components/rank-emblem/rank-emblem.component";
import { gameTerm, GameTermPipe } from "@shared/pipes/game-term.pipe";
import { rankSolidColor } from "@shared/utils/lol-art";

@Component({
    standalone: true,
    selector: "lol-home-latest-players",
    imports: [EntityRowComponent, GameTermPipe, LaneIconComponent, RankEmblemComponent],
    templateUrl: "./home-latest-players.component.html",
    styleUrl: "./home-latest-players.component.scss",
})
export class HomeLatestPlayersComponent {
    public readonly players = input.required<PlayerSummary[]>();

    private readonly unrankedLabel = $localize`:@@lol.player.stats.unranked:Unranked`;

    protected rankAccent(player: PlayerSummary): string {
        return rankSolidColor(player.solo?.tier) ?? "";
    }

    protected subtitle(player: PlayerSummary): string {
        if (player.solo) {
            return this.formatSolo(player.solo);
        }

        if (player.primaryLaneCode) {
            return gameTerm(player.primaryLaneCode);
        }

        return this.unrankedLabel;
    }

    protected hasSubtitleIcons(player: PlayerSummary): boolean {
        return !!(player.primaryLaneCode || player.solo);
    }

    protected hasFacts(player: PlayerSummary): boolean {
        return !!(player.regionCode || player.riotId());
    }

    protected formatSolo(solo: PlayerRank | null | undefined): string {
        if (!solo?.tier) {
            return "";
        }

        const parts = [gameTerm(solo.tier)];
        if (solo.division) {
            parts.push(gameTerm(solo.division));
        }
        if (solo.lp != null) {
            parts.push(`${solo.lp} LP`);
        }
        return parts.join(" ");
    }
}
