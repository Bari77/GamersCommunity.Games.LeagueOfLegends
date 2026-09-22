import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NbButtonModule, NbCardModule } from "@nebular/theme";

@Component({
    selector: "lol-home-container",
    standalone: true,
    imports: [NbCardModule, NbButtonModule, RouterLink],
    templateUrl: "./home-container.component.html",
    styleUrl: "./home-container.component.scss",
})
export class HomeContainerComponent {}
