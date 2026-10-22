# Monsters and bosses

## How a monster is made

Each OSRS monster takes over one or more Megabonk enemies: their spawn slots, movement and attacks. Bonkscape draws
it with its **OSRS NPC model** from your cache (Dharok the Wretched and Ahrim the Blighted instead as an OSRS body in
their own Barrows armour, since their NPC models are pink in the cache), lit the way the OSRS client lights it, and plays its OSRS
[animations](#animations). Megabonk's own model is hidden. The OSRS model follows the enemy, feet on the ground, and
turns to face you.

For ordinary monsters, Bonkscape also replaces Megabonk's **HP, damage, speed and knockback resistance** with the
row's values. **Minibosses and bosses keep Megabonk's own stats**, so the Giant Mole fights with the HP and damage of
the Megabonk boss it replaces, not the sheet's 9000 HP. A map's difficulty scales HP and damage for all of them:
Morytania's is 0.8 (its monsters have 0.8 of their row's, its minibosses and Dharok 0.8 of Megabonk's); Lumbridge's
is 1. Each row joins the spawn pool of its own maps (the roster's
**Maps** column): Lumbridge's monsters on Megabonk's Forest, Morytania's on the Desert. Megabonk enemies that no row
takes over are removed from both maps' pools, so only OSRS monsters spawn in Lumbridge and Morytania.

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
| **Myre blamish snail** | Myre Blamish Snail (2634) | 2649 | 9 | melee | Mummy | 8 | 13 | 5.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Bat** | Bat (2827) | 10888, 14042 | 6 | melee | Tumblebone | 7 | 9 | 11 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Crawling Hand** | Crawling Hand (448) | 453, 454 | 8 | melee | Scorpion | 16 | 20 | 7 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Ghoul** | Ghoul (289) | - | 42 | melee | SkeletonDusty | 16 | 22 | 6.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Loar Shade** | Loar Shade (1277) | - | 40 | melee | Wisp | 8 | 13 | 7.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Banshee** | Banshee (414) | - | 23 | magic | CactusShooter | 15 | 30 | 5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Vampyre Juvenile** | Vampyre Juvenile (4436) | 9732, 4438 | 45 | melee | ArmoredSkeletonDusty | 25 | 16 | 4.5 | 0.1 | 1 | morytania | <span class="st st-built">built</span> |
| **Feral Vampyre** | Feral Vampyre (3237) | - | 61 | melee | ScorpionMedium | 30 | 30 | 6.5 | 0.1 | 1 | morytania | <span class="st st-built">built</span> |
| **Vampyre Juvinate** | Vampyre Juvinate (4430) | 4427, 4428 | 54 | melee | MummyTank | 45 | 30 | 5 | 0.3 | 1 | morytania | <span class="st st-built">built</span> |
| **Vyrewatch** | Vyrewatch (3719) | 3717, 3730 | 105 | melee | MinibossGolemSand | 250 | 40 | 6 | 0.8 | 1.2 | morytania | <span class="st st-built">built</span> |
| **Vyrewatch Sentinel** | Vyrewatch Sentinel (9761) | 9759, 9756 | 151 | melee | MinibossScorpion | 250 | 35 | 7 | 0.8 | 1.2 | morytania | <span class="st st-built">built</span> |
| **Dharok the Wretched** | Dharok the Wretched (1673) | 12317, 12323 | 115 | melee | Pharaoh1, Pharaoh2 | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Ahrim the Blighted** | Ahrim the Blighted (1672) | - | 98 | magic | MummyAncient | 70 | 40 | 5 | 0.5 | 1 | morytania | <span class="st st-built">built</span> |
| **Green dragon** | Green dragon (260) | 261, 262, 263, 264 | 79 | magic | GhostPurple | 40 | 20 | 8 | 0.4 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **Revenant imp** | Revenant imp (7881) | - | 7 | magic | Ghost | 10 | 10 | 6 | 0 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **TzTok-Jad** | TzTok-Jad (3127) | - | 702 | magic | Pharaoh3 | 8000 | 60 | 3 | 1 | 1 | fight_caves | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:enemies -->

The **Combat** column is the monster's OSRS combat level. It isn't used in play yet, and neither are the sheet's
per-monster XP value and drop table: XP comes from the damage you deal ([Skills](skills-and-xp.md)) and every monster
drops the same things ([Loot](#loot)).

## Combat styles

Every monster fights in **melee**, **ranged** or **magic**. In Lumbridge only the guards are ranged and only the giant
frogs are magic. In Morytania nothing is ranged, banshees and Ahrim the Blighted are magic, and the rest are melee. The OSRS skill icon for its style (Attack, Ranged or Magic) floats over the 10
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
| morytania | 0 | Myre blamish snail, Bat, Crawling Hand, Ghoul, Loar Shade, Banshee | start | <span class="st st-built">built</span> |
| morytania | 1.5 | Vampyre Juvenile | unlock | <span class="st st-built">built</span> |
| morytania | 3 | Vampyre Juvinate, Feral Vampyre | unlock | <span class="st st-built">built</span> |
| morytania | 3 | Vyrewatch Sentinel, Vyrewatch | miniboss | <span class="st st-built">built</span> |
| morytania | 4 | Myre blamish snail | swarm | <span class="st st-built">built</span> |
| morytania | 6 | Ahrim the Blighted | unlock | <span class="st st-built">built</span> |
| morytania | 7 | Crawling Hand | swarm | <span class="st st-built">built</span> |
| morytania | 8 | Vyrewatch, Vyrewatch Sentinel | miniboss | <span class="st st-built">built</span> |
| morytania | 10 | Dharok the Wretched | boss | <span class="st st-built">built</span> |
<!-- /gen:waves -->

How those rows apply, on each map's first stage (Lumbridge on the Forest's, Morytania on the Desert's):

- **start** (minute 0): the run's first monsters. Lumbridge: chickens, goblins, giant rats and guards. Morytania: Myre
  blamish snails, bats, crawling hands, ghouls, Loar Shades and banshees.
- **unlock**: the rows join the spawn pool from that minute. Lumbridge: cows and giant frogs at 1.5. Morytania:
  vampyre juveniles at 1.5, vampyre juvinates and feral vampyres at 3, Ahrim the Blighted at 6.
- **swarm**: Megabonk's swarm event at that minute spawns the row's monsters. Lumbridge: goblins at 4, giant rats at
  7. Morytania: Myre blamish snails at 4, crawling hands at 7.
- **miniboss**: Megabonk's miniboss event at that minute spawns each row's miniboss. Lumbridge: a Cow and a Giant frog
  at 3 and 8. Morytania: a Vyrewatch Sentinel and a Vyrewatch at 3 and 8.
- **boss** (minute 10): the plan only. The stage boss comes when you open the boss portal (Lumbridge: the Giant
  Mole; Morytania: Dharok the Wretched).

A swarm or miniboss row whose minute has no matching event in Megabonk's timeline spawns nothing; the log says how
many events each map set (*"waves: Morytania on Megabonk's Desert stage 0: N timeline events set"*). Megabonk's own
pacing decides how many monsters spawn and how fast.

## Stand-ins

Dharok and Ahrim are built from their armour (Dharok's helm, platebody, platelegs and greataxe; Ahrim's hood,
robetop, robeskirt and staff); when those items aren't in your cache, they use their NPC model and its stand-ins as
below.

Your OSRS client downloads a model the first time it shows it, so your cache may not have every monster. For each
monster Bonkscape tries its own NPC first, then each **stand-in NPC id** in the order listed, and uses the first one
whose models are all in your cache (the log says *"Goblin: NPC 3031 isn't in this cache, using stand-in NPC 3029"*).
If none is there, the monster borrows the map's fallback monster (Lumbridge: the Goblin; Morytania: the Ghoul). If that's missing too, you see
Megabonk's own model.

Turn stand-ins off with `OSRS.UseStandIns = false` ([Settings](settings.md)).

## Size

A monster's height is worked out when it spawns, and once more a moment later:

1. **OSRS proportions on your adventurer's scale**: its model height in OSRS units, converted to metres exactly like
   your adventurer's. So an OSRS human (a guard) stands about as tall as your adventurer, and every other monster keeps
   its OSRS ratio to them.
2. Times the row's **Size x** (Cow 1.1, Giant frog 1.6, Giant Mole 2.2, Vyrewatch 1.2, Dharok 1.6) and
   `Models.MonsterSize`.
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

## Animations

Each monster plays its own OSRS sequences (their ids are in the enemies sheet's `animation_ids`):

- **Standing** while it's still.
- **Walking** while it moves, the cycle sped up or slowed (0.5 to 2.5 times) to match how fast it really goes,
  against OSRS's one tile per 0.6 s at its size.
- **Attacking** when it gets within reach of your adventurer (max(1.2 m, 0.4 x its height) + 0.8 m), when a
  shooter (guards, banshees) starts its ranged or magic attack, and when its hit on you lands; merged with walking
  when it's still moving and the sequence allows it (as the OSRS client does). An attack plays out (up to 1.4 s)
  before the next can start.
- **Dying** where it fell: its body plays the death sequence for up to 1.8 s while Megabonk reuses the enemy.

A monster shown as a [stand-in](#stand-ins) or as the fallback Goblin plays that model's sequences. How the animations
look in a run is *(unconfirmed: needs a Melty run or footage)*.

## How monsters move

In Megabonk, enemies run straight at you. On Bonkscape's maps they find their way on the **OSRS tile grid**
instead, like OSRS monsters:

- Every half second, or whenever you step onto a new tile, Bonkscape works out how many steps every tile is from you,
  moving in 8 directions, never through a wall edge, water or big scenery. A diagonal step needs both side steps open,
  as in OSRS.
- Each monster heads for its neighbouring tile that is one step closer, so they go around buildings and over bridges.
- The search reaches 48 tiles from you in each direction (Morytania's grid is 384 x 450 tiles). Farther out, within
  3 steps of you, or off the grid, Megabonk's own chase takes over.

## The Giant Mole

<!-- gen:bosses -->
| Boss | Attacks | Phase thresholds | Pet (rate) | Status |
|---|---|---|---|---|
| **Giant Mole** | Claw (melee, 0 ms telegraph, contact); Dig (melee, 1200 ms telegraph, burrow teleport every 12s) | 50% HP | Baby Mole, 1/3000 | <span class="st st-built">built</span> |
| **TzTok-Jad** | Ranged slam (ranged, 1800 ms telegraph, alternate); Magic fire (magic, 1800 ms telegraph, alternate) | 50% HP | TzRek-Jad, 1/200 | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:bosses -->

The Giant Mole is Lumbridge's stage boss <span class="st st-built">built</span>. You call it by using the boss portal
at the swamp's dark hole ([Maps](maps.md)). **The fight then moves into the Mole's lair** (0.2.10): the screen shows
*Loading - please wait.* for a moment, and you land in the Falador Mole Lair from your own OSRS cache, with the Mole
in the middle of it and the chat box saying *"You follow the Giant Mole down into its lair."* The cave is darker, with
black beyond its walls. Monsters still alive come with you, and chests and shrines move onto the lair's open ground.

The Mole attacks with Megabonk's own boss attacks, and Bonkscape adds its **dig**:

1. **12 seconds** after it appears, and 12 seconds after each dig, the chat box says *"The Giant Mole burrows into
   the ground!"* and it plays its OSRS burrowing sequence (3314). Without the sequences in your cache, it sinks into
   the ground over 1.2 s instead.
2. Once it's under, it moves: **in its lair, to another spot 8 to 18 steps' walk from you** (never behind a wall you
   can't get round), as in OSRS. If the lair couldn't be built, the fight stays on the map and it surfaces next to you.
3. It comes back up with its OSRS surfacing sequence (3315), or rises over 1.2 s.

Below **50% HP** it digs more often, every 8 seconds. After the kill you stay in the lair. Where Megabonk's portal
to the next stage appears then is *(unconfirmed: needs a Melty run or footage)*: no test run has killed the Mole yet.
Dying in the lair restarts the run on Lumbridge with its own sky.

Planned for the Mole: its own drops (Mole claw, the Baby mole pet at 1/3000) and OSRS stats. Neither is built.

## Dharok the Wretched

Morytania's stage boss <span class="st st-built">built</span>: Dharok takes over Megabonk's `Pharaoh1` and
`Pharaoh2` enemies (size x 1.6) and comes when you open the boss portal at the Barrows ([Maps](maps.md#morytania)),
in his own dark armour, swinging his greataxe. As a boss he has Megabonk's own attacks and its boss stats times Morytania's 0.8; Bonkscape adds
no mechanics of its own.

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

Green dragons and revenant imps (the Wilderness) and TzTok-Jad (the Fight Caves) are in the roster above as planned
rows for the planned maps. None of them spawns yet.

<!-- sources: src/Bonkscape.Plugin/Systems/EnemySkins.cs src/Bonkscape.Plugin/Systems/Animator.cs src/Bonkscape.Plugin/Systems/Bosses.cs src/Bonkscape.Plugin/Systems/Pathing.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Rows.cs sheets/enemies.json sheets/bosses.json sheets/waves.json sheets/drops.json -->
