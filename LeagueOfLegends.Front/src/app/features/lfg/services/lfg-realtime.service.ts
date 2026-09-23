import { computed, Injectable, signal } from "@angular/core";
import { LfgMessage } from "@features/lfg/models/lfg-message.model";
import { environment } from "environments/environment";
import * as signalR from "@microsoft/signalr";

export type LfgRealtimeStatus = "offline" | "connecting" | "connected";

@Injectable({ providedIn: "root" })
export class LfgRealtimeService {
    private readonly $status = signal<LfgRealtimeStatus>("offline");

    public readonly status = computed(() => this.$status());
    public readonly isLive = computed(() => this.$status() === "connected");
    public readonly offlineMessage = computed(() => {
        switch (this.$status()) {
            case "connecting":
                return $localize`:@@lol.home.lfg.realtime.connecting:Connecting to live LFG chat…`;
            case "offline":
                return $localize`:@@lol.home.lfg.realtime.offline:Live updates are unavailable. New messages may appear with a delay.`;
            default:
                return "";
        }
    });

    private connection: signalR.HubConnection | null = null;
    private onMessage: ((message: LfgMessage) => void) | null = null;

    public async connect(handler: (message: LfgMessage) => void): Promise<void> {
        this.onMessage = handler;
        if (!environment.hubUrl) {
            this.$status.set("offline");
            return;
        }

        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        this.$status.set("connecting");
        await this.teardown();

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(environment.hubUrl)
            .withAutomaticReconnect([0, 2_000, 5_000, 10_000])
            .build();

        this.connection.on("lfg.message.created", (payload: LfgMessageDtoPayload) => {
            this.onMessage?.(
                LfgMessage.fromDto({
                    publicId: payload.publicId,
                    kind: payload.kind ?? "player",
                    body: payload.body,
                    senderNickname: payload.senderNickname,
                    senderDiscriminator: payload.senderDiscriminator,
                    creationDate: payload.creationDate,
                    expiresAt: payload.expiresAt ?? payload.creationDate,
                    playerPublicId: payload.playerPublicId,
                    platformUserPublicId: payload.platformUserPublicId,
                    senderAvatarUrl: payload.senderAvatarUrl ?? "",
                    regionCode: payload.regionCode ?? null,
                    laneCode: payload.laneCode ?? null,
                }),
            );
        });

        this.connection.onreconnected(() => this.$status.set("connected"));
        this.connection.onclose(() => this.$status.set("offline"));

        try {
            await this.connection.start();
            this.$status.set("connected");
        } catch {
            this.$status.set("offline");
        }
    }

    public async disconnect(): Promise<void> {
        this.onMessage = null;
        await this.teardown();
        this.$status.set("offline");
    }

    private async teardown(): Promise<void> {
        if (!this.connection) {
            return;
        }
        try {
            await this.connection.stop();
        } catch {
            // ignore
        }
        this.connection = null;
    }
}

interface LfgMessageDtoPayload {
    publicId: string;
    kind?: string;
    body: string;
    senderNickname: string;
    senderDiscriminator: string;
    creationDate: string;
    expiresAt?: string;
    playerPublicId: string;
    platformUserPublicId: string;
    senderAvatarUrl?: string;
    regionCode?: string | null;
    laneCode?: string | null;
}
