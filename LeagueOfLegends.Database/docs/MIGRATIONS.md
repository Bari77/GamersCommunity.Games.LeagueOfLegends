# LeagueOfLegends — EF Core Code First

The SQL Server schema is managed by **EF Core migrations** from models in `Models/` and configuration in `LeagueOfLegendsDbContext`.

Reference catalog data lives under `Seed/`: one **class per table** inheriting `KeyTableSeed`. Classes are **auto-discovered** (no manual list). Override `Order` only if FK dependencies require a sequence. Applied at **runtime** after `MigrateAsync`.

## Workflow

### New migration (after a **schema** change only)

```powershell
cd LeagueOfLegends.Database
./Add-Migration.ps1 -Name MigrationName
```

Do **not** put seed rows in migrations (`HasData` / `InsertData`).

### Apply migrations + seed

Automatic on consumer startup (`LeagueOfLegends.Consumer`): `MigrateAsync` then `ReferenceDataSeed.EnsureAsync`.

## Change the model

1. Edit or add an entity under `Models/`
2. Adjust `LeagueOfLegendsDbContext.OnModelCreating` if needed
3. Create a migration with `Add-Migration.ps1` for schema diffs
4. Add a `Seed/<Table>Seed.cs` class (auto-discovered; set `Order` if FK-dependent) — no migration
