import { Component, input } from "@angular/core";
import { PlayerMediaKind } from "@bari77/gc-sdk";
import { PlayerMediaAdminComponent, type PlayerMediaAdminLabels } from "@bari77/gc-widgets";

@Component({
    standalone: true,
    selector: "lol-media-admin",
    imports: [PlayerMediaAdminComponent],
    template: `<gc-player-media-admin [playerPublicId]="playerPublicId()" [kind]="kind()" [labels]="labels" />`,
})
export class MediaAdminComponent {
    public readonly playerPublicId = input.required<string>();
    public readonly kind = input.required<PlayerMediaKind>();

    protected readonly labels: PlayerMediaAdminLabels = {
        captionPlaceholder: $localize`:@@lol.media.caption:Caption`,
        share: $localize`:@@lol.media.share:Public`,
        add: $localize`:@@lol.media.add:Add`,
        remove: $localize`:@@lol.media.remove:Delete`,
        empty: $localize`:@@lol.media.admin.empty:Nothing here yet. Add your first entry above.`,
        errorUrl: $localize`:@@lol.media.error.url:Enter a full http(s) address.`,
        errorTooMany: $localize`:@@lol.media.error.tooMany:You reached the maximum number of entries.`,
        errorUnknown: $localize`:@@lol.media.error.unknown:This entry could not be saved.`,
        urlPlaceholderPhoto: "https://… image address",
        urlPlaceholderVideo: "https://… YouTube, Twitch or Vimeo address",
        urlPlaceholderStream: "https://twitch.tv/your-channel",
    };
}
