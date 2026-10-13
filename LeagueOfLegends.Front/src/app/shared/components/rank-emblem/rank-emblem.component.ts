import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { normalizeTier, rankCrestUrl, rankEmblemUrl } from "@shared/utils/lol-art";

@Component({
    standalone: true,
    selector: "lol-rank-emblem",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./rank-emblem.component.html",
    styleUrl: "./rank-emblem.component.scss",
})
export class RankEmblemComponent {
    public readonly tier = input<string | null | undefined>(null);
    public readonly size = input<"crest" | "hero" | "emblem">("crest");
    public readonly alt = input("");

    protected readonly broken = signal(false);
    protected readonly crop = computed(() => this.size() === "emblem" && normalizeTier(this.tier()) !== "unranked");
    protected readonly src = computed(() =>
        this.size() === "emblem" ? rankEmblemUrl(this.tier()) : rankCrestUrl(this.tier()),
    );
}
