import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { isRichHtmlBlank, RichEditorComponent } from "@bari77/gc-ui";
import { TeamCreateRequestDto } from "@features/teams/dto/team.dto";
import { NbButtonModule, NbInputModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-team-create-form",
    imports: [FormsModule, RichEditorComponent, NbButtonModule, NbInputModule],
    templateUrl: "./team-create-form.component.html",
    styleUrl: "./team-create-form.component.scss",
})
export class TeamCreateFormComponent {
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);

    public readonly create = output<TeamCreateRequestDto>();
    public readonly cancel = output<void>();

    protected readonly sentencePlaceholder = $localize`:@@lol.team.form.sentencePlaceholder:Team catchphrase…`;

    protected readonly entitled = signal("");
    protected readonly tag = signal("");
    protected readonly sentence = signal("");

    protected readonly canSave = computed(() => {
        const name = this.entitled().trim();
        const tag = this.tag().trim();
        return !this.saving() && name.length >= 3 && name.length <= 50 && (tag.length === 0 || /^[A-Za-z0-9]{2,5}$/.test(tag));
    });

    protected submit(): void {
        if (!this.canSave()) {
            return;
        }

        const tag = this.tag().trim();
        this.create.emit({
            entitled: this.entitled().trim(),
            tag: tag.length > 0 ? tag : null,
            sentence: isRichHtmlBlank(this.sentence()) ? null : this.sentence(),
        });
    }
}
