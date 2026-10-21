# Weapons and evolutions

## How a Bonkscape weapon works

Every OSRS weapon takes over one Megabonk weapon (its *Megabonk base*). It keeps that weapon's **behaviour**: how it
attacks, its projectile and its visuals. Bonkscape replaces the rest:

- **Base stats**: damage, cooldown, area, amount (projectiles), speed (projectile speed), bounces, duration and
  knockback come from the row below.
- **Level-up upgrades**: the weapon's Megabonk upgrade pool is replaced with the row's list.
- **Name and icon**: the OSRS name, and an icon rendered from your cache. Fire Strike, Ice Barrage and Fire Surge use
  their OSRS spell icons; the rest use the item's inventory icon.

In Lumbridge, level-ups offer only these eight weapons, and they all count as unlocked whatever your Megabonk progress
is. What you see and hear when a weapon fires is still Megabonk's: the OSRS projectiles and weapon sounds listed in
the sheet aren't used yet.

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
| **Dwarf multicannon** | Cannon base | ranged | new: deployable | 6 | 4 | 1 | 1 | 2 | 0 | 10 | 0.5 | 1 Ranged | <span class="st st-todo">planned (phase 2)</span> |
| **Dharok's greataxe** | Dharok's greataxe | melee | Axe | 14 | 1.6 | 1.3 | 1 | 0.5 | 0 | 0.82 | 2 | 70 Attack, 70 Strength | <span class="st st-todo">planned (phase 2)</span> |
| **Scythe of vitur** | Scythe of Vitur | melee | Scythe | 12 | 0.85 | 1.4 | 3 | 1 | 0 | 0.5 | 1 | 80 Attack, 90 Strength | <span class="st st-todo">planned (phase 2)</span> |
| **Armadyl godsword** | Armadyl godsword | melee | HeroSword | 16 | 1.2 | 1.3 | 1 | 30 | 0 | 0.5 | 3 | 75 Attack | <span class="st st-todo">planned (phase 2)</span> |
| **Dragon claws** | Dragon claws | melee | Dexecutioner | 9 | 0.6 | 1 | 1 | 1 | 0 | 0.5 | 1 | 60 Attack | <span class="st st-todo">planned (phase 2)</span> |
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
| **Abyssal whip** | damage +2.0 (flat); attack speed +0.08 (addition); attack size +0.15 (addition); crit chance +0.06 (flat) | Energy Drain (not built) | <span class="st st-built">built</span> |
| **Dragon scimitar** | damage +2.0 (flat); attack size +0.2 (addition); projectiles +1 (flat); knockback +0.25 (addition) | Sever (not built) | <span class="st st-verified">verified</span> |
| **Magic shortbow** | damage +1.6 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); crit chance +0.08 (flat) | Snapshot (not built) | <span class="st st-built">built</span> |
| **Toxic blowpipe** | damage +2.0 (flat); projectiles +1 (flat); crit chance +0.08 (flat); projectile speed +0.2 (addition) | Toxic Siphon (not built) | <span class="st st-built">built</span> |
| **Fire Strike** | damage +2.5 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); attack size +0.16 (addition) | - | <span class="st st-built">built</span> |
| **Ice Barrage** | attack size +0.12 (addition); damage +2.0 (flat); duration +0.12 (flat) | - | <span class="st st-built">built</span> |
| **Trident of the seas** | damage +2.0 (flat); projectiles +1 (flat); bounces +1 (flat); attack size +0.2 (addition) | - | <span class="st st-built">built</span> |
| **Red chinchompa** | damage +2.0 (flat); projectiles +1 (flat); projectile speed +0.2 (addition); attack size +0.15 (addition) | - | <span class="st st-built">built</span> |
| **Dwarf multicannon** | damage +1.5 (flat); attack speed +0.1 (addition); duration +0.2 (flat) | - | <span class="st st-todo">planned (phase 2)</span> |
| **Dharok's greataxe** | damage +3.0 (flat); attack size +0.15 (addition) | Wretched Strength (damage x missing hp, not built) | <span class="st st-todo">planned (phase 2)</span> |
| **Scythe of vitur** | damage +2.0 (flat); attack size +0.2 (addition) | - | <span class="st st-todo">planned (phase 2)</span> |
| **Armadyl godsword** | damage +3.0 (flat); attack size +0.2 (addition) | The Judgement (godsword smash, not built) | <span class="st st-todo">planned (phase 2)</span> |
| **Dragon claws** | damage +2.0 (flat); crit chance +0.08 (flat) | Slice and Dice (four hit burst, not built) | <span class="st st-todo">planned (phase 2)</span> |
<!-- /gen:weapon-levels -->

Special attacks are named in the sheet but **not built**: there's no special attack bar.

## Caskets

Megabonk's chests wear the OSRS **Casket** model, and their map icon stays. Opening one gives Megabonk's normal chest
reward. Opening a casket is also when evolutions happen.

## Evolutions

An evolution turns a maxed weapon into its OSRS upgrade. When you open a casket, Bonkscape checks every evolution:

1. You have its weapon at **level 8 or higher**, and
2. you hold its **gear passive** (any level).

If both are true, the weapon evolves on the spot: its base stats are multiplied as below, it takes the new name and
icon, the chat box says *"Your Abyssal whip has become an Abyssal tentacle!"*, a banner shows the new name, and
OSRS's level-up sound plays. Each evolution happens once per run, and every run starts with the plain weapons again.

<!-- gen:evolutions -->
| Becomes | Weapon | + gear passive | Weapon level | Stat changes | Status |
|---|---|---|---|---|---|
| **Abyssal tentacle** | Abyssal whip | Kraken tentacle | 8 | damage x1.5, attack speed x1.2, attack size x1.25 | <span class="st st-built">built</span> |
| **Fire Surge** | Fire Strike | Tome of fire | 8 | damage x1.8, projectiles x1, attack size x1.3 | <span class="st st-built">built</span> |
| **Armadyl godsword (i)** | Armadyl godsword | Godsword shard | 8 | damage x1.5 | <span class="st st-todo">planned (phase 2)</span> |
| **Infernal cape** | any weapon | Fire cape | 1 | damage x1.1 | <span class="st st-todo">planned (phase 2)</span> |
<!-- /gen:evolutions -->

Fire Surge's "projectiles x1" leaves the number of projectiles as it was.

To aim for one: take the **Abyssal whip** with the **Kraken tentacle**, or **Fire Strike** with the **Tome of fire**
([Gear passives](gear-passives.md)), level the weapon to 8, then open a casket.

<!-- sources: src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Evolutions.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs sheets/weapons.json sheets/evolutions.json -->
