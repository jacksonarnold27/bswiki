# Weapons and evolutions

## How a Bonkscape weapon works

Every OSRS weapon takes over one Megabonk weapon (its *Megabonk base*). It keeps that weapon's **behaviour**: how it
attacks, its projectile and its visuals. Bonkscape replaces the rest:

- **Base stats**: damage, cooldown, area, amount (projectiles), speed (projectile speed), bounces, duration and
  knockback come from the row below.
- **Level-up upgrades**: the weapon's Megabonk upgrade pool is replaced with the row's list.
- **Name and icon**: the OSRS name, and an icon rendered from your cache. Fire Strike, Ice Barrage and Fire Surge use
  their OSRS spell icons; the rest use the item's inventory icon.

On Bonkscape's maps, level-ups offer only these twelve weapons, and they all count as unlocked whatever your Megabonk progress
is. When a weapon fires:

- its projectile carries the OSRS model from the sheet, about a quarter of a tile along its longest side, centred
  on the projectile and turned to point along its flight: the Magic shortbow's rune
  arrow, the Toxic blowpipe's dragon dart, the Red chinchompa, and Fire Strike's, Ice Barrage's and the Trident's
  spell graphics (the Abyssal whip, Dragon scimitar, Scythe of vitur, Armadyl godsword, Dragon claws and Void
  knight mace have none). Megabonk's own projectile effects stay;
