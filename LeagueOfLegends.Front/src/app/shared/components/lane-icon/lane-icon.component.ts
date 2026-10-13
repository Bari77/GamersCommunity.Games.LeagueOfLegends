import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { laneIconUrl } from "@shared/utils/lol-art";

@Component({
    standalone: true,
    selector: "lol-lane-icon",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./lane-icon.component.html",
    styleUrl: "./lane-icon.component.scss",
})
export class LaneIconComponent {
    public readonly code = input.required<string>();
    public readonly alt = input("");

    protected readonly broken = signal(false);
    protected readonly src = computed(() => laneIconUrl(this.code()));
}
