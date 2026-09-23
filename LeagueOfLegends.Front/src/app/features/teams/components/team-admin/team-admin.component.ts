import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { isRichHtmlBlank, RichEditorComponent } from "@bari77/gc-ui";
import { TeamUpdateRequestDto } from "@features/teams/dto/team.dto";
import { TeamSheet } from "@features/teams/models/team.model";
import { NbButtonModule, NbCardModule, NbInputModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-team-admin",
    imports: [FormsModule, RichEditorComponent, NbButtonModule, NbCardModule, NbInputModule],
    templateUrl: "./team-admin.component.html",
    styleUrl: "./team-admin.component.scss",
})
export class TeamAdminComponent {
    public readonly sheet = input.required<TeamSheet>();
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly save = output<TeamUpdateRequestDto>();
    public readonly disband = output<string>();

    protected readonly entitled = signal("");
    protected readonly tag = signal("");
    protected readonly sentence = signal("");
    protected readonly sentencePlaceholder = $localize`:@@lol.team.form.sentencePlaceholder:Team catchphrase…`;

    protected readonly disbandOpen = signal(false);
    protected readonly confirmation = signal("");

    protected readonly disbandPlaceholder = computed(() => this.sheet().handleLabel());

    /** Typing the full handle is the only way to arm the button, as the microservice requires it. */
    protected readonly canDisband = computed(
        () => !this.saving() && this.confirmation().trim() === this.sheet().handleLabel(),
    );

    public constructor() {
        effect(() => {
            const sheet = this.sheet();
            untracked(() => {
                this.entitled.set(sheet.entitled);
                this.tag.set(sheet.tag ?? "");
                this.sentence.set(sheet.sentence ?? "");
            });
        });
    }

    /**
     * Only the touched fields are sent: an absent field keeps its value.
     */
    protected submit(): void {
        const sheet = this.sheet();
        const request: TeamUpdateRequestDto = {};

        const entitled = this.entitled().trim();
        if (entitled !== sheet.entitled) {
            request.entitled = entitled;
        }

        const tag = this.tag().trim();
        const nextTag = tag.length > 0 ? tag : null;
        if (nextTag !== sheet.tag) {
            request.tag = nextTag;
        }

        const sentence = isRichHtmlBlank(this.sentence()) ? null : this.sentence();
        if (sentence !== sheet.sentence) {
            request.sentence = sentence;
        }

        if (Object.keys(request).length > 0) {
            this.save.emit(request);
        }
    }
}
