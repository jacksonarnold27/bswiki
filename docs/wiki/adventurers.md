# Adventurers

You play an OSRS adventurer in place of a Megabonk character. Each adventurer takes over one Megabonk character's
slot: its place on character select, its movement and its hitbox. Bonkscape changes its name, stats, starting weapon,
portrait and model.

<!-- gen:characters -->
| Adventurer | Style (attack style) | Starting weapon | Megabonk slot | Stat changes | Worn OSRS items | Unlock | Status |
|---|---|---|---|---|---|---|---|
| **Warrior** | melee (aggressive) | Dragon scimitar | SirOofie | max HP +50, armour +0.15, move speed -0.02 | Rune full helm, Rune platebody, Rune platelegs, Dragon scimitar | always | <span class="st st-verified">verified</span> |
| **Ranger** | ranged (accurate) | Magic shortbow | Robinette | armour +0.05, move speed +0.075 | Green d'hide body, Green d'hide chaps, Magic shortbow | always | <span class="st st-verified">verified</span> |
| **Mage** | magic (accurate) | Fire Strike | Fox | move speed +0.04, luck +0.15 | Blue wizard hat, Blue wizard robe, Staff of fire | always | <span class="st st-verified">verified</span> |
| **Pure** | melee (aggressive) | Dragon scimitar | Ninja | max HP -40, damage +0.35, move speed +0.1 | Dragon scimitar | defence 1 attack 60 | <span class="st st-todo">planned (phase 2)</span> |
| **Zerker** | melee (aggressive) | Dragon scimitar | Calcium | max HP +30, armour +0.08, damage +0.15 | Helm of Neitiznot, Fighter torso, Rune platelegs, Dragon defender, Dragon scimitar, Climbing boots, Amulet of glory | always | <span class="st st-verified">verified</span> |
| **Void Knight** | melee (accurate) | Void knight mace | Athena | max HP +25, armour +0.1, damage +0.1 | Void melee helm, Elite void top, Elite void robe, Void knight gloves, Void knight mace | always | <span class="st st-built">built</span> |
| **Durial321** | melee (accurate) | Abyssal whip | Vlad | max HP +40, armour +0.1, damage +0.05, move speed +0.03 | Green partyhat, Ahrim's robetop, Ahrim's robeskirt, Fire cape, Barrows gloves, Abyssal whip, Toktz-ket-xil, Climbing boots | always | <span class="st st-verified">verified</span> |
| **Ironman** | melee (defensive) | Dragon scimitar | SirChadwell | max HP +30, armour +0.1, luck +0.25 | Ironman helm, Ironman platebody, Ironman platelegs | total level 250 | <span class="st st-built">built</span> |
<!-- /gen:characters -->

Stat changes are Megabonk stat modifiers. For each stat in the row (max HP, armour, damage, size, attack speed, move
speed, luck), Bonkscape removes the Megabonk character's own modifier for that stat and adds the row's value, if it
isn't zero. Move speed is added to Megabonk's move speed multiplier; the others are flat. Everything else about the
Megabonk character is left as Megabonk made it.

Pure and Ironman are planned: they're in the sheet with unlock conditions, but **not built**, so character select
shows Megabonk's own `Ninja` and `SirChadwell` characters in their slots.

## Starting weapons

Each adventurer starts with its row's weapon. Once that adventurer's own [skills](skills-and-xp.md) are high enough,
it starts with a stronger weapon of the same style instead: of the ones whose requirements it meets, the one whose
requirements add up highest.

| Adventurer | Default | Upgrades |
|---|---|---|
| Warrior (melee) | Dragon scimitar | 60 Attack: **Dragon claws**; 70 Attack: **Abyssal whip**; 75 Attack: **Armadyl godsword**; 80 Attack and 90 Strength: **Scythe of vitur** |
| Ranger (ranged) | Magic shortbow | 55 Ranged: **Red chinchompa**; 75 Ranged: **Toxic blowpipe** |
| Mage (magic) | Fire Strike | 75 Magic: **Trident of the seas**; 94 Magic: **Ice Barrage** |

These requirements only decide the weapon you **start** with. Level-ups offer all eleven weapons whatever your levels
([Weapons](weapons-and-evolutions.md)).

The character select panel shows which weapon the selected adventurer will start with. Bonkscape sets the starting
weapon when Megabonk loads its data, which happens as the game starts. From the code, a level gained during a play
session shows on the panel right away but may only reach the run after you restart Megabonk. That hasn't been tested
yet ([docket](../dev/docket.md)).

> **Warrior and Attack.** The Warrior fights in the *aggressive* style, so its melee damage trains **Strength**, not
> Attack ([Skills](skills-and-xp.md#what-trains-what)). Attack is trained by melee damage from an *accurate*
> adventurer, which means the Ranger or Mage using a melee weapon picked up on level-up.

## Looks

Each adventurer is built from OSRS player parts in your cache: the male identity kits listed in the sheet (head, jaw,
torso, arms, hands, legs, feet) plus the worn items above, which hide the parts they cover, in the kits' own colours.
It plays OSRS's player animations:

- **standing** (808) when you're still;
- **walking** (819) or **running** (824) by how fast you really move: running from 1.5 times OSRS's walking speed at
  the model's size, each cycle sped up or slowed to match;
- each weapon's OSRS **attack** when it fires ([Weapons](weapons-and-evolutions.md)), on the upper body while the legs
  keep walking or running, the way the OSRS client merges them, with **that weapon in hand**: the adventurer is built
  once per weapon (the weapon slot swapped for its item, the shield taken off for a two-handed one), so the weapon you
  see is the one attacking. A weapon whose item has no worn model leaves the current one in hand;
- a weapon's **special attack** animation, played whole ([Special attacks](weapons-and-evolutions.md#special-attacks));
- the **death** animation (836) when the run ends in death.

The model follows your character, feet on the ground, and turns to face the way you move. Megabonk's own character
model is hidden. Character select portraits are rendered from the same OSRS model.

If a worn item isn't in your cache, the adventurer is built without it. If the body can't be built at all, you see
Megabonk's character.

## Size

Megabonk's character height is measured the first time it stands upright, and again when you switch to another
adventurer. Your adventurer is drawn at
that height times **`Models.AdventurerScale`** (default **1.6**, from 0.5 to 3). The maps are scaled to match, so the
world keeps OSRS proportions around you.

Your **hitbox** is still Megabonk's: a bigger adventurer doesn't get hit more.

Monsters are drawn on your adventurer's scale: an OSRS human stands about as tall as your adventurer, and goblins,
rats and chickens keep their OSRS ratios to them ([Monsters](monsters-and-bosses.md#size)).

<!-- sources: src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/PlayerSkin.cs src/Bonkscape.Plugin/Systems/Animator.cs src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Plugin.cs sheets/characters.json sheets/weapons.json -->
