# Architecture

Bonkscape is a BepInEx 6 IL2CPP plugin for Megabonk (Unity 2023.2.22f1, IL2CPP, build 1.0.69) that reads the player's
Old School RuneScape cache at run time. Nothing from either game is shipped. Written against **0.1.20** (`782ce3f`).

## Projects

| Path | What it is | Target |
|---|---|---|
| `src/Bonkscape.Cache` | OSRS cache library: reads the cache and turns it into plain data (meshes as triangle soup, ARGB pixels, PCM samples). No Unity references. | net6.0 |
| `src/Bonkscape.Plugin` | The BepInEx plugin (`Bonkscape.dll`): Harmony patches, systems, HUD. Compiles its game code only when Megabonk's interop assemblies are found (`INTEROP` define). | net6.0 |
| `src/Bonkscape.Tools` | `bonk.exe`: preflight and code generation, plus cache inspection and map tools. | net8.0 |
| `tools/package.py` | Builds `dist/Bonkscape-<version>.zip` from the Release build. | Python 3 |
| `tools/sketch` | Map sketch tool (Leaflet page + `server.py`, port 8790): the OSRS world map from your cache, for outlining future maps. | Python 3 |
| `tools/wiki-site` | This wiki's local site (port 8791) and `gen_tables.py`. | Python 3 |
| `tools/hub` | [The hub](hub.md) (port 8789): one page that starts, stops and links the wiki and the sketch tool and renders the other docs; `Bonkscape Hub.cmd` in the repo root launches it. `export_wiki.py` writes BSWiki as a static site for hosting. | Python 3 |
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
| `Anim.cs` | Frames and framemaps; applies the first frame of a stand sequence so models don't T-pose. |
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
3. `Rows.Build()` (lookups over phase-1 rows), `Bonk.Init()` (Lumbridge's `EMap` from `maps.bonk_base_map`),
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
| `enemies` | Each phase-1 enemy row: its NPC, then each `osrs_npc_alternates` id (if `UseStandIns`), first that builds. |
| `players` | Each adventurer from kits + worn items in the stand pose; retried without worn items whose models are missing. |
| `items` | Meshes and inventory icons for weapons, passives, drops and evolutions, and every coin stack variant of item 995. |
| `sprites` | Weapon/evolution icon sprites, prayer icons and overheads, skill icons, UI sprites; fonts. |
| `objects` | Map props, skilling node objects, fishing spot NPCs. |
| `sounds` | Weapon, prayer and audio-row sound effects, synthesised. |
| `ready` | `Ready = true`, summary logged, missing assets logged. Then, if `Map.RealLumbridge`, the arena. |

The arena build runs `WorldBuilder.Build` over `maps.lumbridge.osrs_area` (tracking objects named Tree, Oak and Rocks),
gives up if any region is missing, renders the minimap and hands both to `Systems.Arena`.

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

`Runner` is the per-frame driver. A run is "active" while `Bonk.Active` is true: Megabonk's current map is the
Lumbridge map (`EMap.Forest`) and it isn't the main menu.

**Every frame (`Update`):**

1. Once: log which shaders exist; when the cache is ready and the data applied, `Content.ApplyIcons()` and pass
   `osrs-cache`.
2. `TestMode.Tick`, `OsrsAudio.EnsureAttached` (keeps the mixer on the current AudioListener).
3. Stage start: when active and `MyPlayer.Instance` exists and is a new object (first stage, or a new stage), `OnStage`.
4. Run end: when active turns false, `OnRunEnd`.
5. While active: the props/arena timer, `Arena.TryBuild` until it succeeds, `Arena.Tick`, `Pathing.Tick`,
   `Prayer.Tick`, `Skills.GameTick`, `Loot.Tick`, `Skilling.Tick`, death detection.
6. Always: `Skills.Tick` (autosave every 20 s), `Hud.Tick` (skipped when `Debug.OsrsHud` is off; hitsplats, XP drops, health bar timers, dialogues,
   `LevelUpFx.Tick`; outside a run `MegabonkHud.Restore` puts back the Megabonk HUD pieces it hid), `Chat.Tick`.

**`LateUpdate`** (while active): `EnemySkins.LateTick` (models follow enemies, Megabonk renderers stay hidden, hitbox
floor, `Bosses.Tick`), `Arena.LateTick` (see-through walls), `PlayerSkin.LateTick`.

**`OnGUI`**: `Hud.OnGUI` (missing-cache message, the run HUD, or the character select panel; skipped when
`Debug.OsrsHud` is off). Once the cache is ready
it starts `OsrsUi.EnsureLoaded` (the HUD's interface sprites and the `q8_full` font, on a background thread). The run
HUD calls `MegabonkHud.Tick` when `Debug.HideMegabonkHud` is on (finds Megabonk's `HealthUI` and `XpBarUI` every 1.5 s
and hides them; off, the XP bar is never found, so `MegabonkHud.XpProgress` returns -1), places its blocks
with `HudLayout.Arrange` against Megabonk's minimap (`OsrsUi.Minimap`: measured from `MinimapUi.border`'s corners,
retried every 2 s, else estimated) and draws them through `OsrsUi`.

**`OnStage(player)`**: on the first stage of a run, resets the run clock, prayer, evolutions, loot and chat, and posts
the welcome line. Every stage: `Sizing.Measure`, `CameraTweak.Apply`, `PlayerSkin.Apply` (if not skinned yet),
`Skilling.SpawnForRun` (Forest-style nodes around the player, replaced if the arena builds), a 1.5 s timer, and
`Hud.FindGoldCounter` (also clears health bars, XP drops and the minimap measurement for the new stage).

When the 1.5 s timer runs out: if the arena is available, `Arena.TryBuild` is called every frame until Megabonk's
spawn intro has settled (or 8 s pass); otherwise `MapProps.Reskin` dresses the Forest.

**`OnRunEnd`**: saves skills, clears skilling, props, arena, pathing, loot, prayer, the player model and enemy models.
**`OnApplicationQuit`**: saves skills. Exceptions in each callback are caught; the first 20 are logged.

## The arena pipeline (`Systems/Arena.cs`)

1. **Measure**: `Sizing.Measure(player)`; the arena's scale is `Sizing.MetresPerUnit` (Megabonk character height x
   `AdventurerScale` / adventurer height in OSRS units).
