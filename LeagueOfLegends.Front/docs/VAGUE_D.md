# Vague D — Events in-game, notifs, polish

Scrims et tournois côté LoL, inscription par invocateur, badges team dans le shell, centre de
notifications. Reprend le hors-scope des Vagues B/C (équivalent WoW « Vague D », jamais rédigée
côté Platform).

Roadmap Platform : **Vague H**.

## Décisions verrouillées

- **Events LoL** : entité `Event` dans le microservice jeu (pas les events site Platform).
  Kinds seedés : `scrim`, `tournament`, `custom`.
- **Inscription** : un `EventParticipant` pointe un `Summoner` (slot joueur) ou un `Player`
  (coach / manager staff de la team hôte). La team hôte est optionnelle (`Event.IdTeam`) : un
  joueur solo peut créer un custom.
- **AuthZ événement** : captain / manager de la team hôte créent et éditent ; coach peut gérer
  le roster d’inscription ; les `player` s’inscrivent eux-mêmes avec un invocateur de la team.
- **Notifications** : kinds jeu (`lfg`, `team-app`, `event`, `wall-moderation`) poussés vers
  Platform `Notifications` (contrat existant) plutôt qu’une boîte LoL parallèle.
- **Badges shell** : `Platform.UserGroupRole` câblé sur `Team.Id` pour afficher captain / coach /
  manager / player sur le profil Platform. Source de vérité membership reste LoL ; Platform
  n’est qu’une projection.
- **Remplaçants** : rang `substitute` ajouté. Ne compte pas dans les 5. Plafond souple (ex. 3).
  Candidature et LFG peuvent viser ce rang.
- **SEO / share** : meta Open Graph sur fiche joueur, team, event (URLs publiques déjà stables).

## D1 — Events in-game

- [ ] `Event` + `EventParticipant` + kinds
- [ ] `Events.Search` / `Get` (public), `Create` / `Update` / `Delete` (auth, staff team ou auteur)
- [ ] `EventParticipants.Join` / `Leave` (auth) : invocateur cohérent avec la team hôte si
      présente
- [ ] Front : `/league-of-legends/events`, détail, inscription, rail hub B4 branché sur le réel
- [ ] MSW + Gateway resources

## D2 — Remplaçants

- [ ] Seed `TeamRank.substitute`
- [ ] Plafond remplaçants ; `SetRank` / candidatures / LFG
- [ ] Roster UI : 5 starters + banc

## D3 — Notifications + badges shell

- [ ] Publish Platform `Notifications` sur candidature, accept/refuse, event, post modéré
- [ ] Sync `UserGroupRole` à l’acceptation / kick / leave / disband / transfer
- [ ] Profil Platform : badges team LoL (en plus des badges guilde WoW s’ils arrivent)

## D4 — Share / SEO

- [ ] Titles + descriptions i18n (`lol.*`) sur les routes publiques
- [ ] Cartes de partage (joueur, team, event)

## Gateway (Vague D)

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Events | Search, Get | Create, Update, Delete |
| EventParticipants | List | Join, Leave |

## Hors scope D

- API Riot, tournois officiels, brackets auto
- Salaires / contrats / orga multi-teams type franchise
- Voice / salon persistant (hors Whispers Platform)
