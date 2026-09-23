import { Component, computed, effect, inject, input } from "@angular/core";
import { LinkListComponent } from "@bari77/gc-widgets";
import { TeamLinkStore } from "@features/teams/stores/team-link.store";

@Component({
    standalone: true,
    selector: "lol-team-link-board",
    imports: [LinkListComponent],
    template: `<gc-link-list [links]="cards()" [emptyLabel]="emptyLabel" />`,
})
export class TeamLinkBoardComponent {
    public readonly teamPublicId = input.required<string>();

    protected readonly emptyLabel = $localize`:@@lol.team.links.empty:No link shared yet.`;
    protected readonly cards = computed(() => this.store.items.value().map((link) => link.card));

    private readonly store = inject(TeamLinkStore);

    public constructor() {
        effect(() => this.store.setContext(this.teamPublicId()));
    }
}
