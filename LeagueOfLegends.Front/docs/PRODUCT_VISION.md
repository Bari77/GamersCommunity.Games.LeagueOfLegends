# League of Legends — product vision (locked)

Remote jeu pour le MOBA. Même contrat que WoW (fiche joueur, comptes, organisation, LFG, mur
modéré, events), vocabulaire et contraintes adaptés. Pas d’API Riot au lancement — le joueur
saisit sa feuille à la main.

Roadmap Platform : **Vague F** = B ici, **G** = C, **H** = D. Les tickets vivent dans ce repo.

## Correspondance WoW → LoL

| WoW | LoL |
|-----|-----|
| MMORPG | MOBA |
| `Character` (perso serveur / race / classe / spec) | `Summoner` (Riot ID + région + lanes + pool) |
| Race / classe / spec (catalogue) | `Champion` + `Lane` (catalogue) |
| Spec principale / secondaire | Lane prioritaire / lanes secondaires |
| `Guild` + `leader` / `officer` / `member` | `Team` + `captain` / `coach` / `manager` / `player` |
| Un perso = une guilde | Un invocateur = une team |
| Mur de guilde | Mur d’équipe |
| LFG serveur / rôle tank-heal-dps | LFG région / lane |
| Events + inscription perso | Events (scrim / tournoi) + inscription invocateur |

Les guildes n’existent pas dans ce remote. Le scope workspace widgets `guild` devient `team`.

## Dual-layer (inchangé)

| Layer | Owns |
|-------|------|
| **Platform.Front (shell)** | Identité, amis, DMs, events site, catalogue |
| **LoL remote** | Hub, fiche joueur, invocateurs, teams, LFG, mur d’équipe, events in-game |

`Platform.UserGroupRole.IdGroup` référence un id de **team** côté LoL. Les teams ne sont pas
dupliquées dans Platform.

## Roadmap

| Vague | Focus | Platform |
|-------|--------|----------|
| **B** | Branchement shell / Gateway, fiche joueur, invocateurs, lanes, champions, médias, hub | F |
| **C** | Teams (5 joueurs + coach + manager), mur modéré, board LFG, mute RPC (remontée Core) | G |
| **D** | Events in-game, notifs, badges shell, remplaçants si besoin | H |

## Display vs technical keys

- **Display** : `Game.Title` = `League Of Legends`, labels humains (`Top`, `Ahri`, …)
- **Technical** : `UrlValue` = `/league-of-legends`, codes stables (`top`, `ahri`, `euw`) pour
  routes, assets, i18n (`lol.*`)