2. **Hide the Forest**: every root object with a collider or mesh renderer is switched off (colliders and renderers
   disabled, remembered for restore) unless it holds the player, enemies, cameras, pickups, interactables (chests,
   shrines, the boss portal), UI, or is `WorldCollider`/`WorldEdgeTop`/`PlayerCamera`. The procedural tile roots and
   the grass renderer go too.
3. **Place Lumbridge**: a root object centred on Megabonk's `MapEdges` centre (captured by a `MapEdges.Set` prefix),
   with the spawn tile's ground at the adventurer's feet.
4. **Meshes**: terrain on Megabonk's ground layer (8) with `MeshCollider`s; objects and wall cells on layer 0.
5. **Colliders**: `WorldData.Boxes` (walls, big scenery, trunks, water) as `BoxCollider`s on a **free physics layer**
   (the highest unnamed layer from 31 down to 16), set to collide with the player's and the enemy layer. Megabonk's
   camera (1\|8\|12), spawn raycasts (ground\|object) and projectiles don't test that layer.
6. **Spawn bounds**: `SpawnPositions.FindBounds` is re-run; its postfix sets `minX..maxZ` to the arena minus 2 tiles.
7. **Minimap**: Megabonk's `MinimapMesh` renderers off; a textured quad with Lumbridge's minimap on the minimap layer.
   `Minimap.Render(..., separateIcons: true)` returns the map scene and map function icons separately; they're packed
   into one atlas and drawn as one mesh of quads, which `UpdateIcons` turns every frame to face Megabonk's minimap
   camera, so icons stay upright. `Minimap.Zoom` divides that camera's `orthographicSize`.
