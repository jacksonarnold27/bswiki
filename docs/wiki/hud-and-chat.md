# HUD and chat

Bonkscape draws an OSRS HUD over Megabonk's, laid out like OSRS's own interfaces and drawn with OSRS's sprites and
fonts, read from your cache. In a run on one of Bonkscape's maps it hides the Megabonk pieces it replaces: the health bar (on the HUD
and under your adventurer), the XP bar (its *LVL n* text stays) and the monsters' health bars. They come back when the
run ends, so Megabonk's other maps keep their own HUD. Megabonk's timer, kill counter and minimap stay (the minimap
shows the map's own OSRS minimap). Everything scales with the screen height in whole steps of 540 px: 1x at 720p, 2x at
1080p, 3x at 1440p, 4x at 4K. Above 720p the chat box is one step smaller.

The `Debug.OsrsHud` setting turns it off, and with `Debug.HideMegabonkHud` off Megabonk's own bars stay up beside it
([Settings](settings.md)).

## In a run

| Element | Where | What it shows |
|---|---|---|
| **Minimap orbs** | Left of Megabonk's minimap, as in OSRS | From the top: the XP button, the **hitpoints** orb (your Megabonk HP), the **prayer** orb (your prayer points; lit while a prayer is on) and the **special attack** orb: your special attack energy in %, lit when the armed weapon's spec can fire, with that weapon's icon beside it ([Weapons](weapons-and-evolutions.md#special-attacks)). Megabonk's dash keeps its key, but its cooldown no longer shows. Each orb drains from the top; its number is green when full, yellow at half and red when empty. |
| **XP counter** | Left of the orbs | Your total XP over all skills, and under it a green strip: Megabonk's progress to its next run level. |
| **XP drops** | Rising from under the XP counter into it | The skill icon and the amount, for about 2 s, grouped per 0.6 s tick ([Skills](skills-and-xp.md#xp-drops-and-level-ups)). Drops from the same tick line up under each other. |
| **Health bars** | Over a monster's head, and over yours | OSRS's green-over-red bar. A monster's shows for 6 s after you hit it: 30 px wide, 50 for minibosses, 80 for bosses. Yours shows whenever you're below full health, and for 6 s after any hit. |
| **Style icons** | Over the 10 nearest monsters, above their health bar | The Attack, Ranged or Magic skill icon for the monster's combat style ([Prayer](prayer.md)) |
| **Hitsplats** | On the body, at half its height as in OSRS: on a monster you hit, and on you when you're hit | OSRS's red hitsplat with the damage (any damage shows as at least 1), the green poison hitsplat for Megabonk's poison damage, or the blue 0 for a hit that missed: a prayer block, or a Megabonk evade or Aegis block. Hits Megabonk's short hit cooldown stops show nothing, and so do hits on a monster already dead. Each lasts 1.2 s, in OSRS's four slots (middle, above, above left, above right); a fifth hit adds its damage into the newest. Megabonk's own floating damage numbers (yours and the monsters') are hidden in Lumbridge. |
| **Prayer panel** | Bottom right | The three protection prayers on a stone panel with their keys ([Prayer](prayer.md#the-prayer-panel)) |
| **Overhead prayer** | Above your adventurer's health bar | The OSRS overhead icon of the active protection prayer |
| **Prayer glint** | On the overhead prayer icon | A small sparkle for 0.45 s when your prayer stops or halves a hit |
| **Minimap frame and compass** | Round Megabonk's minimap | OSRS's minimap frame, with the compass in its socket turning as the camera turns. Drawn only when Bonkscape could measure where Megabonk's minimap is on screen. |
| **Skilling markers** | Over usable trees, rocks and fishing spots within 10 tiles | The skill's icon (Woodcutting, Mining or Fishing), with a progress bar under it while you gather; gone while the spot comes back ([Skilling](skilling.md)) |
| **Coins** | Left side, about a third down | The OSRS coin stack for your amount, the amount in OSRS's colours (yellow, then white with K from 100,000, green with M from 10 million) and "Coins"; in TzHaar City the Tokkul stack and "Tokkul" ([Maps](maps.md#tzhaar-city)). Megabonk's own gold number and icon are hidden. |
| **Chat box** | Bottom left corner | See [below](#chat-box) |
| **Level-up** | Chat box, and at your feet | OSRS's level-up dialogue covers the chat box for 3 s: *"Congratulations, you just advanced a Strength level."*, *"Your Strength level is now 41."* and *"Click here to continue"*, with the skill's icon. OSRS's level-up fireworks play at your adventurer's feet, and keep playing while Megabonk's level-up window pauses the game. |
| **Evolution** | Chat box | The new weapon's name, like *"Fire Surge!"*, as a dialogue for 3.5 s |
| **Special attack graphics** | At your feet or the target's | The spec's OSRS graphic, rendered from your cache |
| **Loading screen** | The whole screen | Black with OSRS's *Loading - please wait.* box: when a run starts, after a death restart and when a boss fight moves into its lair, until you stand on the OSRS map ([Maps](maps.md#when-its-built)) |
| **Death message** | Centre | *"Oh dear, you are dead!"* in large red OSRS text. Megabonk's death screen title says it too. |
| **Hint** | Above the prayer panel, first 45 s | *"Pray against the icon over a monster: 1 Melee 2 Missiles 3 Magic"* |

Bonkscape doesn't draw a run clock: Megabonk's own timer stays.

## Chat box

OSRS's chat box, cut down: it shows your last **4** lines, and only for 8 seconds after something new is said, then
hides. It sits in the bottom left corner, only as tall as its lines. A level-up or evolution dialogue covers it while
it shows. The same message twice in a row becomes one line with a count, like *"You get some logs. (x3)"*.

What it says:

| When | Message |
|---|---|
| A run starts | *Welcome to Lumbridge. Press 1, 2 or 3 to pray against melee, missiles or magic.* (in Morytania: *Welcome to Morytania. ...*) |
| A later stage is another map | *Welcome to TzHaar City.* |
| A skill levels up | *Congratulations, you just advanced a Mining level. You are now level 12.* |
| You eat | *You eat the lobster. It heals some health.* |
| You drink a prayer potion | *You drink some of your prayer potion.* |
| Prayer runs out | *You have run out of Prayer points, you can recharge at an altar.* |
| You pray with no points | *You need to recharge your Prayer at an altar.* |
| A weapon evolves | *Your Fire Strike has become a Fire Surge!* |
| You press `Q` (`Special.SwitchKey`) | *Special attack: Abyssal whip (Energy Drain).* (the newly armed weapon) |
| You press `F` without enough energy, or with nothing in reach | *You don't have enough special attack energy left.* / *There's nothing in reach.* |
| An Ironman tries to trade | *The shopkeeper won't trade with an Ironman.* |
| You press `V` (`Camera.ToggleKey`) | *Camera: far.* / *Camera: near.* |
| The Giant Mole digs | *The Giant Mole burrows into the ground!* |
| A boss fight moves into its lair | *You follow the Giant Mole down into its lair.* (the Fight Caves: *You follow the TzTok-Jad down into its lair.*) |
| TzTok-Jad joins after the waves | *TzTok-Jad appears!* |
| TzTok-Jad drops below half health | *TzTok-Jad calls for help!* |
| A boss you kill unlocks gear | *You have been awarded a Fire cape!* |
| Lava first burns you in a run | *The lava's heat burns you!* |
| You gather | *You get some logs.* / *You manage to mine some tin.* (the rock's ore; *stone* for plain rocks) / *You catch some shrimps.* |

Every chat line is also written to the BepInEx log as `[chat] ...`.

## Character select panel

On character select, a **Bonkscape** panel at the top of the screen, in the gap between Megabonk's two windows and
above your adventurer, on OSRS's stone background, shows (drawn a step smaller when it wouldn't fit):

- the hovered adventurer's **combat level**, as *"Combat Lvl: 3"* ([Skills](skills-and-xp.md#combat-level)),
- that adventurer's skills in two columns, each with its icon and level, the panel as wide as its longest skill name,
- *"Warrior starts with: Dragon scimitar"*, the weapon the selected adventurer will start with
  ([Adventurers](adventurers.md#starting-weapons)).

## When your cache can't be found

If Bonkscape finds no OSRS cache, or decoding it fails, the screen shows *"Bonkscape can't find Old School
RuneScape's game files. Run OSRS once, then start Megabonk again."*

## Sounds

OSRS sound effects are synthesised from your cache's instrument data and mixed into Megabonk's audio, at
`Audio.OsrsVolume` ([Settings](settings.md)). They play for: getting hit (and the different sound for a 0), hitting
monsters (at most every 0.12 s) and killing them (every 0.2 s), each weapon's attack (at most every 0.3 s per
weapon), level-ups and evolutions, each prayer going on, prayer off, running out of prayer, picking up coins, eating
and drinking, chopping, mining and fishing.

OSRS **music**: an experimental player plays the map's track (Lumbridge: *Harmony*; Morytania: *Village*; TzHaar City: *Mor Ul Rek*) from your cache in place of Megabonk's music
(`Audio.OsrsMusic`), but only with its engine, `OsrsKit.Music.dll`, which release builds don't include; without it
Megabonk's music plays. OSRS's jingles (level-up, death) aren't built.

<!-- gen:audio -->
| Row | Event | OSRS sound or track | Fallback | Status |
|---|---|---|---|---|
| `enemy_hit` | hit | `sfx:2498` | megabonk | <span class="st st-built">built</span> |
| `player_hit` | hit | `sfx:510` | megabonk | <span class="st st-built">built</span> |
| `player_zero` | hit | `sfx:511` | none | <span class="st st-built">built</span> |
| `kill` | kill | `sfx:2498` | megabonk | <span class="st st-built">built</span> |
| `pickup_item` | pickup | `sfx:2582` | megabonk | <span class="st st-built">built</span> |
| `pickup_coins` | pickup | `sfx:3924` | megabonk | <span class="st st-built">built</span> |
| `level_up` | level_up | `sfx:3925` | none | <span class="st st-built">built</span> |
| `level_up_jingle` | level_up | `jingle:level_up` | sfx:3925 | <span class="st st-todo">planned (phase 2)</span> |
| `prayer_on_melee` | prayer_on | `sfx:2676` | none | <span class="st st-built">built</span> |
| `prayer_on_missiles` | prayer_on | `sfx:2677` | none | <span class="st st-built">built</span> |
| `prayer_on_magic` | prayer_on | `sfx:2675` | none | <span class="st st-built">built</span> |
| `prayer_off` | prayer_off | `sfx:2663` | none | <span class="st st-built">built</span> |
| `prayer_empty` | prayer_off | `sfx:2672` | none | <span class="st st-built">built</span> |
| `chop` | pickup | `sfx:2735` | none | <span class="st st-built">built</span> |
| `mine` | pickup | `sfx:3220` | none | <span class="st st-built">built</span> |
| `death` | death | `jingle:dead` | megabonk | <span class="st st-todo">planned (phase 2)</span> |
| `lumbridge_music` | map_music | `track:Harmony` | megabonk | <span class="st st-todo">planned (phase 2)</span> |
<!-- /gen:audio -->

## UI rows

The OSRS sprites and fonts each element uses (`sheets/ui.json`):

<!-- gen:ui -->
| Row | Element | OSRS sprite / font | Text | Position | Status |
|---|---|---|---|---|---|
| `hitsplat_damage` | hitsplat | `1359` | {damage} | over_target | <span class="st st-verified">verified</span> |
| `hitsplat_zero` | hitsplat | `1358` | 0 | over_target | <span class="st st-built">built</span> |
| `hitsplat_poison` | hitsplat | `1360` | {damage} | over_target | <span class="st st-built">built</span> |
| `hitsplat_font` | hitsplat | `font:p11_full` | digits | over_target | <span class="st st-verified">verified</span> |
| `xp_drop` | xp_drop | `font:p11_full` | +{xp} | top_right | <span class="st st-verified">verified</span> |
| `chat_line` | chat_line | `font:p12_full` | Congratulations, you just advanced a {skill} level. | bottom_left | <span class="st st-verified">verified</span> |
| `chat_box` | chat_line | `1017` | none | bottom_left | <span class="st st-verified">verified</span> |
| `death_screen` | death_screen | `font:b12_full` | Oh dear, you are dead! | center | <span class="st st-built">built</span> |
| `coin_stack` | coin_stack | `item:995` | {gp} | hud_gold | <span class="st st-verified">verified</span> |
| `overhead_icon` | overhead_icon | `440` | none | over_player | <span class="st st-verified">verified</span> |
| `style_marker_melee` | style_marker | `197` | none | over_enemy | <span class="st st-verified">verified</span> |
| `style_marker_ranged` | style_marker | `200` | none | over_enemy | <span class="st st-verified">verified</span> |
| `style_marker_magic` | style_marker | `202` | none | over_enemy | <span class="st st-verified">verified</span> |
| `run_timer` | run_timer | `font:p12_full` | {mm}:{ss} | hud_timer | <span class="st st-todo">planned (phase 3)</span> |
| `prayer_orb` | overhead_icon | `font:p11_full` | Prayer {points} | hud_prayer | <span class="st st-verified">verified</span> |
| `missing_cache` | chat_line | `font:p12_full` | Bonkscape can't find Old School RuneScape's game files. Run OSRS once, then start Megabonk again. | center | <span class="st st-built">built</span> |
| `orb_frame` | hud_sprite | `1071` | minimap orb frame | hud | <span class="st st-verified">verified</span> |
| `orb_empty` | hud_sprite | `1059` | drained part of an orb | hud | <span class="st st-verified">verified</span> |
| `orb_hitpoints` | hud_sprite | `1060` | hitpoints orb fill | hud | <span class="st st-verified">verified</span> |
| `orb_poison` | hud_sprite | `1061` | poisoned hitpoints orb fill | hud | <span class="st st-verified">verified</span> |
| `orb_prayer` | hud_sprite | `1063` | prayer orb fill | hud | <span class="st st-verified">verified</span> |
| `orb_prayer_on` | hud_sprite | `1066` | prayer orb fill while praying | hud | <span class="st st-verified">verified</span> |
| `orb_special` | hud_sprite | `1607` | special attack orb fill | hud | <span class="st st-verified">verified</span> |
| `orb_special_on` | hud_sprite | `1608` | special attack orb fill, on | hud | <span class="st st-verified">verified</span> |
| `icon_hitpoints` | hud_sprite | `1067` | hitpoints orb icon | hud | <span class="st st-verified">verified</span> |
| `icon_prayer` | hud_sprite | `1068` | prayer orb icon | hud | <span class="st st-verified">verified</span> |
| `icon_prayer_on` | hud_sprite | `1058` | prayer orb icon while praying | hud | <span class="st st-verified">verified</span> |
| `icon_special` | hud_sprite | `1610` | special attack orb icon | hud | <span class="st st-verified">verified</span> |
| `xp_button` | hud_sprite | `1196` | XP button beside the orbs | hud | <span class="st st-verified">verified</span> |
| `counter_back` | hud_sprite | `297` | stone tile of the XP counter and panels | hud | <span class="st st-verified">verified</span> |
| `total_xp` | hud_sprite | `222` | XP counter icon | hud | <span class="st st-verified">verified</span> |
| `prayer_glow` | hud_sprite | `4892` | active prayer glow | hud | <span class="st st-verified">verified</span> |
| `minimap_frame` | hud_sprite | `1177` | resizable-mode minimap frame | hud | <span class="st st-verified">verified</span> |
| `compass` | hud_sprite | `169` | compass face | hud | <span class="st st-verified">verified</span> |
| `health_bar_30` | hud_sprite | `2176` | 30 px health bar (green) | hud | <span class="st st-verified">verified</span> |
| `health_bar_30_back` | hud_sprite | `2177` | 30 px health bar (red) | hud | <span class="st st-verified">verified</span> |
| `health_bar_50` | hud_sprite | `2178` | 50 px health bar, minibosses (green) | hud | <span class="st st-verified">verified</span> |
| `health_bar_50_back` | hud_sprite | `2179` | 50 px health bar (red) | hud | <span class="st st-verified">verified</span> |
| `health_bar_80` | hud_sprite | `2182` | 80 px health bar, bosses (green) | hud | <span class="st st-verified">verified</span> |
| `health_bar_80_back` | hud_sprite | `2183` | 80 px health bar (red) | hud | <span class="st st-verified">verified</span> |
| `dialogue_font` | font | `font:q8_full` | level-up dialogue (interface 233) | chatbox | <span class="st st-verified">verified</span> |
<!-- /gen:ui -->

Two rows aren't drawn although the sheet marks them done: `run_timer` (Bonkscape's OSRS-font clock was removed in
0.1.7) and `hitsplat_poison` (nothing poisons yet).

<!-- sources: src/Bonkscape.Plugin/Systems/Projectiles.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Music.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/HudLayout.cs src/Bonkscape.Plugin/Systems/OsrsUi.cs src/Bonkscape.Plugin/Systems/MegabonkHud.cs src/Bonkscape.Plugin/Systems/LevelUpFx.cs src/Bonkscape.Cache/SpotAnimFrames.cs src/Bonkscape.Plugin/Systems/Chat.cs src/Bonkscape.Plugin/Systems/Evolutions.cs src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Sfx.cs src/Bonkscape.Plugin/Core/OsrsAudio.cs src/Bonkscape.Plugin/Patches/CorePatches.cs sheets/ui.json sheets/audio.json src/Bonkscape.Plugin/Systems/BossFight.cs src/Bonkscape.Plugin/Systems/LavaBurn.cs src/Bonkscape.Plugin/Systems/Unlocks.cs src/Bonkscape.Plugin/Systems/Arena.cs src/Bonkscape.Plugin/Core/Runner.cs src/Bonkscape.Plugin/Core/Osrs.cs -->
