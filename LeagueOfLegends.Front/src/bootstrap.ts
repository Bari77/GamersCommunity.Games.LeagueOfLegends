import { bootstrapApplication } from "@angular/platform-browser";
import { bootstrapMocks, shouldUseMocks } from "@bari77/gc-playground";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
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
    const mocks = shouldUseMocks(environment);
    await bootstrapMocks(mocks, async () => {
        const { worker } = await import("./mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
    });
    // Keep in the front until @bari77/gc-playground ships the same guard.
    // MSW reloads when the worker does not control the document, but start() still resolves.
    if (mocks && !(await serviceWorkerControlsPage())) {
        return;
    }
    await bootstrapApplication(AppComponent, appConfig);
    removeBootstrapSplash();
}

function serviceWorkerControlsPage(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || navigator.serviceWorker.controller) {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        const timer = window.setTimeout(() => resolve(!!navigator.serviceWorker.controller), 1500);
        navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {
                window.clearTimeout(timer);
                resolve(true);
            },
            { once: true },
        );
    });
}

main().catch((err) => {
    removeBootstrapSplash();
    console.error(err);
});
