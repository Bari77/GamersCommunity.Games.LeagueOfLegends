# Vague C — Teams, mur modéré, board LFG

Gouvernance d’équipe MOBA dans le microservice LoL (pas des guildes), mur modéré par le staff
d’équipe, board LFG avec filtres région / lane, et enforcement du mute Platform. Les events
in-game restent en **Vague D**. Même mécanique que
[Vague C WoW](../../../GamersCommunity.Platform/Platform.Front/docs/VAGUE_C.md).

Roadmap Platform : **Vague G**.

## Décisions verrouillées

- **Clé publique team** : `Team.PublicId` (GUID). Handle = `Entitled#Discriminator`, index unique
  sur le couple. Tag court optionnel (`Tag`, 2–5 chars) pour l’affichage roster.
- **Rangs** : `TeamMember.IdTeamRank` est la **seule** source de vérité.

  | Code | Rôle | Slot roster |
  |------|------|-------------|
  | `captain` | Leader (un des 5 joueurs) | joueur (compte dans les 5) |
  | `player` | Starter | joueur (compte dans les 5) |
  | `coach` | Staff sportif | staff (hors 5) |
  | `manager` | Staff orga | staff (hors 5) |

- **Plafonds** : au plus **1 captain**, **1 coach**, **1 manager**, et **5** membres en slot
  joueur (`captain` + `player`). Pas de remplaçants dans cette vague.
- **Appartenance** : `TeamMember` est la seule source de vérité.
  - Slot joueur (`captain`, `player`) : `IdSummoner` **obligatoire**. Un invocateur = une team.
  - Slot staff (`coach`, `manager`) : rattaché au `Player`, `IdSummoner` null. Un joueur ne peut
    pas être staff de deux teams à la fois (ni staff + joueur sur deux teams différentes — un
    `Player` a au plus une membership staff).
- **Captain** : `Team.IdCaptain` pointe l’invocateur fondateur (région de la fiche team) et doit
  toujours avoir un `TeamMember` `captain` en regard. Écrits dans la même transaction.
- **Candidatures** : `TeamApplication` (statut `pending` / `accepted` / `rejected` / `withdrawn`).
  - Candidature joueur : `IdSummoner` + lane visée.
  - Candidature staff : `IdPlayer` + rang demandé (`coach` ou `manager`).
  - Une seule `pending` par couple (team, invocateur) ou (team, player+rang staff).
- **Mur modéré** : `GamePost` + `GamePostStatus` (`pending` / `approved` / `rejected`). Captain,
  coach et manager publient en `approved` ; les `player` passent en `pending`. File visible
  captain / coach / manager.
- **Pas de deep-link DM.** Parcours : LFG team → fiche team → roster → pseudo → profil Platform
  → ami → Whispers.
- **Mute** : RPC synchrone LoL → `platform_queue` (`Users.Sanctions`), cache mémoire court.
  Sanctions **jamais** répliquées en base LoL.
- **Client RPC** : Vague C WoW l’a laissé dans le Consumer WoW. **Cette vague le remonte dans
  `GamersCommunity.Core`** (deuxième jeu). WoW bascule sur le package Core dans la même livraison
  Core, ou le Consumer LoL référence Core dès que le type y est.
- **Widgets team** : `Team.LayoutJson` + target workspace `team` (comme `guild` WoW).
- **LFG** : kinds `player` / `team`. Filtres `region` / `lane` (plus `kind`). Une annonce team
  estampille la région de la team et les lanes recherchées.

## C1 — Gouvernance de team

- [ ] Migration `TeamGovernance` : `Team`, `TeamRank`, `TeamMember`, `TeamApplication` +
      statuts, `TeamLink`, colonnes de modération sur `GamePost`, `LayoutJson`
- [ ] Seed `TeamRank` (`captain`, `coach`, `manager`, `player`) + `TeamApplicationStatus`
- [ ] `Teams.Search` (public) : nom / tag, filtres région / lane recherchée, pagination curseur
- [ ] `Teams.Create` (auth) : invocateur fondateur sans team, handle unique, member `captain`
      dans la même transaction ; région = région de l’invocateur
