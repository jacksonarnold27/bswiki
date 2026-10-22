# Maps

Bonkscape has four maps, each built from **your own OSRS cache** in place of a Megabonk map or stage:

- **Lumbridge & Swamp** on Megabonk's Forest <span class="st st-verified">verified</span> (Melty publish test of
  0.1.11: courtyard start, castle, river and bridges, swamp, minibosses, death and restart).
- **[Al Kharid](#al-kharid)** on Megabonk's Desert: the desert town, with [the Kalphite Lair](#the-kalphite-lair) as its
  boss arena.
- **[Morytania](#morytania)** on the Desert's second stage: Canifis, Mort Myre and the Barrows.
- **[TzHaar City](#tzhaar-city)** on the Desert's third stage: the TzHaar's underground city of obsidian and lava,
  with [the Fight Caves](#the-fight-caves) as its boss arena.

Which one you play is the Megabonk map you pick: the Forest is Lumbridge; the Desert's three stages are Al Kharid,
Morytania and TzHaar City. The rest of this page describes Lumbridge first; the other maps work the same
way except where their sections say otherwise.

## The Lumbridge arena

The arena is the real Lumbridge, built from **your own OSRS cache**: OSRS world tiles **(3140, 3140) to (3266, 3300)**,
127 x 161 tiles across 16 map regions. That takes in the castle and its courtyard, the River Lum and its bridges, the
church, the houses, the fields and Lumbridge Swamp, with about 11,800 placed OSRS objects.

What's built:

- **Terrain**: tile heights, colours and lighting like the OSRS client draws them, shaped overlay tiles (paths,
  floors, shorelines), and water. Textured surfaces use the average colour of their OSRS texture.
- **Scenery**: walls, buildings, trees, fences, rocks and the rest, turned and mirrored the way the client places them.
- **Collision**: see [What blocks you](#what-blocks-you).
- **Minimap**: Lumbridge's own OSRS minimap, rendered from the cache, replaces Megabonk's minimap, zoomed in 2.5x
  towards OSRS's scale (`Minimap.Zoom`). Its map icons (trees, rocks, and map functions such as banks or altars) stay
  upright as the minimap turns, as in OSRS.
- **See-through walls**: see [below](#see-through-walls).
- **Draw distance**: scenery and walls more than 200 m from your adventurer aren't drawn (`Map.DrawDistance`; 0
  draws everything); the ground always is. They're still solid.

Megabonk still runs the run itself. It generates the Forest stage first (its timeline, chests, shrines and boss
portal), then Bonkscape switches the Forest's ground, props and grass off and puts Lumbridge in their place.

### How it's sized

The arena is scaled to your adventurer: one OSRS tile has the same size relative to your adventurer as in OSRS. The
adventurer is drawn larger than Megabonk's character (`Models.AdventurerScale`, 1.6 by default), and Lumbridge grows
with it, so there's room to run. See [Adventurers](adventurers.md#size).

### When it's built

1. While the main menu loads, every map's world data (tiles, scenery, colliders) and minimap are built in the
   background from your cache, Lumbridge first, then Al Kharid, Morytania, TzHaar City and the bosses' lairs (the Giant
   Mole's, the Kalphite Lair and the Fight Caves); their meshes are then made
   a few at a time, at most 8 ms of each frame.
2. When a run starts, the screen goes black with OSRS's *Loading - please wait.* box, so Megabonk's own stage never
   shows. Bonkscape waits 0.3 s, then for Megabonk's spawn intro to finish (your character on the ground and done
   teleporting, at most 8 s more), and places Lumbridge under you.
3. You're moved into the courtyard, and any monster already alive is moved next to you. The loading box stays up one
   more second while Megabonk's camera swings in, and the camera turns to face north, looking down 45 degrees
   (`Camera.NearPitch`). A restart after a death, and a move into or out of a boss's lair, do the same.

### Spawn, chests, shrines and the boss portal

| What | Where |
|---|---|
| **You** | The castle courtyard, OSRS tile (3222, 3218), facing west towards the castle keep. |
| **Chests (caskets) and shrines** | Random open ground: a walkable tile that has no roof, at least 3 tiles in from the edge, at least 6 tiles from the spawn and 3 tiles from each other. They're placed again every run. |
| **Boss portal** | The dark hole in Lumbridge Swamp, OSRS tile (3169, 3172), the way down to the Lumbridge Swamp Caves in OSRS. |
| **Monster spawns** | Anywhere on the arena (Megabonk's spawn area is set to the arena, minus a 2-tile margin). |
| **Skilling spots** | On Lumbridge's own trees, rocks and shores ([Skilling](skilling.md)). |

If you ever fall through the world (25 m below Lumbridge's lowest ground), you're put back in the courtyard.

### What blocks you

Megabonk needs room to run, so less blocks you than in OSRS:

- **Blocks**: building walls, scenery that's 2 x 2 tiles or bigger, tree trunks (thin, so you can run between trees),
  and water, except on bridges.
- **Doesn't block**: fences, railings, hedges, stiles, gates, doors, curtains, ladders, stairs, bushes, plants,
  flowers, crates, barrels, sacks, tables, chairs, stools, benches, signs, and any other 1 x 1 clutter.

- **Also blocks**: square scenery such as fountains and statues blocks as a round pillar, so its corners don't catch
  you; tiles with no ground at all (holes into the void) are walled off on every map.

You and the monsters bump into these, but Megabonk's camera, its spawn checks and **projectiles pass through them**.
Your adventurer climbs slopes up to 62 degrees, steeper than Megabonk's own limit, for OSRS's steps and hills. Hold a
direction without moving for a quarter of a second and you slide along the wall in front of you, or hop up the ledge
when nothing is in front at knee height.
Monsters find their way around walls on Lumbridge's tile grid ([Monsters](monsters-and-bosses.md#how-monsters-move)).

### See-through walls

OSRS's camera looks into rooms from above; Megabonk's sits behind your shoulder. So Lumbridge's walls are split into
cells of 8 x 8 tiles, and every frame any wall cell between Megabonk's player camera and your adventurer is hidden.
It stays solid while hidden.

### Stages

Megabonk's Forest map has several stages. Bonkscape names them **Lumbridge & Swamp**, **Lumbridge Swamp** and
**Lumbridge Swamp Caves**, but for now every stage builds the same Lumbridge arena.

## Al Kharid

Al Kharid takes over the **first stage** of Megabonk's Desert. Its arena is OSRS world tiles **(3264, 3110) to
(3391, 3330)**, 128 x 221 tiles: the desert town and the sand around it.

| What | Where |
|---|---|
| **You** | OSRS tile (3329, 3220). The chat box says *"Welcome to Al Kharid. Press 1, 2 or 3 to pray against melee, missiles or magic."* |
| **Boss portal** | OSRS tile (3323, 3319). It leads into [the Kalphite Lair](#the-kalphite-lair). |
| **Monsters** | Al Kharid's desert roster, with Kalphite Guardians as minibosses ([Monsters](monsters-and-bosses.md#al-kharid)). |
| **Chests, shrines, monster spawns, skilling spots** | As on Lumbridge, on Al Kharid's ground and its own trees, rocks and shores. |

Its music (experimental) is *Al Kharid*.

### The Kalphite Lair

Opening Al Kharid's boss portal moves the fight into the Kalphite Lair, the Kalphite Queen's cave, as the Giant Mole's
portal moves it into its lair: OSRS tiles (3456, 9472) to (3519, 9535), 64 x 64 tiles, from your cache, under the
loading screen. You land at OSRS tile (3486, 9515), the Queen stands at (3476, 9498), and the chat box says *"You
follow the Kalphite Queen down into its lair."* ([Monsters](monsters-and-bosses.md#the-kalphite-queen)).

## Morytania

Morytania takes over the **second stage** of Megabonk's Desert. Its arena is OSRS world tiles **(3400, 3158) to (3783, 3607)**,
384 x 450 tiles, about eight times Lumbridge's area: Canifis, Mort Myre swamp and the Barrows.

| What | Where |
|---|---|
| **You** | Canifis, OSRS tile (3494, 3488). |
| **Boss portal** | The Barrows, OSRS tile (3565, 3290). Its boss is the run's hidden Barrows brother ([Monsters](monsters-and-bosses.md#the-barrows-brothers)). |
| **Monsters** | Morytania's own roster and waves ([Monsters](monsters-and-bosses.md#when-monsters-come)). |
| **Chests, shrines, monster spawns, skilling spots** | As on Lumbridge, on Morytania's ground and its own trees, rocks and shores. |

What's different from Lumbridge:

- **A dark sky.** The Desert stage's fog and sky turn a dark purple (`maps.sky`), and its sunlight and ambient light
  lose the desert's warm tint.
- **A shorter timeline**: 9 minutes, and Megabonk's own scaling for a second stage.
- **Built at load.** If a stage starts before its map's build is done, it waits behind the loading screen: up to 45 s
  for the build and then up to 30 s for the meshes; past 45 s the stage stays Megabonk's own.
- **A detail budget.** Maps bigger than 40,000 tiles leave out ground decorations (flowers, grass tufts, small
  stones) and 1 x 1 scenery that blocks nothing and has fewer than 300 faces (`Map.LargeMapMinFaces`; 0 keeps
  everything). Trees and ore rocks are always kept, for skilling. Lumbridge is under the limit, so it keeps everything.
- **Raised houses.** Canifis's houses stand on stilts, as in OSRS: their floors, walls, windows and furniture are at
  the raised level, with the posts underneath.
- **Stages.** The Desert's first stage is [Al Kharid](#al-kharid) and its third [TzHaar City](#tzhaar-city).
- **The welcome line**, reaching it from Al Kharid, reads *"Welcome to Morytania."*

## TzHaar City

TzHaar City takes over the **third stage** of Megabonk's Desert, the map's last: you reach it after Al Kharid and
Morytania, and the stage is named *TzHaar City*. Its arena is OSRS world tiles **(2432, 5056) to (2559, 5183)**, 128 x
128 tiles.

| What | Where |
|---|---|
| **You** | OSRS tile (2480, 5167). The chat box says *"Welcome to TzHaar City."* |
| **Final portal** | The Fight Cave entrance, OSRS tile (2439, 5170). The Desert's last stage has Megabonk's final portal instead of a boss portal; it leads into [the Fight Caves](#the-fight-caves). |
| **Monsters** | The TzHaar, with TzHaar-Ket champions as minibosses ([Monsters](monsters-and-bosses.md#tzhaar-city)). |
| **Chests, shrines, monster spawns, skilling spots** | As on Lumbridge, on TzHaar City's ground and its own scenery. Chests and shrines may stand on roofed ground too, as in a lair. |

What's different:

- **Underground.** It's built and lit as a cave, like a boss's lair: darker, black beyond its walls, no sky, and
  walled off wherever it's blocked.
- **Lava burns.** Lava tiles block you, as in OSRS. Standing pressed against a lava tile's edge (within 0.35 of a
  tile) burns 2.4% of your maximum health every OSRS tick (0.6 s), 4% a second. It goes through Megabonk's own damage,
  so it shows as a hitsplat, and no prayer stops it. The first burn of a run says *"The lava's heat burns you!"* The
  middle of a one-tile bridge is half a tile from the lava on each side, so walking across is safe. *(unconfirmed:
  needs a Melty run or footage)*
- **Tokkul instead of coins.** Megabonk's gold is drawn as OSRS's Tokkul, on the ground and flying to you, and the
  [coin counter](hud-and-chat.md#in-a-run) says *Tokkul*.
- **TzHaar-Hur-Tel.** Megabonk's Shady Guy, the merchant, is drawn as TzHaar-Hur-Tel (NPC 2183), as tall as your
  adventurer. Like the Shady Guy, he won't trade with an [Ironman](adventurers.md#special-rules). *(unconfirmed: needs a Melty run or footage)*
- **Harder monsters.** Its difficulty is 1, but as on any later stage, Megabonk's own stage scaling multiplies every
  monster's HP and damage on top.

### The Fight Caves

Opening the final portal moves the fight into the Fight Caves, TzTok-Jad's arena, the way the Giant Mole's portal
moves it into its lair: OSRS tiles (2368, 5056) to (2431, 5119), 64 x 64 tiles, from your cache, under the loading
screen. You land at OSRS tile (2413, 5115) and the chat box says *"You enter TzTok-Jad's arena; the waves come first."*
Six timed waves of Fight Caves monsters come first; TzTok-Jad joins after them, at OSRS tile (2399, 5087)
([Monsters](monsters-and-bosses.md#tztok-jad)). Its lava burns as the city's does.

## When a map isn't built

You get Megabonk's own map instead (the Forest or the Desert), dressed in OSRS scenery, when:

- the `Map.RealLumbridge` setting is off: it covers every map and lair ([Settings](settings.md)),
- your cache is missing any of the map's regions (the log says *"Lumbridge isn't in this OSRS cache"*, or
  *"Morytania ..."*),
- the map's build isn't done 45 s into its run, or
- building it failed for any other reason (logged as *"Lumbridge arena failed, keeping Megabonk's stage"*, or the
  map's own name).

In the fallback, Megabonk's trees, rocks and bushes are drawn with the OSRS models in the map's own row: for
Lumbridge, Tree (with an Oak tree about 30% of the time), Tin rocks and Bush, at sensible sizes, keeping Megabonk's
own colliders. Morytania's row lists none, so its fallback is Megabonk's plain Desert. Skilling spots are placed around where you start: 10 trees, 8 rocks and 4 fishing spots, 12 to 70 m
away.

## Planned maps

Every map in `sheets/maps.json`, built or planned:

<!-- gen:maps -->
| Map | Megabonk map | OSRS area (x0, y0, x1, y1) | Music (planned) | Minutes | Special rule | Status |
|---|---|---|---|---|---|---|
| **Lumbridge & Swamp** | Forest stage 0 | 3140, 3140, 3266, 3300 | Harmony | 10 | none | <span class="st st-verified">verified</span> |
| **Morytania** | Desert stage 1 | 3400, 3158, 3783, 3607 | Village | 9 | none | <span class="st st-built">built</span> |
| **The Wilderness** | Graveyard stage 0 | 2944, 3520, 3391, 3967 | Wilderness | 16 | pkers_revenants | <span class="st st-built">built</span> |
| **God Wars Dungeon** | Graveyard stage 1 | - | Armadyl Alliance | 10 | none | <span class="st st-todo">planned (phase 3)</span> |
| **TzHaar City** | Desert stage 2 | 2432, 5056, 2559, 5183 | Mor Ul Rek | 8 | none | <span class="st st-verified">verified</span> |
| **Al Kharid** | Desert stage 0 | 3264, 3110, 3391, 3330 | Al Kharid | 10 | none | <span class="st st-built">built</span> |
<!-- /gen:maps -->

Each map has an OSRS track (Lumbridge: *Harmony*; Al Kharid: *Al Kharid*; Morytania: *Village*; TzHaar City: *Mor Ul
Rek*). An experimental player plays it from your
cache (`Audio.OsrsMusic`), but only with its engine, which release builds don't include, so they play Megabonk's
music ([HUD and chat](hud-and-chat.md#sounds)). More boss arenas are on the [docket](../dev/docket.md).

<!-- sources: src/Bonkscape.Plugin/Systems/Arena.cs src/Bonkscape.Plugin/Systems/MapProps.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Runner.cs src/Bonkscape.Cache/World/ sheets/maps.json src/Bonkscape.Plugin/Systems/LavaBurn.cs src/Bonkscape.Plugin/Systems/BossFight.cs src/Bonkscape.Plugin/Systems/Bonk.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Barrows.cs src/Bonkscape.Plugin/Systems/SecondForm.cs -->
