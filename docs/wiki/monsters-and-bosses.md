# Monsters and bosses

## How a monster is made

Each OSRS monster takes over one or more Megabonk enemies: their spawn slots, movement and attacks. Bonkscape draws
it with its **OSRS NPC model** from your cache (the six Barrows brothers instead as an OSRS body in
their own Barrows armour, since their NPC models are pink in the cache), lit the way the OSRS client lights it, and plays its OSRS
[animations](#animations). Megabonk's own model is hidden. The OSRS model follows the enemy, feet on the ground, and
turns to face you.

For ordinary monsters, Bonkscape also replaces Megabonk's **HP, damage, speed and knockback resistance** with the
row's values. **Minibosses and bosses keep Megabonk's own stats**, so the Giant Mole fights with the HP and damage of
the Megabonk boss it replaces, not the sheet's 9000 HP (TzTok-Jad: not its 8000). A map's difficulty scales HP and damage for all of them:
Morytania's is 0.8 (its monsters have 0.8 of their row's, its minibosses and its boss 0.8 of Megabonk's); Lumbridge's
and TzHaar City's are 1. Each row joins the spawn pool of its own maps (the roster's **Maps** column): Lumbridge's
monsters on Megabonk's Forest, Morytania's and TzHaar City's on the Desert. Those two share the Desert's enemy types:
when the Desert's third stage starts, TzHaar City's rows take the types over (names, models and stats). The Fight
Caves' monsters (Maps `tztok_jad_boss`) join no pool; the arena spawns them itself. Megabonk enemies that no row takes
over are removed from the Forest's and the Desert's pools, so only OSRS monsters spawn on Bonkscape's maps. On a later
stage, Megabonk's own stage scaling multiplies every monster's HP and damage on top, as it does in any run.

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
| **Vyrewatch** | Vyrewatch (3719) | 3717, 3730 | 105 | melee | MummyAncient | 70 | 40 | 5 | 0.5 | 1 | morytania | <span class="st st-built">built</span> |
| **Vyrewatch Sentinel** | Vyrewatch Sentinel (9761) | 9759, 9756 | 151 | melee | MinibossScorpion | 250 | 35 | 7 | 0.8 | 1.2 | morytania | <span class="st st-todo">planned (phase 2)</span> |
| **Dharok the Wretched** | Dharok the Wretched (1673) | 12317, 12323 | 115 | melee | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Ahrim the Blighted** | Ahrim the Blighted (1672) | - | 98 | magic | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Green dragon** | Green dragon (260) | 261, 262, 263, 264 | 79 | magic | GhostPurple | 40 | 20 | 8 | 0.4 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **Revenant imp** | Revenant imp (7881) | - | 7 | magic | Ghost | 10 | 10 | 6 | 0 | 1 | wilderness | <span class="st st-todo">planned (phase 2)</span> |
| **TzHaar-Ket** | TzHaar-Ket (2179) | 2173, 2174, 2175, 2176 | 149 | melee | ScorpionMedium, MummyTank, MummyAncient | 30 | 30 | 6.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Xil** | TzHaar-Xil (2171) | 2168, 2172, 2167, 2169 | 133 | melee | ArmoredSkeletonDusty | 25 | 16 | 4.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Hur** | TzHaar-Hur (7684) | 2166, 7686, 2161, 2162 | 74 | melee | Mummy, Wisp, Scorpion, SkeletonDusty, Tumblebone | 8 | 13 | 5.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Mej** | TzHaar-Mej (2157) | 2156, 2160, 2154, 2155 | 103 | magic | CactusShooter | 15 | 30 | 5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Ket** | TzHaar-Ket (7679) | 2173, 2174 | 221 | melee | MinibossScorpion, MinibossGolemSand | 250 | 35 | 7 | 0.8 | 1.2 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzTok-Jad** | TzTok-Jad (3127) | 6506, 15574 | 702 | magic | Pharaoh3 | 8000 | 40 | 3 | 1 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **Tz-Kih** | Tz-Kih (3116) | 2189, 2190, 3117 | 22 | melee | Tumblebone | 7 | 9 | 11 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tz-Kek** | Tz-Kek (3118) | 2191, 2192, 3119 | 45 | melee | Scorpion | 16 | 20 | 7 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tz-Kek** | Tz-Kek (3120) | 2191, 2192 | 22 | melee | Mummy | 8 | 13 | 5.5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tok-Xil** | Tok-Xil (3121) | 2193, 2194, 3122 | 90 | ranged | CactusShooter | 15 | 30 | 5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Yt-MejKot** | Yt-MejKot (3123) | 3124 | 180 | melee | MummyTank | 45 | 30 | 5 | 1 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Ket-Zek** | Ket-Zek (3125) | 3126, 15572 | 360 | magic | MummyAncient | 70 | 40 | 5 | 1 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Yt-HurKot** | Yt-HurKot (3128) | 7701, 7705 | 108 | melee | SkeletonDusty | 16 | 22 | 6.5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Guthan the Infested** | Guthan the Infested (1674) | 12318, 12324 | 115 | melee | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-todo">planned (phase 1)</span> |
| **Karil the Tainted** | Karil the Tainted (1675) | 12319, 12325 | 98 | ranged | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-todo">planned (phase 1)</span> |
| **Torag the Corrupted** | Torag the Corrupted (1676) | 12320, 12326 | 115 | melee | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-todo">planned (phase 1)</span> |
| **Verac the Defiled** | Verac the Defiled (1677) | 12321, 12327 | 115 | melee | Pharaoh1, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-todo">planned (phase 1)</span> |
<!-- /gen:enemies -->

