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

**Adventurer rotation.** Each Melty test on this PC plays the next phase-1 adventurer that this PC has unlocked
(`Unlocks.CharacterUnlocked`; a locked one would also start a skills save): the adventurer is
`(run - 1 + rotation) mod <those adventurers>`, where the rotation counts tests in
`%LOCALAPPDATA%\Bonkscape\test-rotation.txt`. Quick checks are always run 1, so before the rotation autoplay only ever
played the Warrior. The log says `autoplay adventurer: <name> (<style>)`. `Dev.AutoStartRun` still plays the first.

**Map rotation** (0.2.1). The map is `rotation mod <phase-1 maps>` over `Rows.Maps` (Lumbridge, Ardougne &
Seers' Village and the God Wars Dungeon on the Forest's three stages; Al Kharid, Morytania and TzHaar City on the Desert's three stages; the Wilderness on the Graveyard). The rotation goes up with every game launch and
each run is one, so a test of as many runs as maps plays each, as 0.5.0's three-run test did (with the run number added too, as for the adventurer, it moved by 2 a run and both of
0.2.1's first test runs played Lumbridge). The
log says `autoplay map: <name> (Megabonk's <map>)`. `Dev.AutoStartRun` plays Lumbridge.

**Autoplay.**

1. **Main menu**: once the cache is decoded and Megabonk's data loaded, wait 3 s, select the rotation's adventurer and
   start the rotation's map (`MapController.StartNewMap`, which always begins on the map's first stage). A later
   stage's row (TzHaar City) is reached a second in through Megabonk's `LoadNextStage` (`TestMode.JumpToStage`), and
   its monsters' hp and hits there leave out Megabonk's stage share (`TestMode.StageScale`): the adventurer arrives
   without the levels a real run brings.
2. **Level-ups**: every 0.8 s of real time (the game is paused), press the first active `UpgradeButton`; if none but
   Megabonk is levelling up, `UpgradePicker.AutoSelectUpgrade`; otherwise take the first offer of any open reward
   window (shrines). In a chest window (0.1.16): press Open, then Take about 3 s later; discard the item if the window
   is still open after 8 s.
3. **Prayer**: every 4 s, switch to the protection prayer against the style most monsters within 10 m use; after a hit
   of a style the prayer doesn't cover, switch to that style on the next tick and hold it for 6 s (0.2.1). When a
   scripted boss starts an attack (Jad), pray against its style at once and hold it until after the hit
   (`Prayer.AutoplayBraceFor`).
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
   Giant Mole, Dharok) was never seen in a test. Logged as `test mode: opened the boss portal at ...`. On a map whose
   boss has `arena_waves` (TzHaar City) the call comes at 40 s and opens Megabonk's final portal
   (`InteractableBossSpawnerFinal`), retried each second for up to 30 s while there's none yet, and the arena plays at
   0.25 of its sheet times (`TestMode.ArenaTimeScale`).

## Self-checks

Each is reported once per game session as a `pass <name>` line (or `fail <name>: why`) in the checks file, and as
`check passed: <name>` in the log. The recipe's `test.checks` lists the same twelve names.

| Check | Passes when | Code |
|---|---|---|
| `spec-fired` | A special attack was fired (0.4; autoplay fires the armed weapon's spec whenever it's affordable and a monster that can take damage is in reach). It took `osrs-cache`'s place in the twelve: `osrs-arena` can't pass without the cache. | `Specials.Fire` |
| `run-started` | A run on a Bonkscape map has been active for 1 s. | `TestMode.Tick` |
| `osrs-arena` | The run's OSRS map (Lumbridge, Morytania or TzHaar City) was built and the adventurer moved in. (`lumbridge-arena` from 0.1.7; renamed in 0.2.1 when test runs began alternating maps, since every recipe check must pass in every run.) | `Arena.Build` |
| `osrs-enemy-killed` | A monster wearing an OSRS model died. | `Combat` (`EnemyDied`) |
| `osrs-item-picked` | Coins, food, flying coins or a prayer potion were picked up. | `Loot` |
| `prayer-switched` | A protection prayer was turned on. | `Prayer.Toggle` |
| `xp-drop` | An XP drop was shown during a run. | `Hud.Init` (XP drop event) |
| `monster-animated` | A monster played its OSRS attack sequence and a dying monster's corpse played its death sequence (0.2.0). The attack starts on a hit, when the monster reaches the adventurer, or when a shooter fires (`EnemySkins.SwingWhenInReach`, 0.2.1: a Ranger killing everything at range saw almost none). | `TestMode.Tick` (`EnemySkins.Attacks`, `EnemySkins.Deaths`) |
| `adventurer-animated` | The adventurer played OSRS walk or run and a weapon's attack sequence (0.2.0). | `TestMode.Tick` (`PlayerSkin.Moved`, `PlayerSkin.Attacks`) |
| `prayer-blocked` | A protection prayer stopped (or halved) a hit of its style. | `Prayer.DamagePatch` |
| `skills-saved` | A skills save was written and reads back exactly as written. | `Skills.Save` |
| `evolution` | A casket turned a weapon into its upgrade. In test runs the first casket prepares it: the first `evolutions` row's weapon (added if missing) is levelled to its level and the required passive given at max (`Evolutions.PrepareForTest`), then the evolution runs as for a player. A run where autoplay never walks into a casket runs the same steps 45 s in (30 s on a map whose boss fights waves first, before its 40 s boss call), again every 3 s for up to 30 s while the player is being remade (`Evolutions.TestCasket`; a final portal's stage load remakes it); a real casket logs `casket opened (its Open button)`. | `Evolutions.TryEvolve` |

