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
| `audio.json` | 14 | 6 | 11 built, 3 todo |
| `bosses.json` | 9 | 22 | 8 built, 1 verified |
| `cache_assets.json` | 686 | 9 | 7 todo, 679 verified |
| `characters.json` | 14 | 22 | 9 built, 5 verified |
| `clue_steps.json` | 42 | 9 | 42 built |
| `drops.json` | 35 | 9 | 32 built, 1 todo, 2 verified |
| `enemies.json` | 116 | 22 | 96 built, 2 todo, 18 verified |
| `evolutions.json` | 4 | 10 | 3 built, 1 todo |
| `hooks.json` | 52 | 8 | 23 built, 29 verified |
| `maps.json` | 7 | 24 | 5 built, 2 verified |
| `passives.json` | 11 | 11 | 11 built |
| `prayers.json` | 3 | 12 | 3 verified |
| `skills.json` | 10 | 8 | 5 built, 5 verified |
| `ui.json` | 41 | 7 | 4 built, 1 todo, 36 verified |
| `waves.json` | 63 | 8 | 55 built, 8 verified |
| `weapons.json` | 34 | 29 | 32 built, 1 todo, 1 verified |
<!-- /gen:sheet-list -->

## Rules the preflight checks on every sheet

`bonk preflight` (`src/Bonkscape.Tools/Preflight.cs`) loads every sheet except `cache_assets.json` and checks:

- **Every row has every column**, and no row has a column the sheet doesn't declare.
- **No cell is unfilled**: `null`, `""` and `"todo-value"` are findings. Use `"none"` or `[]` for "nothing".
- **`status`** is `todo`, `built` or `verified`.
- **`phase`** sorts the findings: phase-1 findings are "open items" and make the preflight exit with code 4; phase 2/3
  findings are listed as "unfinished by design". The report and the generated code are written either way, so read
  the exit code.
- **References** to other sheets resolve (`'goblin' is not a row of enemies`), with `none`/`any` allowed where noted,
  for the columns whose Preflight cell below says so. A column whose cell says nothing isn't checked: a typo there
  passes the preflight and shows only in game.
- **Megabonk names** resolve against `Assembly-CSharp.dll` in the interop folder: enum values (`EWeapon`, `ETome`,
  `EEnemy`, `ECharacter`, `EMap`, `EStat`, `EStatModifyType`; a `new:` prefix skips the check), and for `hooks`, classes
  and methods.
- **OSRS ids** resolve in the dev cache: definitions decode and their models load (NPCs, items, objects, kits, worn
  items, spot animations), sequences are frame-based (not skeletal) so they bake, sprites and fonts exist, sounds
  synthesise to something. Each asset becomes a row of
  `cache_assets.json`, also checked against this PC's own (player) cache.

The report goes to `docs/preflight.md`, `cache_assets.json` is rewritten, and the generated rows go to
`Generated/Sheets.g.cs` when a `genOut` path is given (pass `-` to skip).

In the tables below, the Preflight column says what the preflight checks in that column beyond these rules; a blank
cell means nothing more.

### Status, by convention

| Status | Means |
|---|---|
| `todo` | Designed, not built. The plugin ignores rows with `phase` > 1 whatever their status. |
| `built` | In the code. |
| `verified` | Seen working in a Melty test run (self-check or footage). |

The preflight only checks the spelling, and no plugin code reads a row's status (only `phase`): it's for the docs and
the wiki's tables. Keeping statuses honest is a manual step at each release ([How to update these docs](updating-docs.md)).

## characters