The **Combat** column is the monster's OSRS combat level. It isn't used in play yet, and neither are the sheet's
per-monster XP value and drop table: XP comes from the damage you deal ([Skills](skills-and-xp.md)) and every monster
drops the same things ([Loot](#loot)).

## Combat styles

Every monster fights in **melee**, **ranged** or **magic**. In Lumbridge only the guards are ranged and only the giant
frogs are magic. In Morytania banshees and Ahrim the Blighted are magic, Karil the Tainted is ranged, and the rest are melee. In TzHaar City the
TzHaar-Mej are magic and the rest melee; in the Fight Caves the Tok-Xil are ranged, the Ket-Zek magic and the rest
melee, and each of TzTok-Jad's attacks has its own style ([below](#tztok-jad)). The OSRS skill icon for its style (Attack, Ranged or Magic) floats over the 10
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
| tzhaar_city | 0 | TzHaar-Hur, TzHaar-Mej | start | <span class="st st-verified">verified</span> |
| tzhaar_city | 1.5 | TzHaar-Xil | unlock | <span class="st st-verified">verified</span> |
| tzhaar_city | 1.5 | TzHaar-Ket | miniboss | <span class="st st-verified">verified</span> |
| tzhaar_city | 2.5 | TzHaar-Hur | swarm | <span class="st st-verified">verified</span> |
| tzhaar_city | 3 | TzHaar-Ket | unlock | <span class="st st-verified">verified</span> |
| tzhaar_city | 4 | TzHaar-Hur | swarm | <span class="st st-verified">verified</span> |
| tzhaar_city | 5 | TzHaar-Ket | miniboss | <span class="st st-verified">verified</span> |
| tzhaar_city | 8 | TzTok-Jad | boss | <span class="st st-verified">verified</span> |
| morytania | 0 | Myre blamish snail, Bat, Crawling Hand, Ghoul, Loar Shade, Banshee | start | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 1.5 | Vampyre Juvenile | unlock | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 3 | Vampyre Juvinate, Feral Vampyre | unlock | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 3 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | miniboss | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 4 | Myre blamish snail | swarm | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 6 | Vyrewatch | unlock | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 7 | Crawling Hand | swarm | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 8 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | miniboss | <span class="st st-todo">planned (phase 1)</span> |
| morytania | 10 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | boss | <span class="st st-todo">planned (phase 1)</span> |
<!-- /gen:waves -->

How those rows apply, each on its own map's stage (Lumbridge on the Forest's first, Morytania on the Desert's first,
TzHaar City on the Desert's third):

- **start** (minute 0): the run's first monsters. Lumbridge: chickens, goblins, giant rats and guards. Morytania: Myre
  blamish snails, bats, crawling hands, ghouls, Loar Shades and banshees. TzHaar City: TzHaar-Hur and TzHaar-Mej.
- **unlock**: the rows join the spawn pool from that minute. Lumbridge: cows and giant frogs at 1.5. Morytania:
  vampyre juveniles at 1.5, vampyre juvinates and feral vampyres at 3, the Vyrewatch at 6. TzHaar City:
  TzHaar-Xil at 1.5, TzHaar-Ket at 3.
- **swarm**: Megabonk's swarm event at that minute spawns the row's monsters. Lumbridge: goblins at 4, giant rats at
  7. Morytania: Myre blamish snails at 4, crawling hands at 7. TzHaar City: TzHaar-Hur at 2.5 and 4.
- **miniboss**: Megabonk's miniboss event at that minute spawns each row's miniboss. Lumbridge: a Cow and a Giant frog
  at 3 and 8. Morytania: Barrows brothers at 3 and 8, the five not hidden this run in turn ([below](#the-barrows-brothers)). TzHaar City: a TzHaar-Ket champion at
  1.5 and 5.
- **boss** (minute 10; TzHaar City's 8): the plan only. The stage boss comes when you open the boss portal
  (Lumbridge: the Giant Mole; Morytania: the run's hidden Barrows brother); TzHaar City's when you open its final portal
  (TzTok-Jad, in the Fight Caves).

A swarm or miniboss row whose minute has no matching event in Megabonk's timeline spawns nothing; the log says how
many events each map set (*"waves: Morytania on Megabonk's Desert stage 0: N timeline events set"*). Megabonk's own
pacing decides how many monsters spawn and how fast.

## Stand-ins

The six Barrows brothers are built from their armour (each one's helm, body, legs and weapon); when those items aren't
in your cache, they use their NPC model and its stand-ins as below.

Your OSRS client downloads a model the first time it shows it, so your cache may not have every monster. For each
monster Bonkscape tries its own NPC first, then each **stand-in NPC id** in the order listed, and uses the first one
whose models are all in your cache (the log says *"Goblin: NPC 3031 isn't in this cache, using stand-in NPC 3029"*).
If none is there, the monster borrows the map's fallback monster (Lumbridge: the Goblin; Morytania: the Ghoul;
TzHaar City and its Fight Caves: TzHaar-Hur). If that's missing too, you see
Megabonk's own model.

Turn stand-ins off with `OSRS.UseStandIns = false` ([Settings](settings.md)).

## Size

A monster's height is worked out when it spawns, and once more a moment later:

1. **OSRS proportions on your adventurer's scale**: its model height in OSRS units, converted to metres exactly like
   your adventurer's. So an OSRS human (a guard) stands about as tall as your adventurer, and every other monster keeps
   its OSRS ratio to them.
2. Times the row's **Size x** (Cow 1.1, Giant frog 1.6, Giant Mole 2.2, Vyrewatch 1.2, the Barrows brothers 1.6, TzHaar-Ket champion 1.2) and
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
| **TzTok-Jad** | Magic (magic, 1800 ms telegraph, random); Ranged (ranged, 1800 ms telegraph, random); Bite (melee, 0 ms telegraph, random) | 50% HP | TzRek-Jad, 1/200 | <span class="st st-verified">verified</span> |
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

## The Barrows brothers

Morytania's boss is one of the six Barrows brothers, **hidden**: each time a run (or a restart after a death) starts on
Morytania, one is picked at random, and he rises when you open the boss portal at the Barrows
([Maps](maps.md#morytania)), named on the boss bar. The other five are the map's **minibosses**, one after another at
Megabonk's miniboss events. All six take over Megabonk's `Pharaoh1` (as the boss) and its `MinibossGolemSand` and
`MinibossScorpion` (as minibosses), size x 1.6, each in his own armour with his own weapon and animations. As boss or
miniboss they keep Megabonk's attacks and stats, times Morytania's 0.8.

| Brother | Style | Set effect, on his hits (and yours, when you play him) |
|---|---|---|
| **Dharok the Wretched** | melee | Every hit grows as the hitter's health drops, up to +98% at 1 hitpoint |
| **Ahrim the Blighted** | magic | 25% of magic hits: whoever was hit hits 10% weaker for 6 s |
| **Guthan the Infested** | melee | 25% of melee hits: the hitter heals by the damage dealt |
| **Karil the Tainted** | ranged | 25% of ranged hits: whoever was hit is slowed for 4 s (a monster to 80% speed) |
| **Torag the Corrupted** | melee | 25% of melee hits: whoever was hit is slowed for 2 s (a monster to 80% speed); OSRS drains run energy, which Megabonk doesn't have |
| **Verac the Defiled** | melee | 25% of melee hits: his hit on you ignores your protection prayer; your hit on a monster does 25% more |

A brother's set works on his projectiles and slams too: a hit on you that names no monster counts as the nearest
brother's within 10 m. Each effect but Dharok's plays its OSRS graphic.

**The Barrows chest.** Beating the hidden brother gives, besides Megabonk's own reward, one **Barrows piece** you don't
own yet, picked at random from all 24 (each brother's helm, body, legs and weapon): *"You find Dharok's helm in the
Barrows chest!"* Pieces are yours for good, shared by all your adventurers. A brother's four pieces together unlock him
as an [adventurer](adventurers.md#unlocking): *"You have Dharok's full set: he can join you as an adventurer."* With
all 24 owned, the chest gives nothing more.

Melty's test of 0.7.0 showed Torag the Corrupted as the hidden boss, named on the boss bar and swinging his hammers.
The set effects, the chest's pieces and a brother's unlock are *(unconfirmed: needs a Melty run or footage)*

## TzHaar City

TzHaar City's monsters are the TzHaar, on the Desert's enemy types from its third stage on: **TzHaar-Hur** and
**TzHaar-Mej** (magic) from the start, **TzHaar-Xil** from 1.5 minutes and **TzHaar-Ket** from 3. Its minibosses are
**TzHaar-Ket champions** (OSRS NPC 7679, on Megabonk's `MinibossScorpion` and `MinibossGolemSand`, size x 1.2): as
minibosses they keep Megabonk's stats and attacks, and a protection prayer halves their hits. Its boss is TzTok-Jad,
in the Fight Caves.

## TzTok-Jad

Opening TzHaar City's final portal moves the fight into the [Fight Caves](maps.md#the-fight-caves), as the Mole's
portal moves it into its lair. TzTok-Jad (OSRS NPC 3127, on Megabonk's `Pharaoh3`) is placed on his tile there but
held out of the fight, unseen, frozen and unhurt, while six waves of Fight Caves monsters come first, each 6 to 16
tiles from you on ground you can reach:

| Time in the caves | What comes |
|---|---|
| 0 s | 6 Tz-Kih |
| 20 s | 6 Tz-Kek |
| 40 s | 6 Tok-Xil (ranged) |
| 60 s | 6 Yt-MejKot |
| 80 s | 3 Ket-Zek (magic) |
| 100 s | 6 Ket-Zek |
| 120 s | TzTok-Jad: *"TzTok-Jad appears!"* |

The waves are timed: each comes whether or not the last is dead. Their monsters are OSRS models on Megabonk's enemy
types and fight with those types' attacks; their OSRS abilities (Tz-Kek splitting, Yt-MejKot healing, Tok-Xil's
spines, Ket-Zek's fire) aren't built.

**His attacks are OSRS's, not Megabonk's.** Megabonk's own attacks for `Pharaoh3` are switched off, and touching him
doesn't hurt. Two seconds after he appears, and then every 4.8 seconds (start to start, as in OSRS), he starts one of
three attacks at random, with its OSRS animation and graphics:

| Attack | Style | Lands | |
|---|---|---|---|
| Magic | magic | 3.1 s after he starts it | A fireball flies from him to you |
| Ranged | ranged | 3.1 s after he starts it | A boulder falls on you |
| Bite | melee | 0.3 s after he starts it | Only when you're beside him; it misses if you've stepped away |

A hit is dealt as 55% to 85% of your maximum health, through Megabonk's own damage (armour still counts). The protection prayer for its style, on when the hit **lands**, blocks
it completely ([Prayer](prayer.md#what-it-blocks)): watch his wind-up and switch, as in OSRS.

**Healers.** The first time he drops below half health, the chat box says *"TzTok-Jad calls for help!"* and four
**Yt-HurKot** appear around him. They walk to him and, once beside him, heal him 2% of his maximum health every 1.2
seconds. Hit one and it leaves him for good and comes after you.

**The Fire cape.** Killing him unlocks the [Fire cape](gear-passives.md#the-fire-cape) for the adventurer you're
playing: *"You have been awarded a Fire cape!"*

As a boss his HP is Megabonk's (its `Pharaoh3`'s), times TzHaar City's difficulty of 1. Melty's test of 0.5.0 showed
the Fight Caves, the waves and Jad joining the fight; his attacks against a prayer, the healers, his death and the
Fire cape are *(unconfirmed: needs a Melty run or footage)*.

## Loot

Monsters drop Megabonk's normal pickups, dressed as OSRS items, plus Bonkscape's own prayer potions:

| Drop | What it is | What it does |
|---|---|---|
| **Coins** (in TzHaar City, **Tokkul**) | Megabonk's gold, drawn as the map's OSRS currency stack for the amount (coins: 1 coin up to the big pile) | Megabonk's gold |
| **Shrimps** (60%), **Lobster** (30%), **Shark** (10%) | Megabonk's health pickup, as a random OSRS food | Heals 15, 30 or 60 HP in place of Megabonk's amount: *"You eat the shrimps. It heals some health."* |
| **Prayer potion(4)** | Bonkscape's own pickup, 2.5% chance per kill | Restores prayer points ([Prayer](prayer.md#prayer-potions)) |
| **Casket** | Megabonk's chest | Megabonk's chest reward, and [evolutions](weapons-and-evolutions.md#evolutions) |

The sheet also plans a rare clue scroll (easy) drop, the Mole claw, the Baby mole and Jad's pet, TzRek-Jad; none of
those is built.

## Planned monsters

Green dragons and revenant imps (the Wilderness) are in the roster above as planned rows for a planned map. Neither
spawns yet.

<!-- sources: src/Bonkscape.Plugin/Systems/EnemySkins.cs src/Bonkscape.Plugin/Systems/Animator.cs src/Bonkscape.Plugin/Systems/Bosses.cs src/Bonkscape.Plugin/Systems/Pathing.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Rows.cs sheets/enemies.json sheets/bosses.json sheets/waves.json sheets/drops.json src/Bonkscape.Plugin/Systems/BossFight.cs src/Bonkscape.Plugin/Systems/Bonk.cs src/Bonkscape.Plugin/Systems/Unlocks.cs sheets/maps.json src/Bonkscape.Plugin/Systems/Barrows.cs src/Bonkscape.Plugin/Systems/SetEffects.cs -->
