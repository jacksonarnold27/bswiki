# Maps

Bonkscape has two maps, each built from **your own OSRS cache** in place of one of Megabonk's:

- **Lumbridge & Swamp** on Megabonk's Forest <span class="st st-verified">verified</span> (Melty publish test of
  0.1.11: courtyard start, castle, river and bridges, swamp, minibosses, death and restart).
- **[Morytania](#morytania)** on Megabonk's Desert <span class="st st-built">built</span>: Canifis, Mort Myre and the
  Barrows.

Which one you play is the Megabonk map you pick. The rest of this page describes Lumbridge first; Morytania works
the same way except where [its section](#morytania) says otherwise.

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
   background from your cache, Lumbridge first, then Morytania and the Giant Mole's lair; their meshes are then made
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

## Morytania

Morytania takes over Megabonk's **Desert** map. Its arena is OSRS world tiles **(3400, 3158) to (3783, 3607)**,
384 x 450 tiles, about eight times Lumbridge's area: Canifis, Mort Myre swamp and the Barrows.

| What | Where |
|---|---|
| **You** | Canifis, OSRS tile (3494, 3488). |
| **Boss portal** | The Barrows, OSRS tile (3565, 3290). Its boss is Dharok the Wretched ([Monsters](monsters-and-bosses.md#dharok-the-wretched)). |
| **Monsters** | Morytania's own roster and waves ([Monsters](monsters-and-bosses.md#when-monsters-come)). |
| **Chests, shrines, monster spawns, skilling spots** | As on Lumbridge, on Morytania's ground and its own trees, rocks and shores. |

What's different from Lumbridge:

- **A dark sky and easier monsters.** The Desert stage's fog and sky turn a dark purple (`maps.sky`), and its
  sunlight and ambient light lose the desert's warm tint. Morytania's monsters have 0.8 of their row's HP and damage,
  its minibosses and Dharok 0.8 of Megabonk's own (`maps.difficulty`).
- **Built at load, after Lumbridge.** If a run starts on the Desert before Morytania's build is done, it waits behind
  the loading screen: up to 45 s for the build and then up to 30 s for the meshes; past 45 s the run stays on
  Megabonk's Desert.
- **A detail budget.** Maps bigger than 40,000 tiles leave out ground decorations (flowers, grass tufts, small
  stones) and 1 x 1 scenery that blocks nothing and has fewer than 300 faces (`Map.LargeMapMinFaces`; 0 keeps
  everything). Trees and ore rocks are always kept, for skilling. Lumbridge is under the limit, so it keeps everything.
- **Raised houses.** Canifis's houses stand on stilts, as in OSRS: their floors, walls, windows and furniture are at
  the raised level, with the posts underneath.
- **Stages.** Every stage of the Desert builds the same Morytania arena and is named *Morytania*.
- **The welcome line** reads *"Welcome to Morytania. Press 1, 2 or 3 to pray against melee, missiles or magic."*

## When a map isn't built

You get Megabonk's own map instead (the Forest or the Desert), dressed in OSRS scenery, when:

- the `Map.RealLumbridge` setting is off: it covers both maps ([Settings](settings.md)),
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
| **Morytania** | Desert stage 0 | 3400, 3158, 3783, 3607 | Village | 10 | none | <span class="st st-verified">verified</span> |
| **Barrows crypts** | Desert stage 1 | - | Dangerous Way | 10 | none | <span class="st st-todo">planned (phase 2)</span> |
| **The Wilderness** | Graveyard stage 0 | - | Wilderness | 12 | skull | <span class="st st-todo">planned (phase 2)</span> |
| **God Wars Dungeon** | Graveyard stage 1 | - | Armadyl Alliance | 10 | none | <span class="st st-todo">planned (phase 3)</span> |
| **Fight Caves** | Desert stage 2 | - | TzHaar! | 10 | none | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:maps -->

Each map has an OSRS track (Lumbridge: *Harmony*; Morytania: *Village*). An experimental player plays it from your
cache (`Audio.OsrsMusic`), but only with its engine, which release builds don't include, so they play Megabonk's
music ([HUD and chat](hud-and-chat.md#sounds)). Underground and instanced arenas (caves, dungeons, boss rooms) are on the [docket](../dev/docket.md).

<!-- sources: src/Bonkscape.Plugin/Systems/Arena.cs src/Bonkscape.Plugin/Systems/MapProps.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Runner.cs src/Bonkscape.Cache/World/ sheets/maps.json -->
