# Monsters and bosses

## How a monster is made

Each OSRS monster takes over one or more Megabonk enemies: their spawn slots, movement and attacks. Bonkscape draws
it with its **OSRS NPC model** from your cache, in the first frame of its standing animation, lit the way the OSRS
client lights it. Megabonk's own model is hidden. The OSRS model follows the enemy, feet on the ground, and turns to
face you. Monsters aren't animated yet: no walking, attacking or dying moves.

For ordinary monsters, Bonkscape also replaces Megabonk's **HP, damage, speed and knockback resistance** with the
row's values. **Minibosses and bosses keep Megabonk's own stats**, so the Giant Mole fights with the HP and damage of
the Megabonk boss it replaces, not the sheet's 9000 HP. Megabonk enemies that no row takes over are removed from the
Forest's spawn pool, so only OSRS monsters spawn in Lumbridge.

## Roster

<!-- gen:enemies -->
| Monster | OSRS NPC (id) | Stand-in NPC ids | Combat | Style | Megabonk enemies | HP | Damage | Speed | Knockback resist | Size x | Maps | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Chicken** | Chicken (1173) | 1174, 2804, 2805, 1175 | 1 | melee | Slime | 6 | 8 | 6.5 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Goblin** | Goblin (3031) | 3029, 655, 657, 659, 674, 2484 | 2 | melee | Goblin, GoblinStrong | 7 | 15 | 5 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant rat** | Giant rat (2510) | 2511, 2512, 2856, 2492, 1020 | 3 | melee | Ghoul | 9 | 12 | 9 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Guard** | Guard (3010) | 3011, 1546, 1547, 1548, 995, 397 | 21 | ranged | Skeleton | 20 | 20 | 5.5 | 0.1 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Cow** | Cow (2790) | 2791, 2793, 2795 | 2 | melee | ArmoredSkeleton, GoblinTank, MinibossPig | 30 | 22 | 4 | 0.3 | 1.1 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant frog** | Giant frog (477) | 478 | 99 | magic | Golem, MinibossGolem | 20 | 20 | 5 | 0.2 | 1.6 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant Mole** | Giant Mole (5779) | 6499 | 230 | melee | Ent1, Ent2, Ent3 | 9000 | 40 | 7 | 1 | 2.2 | lumbridge | <span class="st st-built">built</span> |
| **Ahrim the Blighted** | Ahrim the Blighted (1672) | - | 98 | magic | MummyAncient | 70 | 40 | 5 | 0.5 | 1 | barrows | <span class="st st-todo">planned (phase 2)</span> |
| **Green dragon** | Green dragon (260) | 261, 262, 263, 264 | 79 | magic | MummyTank | 45 | 30 | 5 | 0.4 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **Revenant imp** | Revenant imp (7881) | - | 7 | magic | Wisp | 8 | 13 | 7.5 | 0 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **TzTok-Jad** | TzTok-Jad (3127) | - | 702 | magic | Pharaoh1 | 8000 | 60 | 3 | 1 | 1 | fight_caves | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:enemies -->

