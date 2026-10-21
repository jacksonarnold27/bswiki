# Docket

Ideas and tasks, grouped by milestone, in order. Statuses: <span class="st st-todo">todo</span>
<span class="st st-doing">doing</span> <span class="st st-done">done</span> <span class="st st-blocked">blocked</span>.
Update it with every version ([How to update these docs](updating-docs.md)). Last updated 2026-10-21, at 0.1.20.

Phase 2/3 rows in the sheets are tracked by the sheets themselves (their `status`); this docket names them only where
a milestone needs them.

## Current push

| Status | Task | Notes |
|---|---|---|
| <span class="st st-doing">doing</span> | **Shared osrs-kit** | Started at `D:\Modding\osrs-kit`: shared RuneScape code, data dumps and docs. It will replace `src/Bonkscape.Cache`. Separate session. |
| <span class="st st-doing">doing</span> | **Offline data and wiki dump** | Part of osrs-kit. The OSRS Wiki dump (2023-10-08, 135,796 pages) is set up: `python -I D:\Modding\osrs-kit\tools\wiki\wiki.py` with `page`, `infobox`, `search` or `uses` (`--json` for scripts). **Check it before any live oldschool.runescape.wiki lookup** (the user's rule). |
| <span class="st st-doing">doing</span> | **Music research** | How OSRS music is stored and synthesised (MIDI tracks, patches, Vorbis samples). The user will pick one track per map. Session `music-research`. |
| <span class="st st-doing">doing</span> | **Map ideas and per-map music choices** | An Ideas layer in `tools/sketch` and `docs/design/`. |
| <span class="st st-done">done</span> | **These wikis** | `docs/wiki`, `docs/dev`, this docket, `tools/wiki-site` (first version at 0.1.15). Keep them current with every version. |
| <span class="st st-doing">doing</span> | **Monsters on the adventurer's scale** | 0.1.20 (`782ce3f`): the user asked that all OSRS humans be one scale and goblins scaled the same way, so monsters use the adventurer's OSRS-units-to-metres again (`Models.MonsterSize` replaces `MonsterScale`); tier ceilings unchanged. Test `9634e18a` running; check the sizes in its footage. |
| <span class="st st-done">done</span> | **Monster sizing and camera** | 0.1.13 to 0.1.15: size tiers and ceilings, `Models.BossMaxHeight`, `Camera.Distance`, the hitbox floor off, `Minimap.Zoom` and upright minimap icons. 1-run quick tests passed. |
| <span class="st st-doing">doing</span> | **Crash at start (0.1.17, 0.1.18)** | Tests `aebf6011`, `b09071b7` and `48b6a423`: Megabonk crashed in `coreclr.dll` (c0000005) 16 to 18 s in, while the Forest stage loads, 3 times out of 3; only `osrs-cache` reported. The main session's dump shows the main thread with a smashed stack, called from Megabonk's IL2CPP code into ours. Dropping the `EnemyHpBar.Set` patch (0.1.18) didn't fix it. 0.1.19 with `Debug.OsrsHud=false` ran clean (test `9f22aab1`), so it's in the new HUD code; 0.1.20 runs with `Debug.HideMegabonkHud=false` (HUD drawn, Megabonk's HUD left alone) to split it further (test `9634e18a` running). Once found, add the gotcha to `MODLOG.md`. |
| <span class="st st-doing">doing</span> | **OSRS-faithful UI style pass** | The user wants the UI and look copied from OSRS as much as possible: real OSRS interface sprites from the cache, written up in `docs/design/ui-style.md`. Shipped in 0.1.17 (`d283a13`): minimap orbs, XP counter and drops, health bars, prayer panel, chatbox dialogues, level-up fireworks, minimap frame and compass; Megabonk's bars hidden in a run. Not confirmed in a run yet: 0.1.17 and 0.1.18 crashed at start; 0.1.19's test passed, but its footage hasn't been checked for the HUD. Session `osrs-ui-style`. |
| <span class="st st-doing">doing</span> | **Health bars over heads** | Requested by the user (2026-10-21). In 0.1.17: monsters for 6 s after a hit (30/50/80 px by tier), the adventurer whenever hurt. Not seen in a run yet. |
| <span class="st st-done">done</span> | **Upright minimap icons, wall hiding, elite re-size** | 0.1.14 (`6e4df04`): map scene and map function icons drawn upright over Lumbridge's minimap; walls hide for Megabonk's player camera; elites and minibosses re-sized when Megabonk enlarges them after spawn. Quick test passed; keep an eye on wall hiding in footage. |

## Next milestone: 0.2.0, animations

The 0.2 release is the one with animations (the user's call); until then versions stay 0.1.x. OSRS stand, walk,
attack and death sequences for the adventurer and every monster, played in time with Megabonk.

| Status | Task | Notes |
|---|---|---|
| <span class="st st-todo">todo</span> | **Sequence playback in the cache library** | `Anim.cs` only applies the first frame of a stand sequence. Needs every frame with its length, the framemaps, and a way to show it in Unity (baked meshes per frame, or vertex updates: `Mesh.vertices` isn't stripped). Do it in osrs-kit if it lands first. |
| <span class="st st-todo">todo</span> | **Adventurer: stand, walk, run** | From the player's base animations (stand 808 is in `characters.osrs_player_model`). Walk/run chosen by Megabonk's move speed. |
| <span class="st st-todo">todo</span> | **Monsters: stand and walk** | NPC definitions carry stand and walk sequence ids (`enemies.animation_ids` already plans `walk: from_npc_def`). |
| <span class="st st-todo">todo</span> | **Monsters: attack and death** | Not in NPC definitions: needs the ids from the offline data (osrs-kit). Death plays before the model goes back to the pool (`Enemy.ReleaseToPool` timing). |
| <span class="st st-todo">todo</span> | **Weapon-specific attack animations** | One sequence per weapon (whip, scimitar, shortbow, blowpipe, chinchompa, each spell, trident); add a column to `weapons`. |
| <span class="st st-todo">todo</span> | **Sync with Megabonk's attacks** | Find the hooks for "the player's weapon fired" and "this enemy attacks" so the sequence starts with the hit; add them to `hooks`. |
| <span class="st st-todo">todo</span> | **Giant Mole dig animation** | `enemies.giant_mole.animation_ids.dig`, with the existing dig timing. |

## Then: character testing

| Status | Task | Notes |
|---|---|---|
| <span class="st st-todo">todo</span> | **Each adventurer through autoplay runs** | `TestMode.StartRun` always picks the first `characters` row (Warrior). Choose by the test file's `run` or `seed` so Ranger and Mage get runs; then mark their rows verified. |
| <span class="st st-todo">todo</span> | **Character select overlay** | The Bonkscape panel for each adventurer, at several resolutions, next to Megabonk's own character UI; portraits. |
| <span class="st st-todo">todo</span> | **Sizing per adventurer** | `Sizing.Reset()` is never called, so Megabonk's character height is measured once per game session. Check switching adventurers between runs (`SirOofie`, `Robinette`, `Fox` colliders may differ). |
| <span class="st st-todo">todo</span> | **Attack and Defence training** | The Warrior is aggressive (trains Strength); no adventurer trains Attack with its own weapon and none trains Defence. Decide: attack style choice, per-weapon styles, or the Ironman. |

## Then: unlock systems and UI validation

| Status | Task | Notes |
|---|---|---|
| <span class="st st-todo">todo</span> | **Gear requirements and starting weapons** | Every threshold (70 Attack, 55/75 Ranged, 75/94 Magic) with a prepared `skills.json`. Starting weapons are set only in the `DataManager.Load` postfix, but the panel computes them live: check whether a mid-session level-up needs a restart. |
| <span class="st st-todo">todo</span> | **Skill XP and persistence** | XP per damage and per action, Hitpoints at a third, Prayer XP, save timing (20 s, run end, quit), unreadable-file recovery, the 200M cap. |
| <span class="st st-todo">todo</span> | **Caskets and evolutions** | Both evolutions in one run (a test-mode shortcut to level 8 and the passive), stats restored at the next run, chat line and banner. |
| <span class="st st-todo">todo</span> | **Gear slot rules** | Neck and ring exclusivity and the level-8 cap in the offers. |
| <span class="st st-todo">todo</span> | **Level-up banners and chat** | Levels, repeats collapsing, chat box timing. |
| <span class="st st-todo">todo</span> | **Every HUD element** | Hitsplats, minimap orbs, XP counter and drops, health bars, style icons, prayer panel, overhead, "Protected!", coins (K/M colours), level-up and evolution dialogues, fireworks, death text, missing-cache text, at 720p/1080p/1440p/4K. Unconfirmed from code alone: whether Megabonk's minimap gets measured (log `minimap border corners ...: used`), which way the compass turns (`Hud.NorthYaw`), and that Megabonk's HUD comes back after a run (log `Megabonk HUD restored`). |
| <span class="st st-todo">todo</span> | **Prayer against minibosses** | Does Megabonk's `IsBoss()` count `MinibossPig`/`MinibossGolem`? That decides 100% or 50% blocking. |

## Later

| Status | Task | Notes |
|---|---|---|
| <span class="st st-todo">todo</span> | **OSRS music synthesiser** | Built later, as part of osrs-kit, after the research. Unlocks one track per map (the user's picks), `maps.osrs_music_track`, `audio.lumbridge_music`, the level-up and death jingles. |
| <span class="st st-todo">todo</span> | **Maps from the user's outlines, with music** | Outlines drawn in the sketch tool; each map a `maps` row with `osrs_area`, spawn, boss tile and music. |
| <span class="st st-todo">todo</span> | **Underground and instance arenas** | Caves, dungeons and boss rooms (the sketch tool has underground and instance views). |
| <span class="st st-todo">todo</span> | **9-tile performance work** | For larger (3x3-region) maps: shared vertices, LOD, culling. Lumbridge is 16 regions as triangle soup today. |
| <span class="st st-todo">todo</span> | **Switch Bonkscape to osrs-kit** | Replace `src/Bonkscape.Cache` with a reference to the shared kit once it covers what the plugin uses. |
| <span class="st st-todo">todo</span> | **Phase 2 and 3 content** | Pure, Ironman, Dwarf multicannon, Dharok's, Scythe, AGS, Dragon claws, Fire cape, Godsword shards and their evolutions, special attacks, Barrows, the Wilderness, God Wars, the Fight Caves and Jad, pets, clue scrolls (see the sheets). |
| <span class="st st-todo">todo</span> | **OSRS projectiles and weapon sounds** | `weapons.osrs_projectile_or_spotanim_id` and `sfx_id`, and `audio.enemy_hit`/`kill`, are decoded or listed but never used. |

## Recommended fixes and checks

| Status | Task | Notes |
|---|---|---|
| <span class="st st-done">done</span> | **Monster hitbox floor** | Resolved in 0.1.15 (`1ab911b`): the floor is off by default (`Models.MinHitboxShare` = 0), because Megabonk's hitboxes are tall capsules (5.4 m for a 3 m skeleton) and fitting them undid OSRS proportions. `FitHitbox` now logs a `resize ...` line, and re-applies the elite/miniboss enlargement once Megabonk has made it. |
| <span class="st st-done">done</span> | **Boss and elite size caps** | 0.1.13 (tier ceilings, `Models.BossMaxHeight`); 0.1.14 applies the caps after Megabonk's late enlargement. Quick tests passed. |
| <span class="st st-todo">todo</span> | **README in the release zip** | Checked: 0.1.0 to 0.1.11 shipped the first README ("Megabonk's Forest map becomes Lumbridge"); 0.1.12's zip has the current one. It still names `PlayerFit` (renamed `Models.AdventurerScale` in 0.1.12) and lacks `BossMaxHeight`, `Camera.Distance` (0.1.13), `MinHitboxShare` and `Minimap.Zoom` (0.1.15). Have `tools/package.py` refuse a README that doesn't mention the version's config keys. |
| <span class="st st-todo">todo</span> | **Listing text: "Lumbridge's map is in every OSRS install"** | Only true after a first login. Not checked from the docs session (the listing text isn't visible here). |
| <span class="st st-todo">todo</span> | **Real Giant Mole fight** | At the swamp's dark hole or in the Mole lair: its own arena, dig to a new spot, OSRS stats instead of Megabonk's boss. |
| <span class="st st-todo">todo</span> | **Monster rosters per map from NPC spawn data** | Which monsters actually live in each map's area, from the offline data, instead of hand-picked `bonk_base_enemy` lists. |
| <span class="st st-todo">todo</span> | **Hand-over playtest mode** | A test mode the creator plays by hand that still writes self-checks, so features autoplay can't reach get tested. |
| <span class="st st-todo">todo</span> | **Per-feature Melty test checks** | e.g. `evolution`, `skilling-gathered`, `mole-dig`, `prayer-blocked`, `pathing-around-wall`, `casket-opened`. |
| <span class="st st-todo">todo</span> | **Colours paler than OSRS** | Under Megabonk's lighting and post-processing; textured faces are one average colour. Compare side by side with OSRS. |
| <span class="st st-todo">todo</span> | **Autoplay hugging walls** | Autoplay's circle ignores walls; steer it with the pathing distance field. |
| <span class="st st-todo">todo</span> | **`hooks.json` behind the code** | Ten patches have no row, so the preflight can't catch a renamed target, and five rows have no patch ([Architecture](architecture.md#harmony-patches)). |
| <span class="st st-todo">todo</span> | **HUD sprites in the `ui` sheet** | 0.1.17's HUD draws interface sprites by id from `UiSprite` (orbs, XP counter, chatbox, prayer glow, health bars, minimap frame 1177, compass 169) and the `q8_full` font, none of them `ui` rows, so the preflight doesn't check they exist in a player's cache. |
| <span class="st st-todo">todo</span> | **Sheet statuses that don't match the code** | `ui.run_timer` says verified but isn't drawn; `hitsplat_poison` built but unused; `skills.unlocks` duplicates `weapons.gear_reqs`; drops' skilling `effect` strings aren't what runs. |
| <span class="st st-todo">todo</span> | **Bonkscape's data edits on other maps** | Weapons, tomes, characters and remapped enemies keep their OSRS stats and names on Megabonk's other maps. Decide whether to restore them off Lumbridge. |
| <span class="st st-todo">todo</span> | **Skilling spots aren't marked** | Trees and rocks that are spots look like any other; the rock spot is a Tin rocks object but says copper. |
| <span class="st st-done">done</span> | **Docs checks in the release steps** | `tools/package.py` runs `check_docs.py --head --release` (every check but the version one, whose changelog entry comes after the build and test) and refuses to build the zip on any FAIL (`--skip-docs` for emergencies, with a warning). The checker now also fails on a patch-table row with no patch in the code (the stale `EnemyHpBar.Set` case), and `docs_state.json` no longer counts as a changed source. The prose side is the `wiki-update` skill (`.claude/skills/wiki-update/`): run it after each version's build and test ([How to update these docs](updating-docs.md#the-docs-checker)). |

## Done

| Status | Task | Notes |
|---|---|---|
| <span class="st st-done">done</span> | The hub | One launcher for the tools: `Bonkscape Hub.cmd` or the Desktop shortcut starts `tools/hub` (port 8789), which starts the wiki and sketch servers and links them and the other docs. BSWiki is online (public) at jacksonarnold27.github.io/bswiki from the `bswiki` repo; `export_wiki.py --push` updates it ([The hub](hub.md#hosting-bswiki)). |
| <span class="st st-done">done</span> | Playability pass | 0.1.12: pathing, roomier collision, bigger adventurer, prayer bar |
| <span class="st st-done">done</span> | Map sketch tool | `tools/sketch` with surface, underground and instance views |
| <span class="st st-done">done</span> | Full cache on this PC | The RuneLite cache replaced with the full archive (backup kept); preflight 143/143 phase-1 assets; `bonk worldscan` |
| <span class="st st-done">done</span> | The real Lumbridge | 0.1.7 to 0.1.11; passed the publish test |
| <span class="st st-done">done</span> | Phase 1 systems | 0.1.0 to 0.1.5; passed the publish test |

<!-- sources: src/Bonkscape.Plugin/ sheets/ -->
