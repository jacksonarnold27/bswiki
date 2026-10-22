# Sheets reference

`sheets/*.json` is the design data and the source of truth. Every system starts as rows here; the code reads them
through `Generated/Sheets.g.cs`. Each file has the same shape:

```json
{
  "sheet": "prayers",
  "about": "One line on what a row is",
  "columns": ["id", "name", "...", "phase", "status"],
  "rows": [ { "id": "protect_melee", "name": "Protect from Melee", "...": "...", "phase": 1, "status": "verified" } ]
}
```

<!-- gen:sheet-list -->
| Sheet | Rows | Columns | Row statuses |
|---|---|---|---|
| `audio.json` | 17 | 6 | 14 built, 3 todo |
| `bosses.json` | 2 | 12 | 1 built, 1 todo |
| `cache_assets.json` | 263 | 9 | 6 todo, 257 verified |
| `characters.json` | 5 | 17 | 2 todo, 3 verified |
| `drops.json` | 12 | 10 | 7 built, 3 todo, 2 verified |
| `enemies.json` | 23 | 20 | 14 built, 3 todo, 6 verified |
| `evolutions.json` | 4 | 10 | 3 built, 1 todo |
| `hooks.json` | 39 | 9 | 9 built, 30 verified |
| `maps.json` | 6 | 19 | 4 todo, 2 verified |
| `passives.json` | 11 | 10 | 10 built, 1 todo |
| `prayers.json` | 3 | 12 | 3 verified |
| `skills.json` | 10 | 8 | 5 built, 5 verified |
| `ui.json` | 41 | 8 | 4 built, 1 todo, 36 verified |
| `waves.json` | 16 | 8 | 16 built |
| `weapons.json` | 13 | 27 | 10 built, 2 todo, 1 verified |
<!-- /gen:sheet-list -->

## Rules the preflight checks on every sheet

`bonk preflight` (`src/Bonkscape.Tools/Preflight.cs`) loads every sheet except `cache_assets.json` and checks:

- **Every row has every column**, and no row has a column the sheet doesn't declare.
- **No cell is unfilled**: `null`, `""` and `"todo-value"` are findings. Use `"none"` or `[]` for "nothing".
- **`status`** is `todo`, `built` or `verified`.
- **`phase`** sorts the findings: phase-1 findings are "open items" and make the preflight exit with code 4; phase 2/3
  findings are listed as "unfinished by design". The report and the generated code are written either way, so read
  the exit code.
- **References** to other sheets resolve (`'goblin' is not a row of enemies`), with `none`/`any` allowed where noted.
- **Megabonk names** resolve against `Assembly-CSharp.dll` in the interop folder: enum values (`EWeapon`, `ETome`,
  `EEnemy`, `ECharacter`, `EMap`, `EStat`, `EStatModifyType`; a `new:` prefix skips the check), and for `hooks`, classes
  and methods.
- **OSRS ids** resolve in the dev cache: definitions decode and their models load (NPCs, items, objects, kits, worn
  items, spot animations), sprites and fonts exist, sounds synthesise to something. Each asset becomes a row of
  `cache_assets.json`, also checked against this PC's own (player) cache.

The report goes to `docs/preflight.md`, `cache_assets.json` is rewritten, and the generated rows go to
`Generated/Sheets.g.cs` when a `genOut` path is given (pass `-` to skip).

### Status, by convention

| Status | Means |
|---|---|
| `todo` | Designed, not built. The plugin ignores rows with `phase` > 1 whatever their status. |
| `built` | In the code. |
| `verified` | Seen working in a Melty test run (self-check or footage). |

The preflight only checks the spelling; keeping statuses honest is a manual step at each release
([How to update these docs](updating-docs.md)).

## characters

