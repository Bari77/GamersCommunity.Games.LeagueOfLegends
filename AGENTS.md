# Agent guidelines — League of Legends

Shared module: [`AgentKit/`](AgentKit/) → [GamersCommunity.AgentKit](https://github.com/Bari77/GamersCommunity.AgentKit)

- [`AgentKit/AGENTS.base.md`](AgentKit/AGENTS.base.md)
- [`AgentKit/ENGINEERING_STANDARDS.md`](AgentKit/ENGINEERING_STANDARDS.md)
- [`AgentKit/POLICY.md`](AgentKit/POLICY.md)
- Optional: [`AGENTS.override.md`](AGENTS.override.md)

## Repo-specific

- Migrations: `LeagueOfLegends.Database/Add-Migration.ps1` only; class-based `Seed/`.
- Specs: `LeagueOfLegends.Front/docs/` with descriptive milestone titles (e.g. `C1 — Team governance`).
- Player and **team** sheets: workspace grid + editable layout.
- LFG UX lives on the **home** chats — do not reintroduce a dedicated `/lfg` board page.
- Game pillars → also update **Games.Template**; generic code → Core / DevKit.
