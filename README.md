# GamersCommunity.Games.LeagueOfLegends

Remote **League of Legends** (MOBA) : fiche joueur, invocateurs, teams, LFG.

Tickets : [LeagueOfLegends.Front/docs](LeagueOfLegends.Front/docs/PRODUCT_VISION.md)
([B](LeagueOfLegends.Front/docs/VAGUE_B.md) · [C](LeagueOfLegends.Front/docs/VAGUE_C.md) ·
[D](LeagueOfLegends.Front/docs/VAGUE_D.md)).

Identity : Pascal `LeagueOfLegends`, id `leagueoflegends`, queue `leagueoflegends_queue`,
compose `gc-leagueoflegends-dev`, ports front **4202** / DevGateway **8083**, CSS prefix `lol`.

## Layout

- `LeagueOfLegends.Front` — Angular micro-frontend (MSW mocks + Module Federation)
- `LeagueOfLegends.Consumer` — .NET RabbitMQ consumer
- `LeagueOfLegends.Database` — EF / SQL
- `LeagueOfLegends.Tests` — tests
- `compose.yml` — game-full stack (Rabbit + SQL + consumer + DevGateway)
- `contracts/` — federation + OpenAPI

## Platform identity (mandatory in every game)

Platform broadcasts user identity changes on the shared fanout exchange `platform_events`. Each game
binds **its own** queue to it — `platform_events_<microserviceId>` — and mirrors the payload into its
local `PlatformUserSnapshot` table. Queries then join that table instead of calling Platform.

## GitHub Packages auth (once)

```powershell
dotnet nuget update source github -u YOUR_USER -p ghp_xxx --store-password-in-clear-text
$env:NODE_AUTH_TOKEN = "ghp_xxx"
echo ghp_xxx | docker login ghcr.io -u YOUR_USER --password-stdin
```

## Front (UI-only / mocks)

```bash
cd LeagueOfLegends.Front
npm install
npm start
```

Default `apiUrl` is the **platform Gateway** (`http://localhost:5000/api`) so the remote works when
loaded from the Shell. For game-full (DevGateway `:8083`), use `npm run start:api`.

## Game-full

```powershell
$env:GITHUB_TOKEN = "ghp_xxx"
.\scripts\up.ps1
cd LeagueOfLegends.Front
npm run start:api
```

- DevGateway: http://localhost:8083
- Front: http://localhost:4202
- SQL: `127.0.0.1,14333` / sa / Your_password123 (Trust server certificate)

## Shell integration

See `contracts/federation.contract.json` and `contracts/openapi.yaml`.
From Platform.Front: `npm run start:remote:lol` or `npm run dev:federation:lol`.