One row per playable adventurer; each takes over a Megabonk character. Read by `Content.ApplyCharacter`,
`Osrs.BuildPlayer`, `PlayerSkin`, `Combat.CurrentCharacter`, `TestMode` (first row = autoplay's adventurer).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Row key. | |
| `name` | Shown name (character select, `GetName`). | |
| `style` | `melee` / `ranged` / `magic`. Decides which skill the default damage trains and which weapons can be its starting weapon. | |
| `attack_style` | `accurate` / `aggressive` / `defensive`: melee XP goes to Attack / Strength / Defence. | |
| `starting_weapon` | Weapon row it starts with before skill upgrades. | row of `weapons` |
| `bonk_base_character` | Megabonk `ECharacter` whose slot, prefab, movement and hitbox it takes. | `ECharacter` value |
| `hp`, `armor`, `damage`, `area`, `cooldown`, `speed`, `luck` | Stat modifiers replacing the Megabonk character's own for `MaxHealth`, `Armor`, `DamageMultiplier`, `SizeMultiplier`, `AttackSpeed` (flat) and `MoveSpeedMultiplier` (addition), `Luck` (flat). 0 = remove Megabonk's. | |
| `osrs_player_model` | JSON: `osrs_items` (worn item ids), `osrs_kits_male` (identity kit ids), `osrs_colors` (0 = kit colours, the only value used), `osrs_stand_anim` (sequence for the pose), `osrs_walk_anim` (819), `osrs_run_anim` (824) and `osrs_death_anim` (836) for animations (0.2.0). | every kit and worn item resolves; the whole body builds |
| `unlock_condition` | `always`, or a condition for phase-2 characters (`defence_1_attack_60`, `total_level_250`). Not read by the code yet. | |
| `phase`, `status` | See above. | |

## weapons

One row per OSRS weapon; each reuses a Megabonk weapon's behaviour. Read by `Content.ApplyWeapon`, `Combat`,
`Content.StartingWeapon`, `Osrs` (items, sprites, sounds).

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name. | |
| `style` | `melee` / `ranged` / `magic`: which skill its damage trains, and which adventurers can start with it. | |
| `bonk_base` | Megabonk `EWeapon` it takes over, or `new:...` for a weapon type that doesn't exist yet. | `EWeapon` value |
| `damage`, `cooldown`, `area`, `amount`, `speed`, `pierce`, `duration`, `knockback` | Replace `WeaponData.damage`, `endCooldown`, `projectiles`, `projectileSpeed`, `projectileBounces` (from `pierce`), `attackDuration`, `knockback`, and the `baseStats` entries `DamageMultiplier`, `SizeMultiplier` (area), `Projectiles`, `ProjectileSpeedMultiplier`, `ProjectileBounces`, `DurationMultiplier`, `KnockbackMultiplier`. | |
| `level_curve` | List of `Stat:Type:Value` that replaces the weapon's upgrade pool. | each `EStat` and `EStatModifyType` |
| `gear_reqs` | `"starting_weapon"`, or `{"skill": level}`: levels needed to **start** a run with it. | skills are rows of `skills` |
| `osrs_item_id` | Item for the icon (and model). | item resolves |
| `osrs_icon_sprite_id` | Sprite to use as the icon instead (spells), or `none`. | sprite resolves |
| `osrs_projectile_or_spotanim_id` | `item:<id>`, `spotanim:<id>` or `none`: the OSRS model each projectile the weapon spawns carries (`Systems/Projectiles.cs`, 0.1.36), its longest axis along the flight. | resolves |
| `sfx_id` | Attack sound, played when the weapon fires (at most every 0.3 s per weapon; 0.1.36). | sound synthesises |
| `osrs_attack_anim` | OSRS sequence the adventurer plays when this weapon attacks (from OpenRune's `attack_anim_stance1`, resolved with `osrs gamevals seq`; spells use their cast: Fire Strike 1162, Ice Barrage 1979, trident 1167). -1 = none yet. Baked on each adventurer's model (0.2.0). | |
| `spec_name`, `spec_effect` | The special attack's name (chat, log) and its steps, read by `Systems/Specials.cs`, comma-separated: `hit:M` (one hit for M times the weapon's average hit), `hits:M1/M2/...:GAP` (hits GAP seconds apart), `aoe:R:M` (M on every other monster within R tiles of the target), `slow:R:MULT:S`, `stun:S`, `freeze:R:S:M` (round the adventurer: a hit, then frozen S seconds), `heal:F` (heal F of the damage dealt), `cone:R:DEG:M` (ahead of the adventurer), `chain:N:R:M` (jumps to N monsters, each within R tiles of the last). A cone or freeze reaches only its own R. `none` for no spec. | steps known to `Specials.Apply` |
| `spec_cost` | Energy the spec costs, in percent of the bar (OSRS's own; 50 for Bonkscape's invented magic specs); 0 for no spec. | 0 to 100 |
| `spec_anim` | The adventurer's OSRS sequence for the spec (`PlayerSkin.PlaySpec`); -1 plays the weapon's attack. | a sequence id in the cache, or -1 |
| `spec_spotanim` | The spec's OSRS spot animation, drawn as a flipbook (`Systems/SpotFx.cs`); -1 for none. | a spot animation in the cache, or -1 |
| `spec_spot_on` | Where the spot animation plays: `player` or `target`. | `player` / `target` |
| `phase`, `status` | | |

## evolutions

A max-level weapon plus a gear passive becomes its upgrade when a casket opens. Read by `Systems/Evolutions.cs`.

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key. | |
| `from_weapon` | Weapon row, or `any`. | row of `weapons` or `any` |
| `required_passive` | Passive row that must be held (any level). | row of `passives` |
| `max_weapon_level` | Weapon level needed (8). | |
| `result_name` | New name. | |
| `result_stats` | `{"EStat": multiplier}` applied to the weapon's `baseStats` (restored at the next run). | `EStat` names |
| `osrs_item_id`, `osrs_icon_sprite_id` | New icon. | resolve |
| `phase`, `status` | | |

## passives

OSRS gear, one item per slot; each takes over a Megabonk tome. Read by `Content.ApplyTome` and the `GetAvailableTomes`
postfix.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name. | |
| `bonk_base_tome` | Megabonk `ETome` it takes over. Tomes with no row leave Lumbridge's offers. | `ETome` value |
| `bonk_stat` | `Stat:Type` of the tome's stat modifier. | `EStat`, `EStatModifyType` |
| `value_per_level` | Modifier value. | |
| `max_level` | Level cap: no longer offered at this level. | |
| `gear_slot` | Holding one item of a slot removes the others of that slot from the offers. | |
| `osrs_item_id` | Icon. | item resolves |
| `phase`, `status` | | |

## enemies

One row per OSRS monster; each takes over Megabonk enemies. Read by `Content.ApplyEnemies`, `Osrs.BuildEnemy`,
`EnemySkins`, `Prayer`, `Bosses`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name. | |
| `osrs_npc_id` | NPC whose definition gives the model, recolours and stand animation. | NPC builds |
| `osrs_npc_alternates` | Stand-in NPCs, tried in order when the first isn't in the player's cache. | each builds |
| `combat_level` | OSRS combat level. Not used yet. | |
| `style` | `melee` / `ranged` / `magic`: what protection prayer blocks it, and its style icon. | must be one of the three |
| `bonk_base_enemy` | Megabonk `EEnemy` values it takes over. `Miniboss*` and boss bases keep Megabonk's stats. | `EEnemy` values |
| `hp`, `damage`, `speed`, `knockback_resist` | Replace the base's `EnemyData` values (not for minibosses and bosses). | |
| `xp_value` | Not used yet (XP comes from damage). | |
| `drop_table_id` | Not used yet (drops are global). | row of `drops` (`table_id`) |
| `model_ids` | `from_npc_def`: the NPC definition's models. `worn:<item ids>`: a male body (the Warrior's kits) in that worn gear, built like an adventurer; used for Dharok and Ahrim, whose NPC models are pink in the cache (hue 60 on every face). The preflight checks each item's worn model. | `Osrs.BuildWorn` |
| `recolors` | `from_npc_def` (the only value): taken from the NPC definition. | |
| `scale` | Size multiplier on top of OSRS proportions. | |
| `animation_ids` | JSON of OSRS sequence ids: `stand`, `walk`, `attack`, `death` (the Giant Mole also `dig_down`, `dig_up`), checked against the cache's gamevals (`<name>_ready/_walk/_attack/_death` siblings). Baked on the primary NPC's model only (a stand-in NPC may have another skeleton, so it uses its own definition's stand and walk). Rows without ids fall back to the NPC definition's stand and walk (0.2.0). | |
| `maps` | Map rows it belongs to: its bases join those maps' Megabonk spawn pools (`Content.ApplyEnemies`, via `Bonk.MapOf`); a row with no phase-1 map joins Lumbridge's. | rows of `maps` |
| `phase`, `status` | | |

## bosses

Boss behaviour layered on an enemies row. Read by `Systems/Bosses.cs` (phase 1: the Mole's dig pattern and threshold),
`Osrs` (lairs built at load) and `Arena` (the fight moved into the lair).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key, referenced by `maps.boss_id`. | |
| `enemy_id` | The enemies row. | row of `enemies` |
| `attacks` | JSON list: `name`, `style`, `telegraph_ms`, `damage`, `pattern`. Only `burrow_teleport_every_<N>s` is read (dig period and telegraph). | each `style` is melee/ranged/magic |
| `phase_thresholds` | HP fractions; the first one speeds up the dig (x0.66 period). | |
| `music_override` | Not used yet. | |
| `osrs_arena` | `[x0, y0, x1, y1]` in OSRS world tiles: the boss's own lair (the Mole's is the Falador Mole Lair), built at load like a map and keyed by the boss id; when the current map's boss (`maps.boss_id`) is summoned, `Arena` moves the fight there under the loading cover and the Mole digs to tiles you can walk to. `[]` for none (the fight stays on the map). | x0 < x1, y0 < y1; every region the area covers is in the dev and player caches (empty void around it is fine) |
| `arena_spawn_tile` | `[x, y]` where the adventurer lands in the lair. | inside `osrs_arena`, a walkable tile within 3 |
| `arena_boss_tile` | `[x, y]` where the boss is put in the lair. | inside `osrs_arena`, a walkable tile within 3 |
| `pet_item_id`, `pet_rate` | Pet item and 1-in-N rate. Not used yet. | item resolves |
| `phase`, `status` | | |

## maps

One row per map. Read by `Bonk`, `Arena`, `Osrs.BuildArena`, `Skilling`, `MapProps`, `Content`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name (`GetName` on the map). | |
| `bonk_base_map` | Megabonk `EMap` it takes over. One phase-1 row per `EMap` counts (the lowest `bonk_base_stage`; `Rows.Maps`): `Bonk.Active` is true on that map, and sets `Rows.Current` to the row. | `EMap` value |
| `bonk_base_stage` | Stage index whose timeline `waves` edits (and that autoplay starts). | |
| `osrs_area` | `[x0, y0, x1, y1]` in OSRS world tiles, built as the arena; `[]` for none. | x0 < x1, y0 < y1; every region the area covers is in the dev and player caches |
| `spawn_tile`, `boss_tile` | `[x, y]` for the adventurer and the boss portal. | inside the area, a walkable tile within 3 |
| `osrs_music_track` | Track `Music.PlayForStage` plays on the map's stages (experimental; needs `OsrsKit.Music.dll`, which release zips leave out). | track exists (reported phase 2+) |
| `props` | `{"tree"|"oak"|"rock"|"bush": [object ids]}` for the fallback stage (`MapProps`, per map). | objects resolve |
| `skilling_nodes` | List of `{type, osrs_object_id | osrs_npc_id, count, respawn_s, drop}`. `count` is used by the fallback stage; `respawn_s` by both; `drop` names the `drops` row (table `skilling`) whose `effect` a gather applies (`gold:N`, `heal:N`, `speed:…` as Megabonk's Haste, `armor:…` as its Shield). | object or NPC resolves |
| `waves_id` | Its `waves` rows (by `map_id`). | row of `waves` |
| `boss_id` | `bosses` row or `none`. | row of `bosses` or `none` |
| `fallback_enemy` | Enemy row used when a Megabonk enemy has no row, or a monster's model is missing. | row of `enemies` |
| `length_minutes`, `special_rule` | Planned (`skull` for the Wilderness). Not used yet. | |
| `difficulty` | Multiplier on the hp and damage of the map's monsters (1 = Megabonk's stats); minibosses and bosses scale from Megabonk's own stats. Morytania 0.8. | `Content.ApplyEnemies` |
| `sky` | `megabonk` (keep the stage's sky) or a `#rrggbb` colour: the stage's fog takes it, its skybox (a copy) is tinted to it, and the ambient and sun light keep their brightness in cooler tones. Morytania `#170d22`. | `Content.ApplySky`, `Arena.ApplySkyNow` |
| `phase`, `status` | | |

## waves

Spawn plan per map; Megabonk's own credit system paces spawns. Read by `Content.ApplyEnemies`.

| Column | Meaning | Preflight |
|---|---|---|
| `map_id` | Map row (also the sheet's key column, so preflight shows rows by map). | row of `maps` |
| `minute` | When the row applies. | |
| `enemy_ids` | Enemy rows. | rows of `enemies` |
| `spawn_rate`, `max_alive` | `megabonk` (keep Megabonk's pacing). Not read. | |
| `events` | `start`: the stage timeline's start enemies. `unlock`: the rows' non-miniboss bases get `canSpawnAfterTime = minute x 60`. `swarm`: the `ESwarm` event at that minute spawns these. `miniboss`: the `EMiniBoss` event at that minute spawns each row's miniboss base (its first `Miniboss*` base, else its first). A minute with no matching event in Megabonk's timeline changes nothing. `boss`: documentation only (the boss portal calls the stage boss). | |
| `phase`, `status` | | |

## drops

What things drop and what picking them up does. Read by `Rows` (food, potion, coins, casket) and `Loot`.

| Column | Meaning | Preflight |
|---|---|---|
| `table_id` | `lumbridge_common`, `skilling`, `giant_mole`. Not used to pick drops yet (drops are global). | |
| `item` | Item name, used in chat lines. | |
| `kind` | `coins`, `food`, `potion`, `casket`, `rare`, `pet`. `Rows` picks food (with `bonk_base_pickup` Health), the potion, coins and the casket by kind. | |
| `bonk_base_pickup` | Megabonk pickup it reskins (`Gold`, `Health`, `Chest`) or `new`. | |
| `weight_or_rate` | Weight among food rows, or a per-kill chance (potion 0.025), or `megabonk`. | |
| `amount` | Not read. | |
| `osrs_item_id` | Model and icon. | item resolves |
| `effect` | `heal:N` is read for food; the potion's `prayer:7+0.25` matches the code but is hard-coded; the `skilling` rows' effects are what gathering gives (`Skilling.ApplyEffect`: `gold:N` coins, `heal:N`, `speed:...` Megabonk's Haste, `armor:...` its Shield, the numbers after `speed`/`armor` not used). | |
| `phase`, `status` | | |

## prayers

Protection prayers, in key order. Read by `Prayer`, `Hud`, `Osrs` (sprites, sounds).

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and name. | |
| `style_blocked` | Enemy style it blocks. | |
| `block_normal`, `block_boss` | Share of damage removed (1.0 / 0.5). | |
| `drain_per_sec` | Points per second while on. | |
| `key` | Default key as a `KeyCode` name. The code's defaults come from `Prayer.Keys` config; keep them the same. | |
| `osrs_prayer_sprite_id` | Prayer book icon (prayer bar). | sprite resolves |
| `osrs_overhead_sprite_id` | `group:frame` overhead icon. | sprite resolves |
| `sfx_id` | Sound when turned on. | sound synthesises |
| `phase`, `status` | | |

## skills

Persistent skills. Read by `Skills`, `Hud`, `CharacterSelect`, `Prayer`, `Skilling`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key (also the `skills.json` key) and name. | |
| `trained_by` | Documentation of what trains it; the logic is in `Skills.SkillFor`, `Prayer.Tick`, `Skilling.Gather`. | |
| `xp_rate` | XP per point of damage, per second praying, or per gather. **Read by the code.** | |
| `osrs_skill_icon_id` | Skill icon sprite (also the style icons for attack/ranged/magic). | sprite resolves |
| `unlocks` | `{"level": weapon}`. Documentation: the code uses `weapons.gear_reqs`. Keep both in step. | weapons are rows |
| `phase`, `status` | | |

## ui

OSRS presentation elements. Read by `Hud`, `Osrs` (sprites, fonts), `CorePatches` (death text).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key the code looks up (`hitsplat_damage`, `chat_line`, `death_screen`, `missing_cache`...). | |
| `element` | Kind of element. | |
| `osrs_sprite_or_font_id` | Sprite group (number), `font:<name>` or `item:<id>`. | resolves |
| `text` | Text template; `chat_line`, `death_screen` and `missing_cache` texts are used as written. | |
| `position`, `billboard` | Documentation; positions are in `Hud.cs`. | |
| `phase`, `status` | | |

## audio

Sounds and music. Read by `Rows.Sfx` (sound ids by row id) and `Osrs` (which sounds to synthesise).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key the code looks up (`player_hit`, `level_up`, `prayer_off`...). | |
| `event` | Documentation. | |
| `osrs_sound_or_track_id` | `sfx:<id>`, `track:<name>` or `jingle:<name>`. | sound synthesises; tracks and jingles reported as needing the synthesiser |
| `fallback` | `sfx:<id>` used when the main one isn't a sound, `megabonk` or `none`. | sound synthesises |
| `phase`, `status` | | |

## hooks

Every place Bonkscape touches Megabonk. Documentation checked by the preflight; the code doesn't read it.
**It's behind the code**: see the [patch list](architecture.md#harmony-patches).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key. | |
| `system` | Which system. | |
| `bonk_assembly` | Assembly (`Assembly-CSharp`). | |
| `class_or_table` | Megabonk class. | the class exists |
| `method_or_row` | Method, or field for `data row`. | the method (or field/getter) exists |
| `patch_kind` | `prefix`, `postfix`, `poll`, `call (...)`, `data row`. | |
| `purpose` | What it does. | |
| `rows_it_serves` | Sheet rows it serves (`weapons.*`, `ui.hitsplat_*`) or `-`. | the sheets exist |
| `status` | | |

## cache_assets (generated)

Written by the preflight; don't edit. One row per OSRS asset the other sheets use.

| Column | Meaning |
|---|---|
| `osrs_id` | `kind:id`, e.g. `npc:3031`, `area:lumbridge`. |
| `kind` | `npc`, `item`, `worn`, `kit`, `object`, `spotanim`, `sprite`, `font`, `sound`, `track`, `player`, `area`. |
| `decoded_by` | Decoder chain. |
| `converted_to` | `mesh`, `icon`, `texture`, `font`, `clip`... |
| `used_by` | `sheet.row.column` references. |
| `render_settings` | Icon settings note. |
| `player_cache` | Present in this PC's own OSRS cache. |
| `detail` | Name and size, or why it failed. |
| `status` | `verified` (decodes from the dev cache) or `todo`. |

<!-- sources: sheets/ src/Bonkscape.Tools/Preflight.cs src/Bonkscape.Tools/Codegen.cs src/Bonkscape.Plugin/Core/Rows.cs -->
