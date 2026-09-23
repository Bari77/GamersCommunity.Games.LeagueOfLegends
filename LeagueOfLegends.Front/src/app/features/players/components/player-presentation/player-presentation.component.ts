import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { isRichHtmlBlank, RichContentComponent, RichEditorComponent } from "@bari77/gc-ui";
import { NbButtonModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-player-presentation",
    imports: [RichContentComponent, RichEditorComponent, NbButtonModule],
    templateUrl: "./player-presentation.component.html",
    styleUrl: "./player-presentation.component.scss",
})
export class PlayerPresentationComponent {
    public readonly text = input<string | null>(null);
    public readonly editing = input(false);
    public readonly saving = input(false);
    public readonly emptyLabel = input(
        $localize`:@@lol.player.noPresentation:This player has not written a presentation yet.`,
    );

    public readonly save = output<string | null>();
    public readonly cancel = output<void>();

    protected readonly editorPlaceholder = $localize`:@@lol.player.presentation.placeholder:Tell others about yourself…`;
    protected readonly draft = signal("");

    public constructor() {
        effect(() => {
            const editing = this.editing();
            untracked(() => {
                if (editing) {
                    this.draft.set(this.text() ?? "");
                }
            });
        });
    }

    protected submit(): void {
        const draft = this.draft();
        this.save.emit(isRichHtmlBlank(draft) ? null : draft);
        this.cancel.emit();
    }
}
