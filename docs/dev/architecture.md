# Architecture

Bonkscape is a BepInEx 6 IL2CPP plugin for Megabonk (Unity 2023.2.22f1, IL2CPP, build 1.0.69) that reads the player's
Old School RuneScape cache at run time. Nothing from either game is shipped. Written against **0.8.0** (`70b4f98`).

## Projects

| Path | What it is | Target |
|---|---|---|
| `src/Bonkscape.Cache` | OSRS cache library: reads the cache and turns it into plain data (meshes as triangle soup, ARGB pixels, PCM samples). No Unity references. | net6.0 |
| `src/Bonkscape.Plugin` | The BepInEx plugin (`Bonkscape.dll`): Harmony patches, systems, HUD. Compiles its game code only when Megabonk's interop assemblies are found (`INTEROP` define). | net6.0 |
| `src/Bonkscape.Tools` | `bonk.exe`: preflight and code generation, plus cache inspection and map tools. | net8.0 |
| `tools/package.py` | Builds `dist/Bonkscape-<version>.zip` from the Release build. | Python 3 |
| `tools/sketch` | Map sketch tool (Leaflet page + `server.py`, port 8790): the OSRS world map from your cache, for outlining future maps. | Python 3 |
| `tools/wiki-site` | This wiki's local site (port 8791) and `gen_tables.py`. | Python 3 |
| `tools/hub` | [The hub](hub.md) (port 8789): one page that starts, stops and links the wiki and the sketch tool and renders the other docs; `Bonkscape Hub.cmd` in the repo root launches it. Configured by `hub.json`; the engine is a copy from the project-hub kit (`D:\Modding\project-hub`). `export_wiki.py` writes BSWiki as a static site for hosting. | Python 3 |
| `sheets/*.json` | The design data: the source of truth. | |
| `docs/` | `MODLOG.md` (versions, workflow, numbered gotchas), `preflight.md` (generated report), `wiki/`, `dev/`. | |

Not in git: `lib/` (BepInEx assemblies), `derived/` (renders and map tiles made from the cache), `dist/` (release zips),
`bin/`, `obj/`.

### Cache library (`src/Bonkscape.Cache`)

