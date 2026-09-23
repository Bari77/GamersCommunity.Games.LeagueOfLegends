# Vague B — Fiches joueur LoL + hub jeu

Pont identité Platform ↔ microservice LoL, fiche joueur publique (le joueur **est** l’invocateur),
lanes, catalogue de champions, rails du hub. Les **teams**, le mur modéré et le LFG complet restent
en **Vague C**. Même mécanique que
[Vague B WoW](../../../GamersCommunity.Platform/Platform.Front/docs/VAGUE_B.md).

Roadmap Platform : **Vague F**.

## Décisions verrouillées

- **Clé publique fiche jeu** : `Player.PublicId` (GUID), pas l’`Id` Platform.
- **Lien depuis le profil Platform** : `/users/:platformPublicId` → `Players.Resolve` LoL →
  `/league-of-legends/players/:playerPublicId`.
- **Identité LoL** : `Player.IdKeycloak` + `Player.PlatformUserPublicId` (index uniques), `IdUser`
  = `Platform.User.Id` renseigné au `Load`. Snapshot Platform déjà câblé par le scaffold
  (`platform_events_leagueoflegends`).
- **Pas d’entité `Summoner`** : le joueur **est** l’invocateur. L’équivalent WoW `Character` est
  `Champion` + `Lane` (rôle joué), pas un compte enfant.
- **Riot ID** : `GameName` + `TagLine` sur `Player`, uniques **par région**. Saisie manuelle —
  pas d’API Riot.
- **Lane prioritaire** : exactement une (`Player.IdPrimaryLane`).
- **Lanes secondaires** : 1..n via `PlayerLane`, distinctes de la prioritaire. Les cinq codes
  seedés : `top`, `jungle`, `mid`, `bottom`, `support`.
- **Champions** : catalogue seedé (`Champion.Code` stable, ex. `ahri`). Le joueur ne crée pas un
  champion, il l’associe à sa fiche (`PlayerChampion.Kind` = `main` / `pool` / `learning`).
  Snapshot statique au seed — pas de Data Dragon live.
- **Rang saisi à la main** : Solo/Duo et Flex optionnels (`tier` + `division` + `lp`), comme l’ilvl
  WoW. Pas de sync ranked.
- **Régions** seedées au minimum : `euw`, `eune`, `na`, `kr` (extensible par seed).
- **Widgets** : `@bari77/gc-widgets`, `Player.LayoutJson` opaque, visible par tous, éditable par
  le propriétaire. Widget `characters` WoW → widget `roles` (lanes + pool de champions).
- **Médias profil** : URL uniquement (`PlayerPicture` / `PlayerVideo` / `PlayerStream`), `Share`
  pour la visibilité publique.
- **Mute LFG** : bannière shell déjà en Vague E ; enforcement Consumer en Vague C.
- **Démo Template** : retirer `Items` / notes. Le remote n’est plus un scaffold générique.
- **Ports** : Front **4202** (Template jamais lancé). DevGateway game-full **8083**.

## B0 — Branchement Platform / Gateway / shell

- [x] Seed Platform `GameTypes` : `MOBA` (id 2)
- [x] Seed Platform `Games` : Title `League Of Legends`, `UrlValue` `/league-of-legends`,
      `Picture` `league-of-legends`, `IdType` = MOBA
- [x] Gateway : microservice `leagueoflegends` / queue `leagueoflegends_queue` (Dev + Docker +
      `docs/ROUTING.md`)
- [x] Shell : remote federation (`leagueOfLegends`, port **4202**), route `/league-of-legends`,
      `start:remote:lol`
- [x] ACL : alias `lol` (comme `wow`) → `admin_lol` / `moderator_lol`
- [x] Profil Platform public : section « Jeux » + `Players.Resolve` LoL (stub `hasSheet: false`
      jusqu’à B1, pour ne pas timeout le catalogue)
