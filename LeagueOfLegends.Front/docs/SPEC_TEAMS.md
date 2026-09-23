# Spec — Teams

Gouvernance d’équipe MOBA, mur modéré par le staff, board LFG région / lane, enforcement du mute. Les events in-game restent dans spec Events.

## Décisions verrouillées

- **Clé publique team** : `Team.PublicId` (GUID). Handle = `Entitled#Discriminator`. Tag court optionnel (2–5 chars).
- **Rangs** : `TeamMember.IdTeamRank` est la seule source de vérité.

  | Code | Rôle | Slot roster |
  |------|------|-------------|
  | `captain` | Leader (un des 5 joueurs) | joueur (compte dans les 5) |
  | `player` | Starter | joueur (compte dans les 5) |
  | `coach` | Staff sportif | staff (hors 5) |
  | `manager` | Staff orga | staff (hors 5) |

- **Plafonds** : au plus 1 captain, 1 coach, 1 manager, et 5 membres en slot joueur. Pas de remplaçants dans cette spec.
- **Appartenance** : `TeamMember` rattaché au `Player`. Un joueur peut être dans plusieurs teams. Un seul `TeamMember` par couple (`Team`, `Player`).
- **Captain** : `Team.IdCaptain` + `TeamMember` `captain` écrits dans la même transaction. Région de la team = région du joueur fondateur.
- **Candidatures** : `TeamApplication` (`pending` / `accepted` / `rejected` / `withdrawn`). Joueur : lane visée. Staff : rang `coach` ou `manager`. Une seule `pending` par couple (team, player).
- **Mur modéré** : captain / coach / manager publient en `approved` ; les `player` passent en `pending`.
- **Pas de deep-link DM.** Parcours : LFG team → fiche team → roster → pseudo → profil public → ami → Whispers.
- **Mute** : RPC synchrone vers `platform_queue` (`Users.Sanctions`), cache mémoire court. Sanctions jamais répliquées en base jeu.
- **Client RPC** : à partager (package commun) — cette spec est le deuxième consommateur.
- **Widgets team** : `Team.LayoutJson` + target workspace `team`.
- **LFG** : kinds `player` / `team`. Filtres `region` / `lane`.

## C1 — Gouvernance de team

- [ ] Migration `TeamGovernance` : `Team`, `TeamRank`, `TeamMember`, `TeamApplication`, `TeamLink`, `LayoutJson`, colonnes de modération sur `GamePost`
- [ ] Seed `TeamRank` + `TeamApplicationStatus`
- [ ] `Teams.Search` / `Create` / `Update` / `SetRank` / `Kick` / `Leave` / `TransferCaptaincy` / `Disband` / `Get`
- [ ] `TeamApplications` : Create / ListMine / Withdraw / List / Review
- [ ] Acceptation joueur refusée si le slot 5 est plein
- [ ] Acceptation staff refusée si le poste est pris
- [ ] Front : annuaire `/league-of-legends/teams`, fiche

## C2 — Mur d’équipe modéré

- [ ] `GamePosts.ListTeamWall` / `Create` / `ListPending` / `Moderate` / `Delete`
- [ ] Front : mur + file de modération pour le staff

## C3 — Board LFG

- [ ] `LfgAds.Search` : `kind` / région / lane
- [ ] Page `/league-of-legends/lfg`
- [ ] Annonce team → fiche team ; annonce joueur → fiche joueur

## C4 — Enforcement du mute

- [ ] Client RPC `Users.Sanctions` + cache
- [ ] Garde `EnsureCanPublishAsync` sur LFG, posts, candidatures
- [ ] Ban actif : blocage des publications
- [ ] Front : erreurs `MUTED` / `BANNED` / `SANCTIONS_UNAVAILABLE`

## Gateway

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Teams | Get, Search | ListPostable, Create, Update, SetRank, Kick, Leave, TransferCaptaincy, Disband |
| TeamApplications | — | Create, ListMine, Withdraw, List, Review |
| GamePosts | ListTeamWall | Create, ListPending, Moderate, Delete |
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
| Changer les rangs | non | non | non | non | oui |
| Transférer / dissoudre | non | non | non | non | oui |

## Hors scope

- Events in-game — spec Events
- Notifications, partage / SEO — spec Events
- Remplaçants (`substitute`) — spec Events
- Badges team côté shell — spec Events
- API Riot — jamais au lancement
