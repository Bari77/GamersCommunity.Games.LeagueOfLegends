# Spec — Teams

Gouvernance d’équipe MOBA, mur modéré par le staff, LFG live sur l’accueil, enforcement du mute. Les events in-game restent dans spec Events.

## Décisions verrouillées

- **Clé publique team** : `Team.PublicId` (GUID). Handle = `Entitled#Discriminator`. Tag court optionnel (2–5 chars).
- **Rangs** : `TeamMember.IdTeamRank` est la seule source de vérité.

  | Code | Rôle | Roster |
  |------|------|--------|
  | `captain` | Leader, aussi un joueur | joueur (lane + main/sub) |
  | `player` | Joueur | joueur (lane + main/sub) |
  | `coach` | Staff sportif | hors roster joueur |
  | `manager` | Staff orga | hors roster joueur |

- **Plafonds** : au plus 1 captain, 1 coach, 1 manager. Pas de plafond sur le nombre de joueurs.
- **Siège joueur** : `TeamMember.IdLane` + `RosterKind` `main` / `sub`. Un seul `main` par lane (en nommer un autre main fait passer le précédent en sub). Les remplaçants sont des `player` `sub`, pas un rang.
- **Appartenance** : `TeamMember` rattaché au `Player`. Un joueur peut être dans plusieurs teams. Un seul `TeamMember` par couple (`Team`, `Player`).
- **Captain** : `Team.IdCaptain` + `TeamMember` `captain` écrits dans la même transaction. Région de la team = région du joueur fondateur.
- **Candidatures** : `TeamApplication` (`pending` / `accepted` / `rejected` / `withdrawn`). Joueur : lane visée. Staff : rang `coach` ou `manager`. Une seule `pending` par couple (team, player).
- **Mur modéré** : captain / coach / manager publient en `approved` ; les `player` passent en `pending`.
- **Pas de deep-link DM.** Parcours : LFG team → fiche team → roster → pseudo → profil public → ami → Whispers.
- **Whispers team** : canal Platform `lol:team:{PublicId}` créé avec la team, roster synchronisé (join / leave / kick / dissolve), titre = handle. Pas de tchat répliqué en base jeu.
- **Mute** : RPC synchrone vers `platform_queue` (`Users.Sanctions`), cache mémoire court. Sanctions jamais répliquées en base jeu.
- **Client RPC** : à partager (package commun) — cette spec est le deuxième consommateur.
- **Widgets team** : `Team.LayoutJson` + target workspace `team`.
- **LFG** : kinds `player` / `team`. Flux live sur l’accueil (pas de page board dédiée).

## C1 — Gouvernance de team

- [x] Migration `TeamGovernance` : `Team`, `TeamRank`, `TeamMember`, `TeamApplication`, `TeamLink`, `LayoutJson`, colonnes de modération sur `GamePost`
- [x] Seed `TeamRank` + `TeamApplicationStatus`
- [x] `Teams.Search` / `ListByPlayer` / `Create` / `Update` / `SetRank` / `Kick` / `Leave` / `TransferCaptaincy` / `Disband` / `Get`
- [x] `TeamApplications` : Create / ListMine / Withdraw / List / Review
- [x] Acceptation joueur sans plafond de roster
- [x] Acceptation staff refusée si le poste est pris
- [x] Front : annuaire `/league-of-legends/teams`, fiche
- [x] Whispers : canal team créé à la création, roster synchronisé

## C2 — Mur d’équipe modéré

- [x] `GamePosts.ListTeamWall` / `Create` / `ListPending` / `Moderate` / `Delete`
- [x] Front : mur + file de modération pour le staff

## C3 — LFG sur l’accueil

- [x] `LfgAds.ListRecent` / `ListBefore` / `Create` + SignalR live
- [x] Chats player / team sur `/league-of-legends` (accueil)
- [x] Annonce team → fiche team ; annonce joueur → fiche joueur
- [x] Pas de page board `/lfg` ni entrée nav dédiée

## C4 — Enforcement du mute

- [x] Client RPC `Users.Sanctions` + cache
- [x] Garde `EnsureCanPublishAsync` sur LFG, posts, candidatures
- [x] Ban actif : blocage des publications
- [x] Front : erreurs `MUTED` / `BANNED` / `SANCTIONS_UNAVAILABLE`

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Teams | Get, Search, ListByPlayer | ListPostable, Create, Update, SetRank, SetRoster, Kick, Leave, TransferCaptaincy, Disband |
| TeamApplications | — | Create, ListMine, Withdraw, List, Review |
| GamePosts | ListTeamWall | Create, ListPending, Update, Moderate, Delete |
| TeamLinks | List | Create, Update, Reorder, Delete |
| LfgAds | ListRecent, ListBefore, Search | Create |

`Users.Sanctions` reste hors table de routage.

## Matrice de permissions

| Action | Visiteur | Player | Coach | Manager | Captain |
|--------|----------|--------|-------|---------|---------|
| Voir la fiche et le mur | oui | oui | oui | oui | oui |
| Candidater | oui (connecté) | — | — | — | — |
| Publier sur le mur | non | oui (`pending`) | oui (`approved`) | oui (`approved`) | oui (`approved`) |
| Modérer le mur | non | non | oui | oui | oui |
| Traiter les candidatures | non | non | oui | oui | oui |
| Exclure un membre | non | non | oui (player) | oui (player) | oui |
| Éditer la fiche | non | non | non | oui | oui |
| Changer les rangs / main-sub | non | non | non | non | oui |
| Transférer / dissoudre | non | non | non | non | oui |

## Hors scope

- Events in-game — spec Events
- Notifications, partage / SEO — spec Events
- Badges team côté shell — spec Events
- API Riot — jamais au lancement
