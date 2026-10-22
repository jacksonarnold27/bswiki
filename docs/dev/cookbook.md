# Cookbook

Short recipes for the content every release adds, so nobody works them out again: a map, a boss arena, a weapon and
its special attack, an adventurer, a test check. Each one names the files and sheet columns to touch, the commands to
run and the gotchas that bit 0.2.x. Written against **0.2.12** (`4e610d5`) and, for special attacks, the parked
`specials-0.4` branch (`edf1ee4`). The why behind each gotcha is on [Gotchas](gotchas.md); every column is on the
[Sheets reference](sheets-reference.md). The main session owns `src/` and `sheets/`: a prep session writes only its
release's new rows, committed by name.

## Commands every recipe uses

Run from the repo root (Git Bash). `bonk` is the tools project; `BONK_CACHE` picks the full dev cache and `BONK_OUT`
where renders go (default the current folder):

```bash
alias bonk='dotnet run -c Release --project src/Bonkscape.Tools --'
export BONK_CACHE=D:/Modding/osrscache/cache BONK_OUT=derived/check
```

**Preflight** (`bonk preflight <sheets> <interopDir> <devCache> <playerCache|-> <genOut|-> <report>`): checks every
sheet against Megabonk's interop assemblies and both caches, and rewrites `docs/preflight.md`,
`sheets/cache_assets.json` and `Generated/Sheets.g.cs`:

```bash
bonk preflight sheets D:/Steam/steamapps/common/Megabonk/BepInEx/interop D:/Modding/osrscache/cache C:/Users/jacks/.runelite/jagexcache/oldschool/LIVE src/Bonkscape.Plugin/Generated/Sheets.g.cs docs/preflight.md
```

Exit 0 means no phase-1 open items; exit 4 means some, and the code and report are written anyway, so read the exit
code (or `## Phase 1: 0 open item(s)` in the report). Passing `-` as `genOut` skips only `Sheets.g.cs`:
`sheets/cache_assets.json` and the report are rewritten every time. In a checkout another session is editing, run it
on a copy of `sheets/` with the report in a scratch folder, or leave the regenerated files to the session that owns
them.

**Package** (after bumping `Plugin.Version` in `src/Bonkscape.Plugin/Plugin.cs`):

```bash
python tools/package.py 0.3.0
```

It refuses, writing nothing to `dist/`, when `check_docs.py --head --release` fails, the Release build fails,
`Plugin.Version` isn't the version asked for, `README.md`'s Settings table misses a `Config.Bind` key, or `bonk
unstripped` finds a call into a member Il2CppInterop rebuilt (exit 3). The last one alone, on a built DLL:

```bash
bonk unstripped src/Bonkscape.Plugin/bin/Release/net6.0/Bonkscape.dll D:/Steam/steamapps/common/Megabonk/BepInEx/interop
```

