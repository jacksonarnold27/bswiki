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

## 0.5.0: TzHaar

*Build 2026-10-22 03:54, code in `f1c619d`. Test `f40eeddc`: publish test, 3 runs x 2 min, passed. Run 1 Lumbridge
into the Mole's lair, run 2 Morytania with Dharok, run 3 TzHaar City: the city, Tokkul, the TzHaar, the final portal
into the Fight Caves, the waves and TzTok-Jad joining the fight. All 12 self-checks each.*

**Patch notes**
- TzHaar City: the Desert's third stage is the TzHaar's underground city from your cache, with TzHaar-Hur, -Mej, -Xil
  and -Ket, TzHaar-Ket champions as minibosses, Tokkul in place of coins and TzHaar-Hur-Tel standing in for the Shady
  Guy. Lava edges burn (4% of your health a second); walk the middle of the bridges.
- The Fight Caves: TzHaar City's final portal leads into them. Six timed waves (Tz-Kih, Tz-Kek, Tok-Xil, Yt-MejKot,
  Ket-Zek), then TzTok-Jad: a random Magic, Ranged or Bite attack with its OSRS animation, landing after its wind-up
  for most of your health unless the right protection prayer is on, which blocks it completely. Below half health four
  Yt-HurKot come to heal him until you hit them.
- The Fire cape: killing Jad unlocks it for that adventurer for good, and level-ups then offer it (+25 max HP a
  level).

**Changes**
- Maps per stage: `Bonk` keys maps rows by (Megabonk map, stage), with the map's first row for a stage without one;
  `Bonk.StageIndex` is the loaded stage in the map's list (`MapController.GetStageIndex` counts stages played).
  `Rows.Maps` holds every phase-1 map, lowest stage first. A map's first stage's monster rows go on at load
  (`Content.AtLoad`), a later stage's when it starts (`Content.ApplyStage`, onto the enemy types the stages share),
  a boss arena's never. Stage names and waves per stage row. A later stage on another row gets *Welcome to <map>.*
- New `maps` columns `underground` (built walled and lit as a cave; interactables on roofed tiles too),
  `currency_item` (`Osrs.CurrencyItem` and `CurrencyName`: ground and flying gold and the HUD label; 995 when 0) and
  `shopkeeper_npc` (`InteractableShadyGuy.Start` postfix: the NPC over the Shady Guy, at the adventurer's height).
  New `bosses` columns `arena_waves`, `boss_at`, `attack_every_ms`, `healers`, `prayer_blocks_fully`; new
  `passives.unlocked_by`. Rows: `tzhaar_city` (Desert stage 2, (2432, 5056)-(2559, 5183), Mor Ul Rek, Tokkul,
  TzHaar-Hur-Tel), five TzHaar monsters, seven Fight Caves monsters keyed by `tztok_jad_boss`, TzHaar City's waves,
  `tztok_jad_boss` (the Fight Caves (2368, 5056)-(2431, 5119), six waves, Jad at 120 s, random Magic 2656, Ranged
  2652 and Bite 2655 every 4.8 s, four Yt-HurKot at half health) and `fire_cape` at phase 1. Preflight: a monster's
  `maps` may name a `bosses` row; hyphenated track names (`mor-ul-rek`) are found.
- New `Systems/BossFight.cs`: a lair's waves (`BeginArena` from `Arena`, `Tick` from the run loop, `SpawnAs` through
  `EnemySkins.NextRow`) with the boss held (invulnerable, speed 0, model hidden) until `boss_at`; scripted attacks
  (`TickBoss`: Megabonk's special attacks off and its touches dropped in `Prayer`'s damage prefix; the next attack 4.8
  s after a hit lands; the hit, 55-85% of max hp, through `PlayerHealth.Damage` with the attack's style for prayer;
  `prayer_blocks_fully` blocks it all); healers (`Pathing` walks them to the boss, 2% of its max hp every 1.2 s
  within 4 m, drawn off by a weapon hit in `Combat`).
- New `Systems/LavaBurn.cs` (`WorldData.FlagLava`: overlay texture 31, not on bridges): 2.4% of max hp per 0.6 s
  within 0.35 tiles of lava, damage source `lava`, which `Prayer` leaves alone. New `Systems/Unlocks.cs`:
  `%LOCALAPPDATA%/Bonkscape/unlocks.json` per adventurer, `Unlocks.BossDied` from `Combat`'s kill postfix, gear
  offers leave locked passives out. `Arena` places a last stage's `InteractableBossSpawnerFinal` on the boss tile.
  New patch `PlayerHealth.DamagePlayerExternal` (hook `player_damage_external`).
- Test mode: the map rotation covers all three maps; a later stage's run starts on the first and moves on through
  `LoadNextStage` (`TestMode.JumpToStage`), its monsters' hp and hits without Megabonk's stage share
  (`TestMode.StageScale`). The boss call comes at 40 s on a map whose boss has `arena_waves`, retried each second
  for 30 s, and opens a final portal; Melty runs play arenas at x0.25 (`ArenaTimeScale`). The test casket runs at 30
  s there and is retried every 3 s for 30 s (the first 0.5.0 test, `f9cc7928`, lost `evolution` in its TzHaar run
  to the final portal's stage reload). Autoplay prays on a boss's wind-up (`Prayer.AutoplayBraceFor`); the lethal-hit
  guard covers `DamagePlayerExternal` and heals from 0 hp. Optional checks `arena-waves`, `arena-boss-released`,
  `boss-healers`, `boss-healed`, `boss-blocked-fully`, `lava-burned`, `unlock-earned`; scenario key
  `arena_time_scale`, steps `kill` and `lava`; scenarios `tzhaar-city`, `fight-caves`, `fight-caves-quick`.

## 0.4.0: special attacks

*Build 2026-10-22 02:11, code in `ea2a255`. Test `4ff4bb99`: publish test, 2 runs x 2 min, passed. Run 1 Ranger on
Morytania (the spec orb, a spec switch, the Godsword shard among the offers, Dharok); run 2 Warrior on Lumbridge,
starting facing north, with Energy Drain and Sever fired in the Mole's lair. All 12 self-checks each, `spec-fired`
among them.*

**Patch notes**
- Special attacks: **F** fires your armed weapon's spec and **Q** switches which; the special attack orb shows the
  energy (full in 60 s, a little more per kill). Nine weapons have one, OSRS's Energy Drain, Sever, Snapshot, Toxic
  Siphon, The Judgement and Slice and Dice, and Bonkscape's own Wildfire, Deep Freeze and Tidal Chain.
- New weapons: the Armadyl godsword (the Godsword shard evolves it into the Armadyl godsword (i)), Dragon claws and
  the Scythe of vitur.
- Your adventurer holds the weapon whose attack is playing.
- Every run, restart and move into the Mole's lair starts with the camera facing north, looking down 45 degrees (65
  for the far camera).