| File | Does |
|---|---|
| `DiskStore.cs` | Opens `main_file_cache.dat2` and the `.idx` files (shared, read-only), reads a group's raw container bytes. `LooksLikeCache` tests a folder. |
| `Container.cs`, `BZip2.cs` | Decompresses a container (none / bzip2 / gzip). |
| `ReferenceTable.cs` | Index 255 reference tables: groups, files, name hashes, revisions. |
| `OsrsCache.cs` | The cache API: `Config(group, id)`, `File(index, group, file)`, `HasGroup`, `FindGroup(name)`, `Table`, and `CandidateFolders`/`FindCacheFolder` (where to look). |
| `JBuffer.cs` | Jagex big-endian buffer reads (smart ints, strings). |
| `Defs.cs`, `Defs2.cs` | `NpcDef`, `ItemDef`, `ObjectDef`, `SpotAnimDef`, `IdentKitDef`, `TextureDef` decoders. |
| `Port/ModelPort.cs` | RuneLite's `ModelLoader`/`ModelDefinition` ported mechanically (BSD-2-Clause, see `LICENSES/`). |
| `OsrsMesh.cs` | Builds `MeshData` for NPCs, items, objects, spot animations and players (kits + worn items), with recolours, retextures, the client's lighting (`Model.light`) and Jagex HSL to RGB. |
| `Anim.cs` | Sequences, frames and framemaps: the first frame of a stand sequence for a static pose; `Bake` (every frame of a sequence posed on a lit model, with its frame lengths); `Merge` (an action sequence on a movement sequence through its interleave list, RuneLite's `Model.animate2`). |
| `SpotAnimFrames.cs` | Renders a spot animation (model + sequence, e.g. 199, the level-up fireworks) frame by frame into ARGB images from one fixed camera, with each frame's length, for 2D flipbooks. |
| `Raster.cs` | Software rasteriser: item inventory icons (`ItemIcon`, using the item's zoom/angles/offsets) and previews. |
| `Sprites.cs`, `OsrsFont.cs` | Sprite groups and OSRS bitmap fonts (`p11_full`, `p12_full`, `b12_full`, `q8_full`). |
| `SoundEffect.cs` | OSRS sound effect synthesiser (index 4 instruments) to 22,050 Hz PCM. |
| `World/Region.cs` | Map regions: current caches' unnamed groups (`x << 8 \| y`, file 0 terrain, file 1 objects) and older named `m{x}_{y}`/`l{x}_{y}` files; procedural heights. |
| `World/WorldBuilder.cs` | Builds an area: terrain meshes, object meshes, wall meshes in 8x8-tile cells, collision boxes, tile flags (blocked, water, roofed, solid, bridge), wall edges, and named objects to track (trees, rocks). |
| `World/Minimap.cs` | Renders an area like the client's minimap. |

## Load sequence (`Plugin.Load`)

1. `Settings.Load()` reads `%LOCALAPPDATA%\Bonkscape\settings.properties` (`OSRS_DIR`, `OSRS_CACHE`).
2. Config keys are bound (`BepInEx/config/gg.melty.bonkscape.cfg`); a non-empty `OSRS.CacheFolder` overrides
   `OSRS_CACHE`; prayer keys are parsed.
3. `Rows.Build()` (lookups over phase-1 rows; `Rows.Maps`, one row per Megabonk map), `Bonk.Init()` (each row's `EMap` from `maps.bonk_base_map`),
   `Skills.Load()`, `Hud.Init()` (subscribes to XP drop and level-up events), `TestMode.Init()` (reads Melty's test file).
4. `OsrsCache.FindCacheFolder()`. None found: `CacheMissing`, and `osrs-cache` is reported failed in test mode.
   Found: `Osrs.Start(folder)` starts the background build.
5. `Harmony.PatchAll` over the assembly ([patch list](#harmony-patches)).
6. `OsrsAudio` is registered as an IL2CPP type; the `Runner` MonoBehaviour is added.

## The background asset build (`Core/Osrs.cs`)

A background thread (`Bonkscape cache`, below-normal priority) decodes everything into plain data, so Megabonk's menus
stay responsive. Unity objects are only made later, on the main thread, by `UnityConv`.

| Step (`Osrs.Status`) | What |
|---|---|
| `enemies` | Each phase-1 enemy row: a `model_ids` of `worn:<item ids>` first builds a male body (the Warrior's kits) in that gear in the row's stand pose (`Osrs.BuildWorn`: Dharok, Ahrim); otherwise, or if those items are missing, its NPC, then each `osrs_npc_alternates` id (if `UseStandIns`), first that builds; then `EnemyClips`: its `animation_ids` baked (stand, walk, attack, death, the Mole's `dig_down`/`dig_up`) and `attack+walk` when the attack has an interleave list. |
| `players` | Each adventurer from kits + worn items in the stand pose; retried without worn items whose models are missing; then `PlayerClips`: stand, walk, run, death and each weapon's `osrs_attack_anim`, plus `attack:<weapon>+walk` and `+run` merged with the weapons' shared human interleave list. Then (0.4) `PlayerWeaponBodies`: the adventurer once per weapon with that weapon's `osrs_item_id` in the weapon slot (3; a two-hander also takes the shield, 5, off), with stand, walk, run, death, the weapon's attack and its merges and its spec baked on it; the weapon the own body holds is `PlayerBodyWeapon`. About 50-90 ms an adventurer (10 bodies, 78 sequences). |
| `items` | Meshes and inventory icons for weapons, passives, drops and evolutions, every coin stack variant of item 995, and the weapons' projectiles (`item:` ids as items, `spotanim:` ids into `SpotAnimMeshes`). |
| `sprites` | Weapon/evolution icon sprites, prayer icons and overheads, skill icons, UI sprites; fonts. |
| `objects` | Map props, skilling node objects, fishing spot NPCs. |
| `sounds` | Weapon, prayer and audio-row sound effects, synthesised. |
| `ready` | `Ready = true`, summary logged, missing assets logged. Then, if `Map.RealLumbridge`, every arena: each phase-1 map's (Lumbridge first) and each phase-1 boss lair. |

An arena build (`Osrs.BuildArena`) runs `WorldBuilder.Build` over a map row's `osrs_area` (tracking objects named
Tree, Oak, Rocks and the ore rocks: Copper, Tin, Iron, Clay, Coal), gives up if any region the area itself covers is missing (the
margin around it may be void), renders the minimap, and stores both as an `Osrs.ArenaBuild` in `Osrs.Arenas` (by map or
boss id). All of them run at `ready`; `Osrs.EnsureArena` (from `OnStage`) starts one only for a map not built yet. One
build at a time (a lock), so a run that starts while an earlier build is still going waits for it.

Textured faces are coloured with their texture's average colour (`Osrs.TextureColor`); everything is drawn with one
unlit vertex-colour material (`Hidden/Internal-Colored`).

## How sheets become code

```
sheets/*.json ──► bonk preflight ──► docs/preflight.md            (report: open items by phase)
                        │       └──► sheets/cache_assets.json     (every OSRS asset the sheets use, generated)
                        └──────────► src/Bonkscape.Plugin/Generated/Sheets.g.cs   (one class per sheet, one object per row)
```

`Codegen` infers each column's C# type across the rows (int, float, bool, string, arrays); nested objects and mixed
arrays stay as compact JSON text, which the plugin reads with `Core/Json.cs`. `Core/Rows.cs` builds lookups over the
**phase-1 rows only** (by id, by Megabonk base, by style), so phase-2/3 rows never reach the game. See
[Sheets reference](sheets-reference.md).

The plugin applies the rows to Megabonk's own data in the `DataManager.Load` postfix (`Systems/Content.cs`):

- **Weapons**: base stats, `baseStats` entries and the upgrade pool of each `bonk_base` `WeaponData`; names.
- **Tomes**: each passive's stat modifier, level description and name.
- **Enemies**: HP/damage/speed/knockback for non-miniboss, non-boss bases, added to the Lumbridge map; unmapped
  enemies removed from it; the timeline's start enemies, unlock times and swarm contents from `waves`.
- **Characters**: stat modifiers, name, description and starting weapon (by skill levels).
- **Map**: the name.

Icons and tome descriptions are written into Megabonk's data fields once the cache is decoded (`Content.ApplyIcons`),
because Harmony can't call the original of an IL2CPP virtual method ([Gotchas](gotchas.md#il2cpp-and-harmony)).

## Run lifecycle (`Core/Runner.cs`)

`Runner` is the per-frame driver. A run is "active" while `Bonk.Active` is true: Megabonk's current map is one a
phase-1 `maps` row takes over (`EMap.Forest`: Lumbridge; `EMap.Desert`: Morytania) and it isn't the main menu.
`Bonk.Active` also sets `Rows.Current` to that row, which every per-map system reads (spawn and boss tiles, props,
skilling nodes, fallback enemy, music).

**Every frame (`Update`):**

1. Once: log which shaders exist; when the cache is ready and the data applied, `Content.ApplyIcons()` and pass
   `osrs-cache`.
2. `TestMode.Tick`, `Arena.Prewarm` once the cache is ready (meshes a few a frame within 8 ms, 40 ms while the
   loading cover is up: the current map's, then its boss lair's, and in the menu every other built arena's),
   `OsrsAudio.EnsureAttached` (keeps the mixer on the current AudioListener), `Music.Tick` (keeps
   Megabonk's music source paused while an OSRS track plays). In test mode, `Dev.Breadcrumbs` marks each step.
3. Stage start: when active and `MyPlayer.Instance` exists and is a new object (first stage, or a new stage), `OnStage`.
4. Run end: when active turns false, `OnRunEnd`.
5. While active: the props/arena timer, `Arena.TryBuild` until it succeeds, `Arena.Tick`, `BossFight.Tick` (a boss
   arena's waves and the held boss's release, healers), `LavaBurn.Tick` (lava edges, once per 0.6 s), `Content.GiveExtraWeapons` (an adventurer's `extra_weapons`, once
   the inventory exists), `SetEffects.Tick` (monsters' set-effect slows run out), `SecondForm.Tick` (a risen
   second form moves and can be hurt once its arrival sequence has played), `Pathing.Tick`,
   `Prayer.Tick`, `CameraTweak.Tick` (the `[Camera] ToggleKey`, V, flips between `Distance` and `FarDistance`, and
   `NearPitch`/`FarPitch`), `Specials.Tick` (energy, the fire and switch keys), `Skills.GameTick`, `Loot.Tick`, `Skilling.Tick`, death detection.
6. Always: `Skills.Tick` (autosave every 20 s), `Hud.Tick` (skipped when `Debug.OsrsHud` is off; hitsplats, XP drops, health bar timers, dialogues,
   `LevelUpFx.Tick`; outside a run `MegabonkHud.Restore` puts back the Megabonk HUD pieces it hid), `Chat.Tick`.

**`LateUpdate`** (while active): `EnemySkins.LateTick` (models follow enemies, Megabonk renderers stay hidden, hitbox
floor, animation, `Bosses.Tick`, `BossFight.TickBoss` (a scripted boss's attacks), `Corpses.Tick`), `Arena.LateTick` (see-through walls, and `PlayerMoveFix.LateTick`), `PlayerSkin.LateTick`
(follow and animate), then `TestMode.LateTick` (autoplay's movement written into `PlayerInput` after Megabonk's own
update).

**`OnGUI`**: `Hud.OnGUI` (missing-cache message, the run HUD, or the character select panel; skipped when
`Debug.OsrsHud` is off). Once the cache is ready
it starts `OsrsUi.EnsureLoaded` (the HUD's interface sprites and the `q8_full` font, on a background thread). The run
HUD calls `MegabonkHud.Tick` when `Debug.HideMegabonkHud` is on (finds Megabonk's `HealthUI` and `XpBarUI` every 1.5 s
and hides them; off, the XP bar is never found, so `MegabonkHud.XpProgress` returns -1), places its blocks
with `HudLayout.Arrange` against Megabonk's minimap (`OsrsUi.Minimap`: measured from `MinimapUi.border`'s corners,
retried every 2 s and again when the screen size changes, else estimated) and draws them through `OsrsUi`.

**`OnStage(player)`**: on the first stage of a run, or the first stage after the adventurer died (Megabonk's restart
keeps the map and only makes a new player), resets the run clock, prayer, evolutions, loot, lava burns, extra weapons, set
effect counts, second forms and chat, puts a Barrows brother's own weapon on its shared Megabonk type
(`Content.ApplyCharacterWeapons`), and posts the welcome line; a later stage on another maps row (TzHaar City after Morytania) gets the short *Welcome to
<map>.* Every stage: `Sizing.Measure`, `CameraTweak.Apply`, `PlayerSkin.Apply` (if not skinned yet),
`Skilling.SpawnForRun` (Forest-style nodes around the player, replaced if the arena builds), a 1.5 s timer, and
`Hud.FindGoldCounter` (also clears health bars, XP drops and the minimap measurement for the new stage), and
`Music.PlayForStage` (the map's `osrs_music_track`).

`OnStage` also asks `Osrs.EnsureArena` for the run's map: every phase-1 map's arena is built with the other assets at
load (Lumbridge first) and `Arena.Prewarm` makes their meshes in the menu; a map not built yet starts building on a
background thread. When the map has an arena, `Arena.BeginCover` puts up a loading cover (`Hud.DrawLoadingCover`: OSRS's
*Loading - please wait.* on black) until the adventurer stands on the map (or the build fails or times out), so Megabonk's
own stage never shows; meanwhile meshes are made 40 ms a frame instead of 8. When the timer runs out (0.3 s with an arena, 1.5 s without): if
the arena is available (built or building), `Arena.TryBuild` is called every frame until the build is done (up to
45 s), its Unity meshes are made (`Arena.Prewarm`, up to 30 s) and Megabonk's spawn intro has settled (or 8 s pass); otherwise `MapProps.Reskin` dresses Megabonk's stage.

**`OnRunEnd`**: saves skills, clears skilling, props, arena, pathing, loot, prayer, projectiles, the player model and
enemy models, and fades the OSRS music out (`Music.Stop`, 1.2 s).
**`OnApplicationQuit`**: saves skills. Exceptions in each callback are caught; the first 20 are logged.

## The arena pipeline (`Systems/Arena.cs`)

One arena per phase-1 `maps` row with an `osrs_area`: Lumbridge on the Forest, Morytania (the user's Map 1 outline,
384x450 tiles) on the Desert. `Osrs.BuildArena` makes the `WorldData` and minimap off the main thread; maps over
40,000 tiles get the detail budget (`WorldOptions.SkipGroundDecor` and `MinObjectFaces` = `[Map] LargeMapMinFaces`,
300, sparing `TrackNames` objects such as ore rocks: Morytania goes from 10.1M to 5.8M faces, and Canifis still reads the same in `bonk world` renders).

1. **Measure**: `Sizing.Measure(player)`; the arena's scale is `Sizing.MetresPerUnit` (Megabonk character height x
   `AdventurerScale` / adventurer height in OSRS units).
2. **Hide Megabonk's stage**: every root object with a collider or mesh renderer is switched off (colliders and renderers
   disabled, remembered for restore) unless it holds the player, enemies, cameras, pickups, interactables (chests,
   shrines, the boss portal), UI, or is `WorldCollider`/`WorldEdgeTop`/`PlayerCamera`. The procedural tile roots and
   the grass renderer go too.
3. **Place the map**: a root object (`Bonkscape <map name>`) centred on Megabonk's `MapEdges` centre (captured by a `MapEdges.Set` prefix),
   with the spawn tile's ground at the adventurer's feet. Megabonk's Desert never calls `MapEdges.Set` (found by the
   dead-hook report); its maps are centred on the origin, as the Forest's is, so a map without it is centred there,
   never on a centre an earlier map left. The log says which (`arena centred on 0.0,0.0 (...)`).
4. **Meshes**: terrain on Megabonk's ground layer (8) with `MeshCollider`s; objects and wall cells on layer 0. The
   Unity meshes are made a few a frame by `Arena.Prewarm` (an 8 ms budget, called from `Runner.Update`) once the
   map's world data is built (Lumbridge's while in the menu), and kept (`DontUnloadUnusedAsset`); scenery and wall
   meshes are uploaded with `UploadMeshData(true)` (no CPU copy), and the world data's own mesh arrays are let go.
   Morytania's took 3.5 s made in one go.
5. **Colliders**: `WorldData.Boxes` (walls, big scenery, trunks, water) as `BoxCollider`s, one holder object per
   32-tile chunk and turn (`center` places each box; Morytania has 19,000), on a **free physics layer**
   (the highest unnamed layer from 31 down to 16), set to collide with the player's and the enemy layer. Megabonk's
   camera (1\|8\|12), spawn raycasts (ground\|object) and projectiles don't test that layer.
6. **Spawn bounds**: `SpawnPositions.FindBounds` is re-run; its postfix sets `minX..maxZ` to the arena minus 2 tiles.
7. **Minimap**: Megabonk's `MinimapMesh` renderers off; a textured quad with the map's OSRS minimap on the minimap layer.
   `Minimap.Render(..., separateIcons: true)` returns the map scene and map function icons separately; they're packed
   into one atlas and drawn as one mesh of quads, which `UpdateIcons` turns every frame to face Megabonk's minimap
   camera, so icons stay upright. `Minimap.Zoom` divides that camera's `orthographicSize`.
8. **Move in**: `TeleportPlayerImmediate` to the spawn tile (Lumbridge's courtyard, Canifis) facing west, then `rb.position` and the transform, repeated
   for 2 s in `Arena.Tick` ([Gotchas](gotchas.md#megabonk-runtime)). Once the adventurer is on the tile,
   `CameraTweak.FaceNorth` sets `PlayerInput.cameraRotation` and `desiredCameraRotation` to (pitch, yaw 0), here and in
   a boss's lair.
9. **Interactables**: chests and shrines to random open tiles; the `InteractableBossSpawner` to `boss_tile`.
10. **Enemies** already alive are teleported to the player; **skilling spots** are placed on tracked trees, rocks and
    shore tiles.
11. `osrs-arena` passes. Any exception: restore Megabonk's stage and clear the map.

**Boss lairs** (0.2.10): a phase-1 `bosses` row with an `osrs_arena` (the Giant Mole's: the Falador Mole Lair,
1728,5120 to 1791,5247) is built at load like a map and keyed by the boss id (`Osrs.Arenas["giant_mole_boss"]`);
`Prewarm` makes its meshes after the current map's. When `EnemySkins` skins the current map's boss (`Rows.BossArenaFor`),
`Arena.BossSummoned` records it and the next `Arena.Tick` swaps under the loading cover: `bossBuild` set (so `World`,
`Map` and everything that reads them, Pathing and autoplay included, see the lair), `Build(player, keepStage: true)`
(Megabonk's stage is already hidden; searching again would also catch pooled weapons and projectiles), the boss put on
`arena_boss_tile`. The lair uses a copy of the arena material at 82% (`_Color`; the shader is unlit, so fog and lights
don't reach it), black fog, and a black copy of the stage's skybox with dimmer ambient (`Content.KeepLook` keeps each
stage's sky values at load, because `RenderSettings`' getters are stripped). If the lair's build throws, the map is built
again from its kept meshes. `LeaveBossArena` (each stage start, run end) puts the stage's sky back. The Mole's dig in
the lair resurfaces it on a random tile 8 to 18 steps' walk from the adventurer (`Pathing.RandomReachable`, from the
grid's last search), never across a wall. `WorldData.MissingAreaRegions` counts only empty regions inside the area: the
Mole lair's neighbouring regions are empty void. **Holes**: a tile whose ground draws nothing on either level gets
`FlagNoGround`; it is neither `Walkable` nor `Passable`, and on every map each one beside a tile with ground gets a tall
`edge` box (rows merged, 128 units under the floor to 1500 over it) and `FlagSolid` (Morytania: 133 such tiles, 52
boxes; Lumbridge none; the Mole lair has a stone-floored patch drawn only by objects, ~3 m up, whose raised walls the
adventurer walked under in 0.2.11's run). Lairs are also built with `WorldOptions.WallOffBlocked`: every tile that isn't
walkable beside a walkable one gets the same box, so nobody climbs the cave walls' flat tops (0.2.10's run fell twice),
including tiles a diagonal wall marked solid (its own box covers only the diagonal); monster spawns that land off the
floor are moved onto it (the `SpawnPositions` postfixes below). `bonk boxes ... cave` prints a tile grid with these flags.

**Raised houses**: level-1 locs are taken on bridge tiles (level 1 drawn as the walking level), and since 0.2.11 also
walls and wall decorations (types 0-4 and 9) on a level-1 tile *next to* a bridge tile: a stilt house's walls (Canifis)
sit on the ring of tiles just outside its bridge floor, facing in (`WorldData.BridgeRimWalls`: 1,217 on Morytania,
0 on Lumbridge). `bonk tiles <x0 y0 x1 y1> [all]` prints the bridge flags and every skipped wall to check such places.

Each frame afterwards, `Arena.Tick` catches falls (25 m under the lowest ground: back to the spawn tile), and
`Arena.LateTick` turns the minimap icons, every 0.25 s hides scenery and wall meshes whose bounds are farther than
`[Map] DrawDistance` (200 m) from the adventurer (the ground always draws), and hides wall cells whose bounds cross the
ray from `PlayerCamera`'s camera to the adventurer (logging a camera/wall/draw-distance summary every 20 s). `Pathing` searches the tile grid
from the adventurer, within 48 tiles of them (0.2.1, for Morytania's 173,000 tiles), every 0.5 s or on a tile change, and an `EnemyMovementRb.GetTargetPosition` postfix aims each
monster at its next tile.

## Harmony patches

Everything Bonkscape patches, from the code (`[HarmonyPatch]` in `src/Bonkscape.Plugin`). The `hooks` column names the
matching row in `sheets/hooks.json`; **"none"** means the sheet has no row, so the preflight never checks that the
target still exists ([docket](docket.md)).

| Target | Kind | File | What it does | `hooks` row |
|---|---|---|---|---|
| `SteamLeaderboardsManagerNew.QueueLeaderboardUpload` | prefix (skip) | Patches/CorePatches | Modded runs never queue leaderboard scores | `leaderboard_queue` |
| `SteamLeaderboardsManagerNew.UploadLeaderboardScore` | prefix (skip) | Patches/CorePatches | ...or upload them | `leaderboard_upload` |
| `DataManager.Load` | postfix | Patches/CorePatches | Applies the sheets to Megabonk's data; optional data dump | `data_loaded` |
| `DeathScreen.StartDeathScreen` | postfix | Patches/CorePatches | "Oh dear, you are dead!" title; death message timer; test mode keeps the screen | `death_screen` |
| `UnlockableBase.GetName` | prefix (replace) | Systems/Content | OSRS names for weapons, tomes, characters, the map; reimplements the localized name otherwise | `names` |
| `EnemyData.GetName` | prefix | Systems/Content | OSRS monster names | none |
| `StageData.GetName` | prefix | Systems/Content | Stage names: Lumbridge & Swamp, Lumbridge Swamp, Lumbridge Swamp Caves on the Forest; Morytania on every Desert stage | none |
| `UnlockUtility.GetAvailableWeapons` | postfix | Systems/Content | Level-up weapon offers: only Bonkscape weapons (in Lumbridge) | `weapon_pool` |
| `UnlockUtility.GetAvailableTomes` | postfix | Systems/Content | Tome offers: only gear passives, one per slot, below max level | `tome_pool` |
| `MyAchievements.IsUnlocked(UnlockableBase, out string)` | postfix | Systems/Content | Bonkscape weapons and tomes count as unlocked; an adventurer's Megabonk character is unlocked by its row's `unlock_condition` (`Unlocks.CharacterUnlocked`), either way | `unlock_override` |
| `Enemy.InitEnemy` | postfix | Systems/EnemySkins | OSRS model, size tier, hide Megabonk's renderer (re-sized in `LateTick` once the hitbox is live) | `enemy_spawn` |
| `Enemy.ReleaseToPool` | postfix | Systems/EnemySkins | Hide the model of a pooled enemy | none |
| `Enemy.DamageFromPlayerWeapon` | prefix + postfix | Systems/Combat | HP before/after: hitsplat and skill XP for damage dealt | `enemy_damaged` |
| `Enemy.EnemyDied(DamageContainer)` | postfix | Systems/Combat | Kill count, prayer potion drops, `osrs-enemy-killed` | `enemy_died` |
| `Enemy.EnemyDied(DamageContainer)` | prefix | Systems/SecondForm | A two-form boss's first death is called off: full health, Megabonk's death flags cleared, the second form's model in its place (`bosses.second_form`) | `boss_second_form` |
| `InteractableCrypt.Interact` | prefix | Systems/Graveyard | The Graveyard's crypt door on a map with a boss lair loads Megabonk's final stage instead (the KBD's ladder) | `graveyard_door` |
| `InteractableCrypt.CanInteract` | postfix | Systems/Graveyard | The door can be opened until the final stage | `graveyard_door` |
| `InteractableCrypt.GetInteractString` | postfix | Systems/Graveyard | The door says *Climb down to* the map's boss | `graveyard_door` |
| `DamageNumbers.SetDamage(float, Color, Vector3, int)` | postfix | Systems/Combat | Blank Megabonk's damage numbers in Lumbridge | `damage_numbers` |
| `DamageNumbers.SetDamage(string, Color, Vector3, int)` | postfix | Systems/Combat | Blank Megabonk's "-N" player damage text | none (covered by `damage_numbers` in spirit) |
| `PlayerHealth.Damage` | prefix + postfix | Systems/Prayer | Protection prayers reduce or cancel damage by monster style (prefix); the player hitsplat from what the hit actually took, hp + shield + overheal (postfix): hits Megabonk's hit cooldown stops or 0-damage touches show nothing. In test runs the lethal-hit guard (`TestGuard`) cuts a hit that would kill to leave 1 hitpoint, then heals to half (prefix and postfix) | `player_damage` |
| `PlayerHealth.DamagePlayerExternal` | prefix + postfix | Systems/Prayer | Megabonk's other damage call, with a bare amount (0.5: the hits the guard never saw came after a TzHaar-Ket champion, Megabonk's sand golem, joined): in jumped test runs the monster's hit loses the stage share, and the lethal-hit guard trims it; the first call logs whether it goes on to `Damage` (if not, the hit is counted here) | `player_damage_external` |
| `PlayerHealth.PlayerDied` | prefix | Systems/TestGuard | Test runs: a death by any other way than a guarded hit is stopped and logged (heals to half); off with a scenario's `"deaths": "allow"` | none |
| `PlayerHealth.KillPlayer` | prefix | Systems/TestGuard | The same for Megabonk's direct kill | none |
| `PlayerHealth.Evade` | postfix | Systems/Prayer | A Megabonk evade shows OSRS's 0 hitsplat (a miss) | `player_evade` |
| `WeaponAttack.SuccessfullySpawnedProjectile` | postfix | Systems/PlayerSkin | The adventurer plays the weapon's OSRS attack sequence (merged with walking or running while moving) | `weapon_used` |
| `PlayerHealth.UseAegis` | postfix | Systems/Prayer | An Aegis block shows OSRS's 0 hitsplat | `player_aegis` |
| `PickupManager.SpawnPickup` | postfix | Systems/Loot | Coins and food wear OSRS item models | `pickup_spawn` |
| `MusicController.OnPause` | postfix | Systems/Music | Megabonk's pause also pauses the OSRS track (experimental OSRS music) | none |
| `Pickup.ApplyPickup` | prefix + postfix | Systems/Loot | Food heals by its row; pickup sounds; `osrs-item-picked` | `pickup_apply` |
| `InteractableChest.Start` | postfix | Systems/Loot | Chests wear the OSRS casket | `chest_spawn` |
| `InteractableShadyGuy.Start` | postfix | Systems/Loot | The map's shopkeeper NPC (`maps.shopkeeper_npc`, TzHaar-Hur-Tel in TzHaar City) stands in for the Shady Guy | none |
| `CharacterMenu.BuyCharacter` | prefix | Systems/Unlocks | Megabonk's silver purchase of an adventurer Bonkscape keeps locked (a Barrows brother without his set, the Ironman before total level 250) is refused, and the chat says what unlocks him | `character_buy` |
| `InteractableShadyGuy.Interact` | prefix | Systems/Loot | An adventurer whose `characters.can_buy` is false (the Ironman) is refused by the Shady Guy and every shopkeeper standing in for him: the interaction is stopped and the chat says so | `shop_refuse` |
| `InteractableShadyGuy.GetInteractString` | postfix | Systems/Loot | The same adventurer's prompt reads "Ironmen can't trade" | `shop_prompt` |
| `MoneyFlying.Set` | postfix | Systems/Loot | Flying coins wear the OSRS coin stack | none |
| `MoneyFlying.Pickup` | postfix | Systems/Loot | Coin sound (rate-limited), `osrs-item-picked` | none |
| `ChestWindowUi.OpenButton` | postfix | Systems/Evolutions | Try evolutions when a casket's Open button is pressed (the old target, a private method, is inlined by IL2CPP and never ran); in test runs the first casket prepares one | `chest_open` |
| `PlayerRenderer.SetCharacter` | postfix | Systems/PlayerSkin | The OSRS adventurer model | `player_model` |
| `MapEdges.Set` | prefix | Systems/Arena | Remember the stage centre (Megabonk's Desert never calls it: Morytania is centred on the origin, as the Forest's is) | none |
| `SpawnPositions.FindBounds` | postfix | Systems/Arena | Spawn bounds onto Lumbridge | none |
| `SpawnPositions.GetEnemySpawnPosition` | postfix | Systems/Arena | In a boss's lair, a monster spawn off the cave floor goes to a reachable floor tile (`Pathing.RandomReachable`, 5 to 16 steps) | none |
| `SpawnPositions.GetEnemySpawnPositionBiased` | postfix | Systems/Arena | The same, for Megabonk's biased spawns | none |
| `SpawnPositions.GetEnemySpawnPositionAroundPoint` | postfix | Systems/Arena | The same, for spawns around a point | none |
| `EnemyMovementRb.GetTargetPosition` | postfix | Systems/Pathing | Aim monsters at their next tile on the grid | none |
| `PlayerInput.MovementInput` | postfix | Systems/TestMode | Autoplay movement (test mode only) | none |

Polled or called, not patched: `MyPlayer.Instance` (stage start, `run_started`), `RandomObjectPlacer` output after
generation (`map_props`), `KillsAndGoldCounter.t_gold` (hidden, `gold_hud`), `UpgradeButton.SelectUpgrade` and
`BaseEncounterWindow.ChooseOffer` (autoplay), `MapController.StartNewMap` (autoplay start), `PlayerCamera.offset3rdPerson`
and `maxExtraZoomoutDistance` (camera distance), the minimap camera's `orthographicSize` (`Minimap.Zoom`), `MoneyUtility.SpawnMoney` and `statusEffects.TestPickup` (skilling),
`HealthUI`, `XpBarUI` (hidden in a run; `desiredRatio` read for the XP counter's strip), `EnemyHpBar` (scanned every
0.5 s in a run and hidden; a Harmony patch on `EnemyHpBar.Set` in 0.1.17 went with a crash), `MinimapUi.border` (measured
for the minimap frame) and the active ability's `GetCooldown`/`readyAtTime` (the special attack orb).

Rows in `hooks.json` with **no patch** in the code: `icons_weapon`, `icons_tome`, `icons_character` (icons are written
into data fields instead), `music` (`MusicController.PlayMusicTrack`: no music synthesiser yet) and `timer`
(`GameManager.GetAliveTime`: the OSRS clock was removed in 0.1.7). The sheet as it stands:

<!-- gen:hooks -->
| Hook | System | Target | Kind | Purpose | Status |
|---|---|---|---|---|---|
| `leaderboard_queue` | safety | `SteamLeaderboardsManagerNew.QueueLeaderboardUpload` | prefix | modded runs never queue leaderboard scores | <span class="st st-verified">verified</span> |
| `leaderboard_upload` | safety | `SteamLeaderboardsManagerNew.UploadLeaderboardScore` | prefix | modded runs never upload leaderboard scores | <span class="st st-verified">verified</span> |
| `data_loaded` | data | `DataManager.Load` | postfix | apply weapons/passives/enemies/characters/maps/waves rows to Megabonk's ScriptableObjects | <span class="st st-verified">verified</span> |
| `weapon_pool` | data | `UnlockUtility.GetAvailableWeapons` | postfix | level-up picks offer only Bonkscape weapons | <span class="st st-verified">verified</span> |
| `tome_pool` | data | `UnlockUtility.GetAvailableTomes` | postfix | level-up picks offer only gear passives | <span class="st st-verified">verified</span> |
| `names` | presentation | `UnlockableBase.GetName` | prefix | OSRS names for reskinned weapons, tomes and characters | <span class="st st-verified">verified</span> |
| `icons_weapon` | presentation | `WeaponData.GetIcon` | prefix | OSRS item icons rendered from the cache | <span class="st st-verified">verified</span> |
| `icons_tome` | presentation | `TomeData.GetIcon` | prefix | OSRS gear icons rendered from the cache | <span class="st st-verified">verified</span> |
| `icons_character` | presentation | `CharacterData.GetIcon` | prefix | character portraits rendered from the OSRS player model | <span class="st st-built">built</span> |
| `enemy_spawn` | enemies | `Enemy.InitEnemy` | postfix | swap the enemy's mesh for its OSRS NPC model, add style marker | <span class="st st-verified">verified</span> |
| `enemy_damaged` | combat | `Enemy.DamageFromPlayerWeapon` | prefix + postfix | OSRS hitsplats and skill XP from damage dealt | <span class="st st-verified">verified</span> |
| `enemy_died` | combat | `Enemy.EnemyDied` | postfix | kill counting, prayer potion drops, test check | <span class="st st-verified">verified</span> |
| `player_damage` | prayer | `PlayerHealth.Damage` | prefix + postfix | protection prayers cut damage by enemy style; the player hitsplat from what the hit actually took | <span class="st st-verified">verified</span> |
| `player_damage_external` | prayer | `PlayerHealth.DamagePlayerExternal` | prefix + postfix | Megabonk's other damage call (a bare amount): jumped test runs' stage share and the lethal-hit guard, whether or not it goes on to Damage | <span class="st st-built">built</span> |
| `damage_numbers` | presentation | `DamageNumbers.SetDamage` | postfix | hide Megabonk's floating numbers where an OSRS hitsplat shows instead | <span class="st st-verified">verified</span> |
| `pickup_spawn` | loot | `PickupManager.SpawnPickup` | postfix | coins and food pickups wear OSRS item models | <span class="st st-built">built</span> |
| `pickup_apply` | loot | `Pickup.ApplyPickup` | prefix + postfix | food heals, item pickup sound and test check | <span class="st st-verified">verified</span> |
| `chest_spawn` | loot | `InteractableChest.Start` | postfix | chests wear the OSRS casket model | <span class="st st-built">built</span> |
| `chest_open` | loot | `ChestWindowUi.OpenButton` | postfix | evolutions open from caskets | <span class="st st-built">built</span> |
| `player_model` | presentation | `PlayerRenderer.SetCharacter` | postfix | the player becomes their OSRS adventurer model | <span class="st st-verified">verified</span> |
| `level_up` | presentation | `UpgradeButton.SelectUpgrade` | call (test mode) | test autoplay presses the first level-up offer; Megabonk's level-ups otherwise stay as they are | <span class="st st-verified">verified</span> |
| `timer` | presentation | `GameManager.GetAliveTime` | poll | run timer drawn in OSRS's font from Megabonk's run time | <span class="st st-verified">verified</span> |
| `death_screen` | presentation | `DeathScreen.StartDeathScreen` | postfix | Oh dear, you are dead! | <span class="st st-built">built</span> |
| `music` | audio | `MusicController.PlayMusicTrack` | prefix | OSRS music per map when it decodes, else Megabonk's | <span class="st st-built">built</span> |
| `run_started` | systems | `MyPlayer.get_Instance` | poll | a Lumbridge stage begins when Megabonk's player exists on the Lumbridge map: reset prayer, place skilling nodes, start test mode | <span class="st st-verified">verified</span> |
| `map_props` | map | `RandomObjectPlacer.Generate` | poll | after the stage generates, Megabonk's trees, rocks and bushes are drawn with OSRS scenery models (their colliders stay) | <span class="st st-verified">verified</span> |
| `gold_hud` | presentation | `KillsAndGoldCounter.t_gold` | data row | Megabonk's gold number and icon are hidden; the OSRS coin stack for the amount is drawn instead | <span class="st st-verified">verified</span> |
| `arena_edges` | arena | `MapEdges.Set` | prefix | remember Megabonk's map centre so an OSRS map replaces the stage in place (Megabonk's Desert never calls it: those maps are centred on the origin, as every measured map is) | <span class="st st-verified">verified</span> |
| `arena_spawn_bounds` | arena | `SpawnPositions.FindBounds` | postfix | enemy and pickup spawn bounds cover the Lumbridge arena | <span class="st st-verified">verified</span> |
| `stage_name` | data | `StageData.GetName` | postfix | Lumbridge stage names | <span class="st st-verified">verified</span> |
| `enemy_name` | data | `EnemyData.GetName` | postfix | OSRS monster names on Megabonk's enemies | <span class="st st-verified">verified</span> |
| `unlock_override` | data | `MyAchievements.IsUnlocked` | postfix | Bonkscape's weapons and tomes count as unlocked; an adventurer follows its characters.unlock_condition either way (Unlocks.CharacterUnlocked: the Ironman stays locked until total level 250) | <span class="st st-verified">verified</span> |
| `enemy_release` | models | `Enemy.ReleaseToPool` | postfix | hide an enemy's OSRS model when Megabonk pools it | <span class="st st-verified">verified</span> |
| `coins_flying` | loot | `MoneyFlying.Set` | postfix | flying coins wear the OSRS coin stack | <span class="st st-verified">verified</span> |
| `coins_pickup` | loot | `MoneyFlying.Pickup` | postfix | coin pickup sound and test check | <span class="st st-verified">verified</span> |
| `enemy_pathing` | arena | `EnemyMovementRb.GetTargetPosition` | postfix | monsters walk Lumbridge's tile grid round walls toward the adventurer | <span class="st st-verified">verified</span> |
| `autoplay_input` | test | `PlayerInput.MovementInput` | postfix | test-mode autoplay movement | <span class="st st-verified">verified</span> |
| `player_evade` | presentation | `PlayerHealth.Evade` | postfix | a Megabonk evade shows OSRS's 0 hitsplat (a miss) | <span class="st st-built">built</span> |
| `player_aegis` | presentation | `PlayerHealth.UseAegis` | postfix | an Aegis block shows OSRS's 0 hitsplat | <span class="st st-built">built</span> |
| `weapon_used` | models | `WeaponAttack.SuccessfullySpawnedProjectile` | postfix | the adventurer plays the weapon's OSRS attack sequence | <span class="st st-built">built</span> |
| `shop_refuse` | loot | `InteractableShadyGuy.Interact` | prefix | an adventurer who can't buy (characters.can_buy false: the Ironman) is refused by the Shady Guy and the shopkeepers standing in for him | <span class="st st-built">built</span> |
| `shop_prompt` | loot | `InteractableShadyGuy.GetInteractString` | postfix | the same adventurer's prompt reads "Ironmen can't trade" | <span class="st st-built">built</span> |
| `character_buy` | data | `CharacterMenu.BuyCharacter` | prefix | Megabonk's purchase of an adventurer Bonkscape keeps locked is refused (characters.unlock_condition) | <span class="st st-built">built</span> |
| `boss_second_form` | enemies | `Enemy.EnemyDied` | prefix | a two-form boss's first death called off: full health, the second form's model on the same enemy (the Kalphite Queen) | <span class="st st-built">built</span> |
| `graveyard_door` | map | `InteractableCrypt.Interact, CanInteract, GetInteractString` | prefix + postfix | the Graveyard's crypt door on a map with a boss lair loads Megabonk's final stage, whose final boss is the map's boss (the KBD) | <span class="st st-built">built</span> |
<!-- /gen:hooks -->

## Systems at a glance

| File | System |
|---|---|
| `Systems/Bonk.cs` | Is this a Bonkscape run, and on which map? (`Active`, `Rows.Current`, `MapOf`, `RowOf`) Since 0.5 a Megabonk map can carry one maps row per stage: the run's row is the one for its map and stage (`Bonk.StageIndex`: the loaded stage, not Megabonk's played-stage count), else the map's first; a change of row puts that stage's monsters on Megabonk's shared enemy types (`Content.ApplyStage`). |
| `Systems/Content.cs` | Sheets into Megabonk's data; names, icons, level-up pools, unlocks, starting weapons; `maps.difficulty` on enemy hp and damage; `maps.sky` on the stage's fog, skybox (a copy), ambient and sun (`ApplySky`), and each stage's look kept for after a lair (`KeepLook`) |
| `Systems/Arena.cs` | The OSRS arenas (maps and boss lairs), the loading cover |
| `Systems/PlayerMoveFix.cs` | The adventurer on an arena: slope limit 62 degrees (`PlayerMovement.maxSlopeAngle`), and after 0.25 s of holding a direction without moving, a slide along the wall in front or a hop up a ledge; restored when the arena goes |
| `Systems/Pathing.cs` | Tile-grid pathing for monsters |
| `Systems/MapProps.cs` | Fallback stage: OSRS scenery on Megabonk's props |
| `Systems/EnemySkins.cs` | OSRS monster models, size tiers, monster animation (stand, walk at real speed, attack on a hit, death) |
| `Systems/Animator.cs` | `ModelAnimator` (plays baked sequences by swapping frame meshes, shared per type) and `Corpses` (a dead monster's death sequence on a copy, at most 1.8 s) |
| `Systems/Bosses.cs` | The Giant Mole's dig (in its lair: to a reachable tile) |
| `Systems/PlayerSkin.cs` | The OSRS adventurer model and its animation (stand, walk, run, death, weapon attacks from `WeaponAttack.SuccessfullySpawnedProjectile`). Since 0.4 the adventurer takes the attacking weapon in hand: its body (`Osrs.PlayerWeaponBodies`) is made on first use in a run, kept hidden between, drawn at the own body's scale and feet, and shown when that weapon attacks or specs; the same weapon's extra projectiles don't restart a swing, another weapon cuts in after 0.3 s (`MinShow`) |
| `Systems/Projectiles.cs` | OSRS projectile models on Megabonk's projectiles, weapon attack sounds, monster hit and kill sounds |
| `Systems/CameraTweak.cs` | `Camera.Distance`, and the toggle to `Camera.FarDistance` Since 0.4 the camera faces north (yaw 0: the arena puts OSRS north on +z) at `NearPitch` when the adventurer lands on a spawn tile (a run's start, a restart, a boss's lair and back; `Arena.Tick`), through `PlayerInput.cameraRotation` and `desiredCameraRotation` ((pitch, yaw, roll); Megabonk starts at (20, 270, 0)); the toggle key sets `FarPitch` or `NearPitch` too |
| `Systems/Combat.cs` | Damage dealt, kills, Megabonk damage numbers |
| `Systems/Prayer.cs` | Protection prayers |
| `Systems/Barrows.cs` | The Barrows (0.7): the 24 pieces (drops of kind `barrows_piece`), the one a beaten hidden brother gives (never owned before; saved in `unlocks.json` under `_barrows`), a brother's full set (his unlock), the set line on character select |
| `Systems/SetEffects.cs` | The Barrows sets' effects (0.7), from `set_effect`: on a brother's hits on the adventurer (Prayer: before the block, so Verac's pierce skips it; a hit naming no monster, a boss's projectile, counts as the nearest brother's within 10 m) and on the adventurer's hits as a brother (Combat). Dharok's rage always, the others a 25% chance in their style: Ahrim weakens (10% weaker hits, 6 s), Guthan heals by the damage, Karil slows (Megabonk's SlowPlayer on the adventurer), Torag drains (a 2 s slow: Megabonk's dash has no energy), Verac pierces prayers or (on monsters) armour, +25%. Tries and triggers per effect in the run's summary |
| `Systems/LavaBurn.cs` | Lava edges burn (0.5): standing within 0.35 tiles of a lava tile (the world build's `FlagLava`, overlay texture 31) costs 2.4% of max health each OSRS tick through Megabonk's damage call; lava stays blocked, and the middle of a one-tile bridge is safe |
| `Systems/Unlocks.cs` | Permanent unlocks per adventurer (0.5): a boss's death unlocks the passives whose `unlocked_by` names it (the Fire cape for Jad); saved in `%LOCALAPPDATA%/Bonkscape/unlocks.json` (not while skill saving is off, as in scenarios); gear offers leave locked ones out; `CharacterUnlocked` reads `characters.unlock_condition` (`always`, `total_level_N` on any one adventurer, `TotalLevel`), worked out at most every 2 s |
| `Systems/BossFight.cs` | Boss fights beyond the Mole's dig (0.5): a boss arena's own waves (`bosses.arena_waves`, the boss held on its tile, frozen, unhurt and unseen until `boss_at`), scripted attacks (`attack_every_ms` with `random` attacks: Megabonk's own special attacks off, the sheet's attack picked each interval, its sequence and spot animations, the hit landed at impact with its style so the prayer counts then; Megabonk's touches don't hurt), healers (`bosses.healers`: called below a share of health, walk to the boss and heal it until hit), `SpawnAs` (a monster skinned as a given row) |
| `Systems/SecondForm.cs` | A boss's second form (0.8, `bosses.second_form`: the Kalphite Queen): its first form's death called off (the `EnemyDied` prefix), its health back in full, `EnemySkins.Reskin` puts the second form's model on the same enemy (the first falls on a corpse, or `bosses.second_form_spotanim` plays in its place: the Queen's husk) and plays its `spawn` sequence when it has one, still and unhurt meanwhile; Combat's death postfix skips the called-off death. A second form never takes a Megabonk slot of its own (`Rows.Build` leaves it out of the slot lookups) |
| `Systems/Graveyard.cs` | Megabonk's Graveyard under an OSRS map (0.9, the Wilderness): the starting crypt left by its exit door before the arena moves the adventurer (the stage clock starts only then), the surface crypt door put on the boss tile as the way down to the map's boss, opening it loads Megabonk's final stage (as TzHaar City's final portal does), whose final boss (Ent1) is the map's boss row in its lair |
| `Systems/Pkers.cs` | PKers (0.9, `maps.special_rule` `pkers_revenants`): an ambush every three to four minutes from the map's `pk_weapon` rows (none in a boss's lair), each PKer's health and damage from its row, and its weapon's special attack every 10-14 s in reach |
| `Systems/Specials.cs` | Special attacks (0.4): the energy bar (60 s, plus 0.25% a kill, capped), the fire and switch keys, each spec's steps (`weapons.spec_effect`) through Megabonk's own damage and debuff calls, targets only monsters that can take damage, autoplay's specs in test runs, the scenario `spec` step |
| `Systems/SpotFx.cs` | OSRS spot animations as flipbooks on the HUD (the specs' graphics), rendered from the cache off the main thread |
| `Systems/Skills.cs` | Persistent skills, XP table, combat level |
| `Systems/Skilling.cs` | Trees, rocks, fishing spots |
| `Systems/Loot.cs` | Coins, food, caskets, prayer potions |
| `Systems/Evolutions.cs` | Evolutions on casket open |
| `Systems/Hud.cs`, `Chat.cs`, `CharacterSelect.cs` | The OSRS HUD: what to show, from the game's state. `CharacterSelect` also hides the menu's `PlayerRenderer` and stands the adventurer's OSRS model in its place (its height and feet, facing the camera, the stand animation), and measures the free gap between Megabonk's windows (`FindGap`, over the top 3-45% of the screen) for `HudLayout.DrawCharacterPanel` |
| `Systems/HudLayout.cs` | The HUD's layout and drawing from OSRS's interfaces (160 orbs, 122 XP counter, 162 chatbox, 233 level-up dialogue, 541 prayer book, 161 minimap frame), sprite ids in `UiSprite`. No Unity: also compiled into `bonk.exe` for `uisprites mock`. |
| `Systems/OsrsUi.cs` | IMGUI canvas for `HudLayout`; loads its sprites and fonts; measures Megabonk's minimap |
| `Systems/MegabonkHud.cs` | Hides Megabonk's health bars, XP bar and enemy health bars in a run and restores them after; reads run XP progress and the ability cooldown |
| `Systems/LevelUpFx.cs` | OSRS level-up fireworks (spot animation 199) as a flipbook at the adventurer's feet |
| `Systems/Sfx.cs`, `Core/OsrsAudio.cs` | OSRS sounds through an `OnAudioFilterRead` mixer |
| `Systems/Music.cs` | Experimental OSRS music through OsrsKit.Music (publish-gated: `tools/package.py` doesn't ship `OsrsKit.Music.dll`; without it Megabonk's music plays) |
| `Systems/TestMode.cs` | Melty test mode and autoplay ([Testing](testing.md)) |
| `Systems/Scenario.cs` | Scenario test mode for the local loop: `BepInEx/config/Bonkscape/scenario.json` (map, stage, adventurer, timed steps, preset levels, screenshots, expected checks, suites, the UI test), `scenario-report.txt` ([Testing](testing.md#the-local-loop)) |
| `Systems/TestGuard.cs` | The lethal-hit guard in test runs: the killing hit leaves 1 hitpoint, any other death is stopped; logged and counted (`player-hit`) |
| `Systems/Shot.cs` | In-game screenshots for scenarios: read back in an IMGUI repaint, written as PNG by the plugin |
| `Core/DeadHooks.cs` | Test runs: a counting prefix on every patched method; the report lists the patches that never ran |
| `Core/Sizing.cs` | One yardstick: adventurer height, OSRS units to metres, monster tiers |
| `Core/UnityConv.cs` | `MeshData`/pixels into Unity meshes, textures, objects (main thread); OSRS colours gamma-to-linear in Linear colour space; `SpritePart` (part of a sprite frame as its own texture) |
| `Dev/DataDump.cs` | `Dev.DumpData`: Megabonk's data as JSON |
| `Dev/Timing.cs` | `timing: <mark> at N s` lines from the plugin's load (OSRS assets ready, main menu, run requested, run started, arena built) for the local loop |
| `Dev/Breadcrumbs.cs` | Test mode: `%LOCALAPPDATA%\Bonkscape\breadcrumbs.txt`, one flushed line per step, so a native crash's last line names the step |

## Tools (`bonk.exe`)

Run from `src/Bonkscape.Tools`. Most commands find a cache like the plugin does, or use `BONK_CACHE`; outputs go under
`BONK_OUT` (default the current folder).

| Command | Does |
|---|---|
| `bonk preflight <sheets> <interopDir> <devCache> <playerCache\|-> <genOut\|-> <report>` | Checks the sheets, writes the report, `cache_assets.json` and the generated rows |
| `bonk npcs <name\|id...>` / `bonk items <name\|id...>` / `bonk objects <name...>` | Find definitions by name (or, for npcs and items, a number as the id), with model availability |
| `bonk render npc\|item\|icon\|object\|spotanim\|player <id> [yaw pitch]` | PNG renders; textured faces take their texture's average colour, as `bonk world` does |
| `bonk find <interopDir> <name>` | Every game type with a method or property of that name (any case), to find where a call lives |
| `bonk sprites <id...>`, `bonk text <font> <text>`, `bonk sfx <id...>` | Sprites, font text, synthesised sounds as WAV |
| `bonk modelcolors <model...>` | Each model's format, face count and most common face colours (hue, saturation, lightness) |
| `bonk uisprites sheet\|pick\|dump\|info\|iface\|healthbar\|hitsplat\|spotanim\|mock` | Interface sprites for the HUD: contact sheets, dumps, interface layouts, health bars, hitsplats, spot animation frames; `mock [w h]` draws the HUD layout into `mock_WxH.png` |
| `bonk map ...`, `bonk world ...` | Top-down map renders and 3D previews of an area |
| `bonk worldtiles ...` | Tile pyramids for the sketch tool (surface, underground, instances) |
| `bonk worldscan`, `bonk revs` | Check every region decodes; index revisions |
| `bonk locs x0 y0 x1 y1 <name>` | Placed objects by name in an area |
| `bonk anim <npc> <seq>`, `bonk seqinfo <id...>`, `bonk mergeinfo <action> <move>` | Bake a sequence on an NPC into a frame strip; a sequence's frames, length and interleave groups; how an interleave splits the transforms |
| `bonk unstripped <Bonkscape.dll> <interopDir>` | Lists the stripped methods the plugin calls that Il2CppInterop rebuilt (exit 3 when any): `tools/package.py` runs it |
| `bonk probe`, `bonk names`, `bonk rawcfg`, `bonk kits` | Low-level inspection |

## Build and release

```
cd src/Bonkscape.Plugin && dotnet build -c Release
python tools/package.py <version>      # dist/Bonkscape-<version>.zip: Bonkscape.dll, Bonkscape.Cache.dll, README, LICENSE, LICENSES/
```

The plugin compiles against `lib/bepinex-melty` (BepInEx 6.0.0-be.697 from the game folder, the build Melty installs)
and Megabonk's interop assemblies (`InteropLib`, default `D:\Steam\steamapps\common\Megabonk\BepInEx\interop`). Bump
`Plugin.Version` for every build you upload. `package.py` runs the docs checker first and refuses to build the zip
when it fails (`--skip-docs` for emergencies; [the docs checker](updating-docs.md#the-docs-checker)). Then upload, submit and test through Melty ([Testing](testing.md)), and
update the docs ([How to update these docs](updating-docs.md)).

<!-- sources: src/ tools/ -->