The **Combat** column is the monster's OSRS combat level. It isn't used in play yet, and neither are the sheet's
per-monster XP value and drop table: XP comes from the damage you deal ([Skills](skills-and-xp.md)) and every monster
drops the same things ([Loot](#loot)).

## Combat styles

Every monster fights in **melee**, **ranged** or **magic**. In Lumbridge only the guards are ranged and only the giant
frogs are magic; the rest are melee. The OSRS skill icon for its style (Attack, Ranged or Magic) floats over the 10
nearest monsters, so you know which [protection prayer](prayer.md) to use. The style is the monster's, not its
attack's: a guard's hit counts as ranged even when Megabonk has it attack up close.

## When monsters come

<!-- gen:waves -->
| Map | Minute | Monsters | Event | Status |
|---|---|---|---|---|
| lumbridge | 0 | Chicken, Goblin, Giant rat, Guard | start | <span class="st st-built">built</span> |
| lumbridge | 1.5 | Cow, Giant frog | unlock | <span class="st st-built">built</span> |
| lumbridge | 3 | Giant frog, Cow | miniboss | <span class="st st-built">built</span> |
| lumbridge | 4 | Goblin | swarm | <span class="st st-built">built</span> |
| lumbridge | 7 | Giant rat | swarm | <span class="st st-built">built</span> |
| lumbridge | 8 | Cow, Giant frog | miniboss | <span class="st st-built">built</span> |
| lumbridge | 10 | Giant Mole | boss | <span class="st st-built">built</span> |
<!-- /gen:waves -->

How those rows apply:

- **Minute 0 (start)**: chickens, goblins, giant rats and guards are the run's first monsters.
- **Minute 1.5 (unlock)**: cows and giant frogs join the spawn pool after 90 seconds.
- **Minutes 4 and 7 (swarm)**: Megabonk's swarm events at those minutes spawn goblins, then giant rats.
- **Minibosses and the boss** come from Megabonk's own timeline: its miniboss slots are a Cow and a Giant frog, and
  its stage boss is the Giant Mole. The minutes in the miniboss and boss rows are the design plan; Megabonk decides
  when they actually arrive. Megabonk's own pacing decides how many monsters spawn and how fast.

## Stand-ins

Your OSRS client downloads a model the first time it shows it, so your cache may not have every monster. For each
monster Bonkscape tries its own NPC first, then each **stand-in NPC id** in the order listed, and uses the first one
whose models are all in your cache (the log says *"Goblin: NPC 3031 isn't in this cache, using stand-in NPC 3029"*).
If none is there, the monster borrows the map's fallback monster (the Goblin). If that's missing too, you see
Megabonk's own model.

Turn stand-ins off with `OSRS.UseStandIns = false` ([Settings](settings.md)).

## Size

A monster's height is worked out when it spawns, and once more a moment later:

1. **OSRS proportions on your adventurer's scale**: its model height in OSRS units, converted to metres exactly like
   your adventurer's. So an OSRS human (a guard) stands about as tall as your adventurer, and every other monster keeps
   its OSRS ratio to them.
2. Times the row's **Size x** (Cow 1.1, Giant frog 1.6, Giant Mole 2.2) and `Models.MonsterSize`.
3. Times part of Megabonk's own enlargement of elites, minibosses and bosses, capped by tier (below). Megabonk
   enlarges them a moment after they spawn, so this is applied again once the monster's hitbox is live.
4. Optionally, at least a share of its Megabonk hitbox's height (`Models.MinHitboxShare`). **Off by default**:
   Megabonk's hitboxes are tall capsules (5.4 m for a 3 m skeleton), and drawing monsters to fit them undoes the OSRS
   proportions.
5. Never taller than its tier's ceiling, measured against your adventurer.

| Tier | Megabonk enlargement passed on, at most | Tallest, as a multiple of your adventurer |
|---|---|---|
| Normal | 1.15 x | 1.1 x |
| Elite | 1.4 x | 1.35 x |
| Miniboss | 1.6 x | 1.7 x |
| Boss | 2.0 x | 2.2 x (`Models.BossMaxHeight`) |

Model heights in OSRS units, before step 2, as the main session measured them from the cache (the standing model with
the NPC definition's width and height scale): Warrior 216, Guard 201, Cow 153, Giant Mole 150, Goblin 129 (0.64 of a
guard), Giant rat 125, Giant frog 85, Chicken 79. How big they look next to each other in a run is
*(unconfirmed: needs a Melty run or footage)*.

A monster's **hitbox** is always Megabonk's; only the drawing changes, so a monster can be hit (and hit you) a little
outside its drawn shape.

## How monsters move

In Megabonk, enemies run straight at you. In Lumbridge they find their way on the **OSRS tile grid** instead, like
OSRS monsters:

- Every half second, or whenever you step onto a new tile, Bonkscape works out how many steps every tile is from you,
  moving in 8 directions, never through a wall edge, water or big scenery. A diagonal step needs both side steps open,
  as in OSRS.
- Each monster heads for its neighbouring tile that is one step closer, so they go around buildings and over bridges.
- Within 3 steps of you, or off the grid, Megabonk's own chase takes over.

## The Giant Mole

<!-- gen:bosses -->
| Boss | Attacks | Phase thresholds | Pet (rate) | Status |
|---|---|---|---|---|
| **Giant Mole** | Claw (melee, 0 ms telegraph, contact); Dig (melee, 1200 ms telegraph, burrow teleport every 12s) | 50% HP | Baby Mole, 1/3000 | <span class="st st-built">built</span> |
| **TzTok-Jad** | Ranged slam (ranged, 1800 ms telegraph, alternate); Magic fire (magic, 1800 ms telegraph, alternate) | 50% HP | TzRek-Jad, 1/200 | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:bosses -->

The Giant Mole is Lumbridge's stage boss <span class="st st-built">built</span>. You call it by using the boss portal
at the swamp's dark hole ([Maps](maps.md)). It attacks with Megabonk's own boss attacks, and Bonkscape adds its
**dig**:

1. Every **12 seconds** the chat box says *"The Giant Mole burrows into the ground!"* and it sinks into the ground
   over 1.2 s.
2. Halfway through, it moves next to you.
3. It rises again over the next 1.2 s.

Below **50% HP** it digs more often, every 8 seconds.

Planned for the Mole: its own drops (Mole claw, the Baby mole pet at 1/3000) and a real Mole lair fight. Neither is
built.

## Loot

Monsters drop Megabonk's normal pickups, dressed as OSRS items, plus Bonkscape's own prayer potions:

| Drop | What it is | What it does |
|---|---|---|
| **Coins** | Megabonk's gold, drawn as the OSRS coin stack for the amount (1 coin up to the big pile) | Megabonk's gold |
| **Shrimps** (60%), **Lobster** (30%), **Shark** (10%) | Megabonk's health pickup, as a random OSRS food | Heals 15, 30 or 60 HP in place of Megabonk's amount: *"You eat the shrimps. It heals some health."* |
| **Prayer potion(4)** | Bonkscape's own pickup, 2.5% chance per kill | Restores prayer points ([Prayer](prayer.md#prayer-potions)) |
| **Casket** | Megabonk's chest | Megabonk's chest reward, and [evolutions](weapons-and-evolutions.md#evolutions) |

The sheet also plans a rare clue scroll (easy) drop, the Mole claw and the Baby mole; none of those is built.

## Planned monsters

Ahrim the Blighted (Barrows), green dragons and revenant imps (the Wilderness) and TzTok-Jad (the Fight Caves) are in
the roster above as planned rows for the planned maps. None of them spawns yet.

<!-- sources: src/Bonkscape.Plugin/Systems/EnemySkins.cs src/Bonkscape.Plugin/Systems/Bosses.cs src/Bonkscape.Plugin/Systems/Pathing.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Rows.cs sheets/enemies.json sheets/bosses.json sheets/waves.json sheets/drops.json -->