**Changes**
- New `Systems/Specials.cs` (no Harmony patches): energy 100, refilled at 100/60 a second, plus 0.25 a kill from a
  budget that builds at the refill rate (at most 5); `[Special] FireKey` (`F`) and `SwitchKey` (`Q`); reach 5 tiles
  for melee and 12 otherwise, capped by a cone's or freeze's radius. `weapons.spec_effect` steps (`hit`, `hits`,
  `aoe`, `slow`, `stun`, `freeze`, `heal`, `cone`, `chain`) go through `Enemy.DamageFromPlayerWeapon` with the
  weapon's average of its last 20 hits times the step's multiplier (`Combat.RecordHit`, `Combat.SourceById`), only on
  a monster whose `CanTakeDamage` is true. Megabonk's keyboard bindings are logged once, with a warning if they share
  the spec keys. The special orb shows `Specials.Energy`, lit when the armed spec can fire, with the armed weapon's
  icon; Megabonk's dash cooldown no longer shows there.
- New `weapons` columns `spec_name`, `spec_effect`, `spec_cost`, `spec_anim`, `spec_spotanim`, `spec_spot_on` (the
  preflight checks the effect grammar). New `Systems/SpotFx.cs`: spot animations rendered off the main thread (all
  specs' at load) and drawn at the adventurer's or the target's feet.
- Phase-1 rows: `scythe_of_vitur` (`Scythe`, 80 Attack and 90 Strength), `armadyl_godsword` (`HeroSword`, 75
  Attack), `dragon_claws` (`Dexecutioner`, 60 Attack), the `godsword_shards` passive (Megabonk's Knockback tome) and
  the `godsword` evolution (Armadyl godsword + Godsword shard: Armadyl godsword (i), damage x1.5).
- The weapon in hand: `Osrs` builds each adventurer once per weapon (`PlayerWeaponBodies`: the weapon slot swapped
  for its item, the shield off for a two-handed one) with that weapon's sequences and spec; `PlayerSkin` shows the
  body of the weapon whose attack plays, made on first use, at the own body's scale and feet. Optional check
  `weapon-in-hand`.
- `CameraTweak.FaceNorth` once the adventurer lands on the spawn tile and in a boss's lair: `PlayerInput`'s
  `cameraRotation` and `desiredCameraRotation` to (pitch, yaw 0). New `[Camera] NearPitch` (45) and `FarPitch` (65),
  5 to 85; the toggle key sets the pitch too.
- Test mode: `spec-fired` replaces `osrs-cache` among the 12 recipe checks; optional `spec-switched`,
  `spec-<weapon>` and `weapon-in-hand`. Scenario suites go back to Megabonk's main menu between scenarios
  (`TransitionUI.LoadMenu`), and scenario runs set Megabonk's selected-character preference.
- `Runner`: the extra skills save every 60 s (30 s in tests) that 0.3.0 added is gone; `Skills.Tick` saves every 20 s
  as before.
- `bonk find <interopDir> <name>`: every game type with a method or property of that name.

## 0.3.0: the testing tools milestone

*Build 2026-10-22 00:33, code in `2ae6424`. Test `00b2a313`: publish test, 2 runs x 2 min, passed. Run 1 Mage on
Morytania (an evolution, no death), run 2 Ranger on Lumbridge into the Mole's lair; all 12 self-checks each.*

**Patch notes**
- The OSRS HUD follows Megabonk's minimap after you change the resolution or resize the window (it kept the first
  size's position).
- Otherwise no change for players: 0.3 is the testing tools milestone.

**Changes**
- `OsrsUi.Minimap`: measured again when the screen size changes.
- `Arena`: a map whose Megabonk stage never calls `MapEdges.Set` (the Desert: Morytania) is centred on the origin, as
  the Forest's is, never on a centre an earlier map left (log *"arena centred on X,Z (...)"*). Found by the dead-hook
  report; every map measured so far is centred on the origin, so nothing moved in practice.
- `Runner` also saves skills every 60 s during a run (30 s in test runs and scenarios). `Skills.Tick` already saved
  every 20 s while XP changed, so saves come no less often than before.
- Test runs: `TestGuard`, the lethal-hit guard (a hit that would kill leaves 1 hitpoint, then heals to half and is
  logged; every other hit lands in full); `DeadHooks`, a counting prefix on every patched method and a report of the
  patches that never ran; optional `run-restarted` check.
- Scenario test mode (`Systems/Scenario.cs`): while `BepInEx/config/Bonkscape/scenario.json` exists, the game starts
  into its map, stage and adventurer and runs timed steps (call the boss, spawn monsters, give weapons, preset skill
  levels that are never saved, force drops), writing `scenario-report.txt`; `tools/loop.py` runs it locally, with a
  save guard. `Shot` takes in-game screenshots for scenarios; `Dev.Timing` logs startup and run timing marks;
  `HudLayout.Boxes`/`Problems` lay out the HUD for the UI test.
- `bonk` tools: render colours, `tiles` rim walls, `boxes` grid only, `npcs`/`items` by id.

## 0.2.12: no holes in the ground

*Build 2026-10-21 22:30, code in `4e610d5`. Test `80711319`: publish test, 2 runs x 2 min, passed. Run 1 on Morytania,
run 2 Mage on Lumbridge with the lair fight and no falls; all 12 self-checks each.*

**Patch notes**
- No more falling through gaps in the ground: tiles with no floor are walled off, in the Giant Mole's lair and on
  every map.

**Changes**
- `WorldBuilder`: a tile whose ground draws nothing on either level isn't walkable, and beside ground it gets a long
  tall box, marked solid so pathing goes round it, on every map (Morytania has 133). `bonk world` takes a 9th
  argument `cave` (built as a boss lair).

## 0.2.11: stilt house walls, a closed-in lair

*Build 2026-10-21 22:19, code in `82ad139`. Test `036cdc9a`: publish test, 2 runs x 2 min, passed. Run 1 Ranger on
Morytania (Canifis's stilt houses walled), run 2 on Lumbridge with the lair fight; all 12 self-checks each.*

**Patch notes**
- Canifis's stilt houses have their walls and windows again.
- In the Giant Mole's lair you can't climb the cave walls and fall out, and monsters no longer appear on top of them.

**Changes**
- `WorldBuilder`: walls and wall decorations (loc types 0 to 4 and 9) on a level-1 tile next to a bridge tile are
  built at that level (a stilt house's walls); `WorldOptions.WallOffBlocked` (caves): unwalkable tiles beside
  walkable ones become long tall boxes, marked solid for pathing.
- New postfixes on `SpawnPositions.GetEnemySpawnPosition`, `GetEnemySpawnPositionBiased` and
  `GetEnemySpawnPositionAroundPoint`: in a boss's lair, a spawn off the cave floor moves to a reachable floor tile.
- Tools: `bonk members <interopDir> <TypeName>` (a game type's methods and fields), `bonk tiles <x0 y0 x1 y1>`
  (bridge flags and wall locs by level), and `bonk world`'s `cave` option.

## 0.2.10: the Giant Mole fights in its lair

*Build 2026-10-21 22:04, code in `2d3823b`. Test `ae55a279`: publish test, 2 runs x 2 min, passed. Run 1 Mage on
Morytania, run 2 Ranger on Lumbridge, where the boss call moved the fight into the Falador Mole Lair and the Mole dug
to another spot; all 12 self-checks each. Where Megabonk's next-stage portal appears after the Mole is killed in its
lair is unconfirmed: no test has killed it.*

**Patch notes**
- Summoning the Giant Mole takes the fight into its lair, the Falador Mole Lair from your own OSRS cache, behind the
  loading screen. When it digs, it comes up somewhere else in the lair that you can walk to.
- Dying in the lair restarts the run on Lumbridge.

**Changes**
- `bosses.osrs_arena`, `arena_spawn_tile`, `arena_boss_tile` (the Giant Mole: 1728, 5120 to 1791, 5247; spawn
  1752, 5152; boss 1759, 5188), built at load like a map and keyed by the boss id (`Rows.BossArenas`); only the
  regions the area covers must exist. The preflight checks a lair like a map.
- `Arena.BossSummoned` (from `EnemySkins`, when the map's boss with a lair is skinned): on the next tick the fight
  moves to the lair under the loading cover, the boss to its tile; a cave look (black fog, a black copy of the
  stage's skybox, dimmer ambient, vertex colours at 82%), with each stage's look kept at load (`Content.KeepLook`)
  and put back by `LeaveBossArena` at each stage start and run end. Optional checks `boss-arena` and `lair-dig`.
- `Bosses`: in the lair the Mole resurfaces on a random tile 8 to 18 steps' walk from the adventurer
  (`Pathing.RandomReachable`).
- Test runs (2 minutes now): until `prayer-blocked` passes, prayer doesn't drain and autoplay prays against the
  nearest monster within 9 m every second.

## 0.2.9: the camera settles under the cover

*Build 2026-10-21 21:41, code in `526dca6`. Test `239639c9`: failed. Run 1 of 2 x 2 min reported 11 of the 12
self-checks: `prayer-blocked` never came in a 2-minute run.*

**Patch notes**
- The loading screen stays up until the camera has settled, so a run opens cleanly on the OSRS map.

**Changes**
- `Arena`: the cover stays 1 s after the adventurer lands on the map, while Megabonk's follow camera swings in.
- Test mode for 2-minute runs: the boss call at 1:15 (was 2:30), the casket fallback at 45 s (was 75 s).

## 0.2.8: a loading screen instead of Megabonk's stage

*Build 2026-10-21 21:31, code in `6ce3408`. Test `52687ce4`: publish test, 2 runs x 4 min, passed. Run 1 Mage on
Lumbridge, run 2 Ranger on Morytania; all 12 self-checks each, no loader errors.*

**Patch notes**
- A run opens straight into Lumbridge or Morytania behind OSRS's *Loading - please wait.* screen, instead of showing
  Megabonk's stage for a few seconds first; the same after a death restart.
- Morytania is built at load with Lumbridge, so its first run doesn't wait for it.
- Morytania's sky is darker, close to black.

**Changes**
- Every phase-1 map's arena is built at `ready` (Lumbridge first); `Arena.Prewarm` makes every built map's meshes in
  the menu, the current map's first.
- The loading cover: `Arena.BeginCover` in `OnStage` when the map has an arena, off when the adventurer stands on
  the map, the build fails or times out, the arena fails or the run ends, and after 20 s at most
  (*"arena: loading cover off after N s (why)"*). `Hud.DrawLoadingCover`: black, with OSRS's loading box. While it's
  up, `Prewarm` gets 40 ms a frame; the arena path's props timer is 0.3 s (1.5 s without an arena).
- `ApplySky`: more skybox tint property names (`_TintColor` and others, for the Desert's cubemap skybox), exposure
  0.12.
- Test autoplay: a chest's Open, Take and Discard each in their own try, logged as info (Melty fails a run on any
  warning from the mod).

## 0.2.7: unstuck on hills, a far camera, Morytania's sky

*Build 2026-10-21 21:19, code in `430c7df`. Test `46bd824f`: failed. 2 runs x 4 min, all 12 self-checks in both, but
run 2 (Morytania) failed `loader-errors` on test autoplay's chest warnings.*

**Patch notes**
- You no longer get stuck on Lumbridge's hills, at the castle steps or beside fountains.
- Press `V` to switch between the near and a far camera.
- Morytania is a little easier and under a dark purple sky.

**Changes**
- New `Systems/PlayerMoveFix.cs`, while an arena is up: `PlayerMovement.maxSlopeAngle` raised to 62 degrees
  (restored after); after 0.25 s of holding a direction without moving, a knee-height raycast on the solid and ground
  layers slides the adventurer along a wall, or, with nothing there, hops it up (0.45 s apart). Log every 30 s:
  *"player movement assist: N slides along walls, M hops up ledges so far"*.
- `WorldBox.Round`: square scenery footprints (fountains, statues) become an upright `CapsuleCollider` (radius 0.45
  of the side) instead of a box.
- New `[Camera] FarDistance` (1.6, 0.4 to 3) and `[Camera] ToggleKey` (`V`): `CameraTweak.Tick` flips the camera
  and the chat says *Camera: far.* or *Camera: near.*
- New `maps.difficulty` (Morytania 0.8): ordinary rows' hp and damage times it; minibosses and bosses from Megabonk's
  own stats times it. New `maps.sky` (Morytania `#170d22`): `Content.ApplySky` tints the stage's fog, a copy of its
  skybox, its ambient and its sun; `Arena` sets fog and skybox again when the arena is built. The preflight checks
  both columns.
- `bonk boxes <area> <cx cy r>`: the arena's colliders and terrain heights around a tile, and the steepest slopes.

## 0.2.6: only the recipe's checks reach Melty

*Build 2026-10-21 11:00, code in `e49e81c`. Test `e5b8ef9b`: publish test, 2 runs x 4 min, passed. Run 1 Ranger on
Lumbridge (with the Giant Mole), run 2 Warrior on Morytania; exactly the 12 recipe checks reported in each.*

**Patch notes**
- No change for players: test runs report exactly the recipe's checks to Melty.

**Changes**
- `TestMode.InRecipe`: only checks in `TestMode.Checks` (the recipe's 12) are written to Melty's checks file, for
  passes, fails and the replay when the test file turns up. Optional checks (`skill-rules`, `gear-slot-rules`,
  `boss-spawned`, `skilling-gathered`) are only logged, as *"check passed: <name> (optional, log only)"*. Melty
  reads at most 12 check lines, so an optional pass written early pushed a required one out.

## 0.2.5: an XP rules self-check

*Build 2026-10-21 10:50, code in `e5f1d61`. Test `a6122d1e`: 2 runs x 4 min, no crash, the game fine in both
(Mage on Lumbridge, Ranger on Morytania), but neither run counted: the new optional `skill-rules` line took one of
the 12 check lines Melty reads, so run 1 lost `evolution` and run 2 `osrs-item-picked`.*

**Patch notes**
- No change for players: test runs also check the skill XP rules.

**Changes**
- `Skills.SelfTest`, run once 2 s into a test run on scratch data (never the saves): level 99 needs 13,034,431 XP
  and 13,034,430 is still 98; Hitpoints starts at 1,154 XP (level 10); the 200M cap (`Skills.MaxXp`); Hitpoints XP
  is a third of combat's; a new adventurer is combat 3 and a maxed one 126; damage trains Strength (aggressive),
  Attack (accurate), Defence (defensive) and Magic; an unreadable save is set aside. All hold: optional check
  `skill-rules` passes; otherwise it fails with the reasons.

## 0.2.4: Dharok and Ahrim in their armour

*Build 2026-10-21 10:38, code in `1ad4559`. Test `3bf7479b`: publish test, 2 runs x 4 min, passed. Run 1 Warrior on
Lumbridge with the Giant Mole; run 2 Mage on Morytania, where the boss call brought Dharok in his own armour. All 12
self-checks each.*

**Patch notes**
- Dharok the Wretched and Ahrim the Blighted wear their own Barrows armour; they were drawn pink.
- When an OSRS map can't be built, its fallback uses its own scenery (a second map falling back in one session got
  the first one's).

**Changes**
- `enemies.model_ids` `worn:<item ids>` (Dharok `worn:4716,4720,4722,4718`, Ahrim `worn:4708,4712,4714,4710`):
  `Osrs.BuildWorn` builds a male body (the Warrior's kits) in that gear in the row's stand pose and bakes its
  `animation_ids` (with `attack+walk`). Items missing: the NPC model as before (log *"<name>: worn gear not in this
  cache, using its NPC model"*). The Barrows brothers' NPC models are hue 60 (pink) on every face in the cache. The
  preflight checks each worn item, and that `model_ids` is `from_npc_def` or `worn:`.
- `MapProps` reads `maps.props` for each map (before, the first map to fall back fixed them for the session).
- `maps.morytania` status `verified`; `cache_assets` rows for the eight worn items.
- `bonk modelcolors <model...>`: a model's format, face count and commonest face colours.

## 0.2.3: test runs call the stage boss

*Build 2026-10-21 10:20, code in `012e7ea`. Test `7c7d1d9f`: 2 runs x 4 min, all 12 self-checks in each, no crash.
Run 1 (Ranger on Lumbridge) reviewed: the boss call brought the Giant Mole at 2:30 and it dug once (log). Run 2
(Warrior on Morytania) reviewed: the boss call brought Dharok at the Barrows, drawn pink. A publish test (graduates).*

**Patch notes**
- No change for players: test runs now open the boss portal, so the Giant Mole and Dharok get tested.

**Changes**
- `TestMode.CallBoss`: 2:30 into a test run (`runTimer` > 150 s), the adventurer is moved next to Megabonk's
  `InteractableBossSpawner` and the portal's `Interact()` is called; logged as *"test mode: opened the boss portal
  at ..."*.
- New optional self-check `boss-spawned` (not in the recipe's checks): `EnemySkins` passes it when it skins a
  boss-tier enemy that isn't a `Miniboss*` (log: *"boss skinned: <Megabonk enemy> as <row>"*).

## 0.2.2: Morytania without the freeze

*Build 2026-10-21 10:12, code in `5c89010`. Test `4e2dd148`: publish test, 2 runs x 4 min, passed. Run 1 Mage on
Lumbridge, run 2 Ranger on Morytania, all 12 self-checks each; footage reviewed.*

**Patch notes**
- Morytania no longer stops the game while it's made: its first run plays on in Megabonk's desert for a few
  seconds, then Canifis appears.
- Morytania's ore rocks are back, so mining works there.

**Changes**
- `Arena.Prewarm(8)`, called every frame from `Runner.Update` once the cache is ready: makes the current map's Unity
  meshes a few at a time within 8 ms (terrain first, kept readable for its colliders; scenery and walls uploaded
  without a CPU copy), so Lumbridge's are made in the menu and another map's while its first run waits.
  `Arena.TryBuild` waits up to 30 s more for them, then makes the rest at once. Log: *"Morytania: N meshes made a
  few at a time (M ms of work)"*. In 0.2.1 they were made in one go when the arena was placed (Morytania's took
  3.5 s on the main thread).
- `WorldBuilder`: the detail budget spares objects whose name is in `WorldOptions.TrackNames` (trees, ore rocks), so
  big maps keep their skilling spots; 0.2.1's first Morytania run found only 5 plain rocks.

## 0.2.1: Morytania

*Build 2026-10-21 09:59, code in `581c8c0`. Test `008a84a6`: publish test, 2 runs x 4 min, passed. Run 1 Warrior on
Lumbridge, run 2 Mage on Morytania, all 12 self-checks each; footage reviewed (the Mage died three times on
Morytania). The first 0.2.1 zip carried a DLL built before the last edits (it said 0.2.0), and its test played
Lumbridge in both runs; `581c8c0` fixed that, the map rotation and `tools/package.py`, and was rebuilt as 0.2.1.*

**Patch notes**
- Morytania, a second OSRS map, on Megabonk's Desert: Canifis, Mort Myre and the Barrows, 384 x 450 tiles from your
  OSRS cache, with its own monsters (Myre blamish snails, bats, crawling hands, ghouls, Loar Shades, banshees,
  vampyres, Ahrim the Blighted, the Vyrewatch) and Dharok the Wretched as its boss.
- Arrows, coins and food are drawn at their proper size (flat ones were fitted by their height and came out huge).
- Monsters swing at you as soon as they reach you, and banshees and guards as they shoot.
- New settings for big maps: `Map.DrawDistance` (200 m) and `Map.LargeMapMinFaces` (300).

**Changes**
- Sheets: `maps.morytania` (Desert stage 0, `osrs_area` 3400, 3158, 3783, 3607, spawn 3494, 3488 in Canifis, boss
  tile 3565, 3290 at the Barrows, music *Village*, fallback enemy `ghoul`); 12 new `enemies` rows (Myre blamish snail,
  bat, crawling hand, ghoul, Loar Shade, banshee, vampyre juvenile, juvinate and feral vampyre, Vyrewatch and
  Vyrewatch Sentinel on `MinibossGolemSand` and `MinibossScorpion`, Dharok on `Pharaoh1`/`Pharaoh2`) and Ahrim moved to Morytania
  (phase 1); the planned rows whose bases Morytania now uses moved (green dragon to `GhostPurple`, revenant imp to `Ghost`,
  TzTok-Jad to `Pharaoh3`); Morytania's `waves`; `maps.barrows` to Desert
  stage 1 and `god_wars` to the Graveyard.
- One arena per phase-1 map: `Rows.Maps` (one row per Megabonk map) and `Rows.Current`; `Bonk.Active` is true on
  any of them and sets `Rows.Current`. Per-map spawn and boss tiles, props, skilling nodes, fallback enemy, welcome
  line and music track.
- `Content`: each enemy row joins the pools of its own `maps`; unmapped Megabonk enemies leave both maps' pools;
  `ApplyWaves` per map now also fills `EMiniBoss` events from `miniboss` rows (each row's `Miniboss*` base) and logs
  *"waves: <map> on Megabonk's <EMap> stage N: M timeline events set"*; stage names per map.
- `Osrs.EnsureArena`/`Osrs.Arenas`: Lumbridge's arena is built at load; another map's on a background thread on its
  first run, one build at a time. `Arena.TryBuild` waits up to 45 s for it, then keeps Megabonk's stage. Maps over
  40,000 tiles get a detail budget: `WorldOptions.SkipGroundDecor` and `MinObjectFaces` = new `[Map]
  LargeMapMinFaces` (300, 0 to 5000). `bonk world` takes the same two options.
- `Arena`: meshes made once per map and kept; colliders grouped on one object per 32-tile chunk and turn; scenery
  and walls past new `[Map] DrawDistance` (200 m, 0 to 5000; 0 draws everything) hidden, checked every 0.25 s.
  `[Map] RealLumbridge` now covers both maps. Self-check `lumbridge-arena` renamed `osrs-arena`.
- `UnityConv.Longest`/`AttachFit`: models fitted by their longest side, not their height. Pickups (`Loot`) use it;
  projectiles are a quarter of a tile along their longest side (a third, by height, before), centred and turned
  along their flight. The minimap texture is copied in one `Marshal.Copy`.
- `EnemySkins.SwingWhenInReach`: a monster starts its attack when within max(1.2 m, 0.4 x its height) + 0.8 m of the
  adventurer, or when its `specialAttackController` starts attacking, not only when a hit lands.
- `Pathing`: the search stays within 48 tiles of the adventurer.
- Test mode: `TestMode.AutoplayMap` alternates the phase-1 maps by the launch rotation; autoplay prays against what
  just hit it (held 6 s) and, until `prayer-blocked` passes, lets monsters of the prayed style reach it.
- `tools/package.py` builds the plugin first and refuses when `Plugin.Version` isn't the version asked for.

## 0.2.0: the animations milestone

*Build 2026-10-21 09:13, built from `4c41ae5`, code in `b57bab5`. Test `04338614`: 2 runs x 3 min. Run 1 reported all
12 self-checks; run 2 all but `prayer-blocked` (and `gear-slot-rules` too). Neither run's footage has been reviewed,
so it doesn't count as a publish test yet.*

**Patch notes**
- The animations release, the same code as 0.1.37: monsters stand, walk, attack and die with their own OSRS
  animations, and your adventurer walks, runs, swings or casts each weapon's OSRS attack (even while running) and dies.
- Also since 0.1.20: the run-start crash fixed, hitsplats on bodies, skills per adventurer, weapon evolutions from
  caskets, OSRS projectiles and combat sounds, skilling markers and richer OSRS colours.

**Changes**
- `Plugin.Version` 0.2.0; no other code changed from 0.1.37.

## 0.1.37: the character panel fits its skills

*Build 2026-10-21 09:05, built from `eec7619`, code in `4c41ae5`. Test `fb5286b9`: 1-run quick check, passed (all 12
self-checks).*

**Patch notes**
- The character select panel is as wide as its longest skill name, so *Woodcutting* no longer runs into its level.

**Changes**
- New `HudLayout.DrawCharacterPanel`: the Bonkscape panel's columns are sized to the longest skill name plus a
  two-digit level; `CharacterSelect` hands it the hovered adventurer's skill lines. `bonk uisprites mock` draws it.
- `Content` (`GetAvailableTomes` postfix): in test mode, the gear offers the slot rules left out are logged
  (*"gear offers: left out ..."*) and `gear-slot-rules` passes (it isn't in the recipe's check list).
- Sheets: `characters.ranger` and `characters.mage` are `verified`.

## 0.1.36: OSRS projectiles and combat sounds

*Build 2026-10-21 08:59, built from `c8a564b`, code in `8f67903`. Test `a7436954`: 1-run quick check (4 min), passed
(all 12 self-checks).*

**Patch notes**
- Your weapons fire OSRS projectiles: rune arrows, dragon darts, chinchompas and each spell's graphic.
- Each weapon plays its OSRS attack sound, and hitting and killing monsters plays OSRS's hit and kill sounds.

**Changes**
- New `Systems/Projectiles.cs`: from the `WeaponAttack.SuccessfullySpawnedProjectile` postfix, each projectile gets its
  `weapons.osrs_projectile_or_spotanim_id` model (an item, or a spot animation's), about a third of a tile long with
  its longest axis along the flight; Megabonk's own projectile effects stay. The weapon's `sfx_id` plays at most every
  0.3 s per weapon.
- `Osrs` builds the projectile item meshes and `SpotAnimMeshes` in the background build.
- `Combat`: `enemy_hit` sound on a damaging hit (at most every 0.12 s) and `kill` on a death (every 0.2 s).
- Test mode: `TestMode.LateTick` writes autoplay's movement into `PlayerInput` after Megabonk's own update, so it no
  longer depends on the `PlayerInput.MovementInput` patch; an `animations: ...` summary line in the log.

## 0.1.35: skilling rewards from the sheet, HUD sprites as UI rows

*Build 2026-10-21 08:52, built from `c7c7d98`, code in `c5cdfec`. Test `a4d9016b`: 1-run quick check, passed (all 12
self-checks, `evolution` for the first time).*

**Patch notes**
- No change you'd notice: skilling rewards now come from the drops sheet (still 25 coins and Haste for logs, Shield
  for ore, 20 HP for shrimps).

**Changes**
- `maps.lumbridge.skilling_nodes` entries name a `drop` (*Logs*, *Copper ore*, *Raw shrimps*); `Skilling` applies that
  `drops` row's `effect` string: `gold:N` (coins), `heal:N`, `speed:...` (Megabonk's Haste), `armor:...` (its Shield).
- `sheets/ui.json`: 25 `hud_sprite` rows (orbs and their icons, the XP button, counter tile, total XP icon, prayer
  glow, minimap frame, compass, the three health bar sizes) and `dialogue_font` (`font:q8_full`), so the preflight
  checks every HUD sprite against the caches (`cache_assets.json`: 177 to 202 assets). `ui.run_timer` is phase 3.
- Test mode: 75 s into a run with no casket opened, `Evolutions.TestCasket` does what a casket's Open button does.

## 0.1.34: evolutions on the casket's Open button, true OSRS colours

*Build 2026-10-21 08:46, built from `c751a15`, code in `c7c7d98`. Test `7e4aeda1`: 1-run quick check, failed:
`evolution` never reported (no casket was opened in the run); the other 11 self-checks passed.*

**Patch notes**
- Opening a casket evolves your weapon when it's ready (in 0.1.33 it never did).
- Colours are as rich as in OSRS instead of washed out.
- Skilling spots show their skill's icon, with a progress bar while you gather, and mining names the ore.

**Changes**
- Evolutions run in a `ChestWindowUi.OpenButton` postfix; `InteractableChest.OpenChestImplementation` is a small
  private method IL2CPP inlined, so its patch never ran. `hooks.chest_open` retargeted.
- `UnityConv`: in Linear colour space every OSRS vertex colour channel goes through gamma-to-linear first (log:
  *"colours: Linear colour space, OSRS colours converted from gamma"*).
- `Arena` tracks ore rocks by name (*Copper rocks*, *Tin rocks*, *Iron rocks*, *Clay rocks*, *Coal rocks*) and uses
  them for mining spots, plain *Rocks* only when there are fewer than 4.
- `Skilling`: spots carry their object's name; the mining line names its ore (*stone* for plain rocks);
  `Skilling.ForEachNear` feeds the HUD, which draws the skill icon over usable spots within 10 tiles (30 m at least)
  and a 30 px health bar as the progress bar.

## 0.1.33: clean restarts, more self-checks

*Build 2026-10-21 08:40, built from `094ef01`, code in `c751a15`. Test `9ee50cc1`: 1-run quick check, failed:
`evolution` never reported (chests opened, but the chest hook never ran); the other 11 self-checks passed.*

**Patch notes**
- Restarting after a death starts a clean run: evolutions, prayer and loot reset.
- Megabonk's poison damage shows as OSRS's green poison hitsplat.
- The level-up line reads *"an Attack level"*.

**Changes**
- `Runner`: a stage after the adventurer died counts as a new run (Megabonk's restart keeps the map and only makes a
  new player); the shader report logs the colour space.
- `Combat`: `dc.damageEffect == Poison` draws `hitsplat_poison`. `Hud`: *a*/*an* before the skill name.
- New self-checks: `prayer-blocked` (a protection prayer stopped a hit), `skills-saved` (the save reads back as
  written), `evolution` (a weapon evolved). For `evolution`, the first casket of a test run levels the first
  evolution's weapon to 8 and gives its gear passive at max (`Evolutions.PrepareForTest`).
- New `Dev.ManualTest` (`false`): Melty test runs without autoplay, for hand-over tests; self-checks still written.
- Autoplay checks its way two tiles ahead on the tile grid and turns along walls.

## 0.1.32: weapon attack animations

*Build 2026-10-21 08:33, built from `936a346`, code in `094ef01`. Test `7c981d69`: 1-run quick check, passed (all nine
self-checks, both animation checks).*

**Patch notes**
- Your adventurer swings or casts each weapon's OSRS attack, starting as the weapon fires.

**Changes**
- The adventurer's attack sequence starts from a `WeaponAttack.SuccessfullySpawnedProjectile` postfix (every weapon
  attack, melee swings too, spawns a projectile there); the `WeaponBase.Use` postfix never ran for weapon attacks.
  Repeats are ignored until the swing is over (at most 1.2 s). `hooks.weapon_used` retargeted.

## 0.1.31: OSRS animations

*Build 2026-10-21 08:27, code in `3a3d322`. Test `2e28e80e`: 1-run quick check, failed: `adventurer-animated` never
reported (the weapon hook never ran); `monster-animated` and the other seven self-checks passed.*

**Patch notes**
- Monsters stand, walk, attack and die with their own OSRS animations; the Giant Mole burrows with its own sequences.
- Your adventurer stands, walks, runs and dies with OSRS's animations. (Weapon attacks only play from 0.1.32.)

**Changes**
- `Osrs` bakes every sequence once (`Anim.Bake`): stand, walk, attack, death and the Mole's `dig_down`/`dig_up` per
  monster from `enemies.animation_ids`; stand, walk, run, death and each weapon's `osrs_attack_anim` per adventurer,
  plus attack-while-walking and attack-while-running clips merged the way the client interleaves them
  (`Anim.Merge`, RuneLite's `Model.animate2`).
- New `Systems/Animator.cs`: `ModelAnimator` swaps a model's mesh frame by frame (frame meshes shared per type);
  `Corpses` plays a dead monster's death sequence on a copy where it fell (at most 1.8 s), so Megabonk can pool it.
- `EnemySkins`: walk cycles at the speed the monster really moves (against OSRS's one tile per 0.6 s at its size),
  the attack when its hit reaches `PlayerHealth.Damage`, death from `Combat`'s `EnemyDied`. `PlayerSkin`: stand, walk
  or run by speed, death on the death screen. `Bosses`: the dig plays the Mole's own sequences.
- New self-checks `monster-animated` and `adventurer-animated`; `WeaponBase.Use` postfix (`hooks.weapon_used`).
- `Music` checks for `OsrsKit.Music.dll` before using it and logs *"OSRS music: the music engine (OsrsKit.Music.dll)
  isn't installed with this build; Megabonk's music plays"*, with no exception text.
- Tools: `bonk anim <npc> <seq>` (frames side by side), `bonk seqinfo`, `bonk mergeinfo`.

## 0.1.30: skills per adventurer, real-damage hitsplats

*Build 2026-10-21 08:15, built from `dc931f1`, code in `5ffe5f3`. Test `06432eda`: 1-run quick check, failed only on
`loader-errors`: the log's *"OSRS music unavailable (start): FileNotFoundException: Could not load file or assembly
'OsrsKit.Music'..."* (release zips leave that DLL out); all seven self-checks passed.*

**Patch notes**
- Each adventurer keeps their own skills, started from your old shared save.
- Your hitsplats show what a hit actually did: a blue 0 only when something stopped it (your prayer, an evade or an
  Aegis block), and nothing for a hit Megabonk's hit cooldown stopped.
- Experimental OSRS music (Lumbridge's *Harmony*) in builds that include `OsrsKit.Music.dll`; release builds keep
  Megabonk's music.

**Changes**
- `Skills`: one save per adventurer, `skills_<id>.json` (`default` without one), each seeded once from the old
  `skills.json` (left as it was) and written through a `.tmp` copy; `Skills.Level(character, id)` and
  `CombatLevel(character)` for the character select panel and starting weapons.
- `Prayer`: the `PlayerHealth.Damage` prefix records HP, shield and overheal and the new postfix draws the hitsplat from
  what was lost; new `PlayerHealth.Evade` and `PlayerHealth.UseAegis` postfixes (0 hitsplats).
- New `Systems/Music.cs` (code from 0.1.29, `206af63`, a build never uploaded): `maps.osrs_music_track` through
  OsrsKit.Music, a port of the client's synthesiser, mixed by `OsrsAudio` while Megabonk's music source is paused; a
  `MusicController.OnPause` postfix. Publish-gated: `tools/package.py` doesn't ship `OsrsKit.Music.dll`. Settings
  `Audio.OsrsMusic` (`true`) and `Audio.OsrsMusicVolume` (`1`, 0 to 2).
- `Sizing` measures again when the adventurer changes. `EnemySkins` logs Megabonk's boss flags on each monster type's
  first skin.
- Test mode: runs rotate through the phase-1 adventurers by run number plus a per-PC counter
  (`%LOCALAPPDATA%\Bonkscape\test-rotation.txt`); the log says *"autoplay adventurer: ..."*.
- Sheets: `characters.osrs_player_model` gains `osrs_walk_anim` 819, `osrs_run_anim` 824, `osrs_death_anim` 836;
  `enemies.animation_ids` get stand, walk, attack and death ids; new `weapons.osrs_attack_anim`; `hooks.json` has a row
  for every patch.
- Release tooling: `README.md` lists every setting; `tools/package.py` refuses a README that doesn't name every
  `Config.Bind` key.

## 0.1.28: no stray 0 hitsplats on monsters

*Build 2026-10-21 07:48, built from `7edc0b8`, code in `0bd94ca`. Test `9865f40b`: 1-run quick check, passed.*

**Patch notes**
- No more 0 hitsplats from a volley's extra projectiles hitting a monster that's already dead.
- Any damage shows as at least 1 (in OSRS a 0 means a miss).

**Changes**
- `Combat`: no hitsplat or XP for a hit on a monster already at 0 HP; test mode counts zero-damage hits by cause and
  logs them with the prayer tally. `Hud.EnemyHit` shows positive damage as at least 1.

## 0.1.27: hit tally details (diagnostic)

*Build 2026-10-21 07:43, built from `83b1720`, code in `7edc0b8`. Test `401ff9c6`: 1-run quick check, passed.*

**Patch notes**
- No change for players: more test-mode logging.

**Changes**
- The test-mode prayer hit tally records each row's damage range and the enemy's current special attack, and logs
  each enemy type's special attacks once with their damage multipliers.

## 0.1.26: a bigger glint, no empty health bar

*Build 2026-10-21 07:36, built from `737aa71`, code in `239c85d`. Test `e49f90a5`: 1-run quick check, passed.*

**Patch notes**
- The glint for a blocked hit is bigger.
- Megabonk's top-left health bar is hidden completely (no empty black bar).

**Changes**
- `HudLayout.DrawSparkle` and `SparkleSpot` (arms up to 9 px, a thicker inner cross).
- `MegabonkHud`: a small `HealthUI` widget that doesn't follow the player (the top-left bar) has all its images and
  texts hidden; other health bars lose their background image too.
- Test mode: `Prayer.TallyTick` logs every 30 s a tally of hits on the adventurer by style, attacker, damage source,
  prayer and outcome.

## 0.1.25: a glint for blocked hits

*Build 2026-10-21 07:29, built from `a02ab54`, code in `54803d3`. Test `cb852f01`: 1-run quick check, passed.*

**Patch notes**
- A hit your protection prayer blocks flashes a small glint on the overhead prayer icon, in place of *"Protected!"*.

**Changes**
- `Hud.Protected()` starts a 0.45 s sparkle at the overhead icon's top right (white core, pale blue arms, corner
  flecks); the *"Protected!"* text is gone.

## 0.1.24: HUD on the adventurer's feet

*Build 2026-10-21 07:22, built from `4f3a8dd`, code in `a02ab54`. Test `82afafcb`: 1-run quick check, passed.*

**Patch notes**
- Your health bar, overhead prayer, hitsplats and level-up fireworks sit on your adventurer instead of a head too high.

**Changes**
- `PlayerSkin.Feet` (the collider's bottom); the HUD measures everything over the adventurer from it, not from the
  player's transform, which sits inside Megabonk's capsule.

## 0.1.23: hitsplats on the body

*Build 2026-10-21 07:20, built from `d14cd39`, code in `4f3a8dd`. Test `9950ac3a`: 1-run quick check, passed.*

**Patch notes**
- Hitsplats sit on the body, at half its height as in OSRS, in OSRS's four slots instead of over the head.

**Changes**
- `Hud`: hitsplat slots (middle, above, above left, above right: (0, 0), (0, -20), (-15, -10), (15, -10) OSRS
  pixels) at the body's middle; with all four showing, the newest takes the hit's damage. The adventurer's work the
  same way.

## 0.1.22: the run-start crash fixed

*Build 2026-10-21 07:15, built from `2f0376f`, code in `d14cd39`. Test `8619f342`: 1-run quick check, passed (all
seven self-checks, no crash).*

**Patch notes**
- Fixes the crash on the first frame of a run (0.1.17 to 0.1.21).

**Changes**
- `OsrsUi` draws part of a sprite frame from its own cut texture (`UnityConv.SpritePart`, clipped to whole pixels and
  kept) instead of `GUI.DrawTextureWithTexCoords`: that method is stripped from Megabonk, and Il2CppInterop's rebuilt
  copy smashed the stack (MODLOG gotcha 19). `UnityConv.ToTexture` refuses empty or short images.
- Tools: `bonk unstripped <Bonkscape.dll> <interopDir>` lists rebuilt (stripped) methods the plugin calls (exit 3 when
  it finds any).

## 0.1.21: crash breadcrumbs (diagnostic)

*Build 2026-10-21 07:03, built from `8f6f9be`, code in `2f0376f`. Test `6e8c2d64`: 1-run quick check, failed: the same
crash in `coreclr.dll` (c0000005) at 0:16; only `osrs-cache` reported.*

**Patch notes**
- No change for players: a diagnostic build.

**Changes**
- New `Dev/Breadcrumbs.cs`: in test mode, `%LOCALAPPDATA%\Bonkscape\breadcrumbs.txt` gets one flushed line per step
  (time, frame, step; repeats counted) for the first 4 minutes, marked through `Runner` and the HUD's draw steps, so
  after a native crash its last line names the step that never returned.

## 0.1.20: monsters on the adventurer's scale

*Build 2026-10-21 06:58, built from `6b33dbe`, code in `782ce3f`. Test `9634e18a`: 1-run quick check, failed: the
same crash in `coreclr.dll` (c0000005) at 0:15 with `Debug.HideMegabonkHud=false`; only `osrs-cache` reported.*

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
