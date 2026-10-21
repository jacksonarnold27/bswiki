# Maps

Bonkscape has one map so far: **Lumbridge & Swamp**, which takes over Megabonk's Forest map.
<span class="st st-verified">verified</span> (Melty publish test of 0.1.11: courtyard start, castle, river and
bridges, swamp, minibosses, death and restart).

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

Megabonk still runs the run itself. It generates the Forest stage first (its timeline, chests, shrines and boss
portal), then Bonkscape switches the Forest's ground, props and grass off and puts Lumbridge in their place.

### How it's sized

The arena is scaled to your adventurer: one OSRS tile has the same size relative to your adventurer as in OSRS. The
adventurer is drawn larger than Megabonk's character (`Models.AdventurerScale`, 1.6 by default), and Lumbridge grows
with it, so there's room to run. See [Adventurers](adventurers.md#size).

### When it's built

1. While the main menu loads, the arena's meshes, colliders and minimap are prepared in the background from your cache.
2. When a run starts, Bonkscape waits 1.5 s, then for Megabonk's spawn intro to finish (your character on the ground
   and done teleporting, at most 8 s more), and places Lumbridge under you.
3. You're moved into the courtyard, and any monster already alive is moved next to you.

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

You and the monsters bump into these, but Megabonk's camera, its spawn checks and **projectiles pass through them**.
Monsters find their way around walls on Lumbridge's tile grid ([Monsters](monsters-and-bosses.md#how-monsters-move)).

### See-through walls

OSRS's camera looks into rooms from above; Megabonk's sits behind your shoulder. So Lumbridge's walls are split into
cells of 8 x 8 tiles, and every frame any wall cell between Megabonk's player camera and your adventurer is hidden.
It stays solid while hidden.

### Stages

Megabonk's Forest map has several stages. Bonkscape names them **Lumbridge & Swamp**, **Lumbridge Swamp** and
**Lumbridge Swamp Caves**, but for now every stage builds the same Lumbridge arena.

## When Lumbridge isn't built

You get Megabonk's Forest instead, dressed in OSRS scenery, when:

- the `Map.RealLumbridge` setting is off ([Settings](settings.md)),
- your cache is missing any of Lumbridge's 16 map regions (the log says *"Lumbridge isn't in this OSRS cache"*), or
- building it failed for any other reason (logged as *"Lumbridge arena failed, keeping Megabonk's stage"*).

In the Forest fallback, Megabonk's trees, rocks and bushes are drawn with OSRS models (Tree, with an Oak tree about 30%
of the time; Tin rocks; Bush) at sensible sizes, and they keep Megabonk's own colliders. Skilling spots are placed
around where you start: 10 trees, 8 rocks and 4 fishing spots, 12 to 70 m away.

## Planned maps

These are designed in `sheets/maps.json` but **not built**:

<!-- gen:maps -->
| Map | Megabonk map | OSRS area (x0, y0, x1, y1) | Music (planned) | Minutes | Special rule | Status |
|---|---|---|---|---|---|---|
| **Lumbridge & Swamp** | Forest stage 0 | 3140, 3140, 3266, 3300 | Harmony | 10 | none | <span class="st st-verified">verified</span> |
| **Barrows crypts** | Desert stage 0 | - | Dangerous Way | 10 | none | <span class="st st-todo">planned (phase 2)</span> |
| **The Wilderness** | Graveyard stage 0 | - | Wilderness | 12 | skull | <span class="st st-todo">planned (phase 2)</span> |
| **God Wars Dungeon** | Desert stage 1 | - | Armadyl Alliance | 10 | none | <span class="st st-todo">planned (phase 3)</span> |
| **Fight Caves** | Desert stage 2 | - | TzHaar! | 10 | none | <span class="st st-todo">planned (phase 3)</span> |
<!-- /gen:maps -->

Music per map is planned too: it needs an OSRS music synthesiser, which doesn't exist yet, so Megabonk's own music plays
everywhere. Underground and instanced arenas (caves, dungeons, boss rooms) are on the [docket](../dev/docket.md).

<!-- sources: src/Bonkscape.Plugin/Systems/Arena.cs src/Bonkscape.Plugin/Systems/MapProps.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Runner.cs src/Bonkscape.Cache/World/ sheets/maps.json -->
