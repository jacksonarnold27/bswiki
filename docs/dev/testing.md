# Testing

Bonkscape is tested two ways. Day to day, the **local loop** (`tools/loop.py`, 0.3) builds, installs and launches
Megabonk straight into a **scenario** and reports back in under a minute. Once per release, **Melty's test run**
installs the release as players get it, starts Megabonk (through Steam) with a test file in place, records the
window, collects the mod's self-checks, and the run is reviewed from its footage. Melty must be started by the user
([Gotchas](gotchas.md#melty-and-the-loader)).

## Test mode (`Systems/TestMode.cs`)

**Turning on.** At load, and every 3 seconds afterwards until it's found, the mod looks for
`%LOCALAPPDATA%\Melty\test\bonkscape.json`. Its fields:

| Field | Use |
|---|---|
| `checks` | Path of the checks file the mod appends to (`bonkscape-checks.txt` in the same folder). Test mode is on when it's set. |
| `seed` | Seeds autoplay and run randomness (chest/shrine placement, skilling). Default 1. |
| `run` | Run number: picks the adventurer and the map, with the rotations below. |

If the file turns up after some checks already passed, they're written out again. `Dev.AutoStartRun = true` turns on
the same autoplay without Melty (checks are then only logged).

**Hand-over tests.** With `Dev.ManualTest = true` a Melty test run doesn't autoplay: you play it, and Bonkscape still
writes its self-checks (log: `Melty test mode: hand-over`). For what autoplay can't reach: skilling and the Giant Mole.

**Adventurer rotation.** Each Melty test on this PC plays the next phase-1 adventurer (Warrior, Ranger, Mage): the
adventurer is `(run - 1 + rotation) mod 3`, where the rotation counts tests in
`%LOCALAPPDATA%\Bonkscape\test-rotation.txt`. Quick checks are always run 1, so before the rotation autoplay only ever
played the Warrior. The log says `autoplay adventurer: <name> (<style>)`. `Dev.AutoStartRun` still plays the first.

**Map rotation** (0.2.1). The map is `rotation mod <phase-1 maps>` over `Rows.Maps` (Lumbridge on the Forest,
Morytania on the Desert). The rotation goes up with every game launch and each run is one, so the two runs of a
two-run test play both maps (with the run number added too, as for the adventurer, it moved by 2 a run and both of
0.2.1's first test runs played Lumbridge). The
log says `autoplay map: <name> (Megabonk's <map>)`. `Dev.AutoStartRun` plays Lumbridge.

**Autoplay.**

1. **Main menu**: once the cache is decoded and Megabonk's data loaded, wait 3 s, select the rotation's adventurer and
   start the rotation's map at its row's stage directly (`MapController.StartNewMap`).
2. **Level-ups**: every 0.8 s of real time (the game is paused), press the first active `UpgradeButton`; if none but
   Megabonk is levelling up, `UpgradePicker.AutoSelectUpgrade`; otherwise take the first offer of any open reward
   window (shrines). In a chest window (0.1.16): press Open, then Take about 3 s later; discard the item if the window
   is still open after 8 s.
3. **Prayer**: every 4 s, switch to the protection prayer against the style most monsters within 10 m use; after a hit
   of a style the prayer doesn't cover, switch to that style on the next tick and hold it for 6 s (0.2.1).
4. **Movement** (`TestMode.LateTick`, after Megabonk's own update; the `PlayerInput.MovementInput` postfix too when it
   runs): a slow circle (0.35 rad/s), bent away from any monster within 7 m and turned along walls found two tiles
   ahead on the map's tile grid, turned into camera-relative input. Until `prayer-blocked` has passed, monsters whose
   style the active prayer covers are let in (0.2.1: fleeing everything meant two hits in a whole run, and the check was
   luck).
5. **Potions**: after 3 kills, if no potion has been drunk and none is on the ground, the next kill always drops one,
   so `osrs-item-picked` and the potion path get exercised. Only the first potion is boosted (0.1.6 onwards), so the
   chat isn't flooded.
6. **Death**: 6 s on the death screen, then `DeathScreen.Restart()` and a new run.
7. **Boss**: 1:15 into a test run, the adventurer is moved next to Megabonk's boss portal (on the row's `boss_tile`)
   and the portal is opened (`InteractableBossSpawner.Interact`): autoplay never walks there, and the stage boss (the
   Giant Mole, Dharok) was never seen in a test. Logged as `test mode: opened the boss portal at ...`.

## Self-checks

Each is reported once per game session as a `pass <name>` line (or `fail <name>: why`) in the checks file, and as
`check passed: <name>` in the log. The recipe's `test.checks` lists the same twelve names.

| Check | Passes when | Code |
|---|---|---|
| `osrs-cache` | The cache decoded and the OSRS icons were applied to Megabonk's data. Fails at load when no cache is found. | `Runner.Update`, `Plugin.Load` |
| `run-started` | A run on a Bonkscape map has been active for 1 s. | `TestMode.Tick` |
| `osrs-arena` | The run's OSRS map (Lumbridge or Morytania) was built and the adventurer moved in. (`lumbridge-arena` from 0.1.7; renamed in 0.2.1 when test runs began alternating maps, since every recipe check must pass in every run.) | `Arena.Build` |
| `osrs-enemy-killed` | A monster wearing an OSRS model died. | `Combat` (`EnemyDied`) |
| `osrs-item-picked` | Coins, food, flying coins or a prayer potion were picked up. | `Loot` |
| `prayer-switched` | A protection prayer was turned on. | `Prayer.Toggle` |
| `xp-drop` | An XP drop was shown during a run. | `Hud.Init` (XP drop event) |
| `monster-animated` | A monster played its OSRS attack sequence and a dying monster's corpse played its death sequence (0.2.0). The attack starts on a hit, when the monster reaches the adventurer, or when a shooter fires (`EnemySkins.SwingWhenInReach`, 0.2.1: a Ranger killing everything at range saw almost none). | `TestMode.Tick` (`EnemySkins.Attacks`, `EnemySkins.Deaths`) |
| `adventurer-animated` | The adventurer played OSRS walk or run and a weapon's attack sequence (0.2.0). | `TestMode.Tick` (`PlayerSkin.Moved`, `PlayerSkin.Attacks`) |
| `prayer-blocked` | A protection prayer stopped (or halved) a hit of its style. | `Prayer.DamagePatch` |
| `skills-saved` | A skills save was written and reads back exactly as written. | `Skills.Save` |
| `evolution` | A casket turned a weapon into its upgrade. In test runs the first casket prepares it: the first `evolutions` row's weapon (added if missing) is levelled to its level and the required passive given at max (`Evolutions.PrepareForTest`), then the evolution runs as for a player. A run where autoplay never walks into a casket runs the same steps 45 s in (`Evolutions.TestCasket`); a real casket logs `casket opened (its Open button)`. | `Evolutions.TryEvolve` |

Not in the recipe (autoplay doesn't reach them every run), and only logged (`check passed: <name> (optional, log only)`),
never written to Melty's checks file: Melty reads at most 12 check lines, so an optional pass written early pushed a
required one out (0.2.0's run 2 lost `prayer-blocked` to `gear-slot-rules`, 0.2.5's run 1 lost `evolution` to
`skill-rules`; both had passed in the log). The optional checks: `skill-rules` (2 s into a
run, `Skills.SelfTest` checks the XP rules on scratch data: the XP table, the 200M cap, hitpoints at a third, combat 3
and 126, which skill damage trains, unreadable-save recovery; never touches the saves), `boss-spawned` (a stage
boss took its OSRS model: `EnemySkins`, log `boss skinned: <Megabonk boss> as <row>`), `boss-arena` (0.2.10: the
fight moved into the boss's lair, log `arena: in Giant Mole's lair after N ms`), `lair-dig` (the Mole resurfaced on a
reachable lair tile, log `boss: the Giant Mole resurfaced in its lair at ...`), `skilling-gathered`
(`Skilling.Gather`) and `gear-slot-rules` (`Content.TomePool` left a passive out of the offers because its gear slot
was taken or it reached its max level; the log says `gear offers: left out …`).

Every 30 s of a test run the log also says `animations: monster attacks N, deaths N (corpses N), mole digs N (N in its lair),
adventurer attacks N, moved …`, and the cache build logs each monster's and adventurer's baked sequences
(`<name> animations: stand 808 (12 frames, 5.0 s), …`).

## What Melty checks

Besides the self-checks, every run is checked for: `installed` (the right version), `started`, `loaded` (BepInEx
loaded `Bonkscape.dll`), `no-crash`, `responding`, `picture` (the window shows something), `ran-to-end` (the recipe's `test.minutes`:
2 since 0.2.9, 3 or 4 before), `stray-loaders`, and **`loader-errors`**: any warning or error logged from the mod's files fails the run.
So a `LogWarning` in a normal code path is a test failure; keep warnings for real problems.

## Footage review

Melty records frames of the window (for example 91 frames over a 3-minute run, laid out in contact sheets). A reviewer
(a Claude Code session using Melty's `test_review`) looks through them and records a verdict with evidence: the
timestamp, frame and what was seen ("00:48: 'Protected!' over the adventurer as an OSRS guard's hit is blocked"), and
a summary. A run **counts** only when Melty's checks, the self-checks and the footage review all pass.

- A **1-run test** is a quick check.
- A **test of 2+ runs**, each counting, is what lets a new mashup be published (the "publish test"). 0.1.5 and 0.1.11
  passed it.

What footage review is good for: things self-checks can't see. That the adventurer is in the courtyard, that
monsters reach you around walls, that the HUD and the animations show, that sizes look right. What it misses:
anything autoplay doesn't do (most weapons, skilling on purpose, the Giant Mole: runs end before it comes).

## Test history

Times are local (UTC-5). From Melty's release list and test results.

| Version | Test | Runs | Result | Notes |
|---|---|---|---|---|
| 0.0.1 | `69badf81` | | passed | Stub: loader and cache discovery |
| 0.1.0 | `f950c212` | 1 x 4 min | **failed** | `UnityConv` type initializer threw; no self-check reported |
| 0.1.1 | `3d4554e1` | 1 x 3 min | **failed** | "Method unstripping failed" errors; `osrs-item-picked` and `prayer-switched` missing |
| 0.1.2 | `212af9d8` | | passed | |
| 0.1.3 | `a5e4376c` | | passed | |
| 0.1.4 | `196b766b` | | passed | |
| 0.1.5 | `00b12845` | 2 x 4 min | **passed (publish test)** | All six self-checks, footage reviewed |
| 0.1.6 | `4038aeb7` | 1 x 3 min | failed (expected) | Diagnostic build; its probe check `probe-enemies-on-slab` never reported. The six normal checks passed. |
| 0.1.7 | `6c2d57ed` | 1 x 3 min | **failed** | Arena built; kill, pickup, prayer and XP checks missing |
| 0.1.8 | `f9b58412` | 1 x 3 min | **failed** | Same four missing |
| 0.1.9 | `531bf1f4` | | passed | First arena build to pass |
| 0.1.10 | `ce9989f6` | | passed | |
| 0.1.11 | `09ad9949` | 2 x 4 min | **passed (publish test)** | All seven self-checks; footage: courtyard start, castle, river and bridges, swamp, cow and Giant Frog minibosses, death and restart |
| 0.1.12 | `3e8c9d4c` | 1 x 3 min | passed (quick check) | Prayer bar, "Protected!", monsters around walls. Review: adventurer still read small (log: adventurer 4.80 m, guard 4.47 m), which led to 0.1.13 |
| 0.1.13 | `2f85d870` | 1 x 4 min | passed (quick check) | All seven self-checks |
| 0.1.14 | `77b7beb2` | | passed (quick check) | |
| 0.1.15 | `13a522b9` | | passed (quick check) | |
| 0.1.16 | `9e1854a7` | | passed (quick check) | Autoplay opens chests |
| 0.1.17 | `aebf6011` | 1 x 4 min | **failed** | Megabonk crashed in `coreclr.dll` (c0000005) at 0:18, before a run started; only `osrs-cache` reported. The window couldn't be recorded. |
| 0.1.18 | `b09071b7` | 1 x 4 min | **failed** | Same crash in `coreclr.dll` at 0:17 without the `EnemyHpBar.Set` patch; only `osrs-cache` reported |
| 0.1.18 | `48b6a423` | 1 x 4 min | **failed** | The same crash again, at 0:16; only `osrs-cache` reported |
| 0.1.19 | `9f22aab1` | 1 x 3 min | passed (quick check) | No crash; all seven self-checks. Run with `Debug.OsrsHud=false` (per the main session). |
| 0.1.20 | `9634e18a` | 1 x 3 min | **failed** | The same crash in `coreclr.dll` at 0:15, run with `Debug.HideMegabonkHud=false` (per the main session); only `osrs-cache` reported |
| 0.1.21 | `6e8c2d64` | 1 x 3 min | **failed** | The same crash at 0:16 (the breadcrumbs build); only `osrs-cache` reported |
| 0.1.22 | `8619f342` | 1 x 3 min | passed (quick check) | No crash: the first run with the OSRS HUD drawn; all seven self-checks |
| 0.1.23 | `9950ac3a` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.24 | `82afafcb` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.25 | `cb852f01` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.26 | `e49f90a5` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.27 | `401ff9c6` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.28 | `9865f40b` | 1 x 3 min | passed (quick check) | All seven self-checks |
| 0.1.30 | `06432eda` | 1 x 3 min | **failed** | Only `loader-errors`: the log's OsrsKit.Music `FileNotFoundException` line; all seven self-checks passed |
| 0.1.31 | `2e28e80e` | 1 x 3 min | **failed** | `adventurer-animated` never reported (the `WeaponBase.Use` hook never ran); `monster-animated` and seven others passed |
| 0.1.32 | `7c981d69` | 1 x 3 min | passed (quick check) | All nine self-checks, both animation checks |
| 0.1.33 | `9ee50cc1` | 1 x 3 min | **failed** | `evolution` never reported (the old chest hook never ran); the other 11 passed |
| 0.1.34 | `7e4aeda1` | 1 x 3 min | **failed** | `evolution` never reported (no casket opened); the other 11 passed |
| 0.1.35 | `a4d9016b` | 1 x 3 min | passed (quick check) | All 12 self-checks, `evolution` for the first time |
| 0.1.36 | `a7436954` | 1 x 4 min | passed (quick check) | All 12 self-checks. The main session's log: `MinibossGolem` has `IsBoss True`; a death, restart and evolution reset worked |
| 0.1.37 | `fb5286b9` | 1 x 3 min | passed (quick check) | All 12 self-checks |
| 0.2.0 | `04338614` | 2 x 3 min | checks passed, not a publish test yet | Run 1 all 12 self-checks; run 2 all but `prayer-blocked`. No footage review yet. |
| 0.2.1 | `008a84a6` | 2 x 4 min | **passed (publish test)** | Run 1 Warrior on Lumbridge, run 2 Mage on Morytania (built in the background, about 4.7 s once), all 12 self-checks each. Footage: roaming Lumbridge's fields and castle hall, the giant frog miniboss, Canifis, Loar Shades, ghouls and vampyres; the Mage died three times on Morytania. |
| 0.2.2 | `4e2dd148` | 2 x 4 min | **passed (publish test)** | Run 1 Mage on Lumbridge (arena placed in 150 ms, meshes made in the menu), run 2 Ranger on Morytania (meshes made over frames while the run played on in the desert, arena placed in 1.2 s, ore rocks back, the Vyrewatch miniboss), all 12 each. |
| 0.2.3 | `7c7d1d9f` | 2 x 4 min | passed (publish test) | Run 1 Ranger on Lumbridge, all 12; the boss call brought the Giant Mole at 2:30, it dug once (log) and `boss-spawned` passed; prayer halved its hit (the boss rule). Run 2 Warrior on Morytania, all 12, 4:00; the boss call brought Dharok at the Barrows (`boss-spawned`), his model pink (the cache's Barrows brother NPC models are hue 60; 0.2.4 dresses him in his armour). |
| 0.2.4 | `3bf7479b` | 2 x 4 min | **passed (publish test)** | Run 1 Warrior on Lumbridge, the Giant Mole fight at 2:40; run 2 Mage on Morytania, the boss call at the Barrows brought Dharok in his own armour (03:10), and he killed the Mage. All 12 each. |
| 0.2.5 | `a6122d1e` | 2 x 4 min | passed, didn't count | The game played well in both runs (Mage on Lumbridge, Ranger on Morytania with Dharok in armour), but the optional `skill-rules` line took a place among the 12 check lines Melty reads: run 1 lost `evolution`, run 2 `osrs-item-picked`. |
| 0.2.6 | `e5b8ef9b` | 2 x 4 min | **passed (publish test)** | Exactly the 12 recipe checks reported in each run (optional checks log-only). Run 1 Ranger on Lumbridge with the Giant Mole; run 2 Warrior on Morytania (Mort Myre, upgrades with OSRS names, restart in Canifis). |
| 0.2.7 | `46bd824f` | 2 x 4 min | **failed** | Run 1 Warrior on Lumbridge, all 12: climbs the castle steps and steep hills, the Giant Mole fight. Run 2 Mage on Morytania under the dark sky with Dharok at the Barrows, all 12 self-checks, but `loader-errors` failed: test autoplay's chest code logged warnings (`autoplay chest: NullReferenceException`) and stalled on a chest window from 3:40. Footage: Megabonk's desert showed for about 6 s before the map. |
| 0.2.8 | `52687ce4` | 2 x 4 min | **passed (publish test)** | The loading cover at every start and restart. Run 1 Mage on Lumbridge (one frame of the camera still swinging as the cover lifts), run 2 Ranger on Morytania under the dark sky, Dharok at the Barrows. All 12 each, no loader errors. |
| 0.2.9 | `239639c9` | 1 of 2 x 2 min | **failed** | First 2-minute test: run 1 reported 11 of 12, `prayer-blocked` never; the test stopped there. |
| 0.2.10 | `ae55a279` | 2 x 2 min | **passed (publish test)** | Run 1 Mage on Morytania, Dharok at the 1:15 boss call. Run 2 Ranger on Lumbridge: the boss call moved the fight into the Falador Mole Lair under the loading cover, and the Mole dug to another spot (log); two falls off the cave walls' tops into the void, caught and returned to the spawn tile. All 12 each. |
| 0.2.11 | `036cdc9a` | 2 x 2 min | **passed (publish test)** | Run 1 Ranger on Morytania: Canifis's stilt houses with their walls. Run 2 on Lumbridge: the lair fight without wall climbing, spawns moved onto the floor; one fall through a ground-less floor patch. All 12 each. |
| 0.2.12 | `80711319` | 2 x 2 min | **passed (publish test)** | Run 1 on Morytania (walled stilt houses, Dharok). Run 2 Mage on Lumbridge: the lair fight with no falls (lair swap in 45 ms, a dig to a reachable tile, 2 spawns moved onto the floor); a death in the lair restarts on Lumbridge with its sky back. All 12 each, no mod warnings. |
| 0.3.0 | `00b2a313` | 2 x 2 min | **passed (publish test)** | Run 1 Mage on Morytania: an evolution to the Abyssal tentacle, a chest, no death, `skills-saved` without one. Run 2 Ranger on Lumbridge: the boss call into the Mole's lair, the Mole surfacing beside the adventurer. All 12 each. Footage: Megabonk's Settings window showed on the menu for 2 s before run 2 began. |

Blank cells weren't looked up. `mcp__melty__test_result` with the test id gives the full record.

## The local loop

`python -I tools/loop.py tools/scenarios/<name>.json [more.json ...] [--one-launch] [--no-build] [--shots N]`:

1. Refuses if a Megabonk is running (it never closes a game it didn't start) or Melty's test file exists.
2. Builds the plugin (`dotnet build`, about 1.5 s when little changed), backs up `BepInEx/plugins/Bonkscape`, installs
   `Bonkscape.dll`, `Bonkscape.Cache.dll` and the local-only music engine, switches Melty's loader on
   (`winhttp.dll.melty-off` to `winhttp.dll`) and writes the scenario to `BepInEx/config/Bonkscape/scenario.json`.
3. Backs up every save a run writes (Megabonk's `Saves` folder, which Steam Cloud syncs, and its Player logs;
   Bonkscape's skill saves, breadcrumbs and test rotation) and launches `Megabonk.exe` directly (no Steam hand-off on
   this PC). Claude's app package doesn't isolate them: it redirects only new AppData files, and a run overwrites
   existing saves ([Gotchas](gotchas.md#megabonk-runtime)). Scenarios also turn skill saving off unless they test it
   (`"save_skills": true`). Megabonk ignores Unity's `-screen-*` flags and runs at its own settings.
4. Waits for the scenario report's last line, `done:`, then copies `LogOutput.log`, `scenario-report.txt` and the
   screenshots to `derived/loop/<time>-<name>/` (gitignored), closes the PID it started, and puts the plugin folder,
   the loader switch and every save back, byte for byte with their times (files the run made are removed). A loop
   killed before that restores the saves on its next start (`derived/loop/PENDING-RESTORE.txt`).
5. Prints a summary: timings, the in-game timing marks (`timing: <mark> at N s` lines from `Dev/Timing.cs`), the
   checks that passed, every Bonkscape warning or error, the dead-hook report and the scenario report. Several
   scenario files run one after another with a combined table; `--one-launch` runs them as a suite in one game.

**Scenarios** (`Systems/Scenario.cs`, files in `tools/scenarios/`): `map`, `stage`, `adventurer`, `autoplay`,
`boss_at` (seconds), `seconds`, `steps` (`{"at": 3, "spawn": "giant_mole"}` spawns a monster, or the stage boss
through `EnemyManager.SpawnBoss`; `"weapon": "<weapons id>"` gives one; `"drop": "prayer_potion"` or `"casket"`),
`levels` (preset, never saved), `save_skills` (`true` to test saving; the loop restores the files after), `shots` (seconds), `expect` (checks the report marks `pass` or `MISSING`), `deaths`
(`"allow"` for real deaths), `ui` (the UI test), `suite` (several scenarios in one launch, each ended as a run's end
and the next started with `MapController.StartNewMap`). The scenario's clock starts once the OSRS map is built, so
a step at 3 s never lands before the arena (a suite's later runs build theirs in 3-4 s). Scenarios start 0.3 s after
the main menu; Melty's runs keep 3 s. In-game screenshots (`Systems/Shot.cs`) are read back in an IMGUI repaint and
written as PNG by the plugin (Unity's own capture and PNG encoder are stripped from Megabonk), halved on wide screens:
1280x800 in about 0.25 s.

| Scenario | What it checks |
|---|---|
| `smoke` | Morytania as the Mage, a whip given at 2 s, a potion dropped at 4 s, `player-hit` |
| `mole-lair` | Lumbridge, the boss portal opened at 12 s: the lair swap (`boss-arena`) and a dig (`lair-dig`) |
| `spawn-mole` | the Mole spawned straight in as the stage boss, a goblin, a blowpipe, preset levels (not saved) |
| `ui` | the main menu, character select, map select and settings, then the run's HUD, at 1280x720, 1920x1080, 2560x1440 and 3840x2160 (about a minute) |
| `guard` | standing still beside the Mole: hits land, the lethal-hit guard saves the deaths |
| `death` | the same with `"deaths": "allow"`: the death screen and `run-restarted` |
| `saves` | `"save_skills": true`: `Skills.Tick`'s save (every 20 s once XP changed) reads back as written, `skills-saved`; the loop restores the save after |

**Deaths in test runs** (`Systems/TestGuard.cs`): no blanket invulnerability, which would hide broken hits. Every hit
lands in full through Megabonk's damage path; only one that would kill (`PlayerHealth.WillDamageKill`) is cut to
leave 1 hitpoint, then the adventurer is healed to half and the save is logged (`lethal hit saved: <monster> hit for
N with M left`; a hit that comes without its monster names Megabonk's damage source, `something (Enemy)`). `PlayerHealth.PlayerDied` and `KillPlayer` prefixes stop any other way of dying, logged by name. The
guard is on in Melty's autoplay runs and scenarios (not in a hand-over test, where the creator plays), so Melty's
recordings no longer show a death and restart: the `death` scenario covers that. `"deaths": "allow"` turns it off. The report's `test guard:` line counts
the hits taken, their damage and the saves, and `player-hit` (optional) passes on the first monster hit that costs
health, so a run where monsters never hurt the adventurer shows.

**The dead-hook report** (`Core/DeadHooks.cs`): in test runs every method Bonkscape patches gets a counting prefix;
the report lists the patches that never ran (in the scenario report, and every 60 s in Melty runs' logs). A short run
leaves situational ones (no chest opened, no death, no evade); a patch that never runs across scenarios built to
reach it has been inlined by IL2CPP, as `WeaponBase.Use`, the casket's open and `PlayerInput.MovementInput` were.

**The UI test** (not run every time; 0.12 builds on it): scenario `ui` sets each resolution in game
(`Screen.SetResolution`; on a 2560x1600 desktop 3840x2160 clamps to 3840x1934) and, on the menu, opens each screen in
its `"menus"` list through Megabonk's own `MainMenu.GoTo*` calls (`characters`, `maps`, `settings`, `unlocks`, `quests`,
`shop`, `logs`, `leaderboards`, `credits`), screenshotting each. The report lists each screen's buttons the first time
(`B_Back`, `B_Confirm`...); on character select it checks Bonkscape's levels panel against everything of Megabonk's a
player sees there (texts by their first words, icons, buttons), not only the buttons: the first version, buttons only,
passed a panel lying over the adventurer's description and weapon name. In the run it screenshots the HUD at each
resolution and checks Bonkscape's HUD boxes against the real minimap (`HudLayout.Boxes` and `Problems`: the orb cluster
drawn as one, the minimap as a circle). `bonk uilayout [w h ...]` runs the HUD check offline for eight resolutions. A
text's box can be wider than its letters, so a covered text is worth a look at the screenshot before it's called a
bug.

**Timings** (this PC, 2026-10-21; the old way is Melty's two-run test, as every version used):

| | Melty test (old) | Local loop (0.3) |
|---|---|---|
| Change to result | about 7-8 min from upload (plus about a minute packaging, and reviewing 8 contact sheets) | 34-63 s per scenario, built and installed included |
| Launch to the run | about 15 s, after Melty's install | 10.5-12 s (14.8 s before scenarios started 0.3 s after the menu) |
| Reaching a boss fight | 75 s into a run (the boss call), one map a run | 12 s into the run (a spawn: 3 s), any map |
| Map, stage, adventurer | the rotation picks | chosen per scenario |
| Six scenarios | | 249 s in one launch (four: 182 s in four launches, 144 s in one) |
| Screenshots | a frame every 2 s, after the run | full frames at chosen seconds, 0.25 s each |
| Deaths | restart the run | saved and logged; real deaths only where a scenario asks |
| Hooks that never ran | not reported | listed every run |

## Testing by hand

- `Dev.AutoStartRun = true` plays a Lumbridge run by itself on your own launches. Remember Melty switches BepInEx off
  between its launches.
- The log (`BepInEx/LogOutput.log`) has the useful lines: `OSRS assets ready in ... ms`, `Lumbridge built from the
  OSRS cache in ...`, `Lumbridge arena: ...`, `sizing: ...`, `skin <enemy> (<tier>) as <name>: ...`, `check passed:`,
  and every chat line as `[chat]`.
- Offline: `bonk preflight` checks the sheets against the interop assemblies and both caches; `bonk worldscan`
  checks every map region decodes; `bonk render` and `bonk world` make images to look at.

Gaps (per-feature checks, a hand-over playtest mode, the other adventurers) are on the [docket](docket.md).

<!-- sources: src/Bonkscape.Plugin/Systems/TestMode.cs src/Bonkscape.Plugin/Systems/Scenario.cs src/Bonkscape.Plugin/Systems/TestGuard.cs src/Bonkscape.Plugin/Systems/Shot.cs src/Bonkscape.Plugin/Core/DeadHooks.cs src/Bonkscape.Plugin/Dev/Timing.cs tools/loop.py -->
