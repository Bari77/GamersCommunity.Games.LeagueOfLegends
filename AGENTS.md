# Agent guidelines — League of Legends

Technical rules for AI agents in this repo. Same standards as other GamersCommunity game repos and the Template.

## Never start servers

Do **not** run `dotnet run`, `npm start`, `ng serve`, or long-lived Docker app stacks. The developer owns terminals. One-shot `dotnet build` / tests are OK when useful.

## Database (`LeagueOfLegends.Database`)

- Generate EF migrations **only** via `LeagueOfLegends.Database/Add-Migration.ps1`. Never hand-write migrations.
- Seeds: class-based reference data under `Seed/` (`ReferenceDataSeed`, one table seed class each). No seed data inside migrations.

```powershell
cd LeagueOfLegends.Database
./Add-Migration.ps1 -Name MeaningfulName
```

## Front (`LeagueOfLegends.Front`)

- Design: Nebular (or close). Shared UI → DevKit packages, not copy-paste.
- Specs: `LeagueOfLegends.Front/docs/` with clear filenames (`SPEC_TEAMS.md`, …). Milestone titles must be descriptive (e.g. `C1 — Team governance`), not letters alone.
- i18n: English by default; `$localize` / `i18n`; no hardcoded UI strings.
- `package.json`: never depend on a local `dist` / `file:` path for published `@bari77/*` packages—use registry versions.
- Player and **team** sheets: always workspace grid + editable layout.
- Never use `postinstall` (or similar) to patch dependency `package.json` / `node_modules`.

## Template / Core sync

If you change game pillars (`Program.cs`, migrate/seed host, federation, compose fundamentals), update **GamersCommunity.Games.Template**. Prefer **GamersCommunity.Core** (or DevKit) when the change is generic enough to centralize.

## Commits / push

Only when the developer explicitly asks.