- [x] Contrats : `federation.contract.json` / OpenAPI — resources B à la place de `Items`
- [x] Front / compose / DevGateway : ports 4202 / 8083
- [x] Purge démo Template (`Items`, widget notes, copy README scaffold)

## B1 — Identité & fiche joueur LoL

- [x] Migration `Player` : `IdKeycloak`, `PlatformUserPublicId` (index uniques filtrés),
      `PresentationIrl` / `PresentationIg`, `LayoutJson`
- [x] `Players.Load` (auth) : get-or-create par Keycloak + ids Platform
- [x] `Players.Get` (public) : fiche par `Player.PublicId`
- [x] `Players.Resolve` (public) : `{ platformUserPublicId }` → `{ playerPublicId? }`
- [x] `Players.Update` (auth) : présentations IRL / IG, propre fiche uniquement
- [x] Routes : `/league-of-legends/sheet` (ma fiche), `/league-of-legends/players/:publicId`

## B2 — Riot ID, lanes, champions

- [ ] Seeds `Lane` (5), `Region`, `Champion` (snapshot codes + titre + lane typique + picture),
      `PlayerChampionKind` (`main`, `pool`, `learning`)
- [ ] `Players.Update` : Riot ID, région, lane prioritaire, lanes secondaires, rang saisi, pool
- [ ] `Players.Options` (public) : régions, lanes, champions, kinds, tiers / divisions
- [ ] Validations : Riot ID unique par région ; une lane prioritaire ; secondaires ⊂ lanes
      restantes, au moins une ; pool = champions du catalogue ; kinds cohérents
- [ ] UI fiche : identité Riot (région, Riot ID), lanes, rang saisi, pool de champions

## B3 — Médias profil & layout widgets

- [ ] `PlayerPicture`, `PlayerVideo`, `PlayerStream` — List (public, filtré `Share`) /
      Create / Update / Delete (propriétaire)
- [ ] `LayoutJson` via `Players.Update`
- [ ] Widgets : identité, présentation IRL, présentation IG, stats, **rôles** (lanes + pool),
      galerie photo, galerie vidéo, streams, lecteur Twitch, liens
- [ ] Pages par défaut : accueil (verrouillée), rôles, vidéos, photos, liens
- [ ] Target workspace `player` déjà présent ; pas de target `team` avant Vague C
- [ ] MSW handlers standalone (`useMocks: true`)

## B4 — Home LoL (rails)

- [ ] `HomeFeed.Get` : derniers LFG actifs (stub vide ok), fiches joueur, events à venir
      (vide jusqu’à D)
- [ ] Rail LFG : tchat global chronologique + SignalR (`/hubs/lol-lfg`) — Create auth minimal
      (titre, corps, kind, expiration) ; filtres région / lane en Vague C
- [ ] Hub `/league-of-legends` : rails + accent CSS `--game-accent` LoL

## Gateway (Vague B)

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Players | Get, Resolve, Options | Load, Update |
| HomeFeed | Get | — |
| LfgAds | ListRecent | Create |
| PlayerPictures | List | Create, Update, Delete |
| PlayerVideos | List | Create, Update, Delete |
| PlayerStreams | List | Create, Update, Delete |

Catalogue `Lanes` / `Regions` / `Champions` : exposés via `Players.Options`, pas en resources
séparées sauf besoin staff plus tard. La resource Gateway `Summoners` posée en B0 se retire
dans cette vague.

## Hors scope B

- Teams, mur d’équipe, candidatures, roster 5+staff — Vague C
- Board LFG filtrable région / lane — Vague C
- Events in-game (scrim / tournoi) — Vague D
- API Riot / import ranked — jamais au lancement
- Remplaçants, multi-roster — Vague D

## Matrice d’accès profil

| Visiteur | Profil Platform | Fiche LoL |
|----------|-----------------|-----------|
| Anonyme | identité publique | fiche publique si existe |
| Connecté | + amis / DM / report | + lien depuis profil Platform |
| Propriétaire | édition profil Platform | `Load` + `Update` fiche + layout |