8. **Move in**: `TeleportPlayerImmediate` to the spawn tile facing west, then `rb.position` and the transform, repeated
   for 2 s in `Arena.Tick` ([Gotchas](gotchas.md#megabonk-runtime)).
9. **Interactables**: chests and shrines to random open tiles; the `InteractableBossSpawner` to `boss_tile`.
10. **Enemies** already alive are teleported to the player; **skilling spots** are placed on tracked trees, rocks and
    shore tiles.
11. `lumbridge-arena` passes. Any exception: clear Lumbridge and restore the Forest.

Each frame afterwards, `Arena.Tick` catches falls (25 m under the lowest ground: back to the courtyard), and
`Arena.LateTick` turns the minimap icons and hides wall cells whose bounds cross the ray from `PlayerCamera`'s camera
to the adventurer (logging a camera/wall summary every 20 s). `Pathing` searches the tile grid
from the adventurer every 0.5 s or on a tile change, and an `EnemyMovementRb.GetTargetPosition` postfix aims each
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
| `StageData.GetName` | prefix | Systems/Content | Stage names: Lumbridge & Swamp, Lumbridge Swamp, Lumbridge Swamp Caves | none |
| `UnlockUtility.GetAvailableWeapons` | postfix | Systems/Content | Level-up weapon offers: only Bonkscape weapons (in Lumbridge) | `weapon_pool` |
| `UnlockUtility.GetAvailableTomes` | postfix | Systems/Content | Tome offers: only gear passives, one per slot, below max level | `tome_pool` |
| `MyAchievements.IsUnlocked(UnlockableBase, out string)` | postfix | Systems/Content | Bonkscape weapons, tomes and characters count as unlocked | none |
| `Enemy.InitEnemy` | postfix | Systems/EnemySkins | OSRS model, size tier, hide Megabonk's renderer (re-sized in `LateTick` once the hitbox is live) | `enemy_spawn` |
| `Enemy.ReleaseToPool` | postfix | Systems/EnemySkins | Hide the model of a pooled enemy | none |
| `Enemy.DamageFromPlayerWeapon` | prefix + postfix | Systems/Combat | HP before/after: hitsplat and skill XP for damage dealt | `enemy_damaged` |
| `Enemy.EnemyDied(DamageContainer)` | postfix | Systems/Combat | Kill count, prayer potion drops, `osrs-enemy-killed` | `enemy_died` |
| `DamageNumbers.SetDamage(float, Color, Vector3, int)` | postfix | Systems/Combat | Blank Megabonk's damage numbers in Lumbridge | `damage_numbers` |
| `DamageNumbers.SetDamage(string, Color, Vector3, int)` | postfix | Systems/Combat | Blank Megabonk's "-N" player damage text | none (covered by `damage_numbers` in spirit) |
| `PlayerHealth.Damage` | prefix | Systems/Prayer | Protection prayers reduce or cancel damage by monster style; player hitsplat | `player_damage` |
| `PickupManager.SpawnPickup` | postfix | Systems/Loot | Coins and food wear OSRS item models | `pickup_spawn` |
| `Pickup.ApplyPickup` | prefix + postfix | Systems/Loot | Food heals by its row; pickup sounds; `osrs-item-picked` | `pickup_apply` |
| `InteractableChest.Start` | postfix | Systems/Loot | Chests wear the OSRS casket | `chest_spawn` |
| `MoneyFlying.Set` | postfix | Systems/Loot | Flying coins wear the OSRS coin stack | none |
| `MoneyFlying.Pickup` | postfix | Systems/Loot | Coin sound (rate-limited), `osrs-item-picked` | none |
| `InteractableChest.OpenChestImplementation` | postfix | Systems/Evolutions | Try evolutions | `chest_open` |
| `PlayerRenderer.SetCharacter` | postfix | Systems/PlayerSkin | The OSRS adventurer model | `player_model` |
| `MapEdges.Set` | prefix | Systems/Arena | Remember the stage centre | none |
| `SpawnPositions.FindBounds` | postfix | Systems/Arena | Spawn bounds onto Lumbridge | none |
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
| `enemy_damaged` | combat | `Enemy.DamageFromPlayerWeapon` | postfix | OSRS hitsplats and skill XP from damage dealt | <span class="st st-verified">verified</span> |
| `enemy_died` | combat | `Enemy.EnemyDied` | postfix | kill counting, prayer potion drops, test check | <span class="st st-verified">verified</span> |
| `player_damage` | prayer | `PlayerHealth.Damage` | prefix | protection prayers cut damage by enemy style | <span class="st st-verified">verified</span> |
| `damage_numbers` | presentation | `DamageNumbers.SetDamage` | prefix | hide Megabonk's floating numbers where an OSRS hitsplat shows instead | <span class="st st-verified">verified</span> |
| `pickup_spawn` | loot | `PickupManager.SpawnPickup` | postfix | coins and food pickups wear OSRS item models | <span class="st st-built">built</span> |
| `pickup_apply` | loot | `Pickup.ApplyPickup` | postfix | food heals, item pickup sound and test check | <span class="st st-verified">verified</span> |
| `chest_spawn` | loot | `InteractableChest.Start` | postfix | chests wear the OSRS casket model | <span class="st st-built">built</span> |
| `chest_open` | loot | `InteractableChest.OpenChestImplementation` | postfix | evolutions open from caskets | <span class="st st-built">built</span> |
| `player_model` | presentation | `PlayerRenderer.SetCharacter` | postfix | the player becomes their OSRS adventurer model | <span class="st st-verified">verified</span> |
| `level_up` | presentation | `UpgradeButton.SelectUpgrade` | call (test mode) | test autoplay presses the first level-up offer; Megabonk's level-ups otherwise stay as they are | <span class="st st-verified">verified</span> |
| `timer` | presentation | `GameManager.GetAliveTime` | poll | run timer drawn in OSRS's font from Megabonk's run time | <span class="st st-verified">verified</span> |
| `death_screen` | presentation | `DeathScreen.StartDeathScreen` | postfix | Oh dear, you are dead! | <span class="st st-built">built</span> |
| `music` | audio | `MusicController.PlayMusicTrack` | prefix | OSRS music per map when it decodes, else Megabonk's | <span class="st st-built">built</span> |
| `run_started` | systems | `MyPlayer.get_Instance` | poll | a Lumbridge stage begins when Megabonk's player exists on the Lumbridge map: reset prayer, place skilling nodes, start test mode | <span class="st st-verified">verified</span> |
| `map_props` | map | `RandomObjectPlacer.Generate` | poll | after the stage generates, Megabonk's trees, rocks and bushes are drawn with OSRS scenery models (their colliders stay) | <span class="st st-verified">verified</span> |
| `gold_hud` | presentation | `KillsAndGoldCounter.t_gold` | data row | Megabonk's gold number and icon are hidden; the OSRS coin stack for the amount is drawn instead | <span class="st st-verified">verified</span> |
<!-- /gen:hooks -->

## Systems at a glance

| File | System |
|---|---|
| `Systems/Bonk.cs` | Is this a Bonkscape run? (`Active`) |
| `Systems/Content.cs` | Sheets into Megabonk's data; names, icons, level-up pools, unlocks, starting weapons |
| `Systems/Arena.cs` | The real Lumbridge |
| `Systems/Pathing.cs` | Tile-grid pathing for monsters |
| `Systems/MapProps.cs` | Forest fallback: OSRS scenery on Megabonk's props |
| `Systems/EnemySkins.cs` | OSRS monster models, size tiers |
| `Systems/Bosses.cs` | The Giant Mole's dig |
| `Systems/PlayerSkin.cs` | The OSRS adventurer model |
| `Systems/CameraTweak.cs` | `Camera.Distance` |
| `Systems/Combat.cs` | Damage dealt, kills, Megabonk damage numbers |
| `Systems/Prayer.cs` | Protection prayers |
| `Systems/Skills.cs` | Persistent skills, XP table, combat level |
| `Systems/Skilling.cs` | Trees, rocks, fishing spots |
| `Systems/Loot.cs` | Coins, food, caskets, prayer potions |
| `Systems/Evolutions.cs` | Evolutions on casket open |
| `Systems/Hud.cs`, `Chat.cs`, `CharacterSelect.cs` | The OSRS HUD: what to show, from the game's state |
| `Systems/HudLayout.cs` | The HUD's layout and drawing from OSRS's interfaces (160 orbs, 122 XP counter, 162 chatbox, 233 level-up dialogue, 541 prayer book, 161 minimap frame), sprite ids in `UiSprite`. No Unity: also compiled into `bonk.exe` for `uisprites mock`. |
| `Systems/OsrsUi.cs` | IMGUI canvas for `HudLayout`; loads its sprites and fonts; measures Megabonk's minimap |
| `Systems/MegabonkHud.cs` | Hides Megabonk's health bars, XP bar and enemy health bars in a run and restores them after; reads run XP progress and the ability cooldown |
| `Systems/LevelUpFx.cs` | OSRS level-up fireworks (spot animation 199) as a flipbook at the adventurer's feet |
| `Systems/Sfx.cs`, `Core/OsrsAudio.cs` | OSRS sounds through an `OnAudioFilterRead` mixer |
| `Systems/TestMode.cs` | Melty test mode and autoplay ([Testing](testing.md)) |
| `Core/Sizing.cs` | One yardstick: adventurer height, OSRS units to metres, monster tiers |
| `Core/UnityConv.cs` | `MeshData`/pixels into Unity meshes, textures, objects (main thread) |
| `Dev/DataDump.cs` | `Dev.DumpData`: Megabonk's data as JSON |

## Tools (`bonk.exe`)

Run from `src/Bonkscape.Tools`. Most commands find a cache like the plugin does, or use `BONK_CACHE`; outputs go under
`BONK_OUT` (default the current folder).

| Command | Does |
|---|---|
| `bonk preflight <sheets> <interopDir> <devCache> <playerCache\|-> <genOut\|-> <report>` | Checks the sheets, writes the report, `cache_assets.json` and the generated rows |
| `bonk npcs <name...>` / `bonk items <name...>` / `bonk objects <name...>` | Find definitions by name, with model availability |
| `bonk render npc\|item\|icon\|object\|spotanim\|player <id> [yaw pitch]` | PNG renders |
| `bonk sprites <id...>`, `bonk text <font> <text>`, `bonk sfx <id...>` | Sprites, font text, synthesised sounds as WAV |
| `bonk uisprites sheet\|pick\|dump\|info\|iface\|healthbar\|hitsplat\|spotanim\|mock` | Interface sprites for the HUD: contact sheets, dumps, interface layouts, health bars, hitsplats, spot animation frames; `mock [w h]` draws the HUD layout into `mock_WxH.png` |
| `bonk map ...`, `bonk world ...` | Top-down map renders and 3D previews of an area |
| `bonk worldtiles ...` | Tile pyramids for the sketch tool (surface, underground, instances) |
| `bonk worldscan`, `bonk revs` | Check every region decodes; index revisions |
| `bonk locs x0 y0 x1 y1 <name>` | Placed objects by name in an area |
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
