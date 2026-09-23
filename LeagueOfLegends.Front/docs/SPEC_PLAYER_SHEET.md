# Spec — Player sheet

Pont identité shell ↔ microservice, fiche joueur publique (le joueur **est** l’invocateur), lanes, catalogue de champions, rails du hub. Les teams, le mur modéré et le LFG complet restent dans spec Teams.

## Décisions verrouillées

- **Clé publique fiche** : `Player.PublicId` (GUID), pas l’id shell.
- **Lien depuis le profil public** : `/users/:platformPublicId` → `Players.Resolve` → `/league-of-legends/players/:playerPublicId`.
- **Identité** : `Player.IdKeycloak` + `Player.PlatformUserPublicId` (index uniques), `IdUser` renseigné au `Load`. Snapshot déjà câblé (`platform_events_leagueoflegends`).
- **Pas d’entité `Summoner`** : le joueur **est** l’invocateur. Le rôle joué est `Champion` + `Lane`.
- **Riot ID** : `GameName` + `TagLine` sur `Player`, uniques **par région**. Saisie manuelle — pas d’API Riot.
- **Lane prioritaire** : exactement une (`Player.IdPrimaryLane`).
- **Lanes secondaires** : 1..n via `PlayerLane`, distinctes de la prioritaire. Codes : `top`, `jungle`, `mid`, `bottom`, `support`.
- **Champions** : catalogue seedé (`Champion.Code` stable). Association via `PlayerChampion.Kind` = `main` / `pool` / `learning`. Snapshot statique — pas de Data Dragon live.
- **Rang saisi à la main** : Solo/Duo et Flex optionnels (`tier` + `division` + `lp`). Pas de sync ranked.
- **Régions** au minimum : `euw`, `eune`, `na`, `kr`.
- **Widgets** : `@bari77/gc-widgets`, `Player.LayoutJson` opaque. Widget `roles` (lanes + pool).
- **Médias profil** : URL uniquement, `Share` pour la visibilité publique.
- **Mute LFG** : bannière shell déjà en place ; enforcement Consumer dans spec Teams.
- **Ports** : Front **4202**. DevGateway **8083**.

## B0 — Branchement shell / Gateway

- [x] Seed `GameTypes` : `MOBA` (id 2)
- [x] Seed `Games` : Title `League Of Legends`, `UrlValue` `/league-of-legends`, `Picture` `league-of-legends`
- [x] Gateway : microservice `leagueoflegends` / queue `leagueoflegends_queue`
- [x] Remote federation (`leagueOfLegends`, port **4202**), route `/league-of-legends`
- [x] ACL : alias `lol` → `admin_lol` / `moderator_lol`
- [x] Profil public : section « Jeux » + `Players.Resolve`
- [x] Contrats : `federation.contract.json` / OpenAPI — resources B à la place de `Items`
- [x] Front / compose / DevGateway : ports 4202 / 8083
- [x] Purge démo (`Items`, widget notes)

## B1 — Identité & fiche joueur

- [x] Migration `Player` : `IdKeycloak`, `PlatformUserPublicId`, présentations, `LayoutJson`
- [x] `Players.Load` / `Get` / `Resolve` / `Update`
- [x] Routes : `/league-of-legends/sheet`, `/league-of-legends/players/:publicId`

## B2 — Riot ID, lanes, champions

- [ ] Seeds `Lane` (5), `Region`, `Champion`, `PlayerChampionKind`
- [ ] `Players.Update` : Riot ID, région, lanes, rang saisi, pool
- [ ] `Players.Options` (public)
- [ ] Validations : Riot ID unique par région ; une lane prioritaire ; secondaires ⊂ restantes ; pool = catalogue
- [ ] UI fiche : identité Riot, lanes, rang, pool

## B3 — Médias profil & layout widgets

- [ ] `PlayerPicture` / `PlayerVideo` / `PlayerStream`
- [ ] `LayoutJson` via `Players.Update`
- [ ] Widgets : identité, présentations, stats, rôles, galeries, streams, Twitch, liens
- [ ] Pages par défaut : accueil (verrouillée), rôles, vidéos, photos, liens
- [ ] Target workspace `player` ; pas de target `team` avant spec Teams.
- [ ] MSW handlers standalone

## B4 — Home (rails)

- [ ] `HomeFeed.Get` : LFG, fiches, events (vide jusqu’à spec Events)
- [ ] Rail LFG + SignalR (`/hubs/lol-lfg`)
- [ ] Hub `/league-of-legends` + accent CSS

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Players | Get, Resolve, Options | Load, Update |
| HomeFeed | Get | — |
| LfgAds | ListRecent | Create |
| PlayerPictures | List | Create, Update, Delete |
| PlayerVideos | List | Create, Update, Delete |
| PlayerStreams | List | Create, Update, Delete |

La resource Gateway `Summoners` posée en B0 se retire dans cette spec.

## Hors scope

- Teams, mur d’équipe, candidatures, roster 5+staff — spec Teams
- Board LFG filtrable région / lane — spec Teams
- Events in-game — spec Events
- API Riot / import ranked — jamais au lancement
- Remplaçants — spec Events

## Matrice d’accès

| Visiteur | Profil public | Fiche joueur |
|----------|---------------|--------------|
| Anonyme | identité publique | fiche publique si existe |
| Connecté | + amis / DM / report | + lien depuis le profil |
| Propriétaire | édition profil | `Load` + `Update` fiche + layout |
