import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NbLayoutModule } from "@nebular/theme";
import { environment } from "../environments/environment";

@Component({
  selector: "lol-root",
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule],
  template: `
    <nb-layout>
      @if (showBanner) {
        <nb-layout-header fixed>
          <span i18n="@@lol.playground.banner">League of Legends</span>
        </nb-layout-header>
      }
      <nb-layout-column>
        <router-outlet />
      </nb-layout-column>
    </nb-layout>
  `,
})
export class App {
  protected readonly showBanner = environment.useMocks === true;
}