**Try it in game** with the local loop ([Testing](testing.md#the-local-loop)): it builds, installs, launches Megabonk
straight into a scenario's map, stage and adventurer, runs its timed steps and prints the checks, every Bonkscape
warning, the hooks that never ran and the report, then closes the copy it started and puts everything back:

```bash
python -I tools/loop.py tools/scenarios/smoke.json
python -I tools/loop.py tools/scenarios/smoke.json tools/scenarios/mole-lair.json --one-launch
```

A scenario is a small JSON file in `tools/scenarios/` (keys on [Testing](testing.md#the-local-loop)). For new content,
write one that goes straight to it: the map (`"map"`, `"stage"`), the monster or boss (`{"at": 3, "spawn": "<enemies
id>"}`), the weapon (`{"at": 2, "weapon": "<weapons id>"}`), skill levels (`"levels"`, never saved), screenshots
(`"shots"`) and the checks it must reach (`"expect"`). A patch version is checked this way; the Melty test runs once
per release ([Testing](testing.md); the user starts Melty: [Melty and the loader](gotchas.md#melty-and-the-loader)),
then the docs ([How to update these docs](updating-docs.md)). A screen or HUD change gets the UI test too
(`tools/scenarios/ui.json`: menus and HUD at 720p to 4K).

## Add a map

**What the code allows today.** `Rows.Maps` keeps one phase-1 `maps` row per Megabonk map (`EMap`), the lowest
`bonk_base_stage`; `Bonk.Active`, `Rows.Current`, the waves, the stage names and the arena all key off that row, and
every stage of that Megabonk map gets the same arena. Megabonk has three maps (`dump.json`): Forest (3 stages,
Lumbridge's), Desert (3 stages, Morytania's) and Graveyard (1 stage), so only the Graveyard is free. A second
phase-1 row on a taken map gets no arena, waves or runs, and its monsters join Lumbridge's pool (an enemies row whose
`maps` has no phase-1 map gets `Bonk.LumbridgeMap`). Putting a map on a later stage of a taken map, as the milestone plan does for later
releases, needs per-stage rows in the code first. The Graveyard's timeline names `Ent1` as its boss, the Forest's
first boss base, which `giant_mole` already holds: find out what its boss fight really spawns before giving it a boss.

**Files and columns**

- `sheets/maps.json`, one row ([columns](sheets-reference.md#maps)): `bonk_base_map` (a free `EMap`),
  `bonk_base_stage` (below that map's stage count: autoplay starts `map.stages[bonk_base_stage]`), `osrs_area`
  (`[x0, y0, x1, y1]`, from an outline in the sketch tool), `spawn_tile` and `boss_tile` (walkable within 3 tiles),
  `osrs_music_track`, `props`, `skilling_nodes`, `waves_id` (the map's id), `boss_id` (a `bosses` row or `none`),
  `fallback_enemy`, `difficulty` (Morytania 0.8), `sky` (`megabonk` or `#rrggbb`), `phase` 1, `status` `todo`.
- `sheets/enemies.json`, a row per monster ([columns](sheets-reference.md#enemies)) with `maps: ["<map id>"]`. Each
  `bonk_base_enemy` must be a Megabonk `EEnemy` no other phase-1 row uses: `Rows.EnemyByBonk` holds one row per base
  and the last row wins. Minibosses take `Miniboss*` bases; the boss takes the stage's boss base (the timeline's
  `boss` in `dump.json`: `Ent1` to `Ent3` on the Forest, `Pharaoh1` to `Pharaoh3` on the Desert). The plan's rule:
  a monster's `hp` and `damage` are the stats of the Megabonk slot it fills, then the map's `difficulty` scales them.
  Minibosses and bosses keep Megabonk's own stats times `difficulty`.
- `sheets/waves.json`, rows with `map_id` = the map ([columns](sheets-reference.md#waves)). `start` and `unlock`
  apply at any minute; `swarm` and `miniboss` only change an event that exists in that stage's Megabonk timeline at
  the same minute (within 0.01). The minutes are in `BepInEx/config/Bonkscape/dump.json` (`maps[].stages[].events`,
  written when `[Dev] DumpData` is on):
  Forest and Desert stage 0 have minibosses at 3 and 8 and swarms at 4 and 7; the Graveyard has minibosses at 3, 7,
  10 and 13 and swarms at 4, 8, 11 and 14.
- Code (the main session's): `Content.StageName` names Lumbridge's later stages (*Lumbridge Swamp*, *Lumbridge Swamp
  Caves*); every other map shows its row's name on every stage.

**Commands**

```bash
python -I tools/mapideas/rosters.py
```

Writes `docs/design/rosters.md`: the attackable NPCs that spawn inside each map's area and outline, against the
enemies sheet. Then find ids (`bonk npcs <name>`, `bonk items <name>`, `bonk objects <name>`) and check the ground:

```bash
bonk world derived/check/morytania 3400 3158 3783 3607 1 300 holes canifis:3494:3488:200:2600:1500
```

`bonk world <outDir> x0 y0 x1 y1 [skipDecor 0|1] [minFaces] [cave] [holes] [name:x:y:yaw:dist:height ...]` builds the
area as the plugin does and prints regions (and missing ones), boxes, `raised-house rim walls` and `tiles with no
ground: N (M of them not blocked)`; `holes` lists the open ones. It writes `overview.png`, a close-up per view and
`walkable.png` (green walkable, blue water, grey blocked, brown solid, tan roofed). Pass `1 300` for a map over 40,000
tiles (the plugin's detail budget, `[Map] LargeMapMinFaces`), `0 0` for a smaller one. Then, where the overview or the
hole list looks wrong:

```bash
bonk tiles 3480 3475 3510 3500 all
```

`bonk tiles <x0 y0 x1 y1> [all]`: the level-1 bridge flags, the level-0 ground (`x` marks a hole) and every wall the
builder skipped; use it on raised houses (here, Canifis around its spawn tile). It applies `WorldBuilder`'s rules,
0.2.11's rim walls included: a level-1 wall or wall decoration beside a bridge tile counts as `beside a bridge (rim)
taken` (65 walls and 13 decorations here), matching `bonk world`'s `raised-house rim walls`.

```bash
bonk boxes 3400 3158 3783 3607 3494 3488 8
```

`bonk boxes <area x0 y0 x1 y1> <cx cy r> [cave] [gridonly]`: the colliders within `r` tiles of a tile, a tile grid
(`W` walkable, `S` solid, `z` solid with no ground, `w` water, `.` blocked, `h` no ground) and the ground heights, then
the area's steepest walkable slopes (the adventurer climbs up to 62 degrees, `PlayerMoveFix`); `gridonly` prints just
the grid and the slopes. Run it at the spawn tile, the boss tile and any hole beside a `W`. Last, the preflight.

**Gotchas from 0.2.x**

- A third phase-1 map changes test coverage: autoplay plays map `rotation mod <phase-1 maps>`, so a two-run test no
  longer plays every map (0.2.1 alternated two).
- Megabonk's Desert timeline names the Forest's minibosses at minute 8; Morytania's `miniboss` row at 8 replaces them.
  Give every event of the stage a row. The log line *"waves: <map> on Megabonk's <EMap> stage N: M timeline events
  set"* counts what matched.
- When a new map takes a base a planned row used, move the planned row (0.2.1 moved the green dragon to
  `GhostPurple`, the revenant imp to `Ghost`, TzTok-Jad to `Pharaoh3`).
- Big maps: Morytania (384 x 450) went from 10.1M to 5.8M faces under the detail budget, which spares the names in
  `Osrs.BuildArena`'s track list (Tree, Oak, Rocks and the ore rocks) because arena skilling spots go on those (0.2.2:
  Morytania's first run found 5 plain rocks). Every phase-1 map is built at load; a run waits up to 45 s for its build.
- Raised houses (0.2.11): Canifis's stilt-house walls stand on level 1 beside bridge tiles; `WorldData.BridgeRimWalls`
  counts them (1,217 on Morytania). Check any raised building with `bonk tiles`.
- Holes (0.2.12): a tile whose ground draws nothing is unwalkable and boxed beside ground on every map (Morytania 133
  tiles, 52 boxes, which `bonk world` counts as `cave edge boxes`). An open hole with no `W` next to it in `bonk boxes`
  is inside the void and harmless.
- Every region inside `osrs_area` must be in the dev and player caches, or the map falls back to Megabonk's stage with
  `props` scenery; the margin around it may be void. The preflight checks both caches.
- Falls: 25 m under the lowest ground puts the adventurer back on `spawn_tile`, which faces west.
- Music plays only on local builds: release zips leave out `OsrsKit.Music.dll` (the publishing gate), and the
  preflight reports tracks as phase 2+.

**Done when** the preflight has 0 phase-1 open items, the overview and close-ups look right with no open hole beside a
walkable tile, and a test run on the map logs *"<map> arena: ..."*, passes `osrs-arena` and logs the waves line with
every event set.

## Add a boss arena

A boss arena (lair) is a second area the fight moves into when the map's boss is summoned, as `giant_mole_boss` does
since 0.2.10. `Osrs` builds it at load like a map, keyed by the boss id (`Osrs.Arenas["giant_mole_boss"]`); when
`EnemySkins` skins a boss-tier enemy that isn't a `Miniboss*`, `Arena.BossSummoned` records it and the next
`Arena.Tick` swaps to the lair under the loading cover and puts the boss on `arena_boss_tile`
([the arena pipeline](architecture.md#the-arena-pipeline-systemsarenacs)).

**Files and columns**

- `sheets/bosses.json` ([columns](sheets-reference.md#bosses)): `id`, `enemy_id` (the enemies row), `attacks`,
  `phase_thresholds`, `music_override`, `osrs_arena` (`[x0, y0, x1, y1]`), `arena_spawn_tile` and `arena_boss_tile`
  (`[x, y]`, inside the arena and walkable within 3), `pet_item_id`, `pet_rate`, `phase` 1.
  `Rows.BossArenas` takes only rows with `phase` 1 or less, four `osrs_arena` numbers and two numbers in each tile.
- `sheets/maps.json`: the map's `boss_id` names the row. `Rows.BossArenaFor` matches both `maps.boss_id` and the
  row's `enemy_id`, so the enemies row must be the one skinned as that stage's boss: its `bonk_base_enemy` holds the
  stage's boss base. `EnemySkins` treats an enemy as the boss when Megabonk's `IsBoss`, `IsStageBoss` or
  `IsFinalBoss` says so and its base isn't a `Miniboss*`.

The Giant Mole's row as the example: `osrs_arena` `[1728, 5120, 1791, 5247]`, `arena_spawn_tile` `[1752, 5152]`,
`arena_boss_tile` `[1759, 5188]`, attacks *Claw* (contact) and *Dig* (`burrow_teleport_every_12s`, telegraph 1200 ms).

**Commands.** Lairs are built with `WorldOptions.WallOffBlocked`, so pass `cave` to both checks:

```bash
bonk world derived/check/mole_lair 1728 5120 1791 5247 0 0 cave holes boss:1759:5188:200:2600:1500
```

```bash
bonk boxes 1728 5120 1791 5247 1752 5152 8 cave
```

The Mole lair: 64 x 128 tiles, 8 regions (4 of them empty void outside the cave), built in about 0.3 s; its *cave edge
boxes* count is the walled-off tiles.

**Gotchas from 0.2.x**

- 0.2.10's lair run fell twice off the cave walls' flat tops: lairs wall off every unwalkable tile beside a walkable
  one (0.2.11), and diagonal-wall tiles too (0.2.12).
- 0.2.11's lair run fell through a stone floor patch drawn only by objects, about 3 m up: tiles with no ground are
  unwalkable and boxed (0.2.12).
- Monsters spawned on top of the cave walls until three `SpawnPositions` postfixes (0.2.11) moved a spawn that lands
  off the cave floor to a reachable floor tile 5 to 16 steps away.
- The swap rebuilds with `keepStage`: Megabonk's stage is already hidden, and searching it again also catches pooled
  weapons and projectiles.
- `RenderSettings`' getters are stripped, so `Content.KeepLook` keeps each stage's sky at load; `LeaveBossArena` puts
  it back at each stage start and run end. A death in the lair restarts on the map.
- Every lair gets the cave look (black fog, a black skybox copy, vertex colours at 82%) and the chat line *"You follow
  the <boss> down into its lair."*; a lair above ground needs code.
- `Bosses.cs` reads only `Rows.MoleBoss` (Lumbridge's `boss_id`) and only the `burrow_teleport_every_<N>s` pattern.
  A new boss gets the lair, its tile and the cave fixes, not behaviour from `attacks` or `phase_thresholds`.
- Only the regions inside `osrs_arena` must exist (`WorldData.MissingAreaRegions`): the Mole lair's neighbours are void.
- Where Megabonk's next-stage portal appears after a lair kill is unconfirmed: no test has killed the Mole.
- Test runs call the boss at 1:15 (`TestMode.CallBoss` opens Megabonk's boss portal); `boss-spawned`, `boss-arena`
  and `lair-dig` are optional, log-only checks.

**Done when** the preflight passes the lair, `bonk boxes ... cave` around the spawn and boss tiles shows every tile
beside a `W` as `W`, `S` or `z` (boxed), and a test run logs *"arena: in <boss>'s lair after N ms"* and passes
`boss-arena`.

## Add a weapon

**Files and columns:** `sheets/weapons.json` ([columns](sheets-reference.md#weapons)).

- `bonk_base`: the Megabonk `EWeapon` whose behaviour, prefab and projectile the row reuses. `Rows.WeaponByBonk` holds
  one row per `EWeapon`. A `new:...` base passes the preflight but `Content.ApplyWeapon` and the level-up pool skip
  it: the row does nothing until code adds the weapon type. `bonk members <interopDir> EWeapon` lists the values.
- `damage` ... `knockback` replace the `WeaponData` and its `baseStats`; `level_curve` is `Stat:Type:Value` entries
  (`EStat`, `EStatModifyType`) that replace the upgrade pool.
- `gear_reqs`: `"starting_weapon"` or `{"skill": level}`, the levels needed to start a run with it (keep
  `skills.unlocks` in step).
- `osrs_item_id` (icon and model), `osrs_icon_sprite_id` (spells), `osrs_projectile_or_spotanim_id` (`item:<id>`,
  `spotanim:<id>` or `none`), `sfx_id`.
- `osrs_attack_anim`: the sequence the adventurer plays when the weapon attacks, or -1. It's baked on every
  adventurer as `attack:<id>`, and merged with walking and running (`+walk`, `+run`) through the weapons' shared human
  interleave list, because spell casts have none.

**Finding and checking the attack sequence.** Names come from RuneLite's gameval files
(`D:\Modding\osrs-repos\cache\runelite\runelite-api\src\main\java\net\runelite\api\gameval\AnimationID.java`): for
example `HUMAN_SWORD_SLASH = 390` (dragon scimitar), `SLAYER_ABYSSAL_WHIP_ATTACK = 1658`, `HUMAN_BOW = 426`,
`HUMAN_CASTSTRIKE_STAFF = 1162`, `DCLAWS_HUMAN_ATTACK = 7527`. On `master` the preflight doesn't check
`osrs_attack_anim`, so check it yourself:

```bash
bonk seqinfo 390 7527
```

Prints each sequence's frames, length and interleave groups; `absent` means not in the cache, and a `maya` id other
than -1 is a skeletal animation the baker can't use.

```bash
bonk anim worn:4587 390 12 819
```

`bonk anim <npc|warrior|worn:items> <seq> [frames] [moveSeq]` bakes the sequence as the plugin does and writes its
frames side by side to `renders/anim_<npc>_<seq>.png`, or `..._<seq>+<moveSeq>.png` merged with that movement.
`warrior` is the Warrior's kits and gear and `worn:` a male body in those items (both named npc `0` in the file
name). In game, the cache
build logs each adventurer's baked sequences, and a sequence it couldn't bake under *"not baked: ..."*.

**Gotchas from 0.2.x**

- IL2CPP inlined `WeaponBase.Use`, so a patch on it never ran and 0.1.31 failed `adventurer-animated`
  ([IL2CPP and Harmony](gotchas.md#il2cpp-and-harmony), MODLOG 20). Attacks hook
  `WeaponAttack.SuccessfullySpawnedProjectile`; a Megabonk weapon with no row logs *"adventurer attack: Megabonk weapon
  <X> has no weapons row"*.
- OSRS item models lie flat: 0.2.0 drew rune arrows metres long. Projectiles and pickups are fitted by their longest
  side (`UnityConv.Longest`).
- Icons are written into Megabonk's data fields (`Content.ApplyIcons`), never through a `GetIcon` patch: running the
  original of an IL2CPP virtual method from Harmony recurses (MODLOG 5).
- Level-up offers are only Bonkscape weapons (`UnlockUtility.GetAvailableWeapons` postfix): every phase-1 row joins
  the pool, and every phase-1 weapon's attack is baked on every adventurer, so each one adds load time.
- A weapon's attack sound plays at most every 0.3 s.

**Done when** the preflight passes, `bonk anim` shows the swing, and a test run's log shows the weapon's sequence
baked (*"<adventurer> animations: ... attack:<id> ..."*).

### Its special attack (parked on `specials-0.4`)

Special attacks are built on the branch `specials-0.4` (`edf1ee4`: *"WIP 0.4 special attacks (parked, untested)"*),
never run in game, and merge when 0.4 starts. Read it without switching branches:

```bash
git show specials-0.4:src/Bonkscape.Plugin/Systems/Specials.cs
```

```bash
git show specials-0.4:sheets/weapons.json
```

**Columns it adds** to `weapons`: `spec_cost` (% of the energy bar, 0 = no spec), `spec_anim` (the adventurer's
sequence, baked as `spec:<id>` and played whole, at most 2.2 s; -1 falls back to the attack), `spec_spotanim` (a spot
animation shown as a flipbook, `SpotFx`, or -1), `spec_spot_on` (`player` or `target`), `spec_name` and `spec_effect`:
steps `verb:args` separated by commas, `x` being a multiple of the weapon's average hit this run:

| Step | Args | Example (branch) |
|---|---|---|
| `hit` | `x` | `hit:1.5,stun:1.5` (Sever) |
| `hits` | `x/x/...:gap` | `hits:1.2/0.6/0.4/0.4:0.12` (Slice and Dice) |
| `aoe` | `tiles:x` | `hit:2.5,aoe:2:0.5` (The Judgement) |
| `slow` | `tiles:mult:seconds` | `hit:1.25,slow:2:0.5:4` (Energy Drain) |
| `stun` | `seconds` | |
| `freeze` | `tiles:seconds:x` | `freeze:4:3:0.5` (Deep Freeze) |
| `heal` | `fraction` | `hit:1.5,heal:0.5` (Toxic Siphon) |
| `cone` | `tiles:degrees:x` | `cone:5:70:1.5` (Wildfire) |
| `chain` | `jumps:tiles:x` | `chain:5:3:1.0` (Tidal Chain) |

Hits go through `Enemy.DamageFromPlayerWeapon` and debuffs through `AddDebuff`/`SetSpeedMultiplier`, so hitsplats, XP
and kills work as for any hit; there are no new Harmony patches. Energy: full in 60 s, plus 0.25 a kill from a budget
that builds up at the refill rate, so kills at most double it. Keys `[Special] FireKey` (`F`) and `SwitchKey` (`Q`).
Autoplay fires when it can and switches every 20 s when it holds two spec weapons; `spec-fired` and `spec-switched`
are optional checks. On the branch the preflight also checks sequences (a new kind `seq`, which refuses skeletal
ones), `spec_cost` from 0 to 100, `spec_spot_on` and the `spec_effect` grammar.

**Finding the ids.** Grep RuneLite's gameval names in `AnimationID.java` and `SpotanimID.java` (same folder as above)
for `SP_ATTACK`, `SPEC` or `SPECIAL`, then check each id in the cache:

```bash
grep -n -E "SP_ATTACK|SPEC" D:/Modding/osrs-repos/cache/runelite/runelite-api/src/main/java/net/runelite/api/gameval/AnimationID.java
```

```bash
bonk seqinfo 1872 7514 7644
```

```bash
bonk render spotanim 347
```

The branch's ids: dragon scimitar `SP_ATTACK_DRAGON_SCIMITAR = 1872` with `SP_ATTACK_DRAGON_SCIMITAR_TRAIL_SPOTANIM =
347`; magic shortbow `SNAPSHOT = 1074` with `SP_ATTACK_SNAPSHOT_SPOTANIM = 256`; dragon claws `HUMAN_DRAGON_CLAWS_SPEC
= 7514` with `DRAGON_CLAWS_SPOT = 1171`; Armadyl godsword `AGS_SPECIAL_PLAYER = 7644` with
`DH_SWORD_UPDATE_ARMADYL_SPECIAL_SPOTANIM = 1211`; the whip and blowpipe reuse their attacks (1658, 5061) with
`SP_ATTACK_ABYSSAL_WHIP = 341` and `TOXIC_BLOWPIPE_SPECIALATTACK = 1043`. Invented specs (Wildfire, Deep Freeze, Tidal
Chain) reuse the spell's cast and its projectile's spot animation. Then `bonk anim worn:<items> <spec_anim>` to see it.

**When it merges**, the docs gates need, in the same commit: the two `[Special]` keys on
[Settings](../wiki/settings.md) and in `README.md`'s Settings table (`package.py` refuses otherwise), the four new
`spec_*` columns on the Sheets reference, and the optional checks on Testing. Its code comments still say 0.3.

## Add an adventurer

**Files and columns:** `sheets/characters.json` ([columns](sheets-reference.md#characters)).

- `bonk_base_character`: the Megabonk `ECharacter` whose slot, prefab, movement and hitbox it takes.
  `Rows.CharacterByBonk` holds one row per `ECharacter`; taken: `SirOofie` (Warrior), `Robinette` (Ranger), `Fox`
  (Mage), and `Ninja` and `SirChadwell` by the planned Pure and Ironman. `bonk members <interopDir> ECharacter` lists
  them.
- `style`, `attack_style`, `starting_weapon` (a phase-1 weapon of the same style; `Content.StartingWeapon` gives the
  best weapon of that style whose `gear_reqs` the adventurer's skills meet), and the stat columns `hp` ... `luck`,
  which replace the Megabonk character's own modifiers (0 removes it).
- `osrs_player_model` (JSON): `osrs_kits_male` (seven identity kits: head, jaw, torso, arms, hands, legs, feet; the
  Warrior's are `[0, 10, 18, 26, 33, 36, 42]`), `osrs_items` (worn item ids), `osrs_colors` (0, the only value used),
  `osrs_stand_anim` (808), `osrs_walk_anim` (819), `osrs_run_anim` (824), `osrs_death_anim` (836). Put the starting
  weapon's item in `osrs_items`: the own body holds it, and every other weapon gets a body of its own with its item
  swapped into the weapon slot (`Osrs.PlayerWeaponBodies`, 0.4), so a new weapon row needs an `osrs_item_id` with a
  worn model to show in hand.
- `unlock_condition` isn't read by the code yet.

**Commands**

```bash
bonk items "Rune full helm" "Rune platebody"
```

Each match prints `INV` when its inventory model is in the cache and `+W` when its male worn model is.

```bash
bonk render player 0 0,10,18,26,33,36,42 1163,1127,1079,4587
```

`bonk render player 0 <kits> <items|->` builds the body as the plugin does (the `0` is a placeholder id) and writes
`renders/player_0.png`, or names the missing models. `bonk kits` lists the first 60 identity kits as
`id:p<body part>:<model count>` (`x` = not selectable).

**Gotchas from 0.2.x**

- Worn items missing from a player's cache are dropped and the body built again (log *"<name>: some worn items aren't
  in this cache; built with N/M"*); the preflight checks every kit and worn item, and that the whole body builds.
- Megabonk characters' colliders differ (`colliderHeight` in `dump.json`), and the adventurer's size comes from it.
  `Sizing.Measure` measures again when the adventurer changes between runs (0.1.30, log *"sizing: adventurer changed
  (A -> B), measuring again"*), but no test has seen that yet: each Melty test is a fresh game (docket: *Sizing per
  adventurer*). Collider bounds read 0 or tilted at times, so it measures upright (MODLOG 18).
- Skills save per adventurer, `%LOCALAPPDATA%\Bonkscape\skills_<id>.json`, seeded once from the old shared
  `skills.json`: renaming an `id` starts a new save.
- Test runs rotate the phase-1 adventurers: `(run - 1 + rotation) mod <count>`; `[Dev] AutoStartRun` plays the first
  row.
- Starting weapons are set in the `DataManager.Load` postfix, once per game start; the character select panel works
  them out live, so it can show a weapon the run doesn't give until Megabonk restarts (untested).
- Every phase-1 weapon's attack is baked on the new body too, which adds to the cache build.

**Done when** the preflight passes, the render shows the outfit, and a test run with the adventurer passes
`adventurer-animated`.

## Add a test check

A check reports that a feature ran in a test run. `TestMode.Pass(name)` records it once per game session and logs
*"check passed: <name>"*; only names in `TestMode.Checks` are written to Melty's checks file as `pass <name>` lines.

**Choose: required or optional.** Melty reads at most 12 check lines, and `TestMode.Checks` holds 12 (the recipe's
`test.checks`, set when the release is submitted). A new required check replaces one of them in both places;
otherwise it's optional: logged as *"check passed: <name> (optional, log only)"* and never written to Melty's file.
Optional today: `osrs-cache` (out of the twelve since 0.4, for `spec-fired`), `skill-rules`, `boss-spawned`, `boss-arena`, `lair-dig`,
`skilling-gathered`, `gear-slot-rules`, `spec-switched`, `spec-<weapon>`, `weapon-in-hand`, `player-hit`, `run-restarted`.

**Steps**

1. Call `TestMode.Pass("<name>")` where the feature has visibly happened (as `Arena` passes `boss-arena` after the lair
   swap). Use a kebab-case name.
2. For a required check, edit `TestMode.Checks` and the release recipe's `test.checks` (submitted to Melty with the
   release) together.
3. Name it on [Testing](testing.md#self-checks): required checks in the table, optional ones in the list under it.
   `check_docs.py --head` reads `TestMode.Checks` from HEAD and fails when a name isn't on that page, so commit the
   code and the page together.
4. Make sure autoplay reaches it in every run: both maps, every adventurer, inside the 2-minute run (the casket
   fallback is at 45 s, the boss call at 1:15). For what autoplay can't reach, `[Dev] ManualTest` hands the run to you
   and still writes the checks.
5. Give it a scenario that reaches it fast (`"expect": ["<name>"]`, steps that spawn or give what it needs) and run it
   with the local loop: the report marks it `pass` or `MISSING`, and the dead-hook list shows whether the hook behind
   it ran at all.

**Gotchas from 0.2.x**

- An optional pass written to Melty's file pushed a required one past the 12 lines: 0.2.0's run 2 lost
  `prayer-blocked`, 0.2.5's run 1 lost `evolution`, and neither run counted though both passed in the log. Since 0.2.6
  `TestMode.InRecipe` keeps optional checks log-only.
- Melty reads `pass <name>` and `fail <name>: why` lines only; a recipe name the mod never reports fails the run
  (0.1.0's test had every check missing).
- Melty fails a run on any warning or error from the mod's files (`loader-errors`): 0.2.7 failed on autoplay's chest
  warnings. `TestMode.Fail` logs a warning, so call it only for a real failure; log expected misses as info.
- A hook IL2CPP inlined installs and never runs (`WeaponBase.Use` 0.1.31, the casket's open 0.1.33,
  `PlayerInput.MovementInput` 0.1.35): give each new hook a counter or a check before trusting it.
- A recipe check must pass in every run. When test runs began alternating maps (0.2.1), `lumbridge-arena` became
  `osrs-arena`.
- Checks that depend on luck fail short runs: 0.2.9's first 2-minute run never got `prayer-blocked`. Autoplay now
  lets monsters of the prayed style in and doesn't drain prayer until it passes.
- A diagnostic build's probe check fails its test by design (0.1.6).

**Done when** a test run's log shows *"check passed: <name>"* and, for a required check, Melty's result lists it in
each run.

<!-- sources: tools/loop.py src/Bonkscape.Plugin/Systems/Scenario.cs sheets/maps.json sheets/enemies.json sheets/waves.json sheets/bosses.json sheets/weapons.json sheets/characters.json src/Bonkscape.Plugin/Core/Rows.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Systems/Bonk.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Arena.cs src/Bonkscape.Plugin/Systems/Bosses.cs src/Bonkscape.Plugin/Systems/PlayerSkin.cs src/Bonkscape.Plugin/Systems/TestMode.cs src/Bonkscape.Tools/Program.cs src/Bonkscape.Tools/WorldPreview.cs src/Bonkscape.Tools/Preflight.cs tools/package.py -->
