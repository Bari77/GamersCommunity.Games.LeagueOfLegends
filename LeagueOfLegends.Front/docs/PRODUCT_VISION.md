# League of Legends — product vision (locked)

MOBA remote. Player sheet, teams, LFG, moderated team wall, in-game events. No Riot API at launch — the player enters their sheet by hand.

The player **is** the summoner: Riot ID, region, lanes and champion pool live on `Player`. There is no child account. The role played is `Champion` + `Lane`. A player may belong to several teams (player slot and/or staff). There are no guilds ; the workspace target is `team`.

## This remote owns

Hub, player sheet, teams, LFG, moderated team wall, in-game events and player signup.

The site identity, profile wall, friends, DMs, site events and notifications live on the shell.

## Content

| Content | Owner |
|---------|-------|
| Hub / team wall + LFG | This remote |
| In-game events + player signup | This remote |
| Profile wall, friends, DMs, site events, notifications | Shell |

`UserGroupRole.IdGroup` references a `Team.Id`. Teams are not duplicated on the shell. A player may hold several team badges.

## Specs

| Spec | Focus |
|------|--------|
| Player sheet | Shell / Gateway wiring, lanes, champions, media, hub |
| Teams | 5 + coach + manager, several per player, moderated wall, LFG, mute RPC |
| Events | In-game events, notifications, shell badges, substitutes |

## Display vs technical keys

- **Display** : `League Of Legends`, human labels (`Top`, `Ahri`, …)
- **Technical** : `UrlValue` `/league-of-legends`, codes (`top`, `ahri`, `euw`) for routes, assets, i18n (`lol.*`)
