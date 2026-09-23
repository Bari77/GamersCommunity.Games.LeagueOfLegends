import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { laneIconUrl } from "@shared/utils/lol-art";

@Component({
    standalone: true,
    selector: "lol-lane-icon",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (src(); as url) {
            @if (!broken()) {
                <img class="lane-icon" [src]="url" [alt]="alt()" (error)="broken.set(true)" />
            }
        }
    `,
    styles: `
        :host {
            display: inline-flex;
            flex: none;
        }

        .lane-icon {
            width: 1.15rem;
            height: 1.15rem;
            object-fit: contain;
            filter: brightness(1.15);
        }

        :host-context(.lane-icon--lg) .lane-icon {
            width: 1.55rem;
            height: 1.55rem;
        }
    `,
})
export class LaneIconComponent {
    public readonly code = input.required<string>();
    public readonly alt = input("");

    protected readonly broken = signal(false);
    protected readonly src = computed(() => laneIconUrl(this.code()));
}
