# Spec — Events

Scrims et tournois, inscription par joueur, badges team dans le shell, notifications.

## Décisions verrouillées

- **Events** : entité jeu (pas les events site). Kinds : `scrim`, `tournament`, `custom`.
- **Inscription** : `EventParticipant` pointe un `Player`, avec `Champion` + `Lane` optionnels. Team hôte optionnelle (`Event.IdTeam`).
- **AuthZ** : captain / manager créent et éditent ; coach gère le roster d’inscription ; les `player` s’inscrivent eux-mêmes.
- **Notifications** : kinds jeu (`lfg`, `team-app`, `event`, `wall-moderation`) poussés vers le shell.
- **Badges shell** : `UserGroupRole` câblé sur `Team.Id`. Source de vérité membership reste ici.
- **Remplaçants** : rang `substitute`, hors des 5, plafond souple (ex. 3).
- **SEO / share** : Open Graph sur fiche joueur, team, event.

## D1 — Events in-game

- [ ] `Event` + `EventParticipant` + kinds
- [ ] `Events.Search` / `Get` / `Create` / `Update` / `Delete`
- [ ] `EventParticipants.Join` / `Leave`
- [ ] Front : `/league-of-legends/events`, rail hub branché sur le réel
- [ ] MSW + Gateway

## D2 — Remplaçants

- [ ] Seed `TeamRank.substitute`
- [ ] Plafond ; `SetRank` / candidatures / LFG
- [ ] Roster UI : 5 starters + banc

## D3 — Notifications + badges shell

- [ ] Publish notifications (candidature, event, post modéré)
- [ ] Sync `UserGroupRole` à l’acceptation / kick / leave / disband / transfer
- [ ] Profil public : badges team

## D4 — Share / SEO

- [ ] Titles + descriptions i18n (`lol.*`)
- [ ] Cartes de partage (joueur, team, event)

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Events | Search, Get | Create, Update, Delete |
| EventParticipants | List | Join, Leave |

## Hors scope

- API Riot, tournois officiels, brackets auto
- Salaires / contrats / orga multi-teams type franchise
- Voice / salon persistant
