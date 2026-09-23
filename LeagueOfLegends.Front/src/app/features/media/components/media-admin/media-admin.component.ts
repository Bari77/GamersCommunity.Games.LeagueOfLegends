import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PlayerMediaKind } from "@features/media/dto/player-media.dto";
import { PlayerMedia } from "@features/media/models/player-media.model";
import { PlayerMediaStores } from "@features/media/stores/player-media-stores";
import { NbButtonModule, NbCheckboxModule, NbInputModule } from "@nebular/theme";

const PLACEHOLDER: Record<PlayerMediaKind, string> = {
    photo: "https://… image address",
    video: "https://… YouTube, Twitch or Vimeo address",
    stream: "https://twitch.tv/your-channel",
};

@Component({
    standalone: true,
    selector: "lol-media-admin",
    imports: [FormsModule, NbButtonModule, NbCheckboxModule, NbInputModule],
    templateUrl: "./media-admin.component.html",
    styleUrl: "./media-admin.component.scss",
})
export class MediaAdminComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly kind = input.required<PlayerMediaKind>();

    public readonly url = signal("");
    public readonly caption = signal("");
    public readonly share = signal(true);

    public readonly store = computed(() => this.stores.for(this.kind()));
    public readonly items = computed(() => this.store().items.value());
    public readonly urlPlaceholder = computed(() => PLACEHOLDER[this.kind()]);
    public readonly canAdd = computed(() => !this.store().saving() && this.url().trim().length > 0);

    private readonly stores = inject(PlayerMediaStores);

    public constructor() {
        effect(() => this.store().setContext(this.kind(), this.playerPublicId()));
    }

    public async add(): Promise<void> {
        if (!this.canAdd()) {
            return;
        }

        const created = await this.store().create({
            url: this.url().trim(),
            caption: this.caption().trim() || null,
            share: this.share(),
        });

        if (created) {
            this.url.set("");
            this.caption.set("");
        }
    }

    public editUrl(item: PlayerMedia, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value && value !== item.url) {
            this.store().update(item.publicId, { url: value });
        }
    }

    public editCaption(item: PlayerMedia, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value !== (item.caption ?? "")) {
            this.store().update(item.publicId, { caption: value || null });
        }
    }
}
