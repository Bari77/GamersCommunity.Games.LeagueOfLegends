import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { catchError, forkJoin, map, Observable, of, switchMap } from "rxjs";

interface PlatformGameDto {
    id: number;
    title: string;
    urlValue: string;
    picture: string;
}

interface PlayerResolveDto {
    playerPublicId?: string | null;
    hasSheet: boolean;
}

export interface PlatformGame {
    id: number;
    title: string;
    url: string;
    iconUrl: string;
    playerPublicId: string | null;
}

@Injectable({ providedIn: "root" })
export class PlatformGamesService {
    private readonly http = inject(HttpClient);

    public listForPlayer(platformUserPublicId: string): Observable<PlatformGame[]> {
        return this.http.get<PlatformGameDto[]>(`${environment.apiUrl}/platform/games`).pipe(
            map((dtos) => dtos.map((dto) => this.toGame(dto))),
            switchMap((games) => {
                if (games.length === 0) {
                    return of([]);
                }

                return forkJoin(
                    games.map((game) =>
                        this.resolve(game.url, platformUserPublicId).pipe(
                            map((playerPublicId) => ({ ...game, playerPublicId })),
                            catchError(() => of(game)),
                        ),
                    ),
                );
            }),
        );
    }

    private resolve(gameUrl: string, platformUserPublicId: string): Observable<string | null> {
        const segment = gameUrl.replace(/^\/+|\/+$/g, "").replace(/-/g, "");
        return this.http
            .post<PlayerResolveDto>(`${environment.apiUrl}/${segment}/Players/actions/Resolve`, {
                platformUserPublicId,
            })
            .pipe(map((dto) => (dto.hasSheet && dto.playerPublicId ? dto.playerPublicId : null)));
    }

    private toGame(dto: PlatformGameDto): PlatformGame {
        return {
            id: dto.id,
            title: dto.title,
            url: dto.urlValue.startsWith("/") ? dto.urlValue : `/${dto.urlValue}`,
            iconUrl: `${environment.assetsBaseUrl}/Icons/Games/${dto.picture}.png`,
            playerPublicId: null,
        };
    }
}
