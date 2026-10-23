# Skills and XP

Bonkscape has ten OSRS skills. They're **kept between runs** and use OSRS's real 1-99 XP table.
<span class="st st-verified">verified</span> (XP drops and level-ups seen in Melty test runs).

<!-- gen:skills -->
| Skill | Trained by (sheet) | XP rate | Starting weapon unlocks | Status |
|---|---|---|---|---|
| **Attack** | `melee_damage:accurate,controlled` | 0.25 | 1: Bronze scimitar / Iron scimitar, 5: Steel scimitar, 10: Black scimitar, 20: Mithril scimitar, 30: Adamant scimitar, 40: Rune scimitar, 42: Void knight mace, 60: Dragon scimitar / Dragon claws, 70: Abyssal whip, 75: Armadyl godsword, 80: Scythe of vitur | <span class="st st-verified">verified</span> |
| **Strength** | `melee_damage:aggressive,controlled` | 0.25 | 42: Void knight mace, 90: Scythe of vitur | <span class="st st-verified">verified</span> |
| **Defence** | `melee_damage:defensive,controlled; ranged_damage:longrange; magic_damage:defensive` | 0.25 | 42: Void knight mace | <span class="st st-built">built</span> |
| **Ranged** | `ranged_damage` | 0.25 | 1: Shortbow, 5: Oak shortbow, 20: Willow shortbow, 30: Maple shortbow, 40: Yew shortbow, 42: Void knight mace, 50: Magic shortbow, 55: Red chinchompa, 75: Toxic blowpipe | <span class="st st-verified">verified</span> |
| **Magic** | `magic_damage` | 0.25 | 1: Wind Strike, 5: Water Strike, 9: Earth Strike, 13: Fire Strike, 42: Void knight mace, 75: Trident of the seas, 94: Ice Barrage | <span class="st st-built">built</span> |
| **Hitpoints** | `any_damage:third` | 0.0833 | 42: Void knight mace | <span class="st st-verified">verified</span> |
| **Prayer** | `seconds_praying` | 2 | 22: Void knight mace | <span class="st st-verified">verified</span> |
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

Each point of damage is worth 0.25 XP, split by the weapon's style and your [attack style](#attack-styles) as in
OSRS, and Hitpoints gets a third of that (0.0833) on top:

| Weapon | Attack style | Trains |
|---|---|---|
| Melee | Accurate | Attack |
| Melee | Aggressive | Strength |
| Melee | Controlled | Attack, Strength and Defence, a third each |
| Melee | Defensive | Defence |
| Ranged | Accurate or Rapid | Ranged |
| Ranged | Longrange | Ranged and Defence, half each |
| Magic | Casting | Magic |
| Magic | Defensive casting | Magic (0.57) and Defence (0.43) |

The Pure never trains Defence: XP for it is dropped.

## Attack styles

Every adventurer has one attack style, which decides only where its XP goes. It starts on its row's style (the
Warrior, Zerker, Pure and Dharok aggressive, the Ironman and Torag defensive, the rest accurate) and is kept per
adventurer. **F1** (`Interface.AttackStyleKey`, OSRS's own key for the combat tab; Back on a controller) moves to the next style and shows the
combat tab for 4 s; a click on a style on the combat tab picks it ([HUD](hud-and-chat.md#the-side-panel)). The chat box
says *"Attack style: Longrange (Ranged, Defence XP)."*

The styles follow your adventurer's own style: melee **Accurate**, **Aggressive**, **Controlled** and **Defensive**;
ranged **Accurate**, **Rapid** and **Longrange**; magic **Casting** and **Defensive casting**. A style that would
train a skill the adventurer never trains isn't offered (the Pure has no Defensive or Controlled).

**Prayer** gets 2 XP for every second a protection prayer is on. **Gathering skills** get a fixed amount per action:
Woodcutting 25, Mining 17.5 and Fishing 10 ([Skilling](skilling.md)).

## XP drops and level-ups

- XP is grouped per OSRS game tick (0.6 s) and per skill. Each group is an OSRS **XP drop**, the skill icon and the
  amount, rising into the **XP counter** beside the minimap, which shows your total XP over all skills
  ([HUD](hud-and-chat.md#in-a-run)). Drops still waiting when a run ends are dropped; the XP is already yours.
- On a level-up, the chat box says *"Congratulations, you just advanced a Strength level. You are now level 41."* and
  OSRS's level-up sound plays. OSRS's level-up dialogue then covers the chat box for 3 s (*"Congratulations, you just
  advanced a Strength level."*, *"Your Strength level is now 41."*) and OSRS's level-up fireworks play at your feet.
  (OSRS's level-up jingle is planned: the experimental music engine plays only the maps' tracks and the title
  screen's Scape Main.)

## Unlocks by level

Skill levels decide your weapons, as OSRS's requirements do ([Weapons](weapons-and-evolutions.md#requirements)):

- the **weapon ladders**: the Warrior, Ranger, Mage, Ironman and Pure start each run on the highest tier their own
  levels allow (scimitars by Attack, shortbows by Ranged, the Strikes by Magic), and stronger weapons of their style
  past the ladder's top ([Adventurers](adventurers.md#starting-weapons));
- **level-up offers** leave out any weapon whose requirements you don't meet (one you hold or start with is always
  offered).

When a level brings a weapon into reach, the chat box says so: *"You can now wield the rune scimitar (from your next
run)."*, *"You can now cast Fire Strike."*

Your Prayer level also raises your prayer points (20 + level). The **Ironman** unlocks once any one adventurer you've played
(one with a skills save of its own) reaches a **total level** (all its skill levels added up) of 250
([Adventurers](adventurers.md#unlocking)). The
**Pure** unlocks once one adventurer you've played has Attack 60 with Defence 1.

## Combat level

The character select panel shows your **combat level**, worked out with OSRS's formula:

- base = ¼ × (Defence + Hitpoints + ⌊Prayer / 2⌋)
- melee = 0.325 × (Attack + Strength), ranged = 0.325 × ⌊1.5 × Ranged⌋, magic = 0.325 × ⌊1.5 × Magic⌋
- combat level = ⌊base + the biggest of melee, ranged and magic⌋

A fresh save (10 Hitpoints, everything else 1) is combat level 3. Combat level doesn't affect play.

## Saving

Each adventurer keeps their own skills: **`%LOCALAPPDATA%\Bonkscape\skills_<adventurer>.json`** (`skills_warrior.json`,
`skills_zerker.json` and so on), a plain list of each skill's XP. An adventurer without a save yet starts from
the older shared `skills.json` if there is one (it is left as it was). A Barrows brother instead starts at level 70 in his
combat skills, and nothing is written for him until he earns XP. The character select panel shows the hovered
adventurer's own levels and combat level. Bonkscape saves when anything changed, every 20 seconds, at the end of a run
and when you quit Megabonk, writing a temporary file first so a crash never leaves half a save. If a file can't be
read, that adventurer starts fresh (the log says *"skills save of … unreadable, starting fresh"*). To reset an
adventurer's skills, delete their file while Megabonk is closed.

<!-- sources: src/Bonkscape.Plugin/Systems/Skills.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Prayer.cs src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/HudLayout.cs src/Bonkscape.Plugin/Systems/LevelUpFx.cs sheets/skills.json src/Bonkscape.Plugin/Systems/Unlocks.cs src/Bonkscape.Plugin/Systems/AttackStyles.cs src/Bonkscape.Plugin/Core/Rows.cs src/Bonkscape.Plugin/Systems/Controls.cs -->
