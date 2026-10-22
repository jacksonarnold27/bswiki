# Skills and XP

Bonkscape has ten OSRS skills. They're **kept between runs** and use OSRS's real 1-99 XP table.
<span class="st st-verified">verified</span> (XP drops and level-ups seen in Melty test runs).

<!-- gen:skills -->
| Skill | Trained by (sheet) | XP rate | Starting weapon unlocks | Status |
|---|---|---|---|---|
| **Attack** | `melee_damage:accurate` | 0.25 | 70: Abyssal whip | <span class="st st-verified">verified</span> |
| **Strength** | `melee_damage:aggressive` | 0.25 | - | <span class="st st-verified">verified</span> |
| **Defence** | `melee_damage:defensive` | 0.25 | - | <span class="st st-built">built</span> |
| **Ranged** | `ranged_damage` | 0.25 | 55: Red chinchompa, 75: Toxic blowpipe | <span class="st st-verified">verified</span> |
| **Magic** | `magic_damage` | 0.25 | 75: Trident of the seas, 94: Ice Barrage | <span class="st st-built">built</span> |
| **Hitpoints** | `any_damage:third` | 0.0833 | - | <span class="st st-verified">verified</span> |
| **Prayer** | `seconds_praying` | 2 | - | <span class="st st-verified">verified</span> |
| **Woodcutting** | `node:tree` | 25 | - | <span class="st st-built">built</span> |
| **Mining** | `node:rock` | 17.5 | - | <span class="st st-built">built</span> |
| **Fishing** | `node:fishing` | 10 | - | <span class="st st-built">built</span> |
<!-- /gen:skills -->

## The XP table

The same formula as OSRS: level *L* needs ⌊(1/4) × Σ from *l* = 1 to *L* − 1 of ⌊*l* + 300 × 2^(*l*/7)⌋⌋ XP.

| Level | XP | Level | XP |
|---|---|---|---|
| 2 | 83 | 60 | 273,742 |
| 10 | 1,154 | 70 | 737,627 |
| 20 | 4,470 | 75 | 1,210,421 |
| 30 | 13,363 | 80 | 1,986,068 |
| 40 | 37,224 | 90 | 5,346,332 |
| 50 | 101,333 | 99 | 13,034,431 |

XP keeps counting past 99, up to 200,000,000 per skill. **Hitpoints starts at level 10** (1,154 XP), as in OSRS;
every other skill starts at 1.

## What trains what

**Combat skills** get XP for the damage you actually deal: the HP a monster loses, not the number Megabonk rolled.

| You deal damage with | Trains | XP per point of damage |
|---|---|---|
| A melee weapon, as an *accurate* adventurer (Void Knight, Durial321, Ranger, Mage) | Attack | 0.25 |
| A melee weapon, as an *aggressive* adventurer (Warrior, Zerker) | Strength | 0.25 |
| A melee weapon, as a *defensive* adventurer (Ironman) | Defence | 0.25 |
| A ranged weapon (any adventurer) | Ranged | 0.25 |
| A magic weapon (any adventurer) | Magic | 0.25 |
| Any weapon | Hitpoints, as well | 0.0833 (a third) |

The weapon's style decides ranged and magic; for melee weapons your adventurer's attack style picks the skill. So:

- the Warrior trains **Strength** (and Hitpoints) with melee weapons;
- **Attack** only goes up when the Ranger or Mage deals damage with a melee weapon taken on level-up;
- **Defence** is trained only by the Ironman, the one adventurer who fights defensively.

**Prayer** gets 2 XP for every second a protection prayer is on. **Gathering skills** get a fixed amount per action:
Woodcutting 25, Mining 17.5 and Fishing 10 ([Skilling](skilling.md)).

## XP drops and level-ups

- XP is grouped per OSRS game tick (0.6 s) and per skill. Each group is an OSRS **XP drop**, the skill icon and the
  amount, rising into the **XP counter** beside the minimap, which shows your total XP over all skills
  ([HUD](hud-and-chat.md#in-a-run)).
- On a level-up, the chat box says *"Congratulations, you just advanced a Strength level. You are now level 41."* and
  OSRS's level-up sound plays. OSRS's level-up dialogue then covers the chat box for 3 s (*"Congratulations, you just
  advanced a Strength level."*, *"Your Strength level is now 41."*) and OSRS's level-up fireworks play at your feet.
  (OSRS's level-up jingle is planned; it needs the music synthesiser.)

## Unlocks by level

Skill levels unlock better **starting weapons** ([Adventurers](adventurers.md#starting-weapons)):

| Skill | Level | Starting weapon |
|---|---|---|
| Attack | 60 | Dragon claws (melee adventurers) |
| Attack | 70 | Abyssal whip (melee adventurers) |
| Attack | 75 | Armadyl godsword (melee adventurers) |
| Attack and Strength | 80 and 90 | Scythe of vitur (melee adventurers) |
| Ranged | 55 | Red chinchompa (Ranger) |
| Ranged | 75 | Toxic blowpipe (Ranger) |
| Magic | 75 | Trident of the seas (Mage) |
| Magic | 94 | Ice Barrage (Mage) |

Your Prayer level also raises your prayer points (20 + level). The **Ironman** unlocks once any one adventurer reaches
a **total level** (all its skill levels added up) of 250 ([Adventurers](adventurers.md#unlocking)). The planned
Pure's condition (*1 Defence, 60 Attack*) isn't built.

## Combat level

The character select panel shows your **combat level**, worked out with OSRS's formula:

- base = ¼ × (Defence + Hitpoints + ⌊Prayer / 2⌋)
- melee = 0.325 × (Attack + Strength), ranged = 0.325 × ⌊1.5 × Ranged⌋, magic = 0.325 × ⌊1.5 × Magic⌋
- combat level = ⌊base + the biggest of melee, ranged and magic⌋

A fresh save (10 Hitpoints, everything else 1) is combat level 3. Combat level doesn't affect play.

## Saving

Each adventurer keeps their own skills: **`%LOCALAPPDATA%\Bonkscape\skills_<adventurer>.json`** (`skills_warrior.json`,
`skills_zerker.json` and so on), a plain list of each skill's XP. An adventurer without a save yet starts from
the older shared `skills.json` if there is one (it is left as it was). The character select panel shows the hovered
adventurer's own levels and combat level. Bonkscape saves when anything changed, every 20 seconds, at the end of a run
and when you quit Megabonk, writing a temporary file first so a crash never leaves half a save. If a file can't be
read, that adventurer starts fresh (the log says *"skills save of … unreadable, starting fresh"*). To reset an
adventurer's skills, delete their file while Megabonk is closed.

<!-- sources: src/Bonkscape.Plugin/Systems/Skills.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Prayer.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/HudLayout.cs src/Bonkscape.Plugin/Systems/LevelUpFx.cs sheets/skills.json src/Bonkscape.Plugin/Systems/Unlocks.cs -->