One row per playable adventurer; each takes over a Megabonk character. Read by `Content.ApplyCharacter`,
`Osrs.BuildPlayer`, `PlayerSkin`, `Combat.CurrentCharacter`, `TestMode` (autoplay takes the unlocked rows in turn).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Row key. | |
| `name` | Shown name (character select, `GetName`). | |
| `style` | `melee` / `ranged` / `magic`. Decides which skill the default damage trains and which weapons can be its starting weapon. | |
| `attack_style` | The style a new adventurer starts on (0.14; the style key and the combat tab change it, saved per adventurer in `unlocks.json` as `_style_<id>`, `Systems/AttackStyles.cs`): `accurate`, `aggressive`, `controlled` or `defensive`. With melee damage they train Attack, Strength, all three, Defence; with ranged, Ranged (`aggressive` is Rapid) or Ranged and Defence (`defensive` is Longrange); with magic, Magic or Magic and Defence (`defensive` is defensive casting). `Skills.Shares` holds the split. | one of the four; not one that trains a locked skill |
| `starting_weapon` | 0.14: a ladder's first tier (`bronze_scimitar`, `shortbow`, `wind_strike`) makes the adventurer climb that ladder: they start with its highest tier their own levels allow, or a weapon of their style beyond its top once they meet it (`Content.StartingWeapon`). Any other weapon is the adventurer's own, given whatever their levels (the Zerker's dragon scimitar, Durial321's whip). | row of `weapons` |
| `bonk_base_character` | Megabonk `ECharacter` whose slot, prefab, movement and hitbox it takes. | `ECharacter` value |
| `hp`, `armor`, `damage`, `area`, `cooldown`, `speed`, `luck` | Stat modifiers replacing the Megabonk character's own for `MaxHealth`, `Armor`, `DamageMultiplier`, `SizeMultiplier`, `AttackSpeed` (flat) and `MoveSpeedMultiplier` (addition), `Luck` (flat). 0 = remove Megabonk's. | |
| `osrs_player_model` | JSON: `osrs_items` (worn item ids), `osrs_kits_male` (identity kit ids), `osrs_colors` (0 = kit colours; not read, the kits' own colours are always used), `osrs_stand_anim` (sequence for the pose), `osrs_walk_anim` (819), `osrs_run_anim` (824) and `osrs_death_anim` (836) for animations (0.2.0). | every kit and worn item resolves; the whole body builds |
| `can_buy` | `false`: the Shady Guy, and every map's shopkeeper standing in for him (TzHaar-Hur-Tel), refuse this adventurer (the Ironman; `Loot`'s Interact patch, "Ironmen can't trade" on the prompt). | |
| `extra_weapons` | JSON list of weapons ids given beside the starting weapon once a run's inventory exists, their `gear_reqs` not asked (`Content.GiveExtraWeapons`): Durial321's `["ice_barrage"]`. `[]` for none. | rows of `weapons` |
| `unlock_condition` | Replaces Megabonk's unlock for the base character the row takes over, either way (`Unlocks.CharacterUnlocked`, 0.6): `always`; `total_level_N`: any one adventurer has a total level of N (Ironman, 250); `barrows_set_<id>` (0.7); `levels:attack>=60,defence<=1`: one played adventurer's levels meet every part (0.14, the Pure). | one of those forms |
| `locked_skills` | JSON list of skills the adventurer never trains (0.14: the Pure's `["defence"]`): their XP is dropped (`Skills.Add`), and styles that would train one are never offered. `[]` for none. | skills ids |
| `start_levels` | JSON `{skill: level}`: an adventurer with no skills save of their own starts at these levels (0.7: a Barrows brother at 70 in Attack, Strength, Defence, Hitpoints and his style's skill; `Skills.Of`, not saved until he earns XP). `{}` for none. | rows of `skills`; levels 1 to 99 |
| `set_effect` | JSON: the adventurer's Barrows set effect (0.7), the same as his `enemies` row's: `name` (`dharok_rage`, `ahrim_weaken`, `guthan_heal`, `karil_slow`, `torag_drain`, `verac_pierce`), `chance` (0.25; Dharok's 1.0), the style it triggers on (`on`), its numbers and `spotanim`. `{}` for none. | |
| `phase`, `status` | See above. | |

## weapons

One row per OSRS weapon; each reuses a Megabonk weapon's behaviour. Read by `Content.ApplyWeapon`, `Combat`,
`Content.StartingWeapon`, `Content.ApplyLadders`, `Osrs` (items, sprites, sounds).

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name. | |
| `style` | `melee` / `ranged` / `magic`: which skill its damage trains, and which adventurers can start with it. | |
| `bonk_base` | Megabonk `EWeapon` it takes over, or `new:...` for a weapon type that doesn't exist yet (the plugin can't make one: such a row isn't built). Several rows may share a type when all but one are character-only: the other row is the type's default, and a character-only one goes on it only while its owner is chosen or plays (0.7: Guthan's, Torag's and Verac's weapons on CorruptSword, the Void knight mace's; `Content.ApplyCharacterWeapons`). | `EWeapon` value |
| `damage`, `cooldown`, `area`, `amount`, `speed`, `pierce`, `duration`, `knockback` | Replace `WeaponData.damage`, `endCooldown`, `projectiles`, `projectileSpeed`, `projectileBounces` (from `pierce`), `attackDuration`, `knockback`, and the `baseStats` entries `DamageMultiplier`, `SizeMultiplier` (area), `Projectiles`, `ProjectileSpeedMultiplier`, `ProjectileBounces`, `DurationMultiplier`, `KnockbackMultiplier`. | |
| `level_curve` | List of `Stat:Type:Value` that replaces the weapon's upgrade pool. | each `EStat` and `EStatModifyType` |
| `gear_reqs` | `{"skill": level}`: OSRS's levels to wield it (0.14, from the OSRS Wiki): level-ups never offer it to an adventurer below them (`Content.Offered`: their own starting and extra weapons, and any weapon held, ask nothing), and it's never a starting weapon below them. Or `"character:<id>"` (0.7: a Barrows brother's own weapon: only he starts with it, it's never upgraded away from him, and level-up offers give it to him alone). | skills are rows of `skills`; each level listed in `skills.unlocks` |
| `ladder`, `tier` | 0.14: rows sharing a ladder (`scimitar`: bronze 1 .. dragon 60 Attack; `shortbow`: normal 1 .. magic 50 Ranged; `strike`: Wind 1, Water 5, Earth 9, Fire 13 Magic) share one Megabonk weapon and its special attack; the adventurer playing gets the highest tier they meet, a tier asking the same level as the one below being climbed one level later (`Rows.ClimbLevel`: bronze and iron scimitars both ask Attack 1, so a new adventurer starts with bronze and gets iron at Attack 2) (`Content.ApplyLadders`, as character select's choice changes and as a run starts; a level-up mid-run says it comes with the next run), each tier with its own OSRS item (model in hand, icon), projectile and damage. A tier's damage maps its OSRS number (scimitar strength bonus, shortbow ranged attack, Strike max hit) onto 0.70-1.00 of the top tier's. Every tier fires the ladder's special attack (the Strike spells each their element's: Gale, Torrent, Quake, Wildfire). The top tier is the type's default. `none`/0 for other weapons. | tiers 1..n on one `bonk_base` and `style`; tier 1 asks level 1 of one skill; no tier asks less than the one below |
| `osrs_item_id` | Item for the icon (and model). | item resolves |
| `osrs_icon_sprite_id` | Sprite to use as the icon instead (spells), or `none`. | sprite resolves |
| `osrs_projectile_or_spotanim_id` | `item:<id>`, `spotanim:<id>` or `none`: the OSRS model each projectile the weapon spawns carries (`Systems/Projectiles.cs`, 0.1.36), its longest axis along the flight. | resolves |
| `sfx_id` | Attack sound, played when the weapon fires (at most every 0.3 s per weapon; 0.1.36). | sound synthesises |
| `osrs_attack_anim` | OSRS sequence the adventurer plays when this weapon attacks (from OpenRune's `attack_anim_stance1`, resolved with `osrs gamevals seq`; spells use their cast: Fire Strike 1162, Ice Barrage 1979, trident 1167). -1 = none yet. Baked on each adventurer's model (0.2.0). | a sequence in the cache, or -1 |
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
| `bonk_base_tome` | Megabonk `ETome` it takes over. Tomes with no row leave the offers on Bonkscape's maps. | `ETome` value |
| `bonk_stat` | `Stat:Type` of the tome's stat modifier. | `EStat`, `EStatModifyType` |
| `value_per_level` | Modifier value. | |
| `max_level` | Level cap: no longer offered at this level. | |
| `gear_slot` | Holding one item of a slot removes the others of that slot from the offers. | |
| `osrs_item_id` | Icon. | item resolves |
| `unlocked_by` | A bosses id whose death unlocks this passive for good for the adventurer who killed it (`Systems/Unlocks.cs`, saved in `unlocks.json`); before that it isn't offered. `none`: always offered. The Fire cape: `tztok_jad_boss`. | `none` or a row of `bosses` |
| `phase`, `status` | | |

## enemies

One row per OSRS monster; each takes over Megabonk enemies. Read by `Content.ApplyEnemies`, `Osrs.BuildEnemy`,
`EnemySkins`, `Prayer`, `Bosses`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name. | |
| `osrs_npc_id` | NPC whose definition gives the model, recolours and stand animation. | NPC builds |
| `osrs_npc_alternates` | Stand-in NPCs, tried in order when the first isn't in the player's cache. | each builds |
| `combat_level` | OSRS combat level. Not read by the plugin; the wiki's monster table shows it. | |
| `style` | `melee` / `ranged` / `magic`: what protection prayer blocks it, and its style icon. | must be one of the three |
| `bonk_base_enemy` | Megabonk `EEnemy` values it takes over. `Miniboss*` and boss bases keep Megabonk's stats. | `EEnemy` values |
| `hp`, `damage`, `speed`, `knockback_resist` | Replace the base's `EnemyData` values (not for minibosses and bosses). | |
| `xp_value` | Not used yet (XP comes from damage). | |
| `drop_table_id` | Not used yet (drops are global). | row of `drops` (`table_id`) |
| `model_ids` | `from_npc_def`: the NPC definition's models. `worn:<item ids>`: a male body (the Warrior's kits) in that worn gear, built like an adventurer; used for Dharok and Ahrim, whose NPC models are pink in the cache (hue 60 on every face), and for the PKers (`Osrs.BuildWorn`). | `from_npc_def`, or `worn:` with item ids whose worn models load |
| `recolors` | `from_npc_def` (the only value): taken from the NPC definition. Not read: the NPC's own recolours are always used. | |
| `scale` | Size multiplier on top of OSRS proportions. | |
| `animation_ids` | JSON of OSRS sequence ids: `stand`, `walk`, `attack`, `death` (the Giant Mole also `dig_down`, `dig_up`), checked by the pipeline against the cache's gamevals (`<name>_ready/_walk/_attack/_death` siblings). Baked on the primary NPC's model only (a stand-in NPC may have another skeleton, so it uses its own definition's stand and walk). Rows without ids fall back to the NPC definition's stand and walk (0.2.0). | |
| `maps` | Map rows it belongs to: its bases join those maps' Megabonk spawn pools (`Content.ApplyEnemies`, via `Bonk.MapOf`), and on a Megabonk map two map rows share (the Desert's stages) the stage's own rows go onto the shared `EnemyData` when it starts (`Rows.EnemyByMapBonk`, `Content.ApplyStage`); a row with no phase-1 map joins Lumbridge's. A bosses id instead keeps the row for that boss's arena alone (0.5: the Fight Caves' monsters are `["tztok_jad_boss"]`; `arena_waves` and `healers` spawn them, no map does). | rows of `maps` or `bosses` |
| `set_effect` | JSON: a Barrows brother's set effect on his hits (0.7), as on his `characters` row. `{}` for none. | |
| `pk_weapon` | A PKer (0.9): the `weapons` row whose special attack it fires (its sequence from `animation_ids` `spec`, the weapon's `spec_spotanim`, a hit of a fifth to a third of the adventurer's health in the weapon's style). A PKer is never on a Megabonk slot or in the waves: it comes only by an ambush (`Pkers`), its body from `model_ids` `worn:`, its health and damage from this row scaled against the Megabonk enemy it rides (`SkeletonDusty`: a walker that doesn't flee). `none`: an ordinary monster. | `none` or a row of `weapons` |
| `phase`, `status` | | |

## bosses

Boss behaviour layered on an enemies row. Read by `Systems/Bosses.cs` (the Mole's dig pattern and threshold),
`BossFight` (scripted attacks, arena waves, healers), `SecondForm`, `Pets`, `Osrs` (lairs and pets built at load) and
`Arena` (the fight moved into the lair).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key, referenced by `maps.boss_id`. | |
| `enemy_id` | The enemies row. | row of `enemies` |
| `attacks` | JSON list: `name`, `style`, `telegraph_ms`, `damage`, `pattern`. `burrow_teleport_every_<N>s` gives the Mole's dig period and telegraph (`Bosses`). `random` attacks are a scripted boss's own (`BossFight`, with `attack_every_ms`): `seq` (the OSRS sequence it plays), `spotanim_launch` (on the boss), `projectile` (flying to the adventurer), `spotanim` (on the adventurer as it lands), `hit_delay_ms` (added to `telegraph_ms` before the hit lands), `range` (`melee`: only beside the adventurer; `any`), `weight` (its share when the boss picks, 1 by default: the KBD's bite and dragonfire 1.5, each breath 0.5), `effect` (`poison`, `freeze` or `shock`, through Megabonk's own player effects, when the right prayer wasn't up; `pierce_prayer`, 0.11's K'ril smash: no protection prayer blocks the hit, and it drains prayer points by `drain_prayer` (0.5 by default) x the share of health it took), `effect_chance` (1 by default) and `freeze_ms` (capped at 3 s). `poison` and `drain` (OSRS's numbers, on the KBD's breaths and K'ril's slash) aren't read: the poison and the shock's slow have fixed values in `BossFight`. A per-form id (`seq`, `projectile`, `spotanim_launch`...) may be a list `[first form, second form]` (`bosses.second_form`). The hit's share of the adventurer's health is scaled by `damage`, the OSRS max hit, against Jad's 97. The hit is the adventurer's max health x 0.55 to 0.85 in the attack's style, which the matching protection prayer blocks (`prayer_blocks_fully`). | each `style` is melee/ranged/magic |
| `phase_thresholds` | HP fractions; the first one speeds up the dig (x0.66 period). | |
| `music_override` | Not used yet. | |
| `osrs_arena` | `[x0, y0, x1, y1]` in OSRS world tiles: the boss's own lair (the Mole's is the Falador Mole Lair), built at load like a map and keyed by the boss id; when the current map's boss (`maps.boss_id`) is summoned, `Arena` moves the fight there under the loading cover and the Mole digs to tiles you can walk to. `[]` for none (the fight stays on the map). | x0 < x1, y0 < y1; every region the area covers is in the dev and player caches (empty void around it is fine) |
| `arena_spawn_tile` | `[x, y]` where the adventurer lands in the lair. | inside `osrs_arena`, a walkable tile within 3 |
| `arena_boss_tile` | `[x, y]` where the boss is put in the lair. | inside `osrs_arena`, a walkable tile within 3 |
| `arena_waves` | JSON list `[{"at": seconds, "enemies": [enemies ids], "count": n}, ...]`: the boss arena's own waves before the boss (0.5: the Fight Caves), spawned by the arena from the time the adventurer moves in (`BossFight.Tick`; `osrs_wave` notes which OSRS wave an entry stands for). `[]`: the boss comes at once, as the Mole does. With no `osrs_arena` the waves run on the stage's own map where the boss rose (0.10: the Knights of the Round Table at Camelot); each wave monster takes its own row's health and speed, and the boss also comes once every wave has come and fallen. | each wave's `at` 0 or more; its `enemies` rows of `enemies` |
| `boss_at` | Seconds after the move into the arena when the boss itself comes, after `arena_waves`. Until then the boss waits on its tile, hidden, frozen and unhurt. | 0 or more |
| `attack_every_ms` | For a boss whose `attacks` have `pattern` `random`: how often it picks one (Jad: 4800, every 8 ticks). Megabonk's own special attacks are switched off for it, and its touches do no damage. 0: the boss keeps Megabonk's attacks. | 0 or more |
| `healers` | JSON `{"enemy": enemies id, "count": n, "at_hp": fraction}`: healers called once when the boss drops below `at_hp` (Jad's four Yt-HurKot at half health); they walk to the boss and heal it until the adventurer hits them, then fight the adventurer. `{}` for none. | `enemy` is a row of `enemies` |
| `prayer_blocks_fully` | `true`: the right protection prayer blocks this boss's hits completely (Jad), not the half every other boss's hits are cut by. | |
| `second_form` | An `enemies` id: the form the boss rises in when its first form (`enemy_id`) dies (0.8: the Kalphite Queen's airborne form). Megabonk's death is called off, the health comes back in full and the second form's model takes the first's place on the same enemy (`SecondForm`); only the second form's death clears the stage and counts for unlocks. `none`: one form (also what an id naming no phase-1 row gives). | `none` or a row of `enemies` |
| `second_form_spotanim` | A spotanim played where the first form fell as the second rises (the Kalphite Queen's crawling husk, 1055, frame for frame with her 6270 rise), in place of the first form's corpse. While the second form's `spawn` sequence plays it stands still and can't be hurt. -1: none. | a spot animation in the cache (when 0 or more) |
| `pet_item_id`, `pet_rate` | The boss's pet (0.13): its item (character select's icon) and the 1-in-N chance its last form's death drops it (`Pets.BossDied`): Giant Mole and Kalphite Queen 50, the four generals 40, KBD 30, Jad 20, the milestone's rates. 0: no pet. | `pet_item_id` resolves as an item when above 0 (0 is no pet, though item 0 exists: Dwarf remains) |
| `pet_npc_id` | The OSRS NPC that follows the adventurer as the pet, with its own stand and walk sequences (`Pets`, built at load like a monster). 0: none. | NPC resolves (when above 0) |
| `pet_effect` | What the pet out gives: `luck:F` adds F to every adventurer's Megabonk Luck (`Content.ApplyCharacters`). `none`. | |
| `arena_plane` | The OSRS level `osrs_arena` is built from (0.11: Graardor's, Kree'arra's and K'ril's rooms on 2, Zilyana's on 0): that level's heights, floors, tile settings and objects become the ground (`WorldOptions.Plane`). 0 for every earlier lair. | the preflight checks the arena's tiles on this level |
| `phase`, `status` | | |

## maps

One row per map. Read by `Bonk`, `Arena`, `Osrs.BuildArena`, `Skilling`, `MapProps`, `Content`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and shown name (`GetName` on the map). | |
| `bonk_base_map` | Megabonk `EMap` it takes over, on the stage `bonk_base_stage`. `Rows.Maps` keeps one phase-1 row per map and stage (the first in the sheet when two share both). `Bonk.Active` is true on every stage of a map with a row and sets `Rows.Current` to the stage's own row, or to the map's first row (lowest `bonk_base_stage`) on a stage without one. | `EMap` value |
| `bonk_base_stage` | The stage index of `bonk_base_map` the row takes over (0 to 2 on the Forest and the Desert, 0 on the Graveyard): its arena, monsters, stage name and the timeline `waves` edits. Autoplay starts this stage. | |
| `osrs_area` | `[x0, y0, x1, y1]` in OSRS world tiles, built as the arena; `[]` for none. | x0 < x1, y0 < y1; every region the area covers is in the dev and player caches |
| `spawn_tile`, `boss_tile` | `[x, y]` for the adventurer and the boss portal. | inside the area, a walkable tile within 3 |
| `osrs_music_track` | Track `Music.PlayForStage` plays on the map's stages (experimental; needs `OsrsKit.Music.dll`, which release zips leave out). | track exists (reported phase 2+) |
| `props` | `{"tree"|"oak"|"rock"|"bush": [object ids]}` for the fallback stage (`MapProps`, per map). | objects resolve |
| `skilling_nodes` | List of `{type, osrs_object_id | osrs_npc_id, count, respawn_s, drop}`. `count` is used by the fallback stage; `respawn_s` by both; `drop` names the `drops` row (table `skilling`) whose `effect` a gather applies (`gold:N`, `heal:N`, `speed:…` as Megabonk's Haste, `armor:…` as its Shield). | object or NPC resolves |
| `waves_id` | Its `waves` rows (by `map_id`; always the map's own id). Not read: the plugin finds a map's waves by `waves.map_id`. | row of `waves` |
| `boss_id` | `bosses` row or `none`. | row of `bosses` or `none` |
| `fallback_enemy` | Enemy row used when a Megabonk enemy has no row, or a monster's model is missing. | row of `enemies` |
| `length_minutes` | Planned. Not used yet. | |
| `special_rule` | `pkers_revenants` (0.9, the Wilderness): PKers ambush the adventurer, one every three to four minutes (`Pkers`; the first after about a minute, 40 s in test runs). `none`: no rule. The code only asks whether the value contains `pkers`. | `none`, or a value containing `pkers` |
| `difficulty` | Multiplier on the hp and damage of the map's monsters (1 = Megabonk's stats; `Content.ApplyEnemies`); minibosses and bosses scale from Megabonk's own stats. Every map's is 1. | a number above 0, at most 4 |
| `sky` | `megabonk` (keep the stage's sky) or a `#rrggbb` colour: the stage's fog takes it, its skybox (a copy) is tinted to it, and the ambient and sun light keep their brightness in cooler tones (`Content.ApplySky`, `Arena.ApplySkyNow`). Morytania `#170d22`. | `megabonk` or `#rrggbb` |
| `underground` | `true` for a map under the ground (TzHaar City, the God Wars Dungeon): built and lit as a cave, walled off where it's blocked and black beyond its walls, as a boss's lair is (`Osrs.BuildArena`, `Arena`; 0.5). | |
| `currency_item` | The OSRS item the map's gold is shown as: its stack models on coins and pickups, its own cache name on the HUD counter (995 Coins; 6529 TokKul in TzHaar City). | item resolves (when above 0) |
| `shopkeeper_npc` | An OSRS NPC that stands in for Megabonk's Shady Guy on this map (`Loot`'s shopkeeper patch: TzHaar-Hur-Tel, 2183, in TzHaar City); 0 keeps the Shady Guy. | NPC resolves (when above 0) |
| `boss_pool` | JSON list of enemies ids the map's boss is picked from each run (0.7: Morytania's six Barrows brothers). The rows share the boss slot (their first `bonk_base_enemy`, Pharaoh1) and the miniboss slots; `Rows.PickHidden` picks the hidden brother as the stage starts, the other five are the minibosses in turn (`Rows.NextMiniboss`), and beating him gives a Barrows piece (`Barrows`). A pool member that is a `bosses` row's `enemy_id` fights in that row's own lair (0.11: each God Wars general in his room, `Rows.BossArenaFor`); only the Barrows brothers give pieces. `[]` for none. | rows of `enemies` |
| `osrs_plane` | The OSRS level `osrs_area` is built from (0.11: the God Wars Dungeon, on level 2). Above level 0 the raised-house bridges are off, and objects below the level are left out. 0 for every earlier map. | the preflight checks `spawn_tile`, `boss_tile` and the area on this level |
| `phase`, `status` | | |

## waves

Spawn plan per map; Megabonk's own credit system paces spawns. Read by `Content.ApplyEnemies`.

| Column | Meaning | Preflight |
|---|---|---|
| `map_id` | Map row (also the sheet's key column, so preflight shows rows by map). | row of `maps` |
| `minute` | When the row applies. | |
| `enemy_ids` | Enemy rows. | rows of `enemies` |
| `spawn_rate`, `max_alive` | `megabonk` (keep Megabonk's pacing). Not read. | |
| `events` | `start`: the stage timeline's start enemies. `unlock`: the rows' non-miniboss bases get `canSpawnAfterTime = minute x 60`. `swarm`: the `ESwarm` event at that minute spawns these. `miniboss`: the `EMiniBoss` event at that minute spawns each row's miniboss base (its first `Miniboss*` base, else its first). A minute with no matching event in Megabonk's timeline changes nothing. `boss`: documentation only (the boss portal calls the stage boss). | each one of `start`, `unlock`, `swarm`, `miniboss`, `boss` |
| `phase`, `status` | | |

## drops

What things drop and what picking them up does. Read by `Rows` (food, potion, coins, casket) and `Loot`.

| Column | Meaning | Preflight |
|---|---|---|
| `table_id` | `lumbridge_common`, `skilling`, `barrows`, `giant_mole`; `enemies.drop_table_id` names one. The sheet's key (it has no `id`), so the preflight's findings name drops rows by it. Only `skilling` is read (`Skilling` finds a gather's row by it and `item`): kills don't pick drops by table yet (drops are global). | |
| `item` | Item name, used in chat lines. | |
| `kind` | `coins`, `food`, `potion`, `casket`, `rare`, `barrows_piece` (0.7: the 24 pieces a beaten hidden brother gives, one never owned before; its `effect` is `set:<brother>:<head|body|legs|weapon>`; kept for good in `unlocks.json`, `Barrows`). `Rows` picks food (with `bonk_base_pickup` Health), the potion, coins and the casket by kind. | |
| `bonk_base_pickup` | Megabonk pickup it reskins (`Gold`, `Health`, `Chest`) or `new`. | |
| `weight_or_rate` | Weight among food rows, or a per-kill chance (potion 0.025), or `megabonk`. A string column (the values mix numbers and `megabonk`): the food and potion rows' are parsed as numbers (`Rows.PickFood`, `Combat`), and so is the clue's (`Clues`). | a number on the food (Health), potion and clue rows |
| `osrs_item_id` | Model and icon. | item resolves |
| `effect` | `clue_trail` (0.13) makes the row the easy clue scroll: its `weight_or_rate` is the chance per kill (one clue at a time), its item the scroll on the ground. `heal:N` is read for food; the potion's `prayer:7+0.25` matches the code but is hard-coded; the `skilling` rows' effects are what gathering gives (`Skilling.ApplyEffect`: `gold:N` coins, `heal:N`, `speed:...` Megabonk's Haste, `armor:...` its Shield, the numbers after `speed`/`armor` not used). The coins' `gold` and the casket's `chest` are labels, not read. | |
| `phase`, `status` | | |

## clue_steps

The clue trail's spots (0.13), staged by the pipeline (`tools/pipeline clues`). An easy clue picks 2-3 of its map's steps,
a random first and then each nearest (`Clues.Start`). Read by `Clues`.

| Column | Meaning | Preflight |
|---|---|---|
| `id` | `<map>_<n>`. | |
| `map_id` | The map the step is on. | row of `maps` |
| `kind` | `dig` (stand there a moment), `search` (beside the object) or `talk` (beside the NPC, who stands there while it's the step). | dig, search or talk |
| `tile` | `[x, y]` in OSRS world tiles, on the map's `osrs_plane`: where the hint arrow stands and the step is done (1.5 tiles for a dig, 1.8 for a search, 2.5 for a talk). | inside the map's `osrs_area`, a walkable tile within 1 |
| `osrs_object_id` | The object searched (the `tile` is beside it); 0 otherwise. Not read by the plugin: the object stands in the built map, and the step is done at `tile`. | object resolves (search) |
| `osrs_npc_id` | The NPC spoken to, built at load and stood at the `tile`; 0 otherwise. | NPC resolves (talk) |
| `hint` | The step's hint, in our own words: never OSRS's clue text. Shown in the chatbox's dialogue and under the minimap. | |
| `phase`, `status` | | |

## prayers

Protection prayers, in key order. Read by `Prayer`, `Hud`, `Osrs` (sprites, sounds).

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key and name. | |
| `style_blocked` | Enemy style it blocks. | melee / ranged / magic |
| `block_normal`, `block_boss` | Share of damage removed (1.0 / 0.5). | |
| `drain_per_sec` | Points per second while on. | |
| `key` | Default key as a `KeyCode` name. Not read: the keys are `Prayer.Keys` (config), whose defaults this documents; keep them the same. | |
| `osrs_prayer_sprite_id` | Prayer book icon (prayer bar). | sprite resolves |
| `osrs_overhead_sprite_id` | `group:frame` overhead icon. | sprite resolves |
| `sfx_id` | Sound when turned on. | sound synthesises |
| `phase`, `status` | | |

## skills

Persistent skills. Read by `Skills`, `Hud`, `CharacterSelect`, `Prayer`, `Skilling`.

| Column | Meaning | Preflight |
|---|---|---|
| `id`, `name` | Key (also the `skills.json` key) and name. | |
| `trained_by` | Documentation of what trains it; the logic is in `Skills.Shares` (which skills a point of damage trains, by weapon style and attack style) and `Skills.FromDamage`, `Prayer.Tick`, `Skilling.Gather`. | |
| `xp_rate` | XP per point of damage, per second praying, or per gather. **Read by the code.** | |
| `osrs_skill_icon_id` | Skill icon sprite (also the style icons for attack/ranged/magic). | sprite resolves |
| `unlocks` | `{"level": weapon}` or `{"level": [weapons]}`: the weapons whose `gear_reqs` ask that level of this skill. Documentation: the code uses `weapons.gear_reqs`. | weapons are rows; matches `weapons.gear_reqs` both ways (0.14) |
| `phase`, `status` | | |

## ui

OSRS presentation elements. Read by `Hud`, `Osrs` (sprites, fonts), `CorePatches` (death text).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key the code looks up (`hitsplat_damage`, `chat_line`, `death_screen`, `missing_cache`...). | |
| `element` | Kind of element. Documentation (the wiki's ui table shows it). | |
| `osrs_sprite_or_font_id` | Sprite group (number), `font:<name>` or `item:<id>`. | resolves |
| `text` | Text template; `chat_line`, `death_screen` and `missing_cache` texts are used as written. | |
| `position` | Documentation; positions are in `Hud.cs`. | |
| `phase`, `status` | | |

## audio

Sounds and music. Read by `Rows.Sfx` (sound ids by row id) and `Osrs` (which sounds to synthesise).

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key the code looks up (`player_hit`, `level_up`, `prayer_off`...). | |
| `event` | Documentation. | |
| `osrs_sound_or_track_id` | `sfx:<id>`, `track:<name>` or `jingle:<name>`. | sound synthesises; a track is reported (phase 2 or later) as playing only on local builds, a jingle as never played |
| `fallback` | `sfx:<id>` used when the main one isn't a sound, `megabonk` or `none`. | sound synthesises |
| `phase`, `status` | | |

## hooks

Every place Bonkscape touches Megabonk: a row for each Harmony patch, and the polls, calls and data fields it relies
on. Documentation: the code doesn't read it, and the preflight checks every target still exists in Megabonk.
`check_docs.py` checks the [patch list](architecture.md#harmony-patches) against the code but not this sheet, so a new
or removed patch needs its row here by hand.

| Column | Meaning | Preflight |
|---|---|---|
| `id` | Key. | |
| `system` | Which system. | |
| `class_or_table` | Megabonk class. | the class exists |
| `method_or_row` | Method, or field for `data row`. | the method (or field/getter) exists |
| `patch_kind` | `prefix`, `postfix`, `prefix + postfix`, `poll`, `call (...)`, `data row` (a Megabonk field Bonkscape reads or writes). | for `data row`, `method_or_row` may be a field (its getter) |
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
