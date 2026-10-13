import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LOL_GAME_URL } from "@core/constants/game.constants";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { mockPortraitUrl, personaByPlatformId } from "../../mocks/catalog/personas";
import { mockPlayerSheet, PLAYER_PUBLIC_ID, PLATFORM_USER_PUBLIC_ID } from "../../mocks/catalog/players";

/** Stand-in for the Platform community profile while the game runs on its own playground. */
@Component({
    standalone: true,
    selector: "lol-playground-user-profile",
    imports: [RouterLink, NbButtonModule, NbCardModule],
    templateUrl: "./playground-user-profile.component.html",
    styleUrl: "./playground-user-profile.component.scss",
})
export class PlaygroundUserProfileComponent {
    public readonly publicId = input.required<string>();

    protected readonly gameUrl = LOL_GAME_URL;

    protected readonly isSelf = computed(() => this.publicId() === PLATFORM_USER_PUBLIC_ID);

    protected readonly handle = computed(() => {
        if (this.isSelf()) {
            return `${mockPlayerSheet.nickname}#${mockPlayerSheet.discriminator}`;
        }
        const who = personaByPlatformId(this.publicId());
        return who ? `${who.nickname}#${who.discriminator}` : this.publicId();
    });

    protected readonly avatarUrl = computed(() => {
        if (this.isSelf() && mockPlayerSheet.avatarUrl) {
            return mockPlayerSheet.avatarUrl;
        }
        const who = personaByPlatformId(this.publicId());
        return mockPortraitUrl(who?.nickname ?? this.publicId());
    });

    protected readonly playerPublicId = computed(() => {
        if (this.isSelf()) {
            return PLAYER_PUBLIC_ID;
        }
        return personaByPlatformId(this.publicId())?.playerPublicId ?? null;
    });
}
