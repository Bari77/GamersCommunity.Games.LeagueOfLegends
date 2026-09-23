import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    standalone: true,
    selector: "lol-entity-row",
    imports: [DatePipe, RouterLink],
    templateUrl: "./entity-row.component.html",
    styleUrl: "./entity-row.component.scss",
})
export class EntityRowComponent {
    public readonly link = input.required<unknown[]>();
    public readonly name = input.required<string>();
    public readonly subtitle = input<string | null>(null);
    public readonly subtitleMuted = input(false);
    public readonly description = input<string | null>(null);
    public readonly descriptionMuted = input(false);
    public readonly date = input<Date | null>(null);
}
