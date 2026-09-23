import { Component, computed, effect, inject, input } from "@angular/core";
import { MediaGalleryComponent, TwitchEmbedComponent } from "@bari77/gc-widgets";
import { SkeletonComponent } from "@bari77/gc-ui";
import { PlayerMediaKind } from "@features/media/dto/player-media.dto";
import { PlayerMediaStores } from "@features/media/stores/player-media-stores";

const EMPTY: Record<PlayerMediaKind, string> = {
    photo: $localize`:@@lol.media.emptyPhoto:No picture shared yet.`,
    video: $localize`:@@lol.media.emptyVideo:No video shared yet.`,
    stream: $localize`:@@lol.media.emptyStream:No stream declared yet.`,
};

@Component({
    standalone: true,
    selector: "lol-media-manager",
    imports: [MediaGalleryComponent, SkeletonComponent, TwitchEmbedComponent],
    templateUrl: "./media-manager.component.html",
    styleUrl: "./media-manager.component.scss",
})
export class MediaManagerComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly kind = input.required<PlayerMediaKind>();

    public readonly store = computed(() => this.stores.for(this.kind()));
    public readonly items = computed(() => this.store().items.value());
    public readonly galleryItems = computed(() => this.items().map((item) => item.galleryItem));
    public readonly emptyLabel = computed(() => EMPTY[this.kind()]);

    protected readonly galleryPlaceholders = [0, 1, 2, 3, 4, 5];

    private readonly stores = inject(PlayerMediaStores);

    public constructor() {
        effect(() => this.store().setContext(this.kind(), this.playerPublicId()));
    }
}
