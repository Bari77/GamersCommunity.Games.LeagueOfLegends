import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GC_LINK_NETWORKS } from "@bari77/gc-widgets";
import { TeamLink } from "@features/teams/models/team-link.model";
import { TeamLinkStore } from "@features/teams/stores/team-link.store";
import { NbButtonModule, NbInputModule, NbSelectModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-team-link-admin",
    imports: [FormsModule, NbButtonModule, NbInputModule, NbSelectModule],
    templateUrl: "./team-link-admin.component.html",
    styleUrl: "./team-link-admin.component.scss",
})
export class TeamLinkAdminComponent {
    public readonly teamPublicId = input.required<string>();

    protected readonly networks = GC_LINK_NETWORKS;
    protected readonly store = inject(TeamLinkStore);
    protected readonly items = computed(() => this.store.items.value());
    protected readonly labelFieldName = $localize`:@@lol.links.field.label:Label`;
    protected readonly iconFieldName = $localize`:@@lol.links.field.icon:Icon`;
    protected readonly label = signal("");
    protected readonly url = signal("");
    protected readonly icon = signal<string | null>(null);
    protected readonly canAdd = computed(
        () => !this.store.saving() && this.label().trim().length > 0 && this.url().trim().length > 0,
    );

    public constructor() {
        effect(() => this.store.setContext(this.teamPublicId()));
    }

    protected async add(): Promise<void> {
        if (!this.canAdd()) {
            return;
        }

        const created = await this.store.create({
            url: this.url().trim(),
            label: this.label().trim(),
            icon: this.icon(),
        });

        if (created) {
            this.label.set("");
            this.url.set("");
            this.icon.set(null);
        }
    }

    protected editLabel(item: TeamLink, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value && value !== item.label) {
            void this.store.update(item.publicId, { label: value });
        }
    }

    protected editUrl(item: TeamLink, event: Event): void {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value && value !== item.url) {
            void this.store.update(item.publicId, { url: value });
        }
    }

    protected editIcon(item: TeamLink, icon: string | null): void {
        if (icon !== item.icon) {
            void this.store.update(item.publicId, { icon });
        }
    }
}
