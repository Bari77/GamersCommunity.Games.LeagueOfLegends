import { bootstrapApplication } from "@angular/platform-browser";
import { bootstrapMocks, shouldUseMocks } from "@bari77/gc-playground";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";
import { environment } from "./environments/environment";

function removeBootstrapSplash(): void {
    const splash = document.getElementById("app-splash");
    if (!splash) {
        return;
    }

    splash.classList.add("is-hidden");
    window.setTimeout(() => splash.remove(), 220);
}

async function main(): Promise<void> {
    await bootstrapMocks(shouldUseMocks(environment), async () => {
        const { worker } = await import("./mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
    });
    await bootstrapApplication(App, appConfig);
    removeBootstrapSplash();
}

main().catch((err) => {
    removeBootstrapSplash();
    console.error(err);
});