- the weapon's OSRS attack sound plays, at most every 0.3 s;
- your adventurer takes that weapon in hand and plays its OSRS attack animation ([Adventurers](adventurers.md#looks)).

How the projectiles look in a run is *(unconfirmed: needs a Melty run or footage)*.

## Weapons

<!-- gen:weapons -->
| Weapon | OSRS item | Style | Megabonk base | Damage | Cooldown | Area | Amount | Speed | Bounces | Duration | Knockback | Skill levels to start a run with it | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Abyssal whip** | Abyssal whip | melee | Katana | 10 | 0.35 | 1.15 | 1 | 0 | 0 | 0.5 | 1 | 70 Attack | <span class="st st-built">built</span> |
| **Dragon scimitar** | Dragon scimitar | melee | Sword | 11 | 0.7 | 1 | 1 | 1 | 0 | 0.5 | 2 | none (a starting weapon) | <span class="st st-verified">verified</span> |
| **Magic shortbow** | Magic shortbow | ranged | Bow | 8 | 0.7 | 1 | 1 | 1.6 | 2 | 0.5 | 0.5 | none (a starting weapon) | <span class="st st-built">built</span> |
| **Toxic blowpipe** | Toxic blowpipe | ranged | Revolver | 4 | 1 | 1 | 6 | 2.2 | 0 | 1 | 0.4 | 75 Ranged | <span class="st st-built">built</span> |
| **Fire Strike** | Staff of fire | magic | FireStaff | 10 | 0.5 | 1 | 1 | 0.5 | 0 | 2 | 1 | none (a starting weapon) | <span class="st st-built">built</span> |
| **Ice Barrage** | Ancient staff | magic | Frostwalker | 9 | 1.25 | 1.1 | 0 | 0 | 0 | 1.6 | 0.5 | 94 Magic | <span class="st st-built">built</span> |
| **Trident of the seas** | Trident of the Seas | magic | LightningStaff | 8 | 1 | 1 | 1 | 0.5 | 0 | 1 | 1 | 75 Magic | <span class="st st-built">built</span> |
| **Red chinchompa** | Red chinchompa | ranged | Rockets | 11 | 0.35 | 1.2 | 1 | 1 | 0 | 5 | 2 | 55 Ranged | <span class="st st-built">built</span> |
| **Dwarf multicannon** | Cannon base | ranged | new: deployable | 6 | 4 | 1 | 1 | 2 | 0 | 10 | 0.5 | 1 Ranged | <span class="st st-todo">planned (phase 3)</span> |
| **Dharok's greataxe** | Dharok's greataxe | melee | Axe | 14 | 1.6 | 1.3 | 1 | 0.5 | 0 | 0.82 | 2 | 70 Attack, 70 Strength | <span class="st st-todo">planned (phase 2)</span> |
| **Scythe of vitur** | Scythe of Vitur | melee | Scythe | 12 | 0.85 | 1.4 | 3 | 1 | 0 | 0.5 | 1 | 80 Attack, 90 Strength | <span class="st st-built">built</span> |
| **Armadyl godsword** | Armadyl godsword | melee | HeroSword | 16 | 1.2 | 1.3 | 1 | 30 | 0 | 0.5 | 3 | 75 Attack | <span class="st st-built">built</span> |
| **Dragon claws** | Dragon claws | melee | Dexecutioner | 9 | 0.6 | 1 | 1 | 1 | 0 | 0.5 | 1 | 60 Attack | <span class="st st-built">built</span> |
| **Void knight mace** | Void knight mace | melee | CorruptSword | 10 | 0.85 | 1.1 | 1 | 1 | 0 | 0.5 | 2.5 | none (a starting weapon) | <span class="st st-built">built</span> |
<!-- /gen:weapons -->

"Skill levels to start a run with it" only matters for the **starting** weapon
([Adventurers](adventurers.md#starting-weapons)). Any weapon can turn up as a level-up offer.

Each weapon trains a skill when it deals damage: melee weapons train Attack, Strength or Defence (by your
adventurer's attack style), ranged weapons Ranged, magic weapons Magic, and all of them some Hitpoints
([Skills and XP](skills-and-xp.md)).

### Level-ups and special attacks

When a weapon levels up, Megabonk offers upgrades from its pool. Bonkscape's pools:

<!-- gen:weapon-levels -->
| Weapon | Level-up upgrade pool | Special attack | Status |
|---|---|---|---|
| **Abyssal whip** | damage +2.0 (flat); attack speed +0.08 (addition); attack size +0.15 (addition); crit chance +0.06 (flat) | Energy Drain (hit:1.25,slow:2:0.5:4, not built) | <span class="st st-built">built</span> |
| **Dragon scimitar** | damage +2.0 (flat); attack size +0.2 (addition); projectiles +1 (flat); knockback +0.25 (addition) | Sever (hit:1.5,stun:1.5, not built) | <span class="st st-verified">verified</span> |
| **Magic shortbow** | damage +1.6 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); crit chance +0.08 (flat) | Snapshot (hits:1.1/1.1:0.2, not built) | <span class="st st-built">built</span> |
| **Toxic blowpipe** | damage +2.0 (flat); projectiles +1 (flat); crit chance +0.08 (flat); projectile speed +0.2 (addition) | Toxic Siphon (hit:1.5,heal:0.5, not built) | <span class="st st-built">built</span> |
| **Fire Strike** | damage +2.5 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); attack size +0.16 (addition) | Wildfire (cone:5:70:1.5, not built) | <span class="st st-built">built</span> |
| **Ice Barrage** | attack size +0.12 (addition); damage +2.0 (flat); duration +0.12 (flat) | Deep Freeze (freeze:4:3:0.5, not built) | <span class="st st-built">built</span> |
| **Trident of the seas** | damage +2.0 (flat); projectiles +1 (flat); bounces +1 (flat); attack size +0.2 (addition) | Tidal Chain (chain:5:3:1.0, not built) | <span class="st st-built">built</span> |
| **Red chinchompa** | damage +2.0 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); attack size +0.15 (addition) | - | <span class="st st-built">built</span> |
| **Dwarf multicannon** | damage +1.5 (flat); attack speed +0.1 (addition); duration +0.2 (flat) | - | <span class="st st-todo">planned (phase 3)</span> |
| **Dharok's greataxe** | damage +3.0 (flat); attack size +0.15 (addition) | Wretched Strength (none, not built) | <span class="st st-todo">planned (phase 2)</span> |
| **Scythe of vitur** | damage +2.0 (flat); attack size +0.2 (addition) | - | <span class="st st-built">built</span> |
| **Armadyl godsword** | damage +3.0 (flat); attack size +0.2 (addition) | The Judgement (hit:2.5,aoe:2:0.5, not built) | <span class="st st-built">built</span> |
| **Dragon claws** | damage +2.0 (flat); crit chance +0.08 (flat) | Slice and Dice (hits:1.2/0.6/0.4/0.4:0.12, not built) | <span class="st st-built">built</span> |
| **Void knight mace** | damage +2.0 (flat); attack size +0.2 (addition); knockback +0.25 (addition); attack speed +0.08 (addition) | - | <span class="st st-built">built</span> |
<!-- /gen:weapon-levels -->

## Special attacks

Nine of the weapons have a special attack. They share one **special attack energy** bar, the special attack orb
beside the minimap ([HUD](hud-and-chat.md#in-a-run)):

- It starts each run full (100%) and refills completely in 60 seconds. Each kill adds 0.25% more, but kills can at
  most double the refill rate.
- **F** (`Special.FireKey`) fires the **armed** weapon's spec at the nearest monster in reach: 5 tiles for melee
  weapons, 12 for ranged and magic, and no farther than its own radius for a spec centred on you (Wildfire, Deep
  Freeze). With nothing in reach or too little energy nothing is spent, and the chat says *There's nothing in reach.*
  or *You don't have enough special attack energy left.*
- **Q** (`Special.SwitchKey`) arms the next weapon you hold that has a spec; the chat names it, as in *Special attack:
  Abyssal whip (Energy Drain).* The armed weapon's icon sits beside the orb, which lights up when that spec can fire.
- A spec plays your adventurer's OSRS special attack animation and its OSRS graphic, then hits through Megabonk's own
  weapon damage, so hitsplats, XP and kills work as for any hit. A spec hit is a multiple of the weapon's average hit
  over its last 20 hits (before its first hit, its damage stat). It hits only monsters that can take damage: Megabonk
  ignores every hit on a monster for about its first second.

| Weapon | Special attack | Energy | What it does |
|---|---|---|---|
| Abyssal whip | Energy Drain | 50% | Hits for 1.25x, and slows the target and every monster within 2 tiles of it to half speed for 4 s |
| Dragon scimitar | Sever | 55% | Hits for 1.5x and stuns the target for 1.5 s |
| Magic shortbow | Snapshot | 55% | Two hits of 1.1x, 0.2 s apart |
| Toxic blowpipe | Toxic Siphon | 50% | Hits for 1.5x and heals you half the damage it dealt |
| Fire Strike | Wildfire (Bonkscape's own) | 50% | Hits every monster in a 70 degree cone 5 tiles long for 1.5x |
| Ice Barrage | Deep Freeze (Bonkscape's own) | 50% | Hits every monster within 4 tiles of you for 0.5x and freezes it for 3 s; its ice block shows on the target |
| Trident of the seas | Tidal Chain (Bonkscape's own) | 50% | Hits 5 monsters in a chain, each the nearest within 3 tiles of the last, for 1x, 0.12 s apart |
| Armadyl godsword | The Judgement | 50% | Hits for 2.5x, and every other monster within 2 tiles of the target for 0.5x |
| Dragon claws | Slice and Dice | 50% | Four hits of 1.2x, 0.6x, 0.4x and 0.4x, 0.12 s apart |

The Red chinchompa and the Scythe of vitur have none. Fire Strike, Ice Barrage and the Trident have no special
attack in OSRS; Bonkscape gives them one.

## Caskets

Megabonk's chests wear the OSRS **Casket** model, and their map icon stays. Opening one gives Megabonk's normal chest
reward. Opening a casket is also when evolutions happen.

## Evolutions

An evolution turns a maxed weapon into its OSRS upgrade. When you open a casket, Bonkscape checks every evolution:

1. You have its weapon at **level 8 or higher**, and
2. you hold its **gear passive** (any level).

If both are true, the weapon evolves on the spot: its base stats are multiplied as below, it takes the new name and
icon, the chat box says *"Your Abyssal whip has become an Abyssal tentacle!"*, a dialogue in the chat box shows the new
name, and
OSRS's level-up sound plays. Each evolution happens once per run, and every run starts with the plain weapons again.

<!-- gen:evolutions -->
| Becomes | Weapon | + gear passive | Weapon level | Stat changes | Status |
|---|---|---|---|---|---|
| **Abyssal tentacle** | Abyssal whip | Kraken tentacle | 8 | damage x1.5, attack speed x1.2, attack size x1.25 | <span class="st st-built">built</span> |
| **Fire Surge** | Fire Strike | Tome of fire | 8 | damage x1.8, projectiles x1, attack size x1.3 | <span class="st st-built">built</span> |
| **Armadyl godsword (i)** | Armadyl godsword | Godsword shard | 8 | damage x1.5 | <span class="st st-built">built</span> |
| **Infernal cape** | any weapon | Fire cape | 1 | damage x1.1 | <span class="st st-todo">planned (phase 2)</span> |
<!-- /gen:evolutions -->

Fire Surge's "projectiles x1" leaves the number of projectiles as it was.

To aim for one: take the **Abyssal whip** with the **Kraken tentacle**, or **Fire Strike** with the **Tome of fire**
([Gear passives](gear-passives.md)), level the weapon to 8, then open a casket.

<!-- sources: src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Projectiles.cs src/Bonkscape.Plugin/Systems/PlayerSkin.cs src/Bonkscape.Plugin/Systems/Evolutions.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs sheets/weapons.json sheets/evolutions.json -->