Not in the recipe (autoplay doesn't reach them every run), and only logged (`check passed: <name> (optional, log only)`),
never written to Melty's checks file (`osrs-cache` among them since 0.4: the cache decoded and the OSRS icons
applied): Melty reads at most 12 check lines, so an optional pass written early pushed a
required one out (0.2.0's run 2 lost `prayer-blocked` to `gear-slot-rules`, 0.2.5's run 1 lost `evolution` to
`skill-rules`; both had passed in the log). The optional checks: `skill-rules` (2 s into a
run, `Skills.SelfTest` checks the XP rules on scratch data: the XP table, the 200M cap, hitpoints at a third, combat 3
and 126, which skill damage trains, unreadable-save recovery; never touches the saves), `boss-spawned` (a stage
boss took its OSRS model: `EnemySkins`, log `boss skinned: <Megabonk boss> as <row>`), `boss-arena` (0.2.10: the
fight moved into the boss's lair, log `arena: in Giant Mole's lair after N ms`), `lair-dig` (the Mole resurfaced on a
reachable lair tile, log `boss: the Giant Mole resurfaced in its lair at ...`), `skilling-gathered`
(`Skilling.Gather`) and `gear-slot-rules` (`Content.TomePool` left a passive out of the offers because its gear slot
was taken or it reached its max level; the log says `gear offers: left out …`). Since 0.5: `arena-waves` (a boss
arena's first wave), `arena-boss-released` (the held boss joined after the waves), `boss-healers` and `boss-healed`
(Jad's healers called, and one healed him), `boss-blocked-fully` (a boss hit blocked completely), `lava-burned` (a lava
burn cost health) and `unlock-earned` (a boss's death unlocked a passive). Since 0.6: `extra-weapon` (an
adventurer's `extra_weapons` given), `shop-refused` (a shopkeeper refused an adventurer who can't buy) and
`character-unlocked` (an `unlock_condition` other than `always` met). Since 0.7: `hidden-brother` (a boss pool's
hidden brother picked), `barrows-piece` and `barrows-set` (a piece given; a set completed), `set-effect` (a set
effect triggered) and `weapon-takeover` (a brother's weapon put on its shared Megabonk type). Since 0.8:
`boss-second-form` (a two-form boss's first form fell and its second rose). Since 0.9: `crypt-left` (a Graveyard run left its starting crypt by its exit door), `pker-ambush` and `pker-spec` (a PKer came, and fired its special attack) and `boss-breath-effect` (a boss's breath poisoned, froze or shocked the adventurer; since 0.11 also K'ril's prayer-piercing smash). Since 0.12: `osrs-inventory` (the OSRS side panel's inventory showed a weapon) and `title-screen` (the OSRS title screen stood in for Megabonk's main menu). Since 0.13: `pet-dropped` (a boss dropped its pet), `pet-following` (the pet out walked after the adventurer), `clue-started` (a clue trail began) and `clue-complete` (its reward casket paid out). In Melty's runs the sixth kill drops a clue scroll, so its trail shows in the footage. Since 0.14: `ladder-tier` (a ladder's Megabonk weapon took a tier below its top for the adventurer), `gear-reqs` (a level-up's offers left out a weapon above the adventurer's levels), `style-switched` (the attack style changed), `style-xp` (after a switch, the adventurer's own style earned XP only in the new style's skills), `combat-tab` (the side panel's combat tab opened) and `locked-skill-kept` (an adventurer with a locked skill earned XP this run and none in it: the Pure's Defence). In Melty's runs the twelfth kill presses the style key, so the combat tab and a style switch show in the footage; the `skill-rules` self-check also covers the styles' XP shares, the Pure's styles, the ladders' tiers and the whip's and scythe's requirements.

**Each Melty run's own log** (0.9.1): in Melty's test mode Bonkscape copies its log lines to `%LOCALAPPDATA%/Bonkscape/melty-run-N.log` as they come, since BepInEx's `LogOutput.log` starts over with each launch and a test's first run was gone by its last. Test mode never calls a boss while the game is paused (time scale 0).

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
| 0.4.0 | `4ff4bb99` | 2 x 2 min | **passed (publish test)** | Run 1 Ranger on Morytania: the spec orb, a spec switch (*Special attack: Abyssal whip (Energy Drain).*), the Godsword shard among the offers, Dharok. Run 2 Warrior on Lumbridge, starting facing north; Energy Drain and Sever fired in the Mole's lair. All 12 each, `spec-fired` in place of `osrs-cache`. |
| 0.5.0 | `f40eeddc` | 3 x 2 min | **passed (publish test)** | Run 1 on Lumbridge: the boss portal into the Mole's lair, the Dragon scimitar's spec there. Run 2 on Morytania: Dharok at the Barrows, Ice Barrage's spec. Run 3 on TzHaar City (the Desert's third stage, reached by the jump): the city's lava cracks, Tokkul, TzHaar and TzHaar-Ket, the final portal into the Fight Caves, Yt-MejKot and Ket-Zek waves, TzTok-Jad released with his boss bar dropping. All 12 each. The first 0.5.0 test, `f9cc7928`, failed only its TzHaar run's `evolution`: the test casket landed in the final portal's stage reload (fixed in `f1c619d`). |
| 0.6.0 | `b459ddbb` | 3 x 2 min | **passed (publish test)** | Run 1 the Zerker on Lumbridge: his OSRS model, the Void knight mace among the level-up offers, the Mole's lair fight. Run 2 Durial321 on Morytania: his model, his extra Ice Barrage firing round him, Dharok; the Deep Freeze ice block on its target drew as an opaque tan box. Run 3 TzHaar City: the city, the Fight Caves' waves and TzTok-Jad. All 12 each. |
| 0.7.0 | `4b4dffee` | 3 x 2 min | **passed (publish test)** | Run 1 the Warrior on Lumbridge: the Void knight mace and whip among the offers, the Mole's lair. Run 2 the Mage on Morytania: the hidden brother was Torag the Corrupted, named on the boss bar, in his armour with his hammers (Megabonk's boss beams). Run 3 the Void Knight on TzHaar City: the final portal, *You enter TzTok-Jad's arena; the waves come first.*, the waves, Jad with his telegraphs. All 12 each. The review read Jad's prayed hits as half blocked: `Prayer` labels every boss hit `boss, half blocked`, also one blocked fully. |
| 0.8.0 | `7b1d13bb` | 3 x 2 min | **passed (publish test)** | Run 1 Durial321 on Al Kharid: the desert town, scorpions, desert wolves, lizards, a bandit and an Al Kharid warrior, the boss portal into the Kalphite Lair, the crawling Queen fighting (boss bar 7,142). Run 2 the Ranger on Morytania, reached by the jump to the Desert's second stage: Verac the hidden brother at the Barrows. Run 3 TzHaar City: the Fight Cave, its waves, Jad's telegraphs. All 12 each. The Queen's second form wasn't reached in the run's 30 s with her (seen locally in `kalphite-lair`). |
| 0.9.0 | `59fdc7c2` | 3 x 2 min | passed, didn't graduate | Run 1 the Mage on the Wilderness: revenants, green dragons, a Pipe Ranger ambush with Toxic Siphon, then the boss door (opened by test mode while a window had the game paused) loaded the final stage, and the screen stayed black to the end, no King Black Dragon; the review failed it, and the crypt's *Find the exit* stayed on screen. Run 2 the Void Knight on Al Kharid (the Kalphite Queen), run 3 the Zerker on Morytania (Guthan) passed. All 12 self-checks in each run. |
| 0.9.1 | `5816c823` | 3 x 2 min | **passed (publish test)** | Run 1 the Ranger on the Wilderness: revenants and green dragons, an Ice Tank ambush (log), the door opened only once a chest window's pause ended, then the King Black Dragon in his lair (boss bar 9,450). Run 2 the Zerker on Al Kharid: the Kalphite Lair, the crawling Queen. Run 3 Durial321 on Morytania: Torag the hidden brother. All 12 each. The KBD's death and breath effects weren't reached (seen locally in `kbd-lair`). |
| 0.10.0 | `2be74135` | 3 x 2 min | passed, didn't graduate | Run 1 the Void Knight on Ardougne & Seers' Village: East Ardougne's market, grizzly bears, guards and warriors, the boss portal at Camelot, the seven knights in three waves, then Sir Lancelot. Run 2 the Warrior on TzHaar City: the Fight Cave, Jad. Run 3 the Mage on Lumbridge failed the review: the Giant Mole fought in its lair under a boss bar reading *King Black Dragon* (both on `Ent1`). All 12 self-checks in each run. |
| 0.10.1 | `6396cd70` | 3 x 2 min | **passed (publish test)** | Run 1 the Void Knight on Ardougne & Seers' Village: its monsters, the knights' waves and Sir Lancelot at Camelot, named on the boss bar. Run 2 the Warrior on TzHaar City: the Fight Cave, Jad. Run 3 the Mage on Lumbridge: the Giant Mole named on its boss bar again. All 12 each. |
| 0.11.0 | `4f4ef19f` | 3 x 2 min | **passed (publish test)** | Run 1 the Ranger on Morytania: Ahrim the hidden brother on the boss bar. Run 2 Ardougne & Seers' Village: East Ardougne's market, the knights and Sir Lancelot at Camelot. Run 3 the God Wars Dungeon: the cavern from OSRS level 2, the gods' armies (bloodvelds, imps, goblins, an aviansie), the final portal, Megabonk's final stage loading (about 10 s) into General Graardor's room with his bodyguards, Graardor's melee reaching the adventurer. All 12 each. |
| 0.12.0 | `9663b475` | 3 x 2 min | **passed (publish test)** | Every run opened on the title screen (the combined logo, Megabonk's functions as OSRS buttons with their alerts, silver 32). Run 1 the Void Knight on TzHaar City: the side panel, the Fight Caves and Jad. Run 2 the Warrior on Lumbridge: a casket's chest window with the HUD stepped aside but for the chat box and Megabonk's panels in OSRS browns, then the Giant Mole. Run 3 the Mage on the Wilderness: the upgrade offers in OSRS browns, the King Black Dragon. All 12 each. The review noted the chest window's own teal background, not restyled yet. |
| 0.13.0 | `5fe97177` | 3 x 2 min | **passed (publish test)** | Every run opened on the title screen and showed a clue trail from the 6th kill's scroll: *Clue scroll (easy): step 1 of 2* in the chat box and its hint under the minimap. Run 1 the Ranger on Al Kharid, then the Kalphite Queen. Run 2 the Zerker on Morytania (the Zealot to speak to, the minimap's yellow hint arrow), then Verac. Run 3 Durial321 on Ardougne & Seers' Village (dig at the Legends' Guild bank), then Sir Lancelot. All 12 each. No boss died, so no pet was seen. |
| 0.14.0 | `dc84b98b` | 3 x 2 min | **failed** | Run 1's 12 self-checks passed, but `loader-errors` failed: Bonkscape's HUD logged NullReferenceExceptions (the clue arrow reading the God Wars map's ground while a final portal tore it down). |
| 0.14.1 | `a53efa6b` | 3 x 2 min | **failed** | Run 1 Durial321 on TzHaar City passed: a clue trail, the combat tab after the style key (Aggressive, XP to Strength), Jad. Run 2 never reported `prayer-blocked`: the Giant Mole's ground attacks name no monster, so no prayer blocked them. |
| 0.14.2 | `0681a9e7` | 3 x 2 min | **passed (publish test)** | Run 1 the Ranger on the Wilderness on the willow shortbow tier: a clue trail, the style key to Longrange on the combat tab, a Defence level from it, the King Black Dragon. Run 2 the Zerker on Al Kharid with his own dragon scimitar: Controlled, the Kalphite Queen. Run 3 Durial321 on Morytania on his own whip: Controlled, Karil. All 12 each. |

Blank cells weren't looked up. `mcp__melty__test_result` with the test id gives the full record.

## The local loop

`python -I tools/loop.py tools/scenarios/<name>.json [more.json ...] [--one-launch] [--no-build] [--shots N]`:

1. Refuses if a Megabonk is running (it never closes a game it didn't start) or Melty's test file exists.
2. Builds the plugin (`dotnet build`, about 1.5 s when little changed), backs up `BepInEx/plugins/Bonkscape`, installs
   `Bonkscape.dll`, `Bonkscape.Cache.dll` and the local-only music engine, switches Melty's loader on
   (`winhttp.dll.melty-off` to `winhttp.dll`) and writes the scenario to `BepInEx/config/Bonkscape/scenario.json`.
3. Backs up every save a run writes (Megabonk's `Saves` folder, which Steam Cloud syncs, and its Player logs;
   Bonkscape's skill saves, unlocks, breadcrumbs and test rotation) and launches `Megabonk.exe` directly (no Steam hand-off on
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

**Scenarios** (`Systems/Scenario.cs`, files in `tools/scenarios/`): `map`, `stage` (a later stage is reached from the
first, `TestMode.JumpToStage`; the clock waits for it, and its monsters lose Megabonk's per-stage hp and damage share, as
the adventurer arrives without the levels a real run brings: [Gotchas](gotchas.md)), `adventurer`, `autoplay`,
`boss_at` (seconds: the boss portal is opened, or a map's last stage's final portal, tried each second until one
exists), `arena_time_scale` (a boss arena's wave times and `boss_at` multiplied by it; Melty's autoplay runs use 0.25
and call the boss at 40 s on a map whose boss has `arena_waves`, 75 s otherwise, so the Fight Caves' waves and Jad fit
a two-minute run), `seconds`, `steps` (`{"at": 3, "spawn": "giant_mole"}` spawns a monster 4 tiles ahead
(`"goblin:1"`: one tile ahead), or the stage boss
through `EnemyManager.SpawnBoss`; `"weapon": "<weapons id>"` gives one; `"drop": "prayer_potion"` or `"casket"`;
`"kill": "boss"` ends the live stage or final boss through Megabonk's own death call, so what a boss's death unlocks runs
(the Fire cape after Jad; a test adventurer can't kill a third-stage boss in a scenario's time); `"shop": "interact"` puts the adventurer by the nearest Shady Guy (or the shopkeeper standing in for him) and
presses Interact, reporting whether he traded (`shop-refused` for an Ironman); `"lava": "edge"` puts
the adventurer against the nearest lava edge with a burn due at once (autoplay never walks into one: lava has colliders);
`"probe": "<regex>"` logs the active scene objects whose type matches (`"text:<regex>"`: the on-screen texts) and `"interact": "<type>"` presses the nearest interactable of that type (0.9's study of the Graveyard; a scenario on a map not built yet plays Megabonk's own map under it and runs only its steps and shots); `"teleport": "x,y,z"` moves the adventurer; `"pause": "on"` or `"off"` sets Megabonk's time scale as its level-up and reward windows do (the scenario clock stops with it, so a step meant under the pause shares its time); `"gold": "12345"` adds that much gold (through Megabonk's `ChangeGold` up to its 10,000 a frame, straight into the purse above that); `"tab": "prayer"`, `"inventory"` or `"combat"` opens that side panel tab, as F5 or a click does; `"style": "next"` presses the style key (and shows the combat tab), `"style": "defensive"` (or another style) picks it, refused when it isn't one of the adventurer's (the Pure's); `"xp": "attack,strength,defence"` reports those skills' XP; `"clue": "drop"` makes the next kill drop a clue scroll, `"start"` starts a trail at once, `"solve"` moves the adventurer to the current step and does it, `"near"` moves them five tiles from it (for the hint arrow's screenshot); `"pet": "drop"` makes the next boss death with a pet drop it, `"pet": "give:<bosses id>"` makes that pet owned and out; `"pause_menu": "open"` or `"close"` opens or closes Megabonk's pause menu (through its `PauseHandler`); `"interact"` takes a type name ending in `*` for any of that kind (`InteractableShrine*`); `"spec": "<weapons id>"` arms that held weapon's special attack, fills the bar and fires it, `"spec": "switch"` presses
the switch key; `"camera": "far"`, `"near"` or `"north"` sets the camera; `"evolve": "<evolutions id>"` readies an evolution (the weapon levelled, its passive given) and does
what a casket's Open button does). A spawned monster can't be hurt for about its first second (`Enemy.CanTakeDamage`),
so a spec step comes 1.5 s after its monsters' spawn,
`levels` (preset, never saved), `seed_levels` (`{"warrior": 30}`: every skill of another adventurer at that level, in
memory only, for unlocks that look at other adventurers: Ironman's total level 250; `{"warrior": {"attack": 60, "defence": 1}}`: only those skills, 0.14's Pure), `seed_barrows` (`["dharok"]`: that
brother's full Barrows set owned, in memory only, for his unlock), `pool_boss` (`"kril_tsutsaroth"`: that member of the map's `boss_pool` is the run's boss, not a random one), `reload_saves` (`true`: unlocks read again from
unlocks.json, so a suite's later scenario proves a piece the earlier one saved survives a restart: `barrows-save` then
`barrows-load`; the report counts the pieces owned and says whether the
playing adventurer is unlocked), `save_skills` (`true` to test saving; the loop restores the files after), `shots` (seconds), `expect` (checks the report marks `pass` or `MISSING`), `deaths`
(`"allow"` for real deaths), `ui` (the UI test; its `menus` may include `"title"` (0.12): at the last resolution each title screen button a test may press is pressed, what it opened screenshotted and the menu brought back, and Exit, Language and Discord are only checked as wired, so a test never quits, changes the language or opens a browser; a return to the main menu while it's open is skipped, since Megabonk's `SetWindow` toggles and would switch the menu off), `title_screen` (`false`: Megabonk's own main menu for that scenario), `music` (`true` for the OSRS music; it's off in scenarios otherwise, since 0.12: Melty's builds never carry the engine, and on local suites its track changes at scene loads hung the game), `dump_logo` (`true`: Megabonk's logo as the title screen reads it back, written raw into the shots folder for `bonk uisprites mock`; Megabonk's art, kept local), `suite` (several scenarios in one launch: each run is ended as at a
run's end and Megabonk goes back to its main menu, `TransitionUI.LoadMenu`, where the next run starts as after a launch;
about 5 s a scenario. Starting it straight from the run with `MapController.StartNewMap` kept the last run's player,
its adventurer and weapons, so suites before 0.4 ran every scenario as the first one's adventurer). Each scenario
reports `playing as <adventurer> holding <weapons>` and warns on a mismatch, and at its end `weapon attacks: <weapon>
<count>, ...; weapon swaps N`; a suite's screenshots are collected under each scenario's own name. Something with no
set time can ask for a screenshot (`Scenario.ShotSoon`): each weapon's first swap into the adventurer's hand gets one,
0.3 s into the swing. The scenario's clock starts once the OSRS map is built, so
a step at 3 s never lands before the arena (a suite's later runs build theirs in 3-4 s). Scenarios start 0.3 s after
the main menu; Melty's runs keep 3 s. In-game screenshots (`Systems/Shot.cs`) are read back in an IMGUI repaint and
written as PNG by the plugin (Unity's own capture and PNG encoder are stripped from Megabonk), halved on wide screens:
1280x800 in about 0.25 s.

| Scenario | What it checks |
|---|---|
| `smoke` | Morytania (the Desert's second stage since 0.8, reached by the jump) as the Mage, a whip given at 2 s, a potion dropped at 4 s, `player-hit` |
| `mole-lair` | Lumbridge, the boss portal opened at 12 s: the lair swap (`boss-arena`) and a dig (`lair-dig`) |
| `spawn-mole` | the Mole spawned straight in as the stage boss, a goblin, a blowpipe, preset levels (not saved) |
| `ui` | the main menu, character select, map select and settings, then the run's HUD, at 1280x720, 1920x1080, 2560x1440 and 3840x2160 (about a minute) |
| `windows`, `windows-death` | The UI test in a run (0.12): with `ui` set, each of Megabonk's windows gets a screenshot and a report line (its buttons) the first time it opens: its `Window` components (pause, chest, the Shady Guy's shop and the other encounters), the level-up offers (`LevelupScreen.isLevelingUp`) and the death screen and its stats. `windows`: a casket at 8 s, gold and the Shady Guy at 12-14 s, a shrine at 20 s, the pause menu at 26-28 s, level-ups as they come; `windows-death`: the Mage beside the Giant Mole with real deaths, for the death screen |
| `pets-save`, `pets-load` | 0.13's pets, run as a suite: Lumbridge as the Warrior at 99 combat (not saved), the pet forced at 2 s, the boss called at 10 s and killed at 25 s: the Baby Mole drops, comes out and follows (`pet-dropped`, `pet-following`), saved for real (`save_skills`; the loop restores the files after); then Lumbridge as the Mage with `reload_saves`: the pet still owned and out, following again, and character select's pet line in the UI test's screenshot |
| `ladder-start` | 0.14's ladders: Lumbridge as the Warrior preset at Attack, Ranged and Magic 1 (not saved): the Sword is the bronze scimitar (`ladder-tier`), and the level-up offers leave out every weapon above his levels, the whip, godsword, claws, scythe, blowpipe, chinchompas, trident, Ice Barrage and Void knight mace (`gear-reqs`; the report lists them). |
| `ladder-rune` | Attack 40, Ranged 30 and Magic 9: the rune scimitar, a maple shortbow and Earth Strike given and in hand (`ladder-tier`, `weapon-in-hand`). |
| `attack-styles` | The Warrior on Aggressive, then Defensive, then the style key (Controlled): the XP report after each shows Strength, then Defence, then all three rising (`style-switched`, `style-xp`, `combat-tab`). |
| `pure` | The Pure, unlocked by the Warrior seeded at Attack 60 with Defence 1 (`character-unlocked`): Defensive and Controlled are refused, the style key moves him to Accurate, and his run's XP has none in Defence (`locked-skill-kept`). |
| `mole-prayer` | Lumbridge as the Ranger with the Giant Mole called at 5 s: autoplay prays against the Mole, whose roots name no monster, and the prayer half-blocks them as a boss's hits (`prayer-blocked`; the prayer hit tally, logged in scenarios too since 0.14.2, names `giant_mole` and `RootAttackSinglePredictive`). 0.14.1's Melty run 2 had none blocked. |
| `clue-portal` | A clue trail on the God Wars Dungeon, then Megabonk's final portal at 6 s: the stage change takes the map down under a live trail with no errors (0.14.1: 0.14.0's first Melty run logged twenty `TileGround` exceptions there, the clue's arrow asking a destroyed map). |
| `clues` | 0.13's clue trail: Lumbridge as the Warrior without autoplay, a goblin spawned and killed by the starting weapon with a clue drop forced: the scroll picked up starts a trail (`clue-started`), five tiles from each step for a screenshot of the hint arrow (Fayeth standing at her talk step), each step solved, the reward casket's coins and Megabonk's free chest window (`clue-complete`) |
| `title` | the title screen (0.12) at 1280x720, 1920x1080, 2560x1440 and 3840x2160 (`title-screen`), then at the last its buttons: Play, Shop, Unlocks, Quests, Settings, Credits and Leaderboards each open Megabonk's screen, Exit, Language and Discord wired |
| `guard` | standing still beside the Mole: hits land, the lethal-hit guard saves the deaths |
| `death` | the same with `"deaths": "allow"`: the death screen and `run-restarted` |
| `specials-melee` | the Warrior with the whip, godsword and claws: each spec (`spec-<weapon>` checks), the switch key, the godsword's evolution and a spec after it |
| `specials-ranged` | the Ranger: Snapshot, Toxic Siphon (its heal is reported), the Scythe held |
| `specials-magic` | the Mage on Morytania: Wildfire, Deep Freeze, Tidal Chain |
| `weapon-ranger` | the Ranger given the whip, guards spawned a tile ahead: the whip in hand for its swings (`weapon-in-hand`, a screenshot 0.3 s into each weapon's first swap), the bow back after |
| `weapon-warrior` | the Warrior given the magic shortbow and Ice Barrage on Morytania: the bow in hand for its shots, the scimitar back |
| `camera` | Lumbridge without autoplay: the run starts facing north at the near pitch, the far camera at 3 s, the near one again at 5.5 s (screenshots at 4 and 7 s) |
| `saves` | `"save_skills": true`: `Skills.Tick`'s save (every 20 s once XP changed) reads back as written, `skills-saved`; the loop restores the save after |
| `tzhaar-city` | TzHaar City (the Desert's third stage, reached by the jump) as the Warrior: a kill, and at 15 s the adventurer put against a lava edge (`lava-burned`) |
| `fight-caves` | TzHaar City as the Mage with Prayer, Hitpoints and Magic at 99 (not saved), the final portal at 3 s: the Fight Caves (`boss-arena`), the waves at the sheet's times (`arena-waves`), Jad released at 120 s (`arena-boss-released`) and his hits (`player-hit`) |
| `fight-caves-quick` | the same as the Ranger at Melty's speed (`arena_time_scale` 0.25), Jad killed at 72 s by the `kill` step: `boss-blocked-fully` and `unlock-earned` |
| `adventurer-zerker`, `adventurer-void-knight` | Lumbridge as that adventurer for 25 s: a kill and the OSRS model animated |
| `adventurer-durial321` | the same on Morytania, and his Ice Barrage given beside the whip (`extra-weapon`) |
| `adventurer-ironman` | Lumbridge as the Ironman, the Warrior seeded at level 30 in every skill (`seed_levels`, not saved) so he unlocks (`character-unlocked`), the Shady Guy pressed at 6 s (`shop-refused`) |
| `morytania-barrows`, `barrows-save` | Morytania (Desert stage 1 since 0.8) as the Warrior, the boss called at 10 s and killed at about 30 s: `hidden-brother`, `boss-spawned` (the first), `barrows-piece`; `barrows-save` saves it for real |
| `barrows-load` | `reload_saves`: the piece `barrows-save` wrote comes back from `unlocks.json` |
| `barrows-dharok`, `barrows-guthan` | `seed_barrows`: that brother's set owned in memory, played on Lumbridge (`character-unlocked`; Guthan's warspear on its shared type, `weapon-takeover`) |
| `barrows-sets-enemies` | the Warrior at 99 Hitpoints and Defence among spawned brothers: `player-hit`, `set-effect`, the effect counts in the report |
| `barrows-sets-guthan`, `barrows-sets-karil` | that brother played for 60 s: his set's effect on his hits (`set-effect`) |
| `al-kharid` | Al Kharid (the Desert's first stage since 0.8) as the Warrior for 60 s: the map built, a kill, the monsters animated |
| `kalphite-lair` | Al Kharid as the Mage with Prayer, Hitpoints and Magic at 99 (not saved), the boss portal at 12 s: the Kalphite Queen's lair (`boss-arena`), her scripted Spines and Lightning, the first `kill` at 30 s calls her death off and she rises airborne out of the husk (`boss-second-form`), the second at 55 s kills her |
| `wilderness` | The Wilderness (Megabonk's Graveyard) as the Warrior for 90 s: the starting crypt left (`crypt-left`), the map built, a kill, a PKer's ambush at 40 s and its spec (`pker-ambush`, `pker-spec`) |
| `kbd-lair` | The Wilderness as the Mage with Prayer, Hitpoints and Magic at 99 (not saved), the boss door opened at 12 s: Megabonk's final stage, its final boss skinned as the King Black Dragon in his lair (`boss-arena`), his weighted attacks, killed at 75 s: "Defeat the Final Boss" and Megabonk's end-of-run portal |
| `kbd-late` | The same with the boss door opened at 85 s, after a PKer's ambush, as Melty's runs do: the final stage and the KBD in his lair |
| `ardougne` | Ardougne & Seers' Village (the Forest's second stage since 0.10, reached by the jump) as the Warrior for 60 s: the map built, a kill, the monsters animated |
| `knights` | The same as the Mage with Prayer, Hitpoints and Magic at 99 (not saved), the boss portal at 12 s at Camelot, the arena's times x0.25: the Knights of the Round Table two and three at a time on the map (`arena-waves`), then Sir Lancelot (`arena-boss-released`), killed at 60 s |
| `mole-name` | Lumbridge as the first map of a launch, the boss portal at 12 s: the boss bar names the Giant Mole, not another map's boss on the same Megabonk enemy (0.10.0's bug) |
| `god-wars` | The God Wars Dungeon (the Forest's third stage since 0.11, built from OSRS level 2) as the Warrior for 60 s: the map built, a kill, the monsters animated |
| `gwd-graardor`, `gwd-kree`, `gwd-kril`, `gwd-zilyana` | The same as the Mage with Prayer, Hitpoints and Magic at 99 (not saved), that general picked from the pool (`pool_boss`), the boss called at 8 s: his own room (`boss-arena`; Zilyana's on level 0), his three bodyguards at once (`arena-waves`), his scripted attacks (K'ril's prayer-piercing smash in the log), killed at 50 s |
| `inventory` | Lumbridge as the Warrior: the whip, magic shortbow and Fire Strike given at 2-4 s and 12,345 gold at 5 s, the HUD at all four resolutions from 10 s, the prayer tab at 14 s and the inventory again at 20 s, 200,000 gold at 22 s: the OSRS side panel with the coins and the four weapons in the order taken (`osrs-inventory`), Megabonk's weapon slots gone, the prayer book, a white K stack |
| `gwd-kril-melee` | K'ril as the Warrior for 90 s, the boss called at 6 s: his melee reaches the adventurer, and his Prayer smash goes through prayer and drains it (`pierces prayer` in the log), killed at 85 s |

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
passed a panel lying over the adventurer's description and weapon name. It also says whose model the preview shows
(0.6: the adventurer's OSRS model, `CharacterSelect.Preview`; the panel sits in the free gap it measures between
Megabonk's two windows, and passes at all four sizes). `"adventurers": true` in `"ui"` presses each phase-1 adventurer's
button there too and screenshots it (`menu-characters-<id>-WxH`); a locked one (the Ironman, before total level 250)
is reported as locked, as Megabonk keeps the last selection. In the run it screenshots the HUD at each
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
