# Testing

Bonkscape is tested through **Melty's test runs**: Melty installs a release on this PC, starts Megabonk (through
Steam) with a test file in place, records the window, collects the mod's self-checks, and the run is reviewed from
its footage. Melty must be started by the user ([Gotchas](gotchas.md#melty-and-the-loader)).

## Test mode (`Systems/TestMode.cs`)

**Turning on.** At load, and every 3 seconds afterwards until it's found, the mod looks for
`%LOCALAPPDATA%\Melty\test\bonkscape.json`. Its fields:

| Field | Use |
|---|---|
| `checks` | Path of the checks file the mod appends to (`bonkscape-checks.txt` in the same folder). Test mode is on when it's set. |
| `seed` | Seeds autoplay and run randomness (chest/shrine placement, skilling). Default 1. |
| `run` | Run number, logged. |

If the file turns up after some checks already passed, they're written out again. `Dev.AutoStartRun = true` turns on
the same autoplay without Melty (checks are then only logged).

**Autoplay.**

1. **Main menu**: once the cache is decoded and Megabonk's data loaded, wait 3 s, select the first adventurer
   (Warrior) and start the Lumbridge map's stage 0 directly (`MapController.StartNewMap`).
2. **Level-ups**: every 0.8 s of real time (the game is paused), press the first active `UpgradeButton`; if none but
   Megabonk is levelling up, `UpgradePicker.AutoSelectUpgrade`; otherwise take the first offer of any open reward
   window (shrines). In a chest window (0.1.16): press Open, then Take about 3 s later; discard the item if the window
   is still open after 8 s.
3. **Prayer**: every 4 s, switch to the protection prayer against the style most monsters within 10 m use.
4. **Movement** (`PlayerInput.MovementInput` postfix): a slow circle (0.35 rad/s), bent away from any monster within
   7 m, turned into camera-relative input.
5. **Potions**: after 3 kills, if no potion has been drunk and none is on the ground, the next kill always drops one,
   so `osrs-item-picked` and the potion path get exercised. Only the first potion is boosted (0.1.6 onwards), so the
   chat isn't flooded.
6. **Death**: 6 s on the death screen, then `DeathScreen.Restart()` and a new run.

## Self-checks

Each is reported once per game session as a `pass <name>` line (or `fail <name>: why`) in the checks file, and as
`check passed: <name>` in the log. The recipe's `test.checks` lists the same seven names.

| Check | Passes when | Code |
|---|---|---|
| `osrs-cache` | The cache decoded and the OSRS icons were applied to Megabonk's data. Fails at load when no cache is found. | `Runner.Update`, `Plugin.Load` |
| `run-started` | A Lumbridge run has been active for 1 s. | `TestMode.Tick` |
| `lumbridge-arena` | The real Lumbridge was built and the adventurer moved in. (Added in 0.1.7.) | `Arena.Build` |
| `osrs-enemy-killed` | A monster wearing an OSRS model died. | `Combat` (`EnemyDied`) |
| `osrs-item-picked` | Coins, food, flying coins or a prayer potion were picked up. | `Loot` |
| `prayer-switched` | A protection prayer was turned on. | `Prayer.Toggle` |
| `xp-drop` | An XP drop was shown during a run. | `Hud.Init` (XP drop event) |

## What Melty checks

Besides the self-checks, every run is checked for: `installed` (the right version), `started`, `loaded` (BepInEx
loaded `Bonkscape.dll`), `no-crash`, `responding`, `picture` (the window shows something), `ran-to-end` (3 or 4
minutes), `stray-loaders`, and **`loader-errors`**: any warning or error logged from the mod's files fails the run.
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
monsters reach you around walls, that the prayer bar and "Protected!" show, that sizes look right. What it misses:
anything autoplay doesn't do (other adventurers, most weapons, skilling on purpose). Since 0.1.16 autoplay opens
chests, so caskets get exercised; an evolution still needs a maxed weapon and its gear passive by chance.

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
| 0.1.20 | `9634e18a` | | running | Run with `Debug.HideMegabonkHud=false` (per the main session) |

Blank cells weren't looked up. `mcp__melty__test_result` with the test id gives the full record.

## Testing locally

- `Dev.AutoStartRun = true` plays a Lumbridge run by itself on your own launches. Remember Melty switches BepInEx off
  between its launches.
- The log (`BepInEx/LogOutput.log`) has the useful lines: `OSRS assets ready in ... ms`, `Lumbridge built from the
  OSRS cache in ...`, `Lumbridge arena: ...`, `sizing: ...`, `skin <enemy> (<tier>) as <name>: ...`, `check passed:`,
  and every chat line as `[chat]`.
- Offline: `bonk preflight` checks the sheets against the interop assemblies and both caches; `bonk worldscan`
  checks every map region decodes; `bonk render` and `bonk world` make images to look at.

Gaps (per-feature checks, a hand-over playtest mode, the other adventurers) are on the [docket](docket.md).

<!-- sources: src/Bonkscape.Plugin/Systems/TestMode.cs -->
