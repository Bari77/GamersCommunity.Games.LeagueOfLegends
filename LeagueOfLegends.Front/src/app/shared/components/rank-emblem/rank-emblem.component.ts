import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { normalizeTier, rankCrestUrl, rankEmblemUrl } from "@shared/utils/lol-art";

@Component({
    standalone: true,
    selector: "lol-rank-emblem",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (!broken()) {
            <span
                class="rank-emblem"
                [class.rank-emblem--crest]="size() === 'crest'"
                [class.rank-emblem--hero]="size() === 'hero'"
                [class.rank-emblem--emblem]="size() === 'emblem'"
                [class.rank-emblem--crop]="crop()"
            >
                <img [src]="src()" [alt]="alt()" (error)="broken.set(true)" />
            </span>
        }
    `,
    styles: `
        :host {
            display: inline-flex;
            flex: none;
        }

        :host:has(.rank-emblem--emblem) {
            display: block;
            width: 100%;
        }

        .rank-emblem {
            display: block;
            overflow: hidden;
        }

        .rank-emblem img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .rank-emblem--crest {
            width: 1.35rem;
            height: 1.35rem;
        }

        .rank-emblem--hero {
            width: 2.6rem;
            height: 2.6rem;
        }

        .rank-emblem--emblem {
            width: 100%;
        }

        .rank-emblem--crop img {
            object-fit: cover;
            object-position: 50% 48%;
            transform: scale(2.75);
            transform-origin: center center;
        }
    `,
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
