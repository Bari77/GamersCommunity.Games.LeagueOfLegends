# League of Legends — product vision (locked)

Remote MOBA. Même contrat social que WoW (fiche joueur, organisation, LFG, mur modéré, events),
sans en copier le modèle MMO. Pas d’API Riot au lancement — le joueur saisit sa feuille à la
main.

Roadmap Platform : **Vague F** = B ici, **G** = C, **H** = D. Les tickets vivent dans ce repo.

## Positionnement

L’identité jeu, c’est la fiche `Player` : Riot ID, région, lanes et pool de champions. Pas de
compte enfant à côté.

L’équivalent WoW `Character` est le **rôle joué** — `Champion` + `Lane`. Le catalogue
(`Champion`, `Lane`) et les préférences (lane prioritaire / secondaires, pool `main` / `pool` /
`learning`) appartiennent à la fiche.

Une **team** remplace la guilde. Un joueur peut appartenir à **plusieurs** teams (slot joueur
et/ou staff). Les guildes n’existent pas ; le scope workspace `guild` devient `team`.

## Correspondance WoW → LoL

| WoW | LoL |
|-----|-----|
| MMORPG | MOBA |
| `Character` (perso serveur / race / classe / spec) | `Champion` + `Lane` (sur la fiche joueur) |
| Race / classe / spec (catalogue) | `Champion` + `Lane` (catalogue) |
| Spec principale / secondaire | Lane prioritaire / lanes secondaires |
| `Guild` + `leader` / `officer` / `member` | `Team` + `captain` / `coach` / `manager` / `player` |
| Un perso = une guilde | Un joueur peut avoir plusieurs teams |
| Mur de guilde | Mur d’équipe |
| LFG serveur / rôle tank-heal-dps | LFG région / lane |
| Events + inscription perso | Events (scrim / tournoi) + inscription joueur |

## Dual-layer

| Layer | Owns |
|-------|------|
| **Platform.Front (shell)** | Identité, mur profil, amis, DMs, events site, catalogue, notifications |
| **LoL remote** | Hub, fiche joueur (Riot ID, lanes, pool), teams, LFG, mur d’équipe, events in-game |

`Platform.UserGroupRole.IdGroup` référence un `Team.Id` LoL. Les teams ne sont pas dupliquées
dans Platform. Un même joueur peut porter plusieurs badges team.

## Contenu

| Contenu | Owner |
|---------|-------|
| Mur profil | Platform |
| Notifications | Platform |
| Hub / mur d’équipe + LFG | LoL |
| Events site + RSVP | Platform |
| Events in-game + inscription joueur | LoL |

## Roadmap

| Vague | Focus | Platform |
|-------|--------|----------|
| **B** | Branchement shell / Gateway, fiche joueur, lanes, champions, médias, hub | F |
| **C** | Teams (5 + coach + manager, multi-teams par joueur), mur modéré, board LFG, mute RPC (Core) | G |
| **D** | Events in-game, notifs, badges shell, remplaçants si besoin | H |

## Display vs technical keys

- **Display** : `Game.Title` = `League Of Legends`, labels humains (`Top`, `Ahri`, …)
- **Technical** : `UrlValue` = `/league-of-legends`, codes stables (`top`, `ahri`, `euw`) pour
  routes, assets, i18n (`lol.*`)
