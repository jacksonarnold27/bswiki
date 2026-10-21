# Changelog and patch notes

Every Bonkscape version, newest first. Each entry has:

- **Patch notes**: short and player-facing, safe to paste into a release.
- **Changes**: what changed for developers, and where.
- **Build**: when the zip was made (local time, UTC-5), the commit it was built from (the `1.0.0+<hash>` in the DLL;
  the working tree can be ahead of it) and the commit that holds its code.
- **Test**: the Melty test ([Testing](testing.md#test-history)).

Reconstructed from `git log`, `docs/MODLOG.md`, Melty's release list (changelog text and tests) and the strings
inside each release's DLL in `dist/`. No version has been published yet: every release is a Melty draft.

---

## 0.1.20: monsters on the adventurer's scale

*Build 2026-10-21 06:58, built from `6b33dbe`, code in `782ce3f`. Test `9634e18a`: running.*

**Patch notes**
- Monsters are drawn on your adventurer's own scale, so OSRS's proportions hold between everyone: a guard about as
  tall as you, a goblin about two-thirds of that, a chicken about two-fifths.
- `Models.MonsterSize` (1 = OSRS proportions) replaces `Models.MonsterScale`.

**Changes**
- `Sizing.MonsterMetresPerUnit` is `MetresPerUnit x Models.MonsterSize` (it was `MetresPerUnit / AdventurerScale x
  MonsterScale`): monsters use the adventurer's OSRS-units-to-metres again. The tier ceilings are unchanged.
- Config: `Models.MonsterScale` (1.0, 0.5 to 3) replaced by `Models.MonsterSize` (1.0, 0.3 to 3).
- New `Debug.HideMegabonkHud` (`true`): off, `Hud` skips `MegabonkHud.Tick`, so Megabonk's health, XP and enemy bars
  stay and its XP bar isn't read (`XpProgress` returns -1). It splits the 0.1.17/0.1.18 crash: the main session tests
  0.1.20 with it off.
- Model heights from the cache, as the main session measured them (OSRS units, standing model with the NPC
  definition's width and height scale): Warrior 216, Guard 201, Cow 153, Giant Mole 150, Goblin 129, Giant rat 125,
  Giant frog 85, Chicken 79.

## 0.1.19: a switch for the OSRS HUD

*Build 2026-10-21 06:52, built from `abfc90f`, code in `2445030`. Test `9f22aab1`: 1-run quick check, passed: no crash,
all seven self-checks. The main session ran it with `Debug.OsrsHud=false`.*

**Patch notes**
- New `Debug.OsrsHud` setting (on by default): off turns Bonkscape's OSRS HUD off and leaves Megabonk's HUD as it is.
  For tracking down the crash at start in 0.1.17 and 0.1.18.

**Changes**
- New config key `Debug.OsrsHud` (`true`). Off, `Runner` skips `Hud.Tick` and `Hud.OnGUI`: no HUD drawing, no
  `OsrsUi.EnsureLoaded` (interface sprites and the `q8_full` font), no `MegabonkHud` hiding. `Hud.Init` still
  subscribes to XP drops and level-ups, so the chat line, the level-up sound, `xp-drop` and `LevelUpFx.Play` (which
  renders the fireworks frames on a background thread) still run.

## 0.1.18: no Harmony patch on enemy health bars

*Build 2026-10-21 06:43, built from `d283a13`, code in `1bc777c`. Test `b09071b7`: 1 run, **failed**: the same crash
in `coreclr.dll` (c0000005) 17 s in, before a run started; only `osrs-cache` reported.*

**Patch notes**
- Meant to fix 0.1.17's crash 18 seconds after the game started. It didn't: 0.1.18 crashes the same way.

**Changes**
- `MegabonkHud`: Megabonk's enemy health bars are pooled objects (`EffectManager.AttachEnemyHpBar`), now found with
  `FindObjectsOfType<EnemyHpBar>` every 0.5 s during a run and hidden, instead of the Harmony postfix on
  `EnemyHpBar.Set`. That patch was 0.1.17's only new native detour, and 0.1.17 crashed in `coreclr.dll` 18 s in (the
  commit says as the first enemies spawned); 0.1.18's test crashed the same way, so it wasn't (or wasn't the only) cause.

## 0.1.17: OSRS-styled HUD

*Build 2026-10-21 06:37, built from `92fc0b6`, code in `d283a13`. Test `aebf6011`: 1 run, **failed**: Megabonk crashed
in `coreclr.dll` (c0000005) 18 s in, before a run started; only `osrs-cache` reported.*

**Patch notes**
- An OSRS HUD drawn from your cache's own interface art: hitpoints, prayer and special attack orbs beside the minimap,
  an XP counter with the drops rising into it, and a prayer panel at the bottom right.
- OSRS health bars over monsters you hit, and over your adventurer whenever you're hurt. Megabonk's own bars are
  hidden in Lumbridge and come back on its other maps.
- Level-ups show OSRS's level-up dialogue in the chat box and the level-up fireworks at your feet.
- OSRS's minimap frame round Megabonk's minimap, with a compass that turns with the camera.

**Changes**
- New `Systems/HudLayout.cs` (no Unity; also compiled into `bonk.exe`): the layout from the cache's interfaces (160
  orbs, 122 XP counter, 162 chatbox, 233 level-up dialogue, 541 prayer book, 161 minimap frame), sprite ids in
  `UiSprite` (not rows in `sheets/ui.json`, so the preflight doesn't check them). HUD scale `round(height / 540)`,
  the chatbox one step smaller.
- New `Systems/OsrsUi.cs`: the IMGUI canvas; loads the interface sprites and the `q8_full` font on a background
  thread once the cache is ready (log: `OSRS interface sprites loaded`); measures Megabonk's minimap from
  `MinimapUi.border`'s corners (log: `minimap border corners ...`), else estimates it. The minimap frame and compass
  are drawn only round a measured minimap; north is `Hud.NorthYaw` = 0 (Unity +z).
- New `Systems/MegabonkHud.cs`: in a Lumbridge run hides `HealthUI` (HUD bar and the bar under the adventurer),
  `XpBarUI`'s bar (its level text stays) and enemy health bars (new postfix on `EnemyHpBar.Set`, no `hooks` row);
  restores them once `Bonk.Active` is false (log: `Megabonk HUD restored (N pieces)`). Reads `XpBarUI.desiredRatio`
  and the active ability's cooldown for the special attack orb.
- New `Systems/LevelUpFx.cs` and `Cache/SpotAnimFrames.cs`: spot animation 199 rendered to a flipbook on a
  background thread (log: `level-up fireworks: N frames, S s`), drawn at the adventurer's feet on unscaled time.
- `Hud.cs` rewritten around them (public API unchanged): health bars for 6 s after a hit (30/50/80 px by tier), the
  adventurer's whenever hurt; level-ups open the dialogue for 3 s instead of a 2.2 s banner; `Hud.Banner`
  (evolutions) shows as a dialogue. `CharacterSelect.cs` on an OSRS stone panel.
- `bonk uisprites sheet|pick|dump|info|iface|healthbar|hitsplat|spotanim|mock`; `mock [w h]` draws the HUD layout
  into a PNG. Design notes: `docs/design/ui-style.md`.

## 0.1.16: autoplay opens chests

*Build 2026-10-21 06:07, built from `1ab911b`, code in `d18cdb0`. Test `9e1854a7`: 1-run quick check, passed.*

**Patch notes**
- No change for players: Melty's test autoplay now opens chests, so tests reach caskets and evolutions.

**Changes**
- `TestMode`: in a `ChestWindowUi`, autoplay presses Open, then Take about 3 s later; after 8 s a stuck window is
  discarded and a warning is logged (which would fail Melty's `loader-errors` check, so a stuck chest shows up).

## 0.1.15: OSRS proportions all the way, a closer minimap

*Build 2026-10-21 05:59, built from `6e4df04`, code in `1ab911b`. Test `13a522b9`: 1-run quick check, passed.*

**Patch notes**
- Monsters keep OSRS proportions all the way: they no longer grow to fit Megabonk's oversized hitboxes.
- The minimap is zoomed in towards OSRS's scale (new `Minimap.Zoom` setting, 2.5).

**Changes**
- `Models.HitboxFill` replaced by **`Models.MinHitboxShare`**, default **0** (off). Megabonk's enemy hitboxes are tall
  capsules (5.4 m for a 3 m skeleton), so a hitbox floor undid OSRS proportions; the key was renamed because existing
  configs kept 0.85.
- New `Minimap.Zoom` (2.5, 1 to 6): divides the minimap camera's `orthographicSize`, following any size Megabonk sets.

## 0.1.14: upright minimap icons

*Build 2026-10-21 05:53, built from `a236431`, code in `6e4df04`. Test `77b7beb2`: 1-run quick check, passed.*

**Patch notes**
- Minimap icons (trees, rocks, map functions) stay upright as the minimap turns, like in OSRS.
- Walls in the camera's way hide reliably.
- Elites and minibosses grow only within their size limits once Megabonk enlarges them.

**Changes**
- `Minimap.Render(separateIcons)`: map scene and map function icons come back as icons; `Arena.BuildIcons` packs them
  into one atlas mesh over Lumbridge's minimap, and `Arena.UpdateIcons` turns it to Megabonk's minimap camera every
  frame.
- Walls hide for `PlayerCamera`'s camera (`Camera.main` can be another camera); camera and wall diagnostics in the
  log every 20 s.
- `EnemySkins.FitHitbox`: Megabonk enlarges elites and minibosses after spawn, so the re-size happens when the hitbox
  goes live, re-applying the capped enlargement; logs a `resize ...` line.

## 0.1.13: monster sizes and a closer camera

*Build 2026-10-21 05:41, built from `fe57644`, code in `a236431`. Test `2f85d870`: 1-run quick check, passed.*

**Patch notes**
- Your adventurer is now clearly bigger than ordinary monsters: monsters keep OSRS proportions against Megabonk's
  character, not your enlarged adventurer (in the log: adventurer 4.8 m, guard 2.8 m, goblin 1.8 m, chicken 1.1 m).
- Elites, minibosses and bosses grow only so far (bosses at most 2.2 times your height), so no more castle-sized cows.
- Megabonk's follow camera sits closer (new `Camera.Distance` setting, 0.8).

**Changes**
- `Sizing`: `MonsterMetresPerUnit` (monsters at Megabonk-character scale x `MonsterScale`), `Tier` (normal, elite,
  miniboss, boss), `MaxEnlarge` (1.15 / 1.4 / 1.6 / 2.0 of Megabonk's enlargement), `MaxHeight` (1.1 / 1.35 / 1.7 x
  adventurer, bosses `Models.BossMaxHeight`), `AdventurerHeight` (set by `PlayerSkin`).
- `EnemySkins`: tier from `IsBoss`/`IsStageBoss`/`IsFinalBoss`, `Miniboss*` names, `IsElite`; height capped; the
  hitbox floor can't pass the cap; one log line per enemy type and tier.
- `Models.HitboxFill` default 0.85 to **0.6**. New `Models.BossMaxHeight` (2.2) and `Camera.Distance` (0.8).
- New `Systems/CameraTweak.cs`: scales `PlayerCamera.offset3rdPerson` (Megabonk's is about 11 m) and
  `maxExtraZoomoutDistance` (about 15 m) once per camera, from Megabonk's values; applied every stage.

## 0.1.12: playability pass

*Build 2026-10-21 05:15, built from `179fbb4`, code in `fe57644`. Test `3e8c9d4c`: 1-run quick check, passed.*

**Patch notes**
- Monsters find their way around walls and over bridges in Lumbridge instead of getting stuck.
- More room to run: only buildings, big scenery, tree trunks and water block you now. Fences, railings, hedges, gates
  and small clutter don't.
- Your adventurer, the monsters and Lumbridge are 1.6 times bigger (`Models.AdventurerScale`).
- A prayer bar at the top right shows the three protection prayers with their keys, the active one framed, and
  "Protected!" flashes when a prayer stops a hit.

**Changes**
- New `Systems/Pathing.cs`: breadth-first search from the adventurer's tile over the arena grid
  (`WorldData.CanStep`: wall edges, water, big scenery; diagonals need both side steps), every 0.5 s or on a tile
  change; `EnemyMovementRb.GetTargetPosition` postfix aims monsters at their next tile; direct chase within 3 steps.
- `WorldBuilder.Classify`: only walls, 2x2+ scenery, thin tree trunks and water block; a list of open names (fence,
  railing, hedge, gate, door, stairs, crates, barrels...).
- `Models.PlayerFit` (1.0) **renamed** `Models.AdventurerScale`, default **1.6**. An old config's `PlayerFit` line is
  ignored.
- `Hud`: prayer bar with keys, active prayer framed in gold, `Hud.Protected()` and "Protected!", clearer 45-second hint.
- Release README updated to the real-Lumbridge text (0.1.0 to 0.1.11 all shipped the first README). It still names
  the setting `PlayerFit`, renamed in this version.
- Between 0.1.11 and 0.1.12, not in the plugin: the map sketch tool (`tools/sketch`, `bonk worldtiles`, `0b799aa`,
  `179fbb4`), `bonk worldscan`/`revs` (`6acb56c`), and the preflight against this PC's full RuneLite cache (143/143
  phase-1 assets, `aee5241`).
- Footage review noted the adventurer still read small (the world and monsters scaled with it), which 0.1.13 fixes.

## 0.1.11: Lumbridge passes the publish test

*Build 2026-10-21 03:56, built from `01a00f7`, code in `583d4bd`. Test `09ad9949`: **2 runs x 4 min, passed**, all
seven self-checks, footage reviewed.*

**Patch notes**
- The real Lumbridge, built from your own OSRS cache: the castle, the River Lum and its bridges, the church, the swamp
  and the fields, with Lumbridge's own minimap. Walls in the camera's way step aside.
- Walls, scenery and water have a collision layer of their own, which you and the monsters bump into.

**Changes**
- `Arena.SolidLayer`: collision boxes on the highest unnamed physics layer, set to collide with the player's and the
  enemy layer (they were on layer 0 in 0.1.10).
- MODLOG gotchas 15 to 18 written. After the zip: README rewritten for the real Lumbridge (`fd15cc7`) and
  `maps.lumbridge` marked verified (`3b27fb5`). The 0.1.11 zip still has the old README.

## 0.1.10: see-through walls

*Build 2026-10-21 03:51, built from `d1ffbc6`, code in `01a00f7`. Test `ce9989f6`: passed.*

**Patch notes**
- Walls between the camera and your adventurer step aside, so you can see where you're going.

**Changes**
- `WorldBuilder` emits wall meshes in 8x8-tile cells; `Arena.LateTick` hides cells whose bounds cross the
  camera-to-adventurer ray.
- Colliders moved off the camera's layers.
- `EnemySkins.FitHitbox`: the hitbox floor is applied in `LateTick` once the collider is live.
- Character size measured once.

## 0.1.9: the ground holds

*Build 2026-10-21 03:45, built from `97c29d6`, code in `d1ffbc6`. Test `531bf1f4`: passed, the first real-Lumbridge
build to pass.*

**Patch notes**
- Fixed falling through Lumbridge's ground; monsters now spawn on it.

**Changes**
- `UnityConv`: triangles re-wound after the z flip, so terrain faces up (Unity mesh colliders and raycasts are
  one-sided; ground collision and Megabonk's spawn raycasts went through backward ground).
- Size measured once per run.

## 0.1.8: moving into Lumbridge

*Build 2026-10-21 03:41, built from `39bbd35`, code in `97c29d6`. Test `f9b58412`: failed (kill, pickup, prayer and
XP checks never reported).*

**Patch notes**
- You now start in Lumbridge's castle courtyard reliably, and you're caught if you fall.

**Changes**
- `Arena.TryBuild` waits for Megabonk's spawn intro (on the ground, not teleporting, at most 8 s) before building.
- The move sets the rigidbody position and transform, repeated for 2 s; falls 25 m below the lowest ground return you
  to the courtyard.
- `Sizing.Body` finds the character collider (`playerMovement.playerCollider`, then any upright collider).

## 0.1.7: the real Lumbridge (first try)

*Build 2026-10-21 03:36, built from `23ed7be`, code in `39bbd35`. Test `6c2d57ed`: failed (arena built; kill,
pickup, prayer and XP checks never reported).*

**Patch notes**
- Lumbridge is now the real Lumbridge, built from your OSRS cache as the arena, in place of Megabonk's Forest with
  OSRS trees.
- Your adventurer matches Megabonk's character size; monsters keep OSRS proportions and stand on the ground.
- A quieter HUD: no clock, a short chat box that hides itself, style icons only on the nearest monsters.

**Changes**
- Cache library: `World/Region` (current unnamed region groups and old `m`/`l` files, procedural heights),
  `World/WorldBuilder` (terrain lit and coloured like the client, shaped overlays, objects rotated and mirrored like
  `getModel`, collision boxes, bridges), `World/Minimap`.
- `Systems/Arena`: hides the Forest, places Lumbridge on its ground/object layers, moves spawn bounds, the adventurer,
  chests, shrines, the boss portal (swamp dark hole) and skilling spots; swaps the minimap. New self-check
  `lumbridge-arena`.
- `UnityConv` flips z (OSRS is right-handed; models were mirrored).
- `Core/Sizing.cs`: the adventurer matches Megabonk's character; monsters keep OSRS proportions but never draw smaller
  than their hitbox; feet on the ground. Config: `Models.Scale` replaced by `Models.PlayerFit` (1.0),
  `Models.MonsterScale` (1.0), `Models.HitboxFill` (0.85); new `Map.RealLumbridge` (true).
- `Hud`: no run clock, short chat box (8 s, repeats collapse), style markers on the nearest 10, 45-second key hint.
- Sheets: `maps.osrs_area`, `spawn_tile`, `boss_tile`; the preflight builds the arena from both caches and checks
  the tiles. Tools: `bonk world`, `bonk locs`; `bonk map` through the library.

## 0.1.6: diagnostic build (not for players)

*Build 2026-10-21 03:13, built from `23ed7be` with uncommitted probe code. Test `4038aeb7`: failed as expected (its
probe check never reported; the six normal checks passed).*

**Patch notes**
- Not for players: a build that logs how Megabonk builds its stage and tests a replacement world.

**Changes**
- A stage probe: logged Megabonk's map generation (layers, masks, colliders, bounds, `MapEdges` centre, interactables)
  and placed a test slab to see whether enemies reach it (`probe-enemies-on-slab`). What it found became MODLOG
  gotcha 15. The probe code wasn't kept.
- Included `81a3789`: Megabonk's own "-N" player damage text hidden (the OSRS hitsplat shows the hit); the test-mode
  prayer potion boost stops after the first potion (autoplay was flooding the chat). Sheet statuses set; MODLOG
  started.
- `bonk map` (`23ed7be`): top-down renders of OSRS regions from the cache.

## 0.1.5: first complete version

*Build 2026-10-21 00:28, built from `2aca038`, code in `6febbfd`. Test `00b12845`: **2 runs x 4 min, passed**, all six
self-checks, footage reviewed.*

**Patch notes**
- Lumbridge & Swamp with OSRS monsters, scenery, adventurers, weapons, gear, prayers, skills, hitsplats, XP drops and
  sound effects, all read from your own OSRS install.
- The Giant Mole digs: it burrows and comes up next to you, more often when hurt.

**Changes**
- `Systems/Bosses.cs`: the Mole's dig from `bosses.attacks` (`burrow_teleport_every_12s`, 1.2 s telegraph, faster
  below 50%).
- Autoplay takes the first offer of shrine windows (`BaseEncounterWindow.ChooseOffer`).

## 0.1.4: OSRS scenery, coins and the death screen

*Build 2026-10-21 00:21, built from `2aca038`, code in `6febbfd`. Test `196b766b`: passed.*

**Patch notes**
- Megabonk's trees, rocks and bushes look like OSRS trees, rocks and bushes.
- An OSRS coins counter, and "Oh dear, you are dead!".

**Changes**
- `Systems/MapProps.cs`: Megabonk's props drawn with OSRS scenery models after the stage generates (colliders kept).
- `Hud`: OSRS coin stack in place of `KillsAndGoldCounter`'s number and icon; the OSRS-font run timer now reads
  Megabonk's `GameManager.GetAliveTime`.
- `DeathScreen.StartDeathScreen` postfix; autoplay restarts after death.
- Run start keyed off `MyPlayer.Instance`; fishing spots use their OSRS NPC model.

## 0.1.3: OSRS proportions

*Build 2026-10-21 00:13, built from `7b77aa6`, code in `2aca038`. Test `a5e4376c`: passed.*

**Patch notes**
- Monsters and your adventurer have OSRS proportions.

**Changes**
- `Models.Scale` (1.15): OSRS models sized at 96 OSRS units per metre times the setting, times the enemy's scale.
- Autoplay presses level-up offers (`UpgradeButton.SelectUpgrade`).
- Commit `2aca038` holds all the in-game systems of 0.1.0 to 0.1.3, plus `README.md`, `LICENSE` and
  `tools/package.py`.

## 0.1.2: sizes and facing

*Build 2026-10-21 00:07, built from `7b77aa6`. Test `212af9d8`: passed.*

**Patch notes**
- OSRS models are sized and face the right way; coins look like OSRS coins.

**Changes**
- Model sizing against Megabonk's renderer height (logged per model).
- The screenshot option removed (`ScreenCapture.CaptureScreenshot` is stripped in Megabonk's build).
- Autoplay pick errors handled.

## 0.1.1: the sound mixer

*Build 2026-10-20 23:57, built from `7b77aa6`. Test `3d4554e1`: failed ("Method unstripping failed" errors).*

**Patch notes**
- OSRS sound effects play.

**Changes**
- `Core/OsrsAudio.cs`: sounds mixed into the output from `OnAudioFilterRead` on the AudioListener's object, because
  `AudioClip.Create/SetData` are stripped. Renderer fixes for the IL2CPP build. The Melty test file's presence is logged.

## 0.1.0: first playable build

*Build 2026-10-20 23:47, built from `7b77aa6` with the in-game systems uncommitted. Test `f950c212`: failed (the
`UnityConv` type initializer threw; no self-check reported).*

**Patch notes**
- First playable test build: Lumbridge & Swamp (Megabonk's Forest), OSRS monsters, adventurers, weapons, gear,
  prayers, skills and HUD.

**Changes**
- Plugin systems: `Content` (sheets into Megabonk's data, names, level-up pools), `EnemySkins`, `PlayerSkin`,
  `Combat`, `Prayer`, `Skills` (persistent, OSRS XP table), `Loot`, `Skilling`, `Evolutions`, `Hud`, `Chat`,
  `CharacterSelect`, `TestMode` (Melty self-checks, autoplay), `Core/Osrs` (background decode), `Core/UnityConv`.
- Config: `OSRS.CacheFolder`, `OSRS.UseStandIns`, `Dev.DumpData`, `Dev.AutoStartRun`, `Audio.OsrsVolume`,
  `Prayer.Keys`, and a screenshot option.
- Before it (`7b77aa6`, 23:24): `bonk preflight` and code generation, the sound synthesiser, stand-pose frames, player
  models; phase-1 preflight clean.

## 0.0.1: loader stub

*Build 2026-10-20 22:46, before the first commit (its code is in `408476b`). Test `69badf81`: passed.*

**Patch notes**
- Development build: loads and finds your OSRS files; no gameplay changes yet.

**Changes**
- Stub plugin: reads `OSRS_DIR`/`OSRS_CACHE` from `%LOCALAPPDATA%\Bonkscape\settings.properties`, searches the cache
  folders, logs what it found.
- First commit (`408476b`, 23:13): the OSRS cache reader, the model and icon pipeline (RuneLite's model loader ported),
  the design sheets and the stub plugin.

<!-- sources: src/Bonkscape.Plugin/Plugin.cs -->