- [ ] `Teams.Update` (auth) : description, tag, liens, captain + manager
- [ ] `Teams.SetRank` (auth) : captain uniquement ; interdit de casser les plafonds (2 captains,
      6 joueurs, 2 coaches…)
- [ ] `Teams.Kick` (auth) : captain, coach, manager ; interdit sur un rang ≥ au sien
      (`captain` > `coach` = `manager` > `player` pour le kick)
- [ ] `Teams.Leave` (auth) : le captain doit transférer avant de partir
- [ ] `Teams.TransferCaptaincy` (auth) : captain → un `player` de la team (bascule des deux rangs,
      le nouveau compte toujours dans les 5)
- [ ] `Teams.Disband` (auth) : captain, confirmation par handle
- [ ] `Teams.Get` enrichi : effectif 5+staff, rang du visiteur, état de sa candidature, lanes
      couvertes par le roster
- [ ] `TeamApplications` : `Create` / `ListMine` / `Withdraw` (candidat), `List` / `Review`
      (captain / coach / manager)
- [ ] Acceptation joueur refusée si le slot 5 est plein, ou si l’invocateur est déjà en team
- [ ] Acceptation staff refusée si le poste coach/manager est déjà pris
- [ ] Front : annuaire `/league-of-legends/teams` (recherche, filtres, fondation)
- [ ] Front : fiche (badges de rang, roster 5 + staff, réglages, candidature)

## C2 — Mur d’équipe modéré

- [ ] `GamePosts.ListTeamWall` (public) : posts `approved`, pagination curseur
- [ ] `GamePosts.Create` (auth) : membre ; `approved` si captain / coach / manager, sinon
      `pending`
- [ ] `GamePosts.ListPending` (auth) : file, captain / coach / manager
- [ ] `GamePosts.Moderate` (auth) : `approved` / `rejected` + motif
- [ ] `GamePosts.Delete` (auth) : auteur ou staff (captain / coach / manager)
- [ ] Front : mur dans la fiche, avertissement de modération pour les `player`
- [ ] Front : file au-dessus du mur pour le staff

## C3 — Board LFG

- [ ] `LfgAds.Search` (public) : filtres `kind` / région / lane, pagination curseur
- [ ] `LfgAds.Create` estampille région + lane (team : région de la team + lanes manquantes ;
      joueur : région + lane prioritaire de l’invocateur principal)
- [ ] Page `/league-of-legends/lfg` : board filtrable, séparé du rail temps réel du hub
- [ ] Annonce team → fiche team (parcours de contact)
- [ ] Annonce joueur → fiche joueur → profil Platform

## C4 — Enforcement du mute + RPC Core

- [ ] Remonter `PlatformSanctionsClient` (et contrat `Users.Sanctions`) dans
      `GamersCommunity.Core` ; WoW et LoL consomment le même type
- [ ] Garde `EnsureCanPublishAsync` sur `LfgAds.Create`, `GamePosts.Create`,
      `TeamApplications.Create`
- [ ] Ban actif : blocage des publications LoL
- [ ] Front : erreurs `MUTED` / `BANNED` / `SANCTIONS_UNAVAILABLE`

## Gateway (Vague C)

| Resource | Public | Private (auth) |
|----------|--------|----------------|
| Teams | Get, Search | ListPostable, Create, Update, SetRank, Kick, Leave, TransferCaptaincy, Disband |
| TeamApplications | — | Create, ListMine, Withdraw, List, Review |
| GamePosts | ListTeamWall | Create, ListPending, Moderate, Delete |
| LfgAds | ListRecent, ListBefore, Search | Create |

`Users.Sanctions` reste hors table de routage : appel interne de bus.

## Matrice de permissions team

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

## Hors scope C

- Events in-game et inscription d’invocateurs — Vague D
- Centre de notifications, partage / SEO — Vague D
- Remplaçants (`substitute`) — Vague D
- `Platform.UserGroupRole` et badges team côté shell — Vague D
- API Riot — jamais au lancement
