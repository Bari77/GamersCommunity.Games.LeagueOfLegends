import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { isRichHtmlBlank, RichEditorComponent } from "@bari77/gc-ui";
import { GamePost } from "@features/teams/models/game-post.model";
import { GamePostDraft } from "@features/teams/stores/team-wall.store";
import { NbButtonModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "lol-team-post-form",
    imports: [RichEditorComponent, NbButtonModule],
    templateUrl: "./team-post-form.component.html",
    styleUrl: "./team-post-form.component.scss",
})
export class TeamPostFormComponent {
    public readonly post = input<GamePost | null>(null);
    public readonly saving = input(false);
    public readonly errorCode = input<string | null>(null);
    public readonly moderated = input(false);

    public readonly save = output<GamePostDraft>();
    public readonly cancel = output<void>();

    protected readonly bodyPlaceholder = $localize`:@@lol.team.wall.bodyPlaceholder:Share something with the team…`;
    protected readonly body = signal("");

    public constructor() {
        effect(() => {
            const post = this.post();
            untracked(() => this.body.set(post?.body ?? ""));
        });
    }

    public reset(): void {
        this.body.set("");
    }

    protected submit(): void {
        const body = this.body();
        if (isRichHtmlBlank(body) || this.saving()) {
            return;
        }

        this.save.emit({ body });
    }
}
