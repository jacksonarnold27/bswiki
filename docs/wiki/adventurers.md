# Adventurers

You play an OSRS adventurer in place of a Megabonk character. Each adventurer takes over one Megabonk character's
slot: its place on character select, its movement and its hitbox. Bonkscape changes its name, stats, starting weapon,
portrait and model.

<!-- gen:characters -->
| Adventurer | Style (attack style) | Starting weapon | Megabonk slot | Stat changes | Worn OSRS items | Unlock | Status |
|---|---|---|---|---|---|---|---|
| **Warrior** | melee (aggressive) | Bronze scimitar | SirOofie | max HP +50, armour +0.15, move speed -0.02 | Rune full helm, Rune platebody, Rune platelegs, Dragon scimitar | always | <span class="st st-verified">verified</span> |
| **Ranger** | ranged (accurate) | Shortbow | Robinette | armour +0.05, move speed +0.075 | Green d'hide body, Green d'hide chaps, Magic shortbow | always | <span class="st st-verified">verified</span> |
| **Mage** | magic (accurate) | Wind Strike | Fox | move speed +0.04, luck +0.15 | Blue wizard hat, Blue wizard robe, Staff of fire | always | <span class="st st-verified">verified</span> |
| **Pure** | melee (aggressive) | Bronze scimitar | Ninja | max HP -40, damage +0.35, move speed +0.1 | Amulet of glory, Obsidian cape, Mithril gloves, Climbing boots, Zamorak monk top, Zamorak monk bottom, Dragon scimitar | levels:attack>=60,defence<=1 | <span class="st st-built">built</span> |
| **Zerker** | melee (aggressive) | Dragon scimitar | Calcium | max HP +30, armour +0.08, damage +0.15 | Helm of Neitiznot, Fighter torso, Rune platelegs, Dragon defender, Dragon scimitar, Climbing boots, Amulet of glory | always | <span class="st st-verified">verified</span> |
| **Void Knight** | melee (accurate) | Void knight mace | Athena | max HP +25, armour +0.1, damage +0.1 | Void melee helm, Elite void top, Elite void robe, Void knight gloves, Void knight mace | always | <span class="st st-built">built</span> |
| **Durial321** | melee (accurate) | Abyssal whip | Vlad | max HP +40, armour +0.1, damage +0.05, move speed +0.03 | Green partyhat, Ahrim's robetop, Ahrim's robeskirt, Fire cape, Barrows gloves, Abyssal whip, Toktz-ket-xil, Climbing boots | always | <span class="st st-verified">verified</span> |
| **Ironman** | melee (defensive) | Bronze scimitar | SirChadwell | max HP +30, armour +0.1, luck +0.25 | Ironman helm, Ironman platebody, Ironman platelegs | total level 250 | <span class="st st-built">built</span> |
| **Dharok** | melee (aggressive) | Dharok's greataxe | Dicehead | max HP +40, armour +0.12, damage +0.2, move speed -0.03 | Dharok's helm, Dharok's platebody, Dharok's platelegs, Dharok's greataxe | barrows set dharok | <span class="st st-built">built</span> |
| **Ahrim** | magic (accurate) | Ahrim's staff | Amog | max HP +20, armour +0.05, damage +0.1, luck +0.05 | Ahrim's hood, Ahrim's robetop, Ahrim's robeskirt, Ahrim's staff | barrows set ahrim | <span class="st st-built">built</span> |
| **Guthan** | melee (accurate) | Guthan's warspear | Spaceman | max HP +50, armour +0.12, damage +0.05 | Guthan's helm, Guthan's platebody, Guthan's chainskirt, Guthan's warspear | barrows set guthan | <span class="st st-built">built</span> |
| **Karil** | ranged (accurate) | Karil's crossbow | Bush | max HP +20, armour +0.05, damage +0.1, move speed +0.06 | Karil's coif, Karil's leathertop, Karil's leatherskirt, Karil's crossbow | barrows set karil | <span class="st st-built">built</span> |
| **Torag** | melee (defensive) | Torag's hammers | Bandit | max HP +45, armour +0.25 | Torag's helm, Torag's platebody, Torag's platelegs, Torag's hammers | barrows set torag | <span class="st st-built">built</span> |
| **Verac** | melee (accurate) | Verac's flail | Roberto | max HP +40, armour +0.12, damage +0.08 | Verac's helm, Verac's brassard, Verac's plateskirt, Verac's flail | barrows set verac | <span class="st st-built">built</span> |
<!-- /gen:characters -->

Stat changes are Megabonk stat modifiers. For each stat in the row (max HP, armour, damage, size, attack speed, move
speed, luck), Bonkscape removes the Megabonk character's own modifier for that stat and adds the row's value, if it
isn't zero. Move speed is added to Megabonk's move speed multiplier; the others are flat. Everything else about the
Megabonk character is left as Megabonk made it. A [boss pet](monsters-and-bosses.md#boss-pets) out adds +1% luck to
every adventurer.

## Unlocking

Six adventurers are open from the start. The others are earned:

- the **Pure**, once any one adventurer you've played has Attack 60 or more with Defence still 1;
- the **Ironman**, once any one adventurer you've played (one with a skills save of its own) reaches a **total level**
  of 250, all its skill levels added up;
- each **Barrows brother** (Dharok, Ahrim, Guthan, Karil, Torag and Verac), once you own his full set: his helm, body,
  legs and weapon, from the [Barrows chest](monsters-and-bosses.md#the-barrows-brothers).

These conditions replace Megabonk's own unlocks for the characters Bonkscape takes over, whatever your Megabonk
progress. Character select shows what a locked adventurer still needs, and refuses Megabonk's silver purchase of one,
as in *"Dharok can't be bought: his Barrows set (2/4)."*

## Special rules

- **Durial321** carries a second weapon from the start: **Ice Barrage**, beside his Abyssal whip, without its 94
  Magic requirement. He gets it again when a run restarts after a death.
- **The Barrows brothers** join at level 70 in Attack, Strength, Defence and Hitpoints (Ahrim in Magic too, Karil in
  Ranged), with their own weapon, and carry their set's effect on their hits
  ([set effects](monsters-and-bosses.md#the-barrows-brothers)). Nothing is saved until a brother earns XP.
  *(unconfirmed: needs a Melty run or footage)*
- **The Pure never trains Defence**: its Defence XP is dropped, and its combat styles never include Defensive or
  Controlled.
- **The Ironman can't trade.** Megabonk's Shady Guy, and TzHaar-Hur-Tel standing in for him in TzHaar City, won't deal
  with him: the prompt reads *Ironmen can't trade*, and pressing it says *"The shopkeeper won't trade with an
  Ironman."*

## Starting weapons

The **Warrior, Ranger, Mage, Ironman and Pure** climb OSRS's weapon ladders by their own
[levels](skills-and-xp.md): each starts with the highest tier its levels allow
([Weapons](weapons-and-evolutions.md#weapon-ladders)), and once it meets a stronger weapon of its style past the
ladder's top, that one instead (the one whose highest requirement is highest: a weapon outside the ladders counts as
soon as that requirement is above the tier's). Everyone else keeps their own weapon whatever their levels.

| Adventurer | Starts with | Climbs to |
|---|---|---|
| Warrior, Ironman, Pure (melee) | Bronze scimitar | the scimitar ladder by Attack (iron 2, steel 5, black 10, mithril 20, adamant 30, rune 40, dragon 60), then 70 Attack: **Abyssal whip**; 75 Attack: **Armadyl godsword**; 80 Attack and 90 Strength: **Scythe of vitur**. Also the **Void knight mace** once all its requirements are met (42 in Attack, Strength, Defence, Hitpoints, Ranged and Magic, 22 Prayer) while the ladder gives no more than the rune scimitar |
| Ranger (ranged) | Shortbow | the shortbow ladder by Ranged (oak 5, willow 20, maple 30, yew 40, magic 50), then 55 Ranged: **Red chinchompa**; 75 Ranged: **Toxic blowpipe** |
| Mage (magic) | Wind Strike | the Strikes by Magic (Water 5, Earth 9, Fire 13), then 75 Magic: **Trident of the seas**; 94 Magic: **Ice Barrage** |
| Zerker | Dragon scimitar | his own, always |
| Void Knight | Void knight mace | his own, always |
| Durial321 | Abyssal whip | his own, always |
| The Barrows brothers | their own weapon | their own, always |

The character select panel shows which weapon the adventurer will start with. A ladder's tier goes on when you pick
the adventurer and when a run starts, so a tier reached during a run comes with the next one (the chat box says so).
A starting weapon past the ladder (the whip at Attack 70) is set when Megabonk loads its data; from the code, one
reached during a play session may only reach a run after you restart Megabonk. That hasn't been tested yet
([docket](../dev/docket.md)).

> **Attack styles.** Each adventurer starts on its row's attack style (the Warrior, Zerker, Pure and Dharok
> aggressive, the Ironman and Torag defensive, the rest accurate), which decides which skills its hits train; switch
> it with **F1** or the combat tab ([Skills](skills-and-xp.md#attack-styles)). The style is kept per adventurer.

## Looks

Each adventurer is built from OSRS player parts in your cache: the male identity kits listed in the sheet (head, jaw,
torso, arms, hands, legs, feet) plus the worn items above, which hide the parts they cover, in the kits' own colours.
It plays OSRS's player animations:

- **standing** (808) when you're still (the Barrows brothers but Torag have their own standing and walking animations);
- **walking** (819) or **running** (824) by how fast you really move: running from 1.5 times OSRS's walking speed at
  the model's size, each cycle sped up or slowed to match;
- each weapon's OSRS **attack** when it fires ([Weapons](weapons-and-evolutions.md)), on the upper body while the legs
  keep walking or running, the way the OSRS client merges them, with **that weapon in hand**: the adventurer is built
  once per weapon (the weapon slot swapped for its item, the shield taken off for a two-handed one), so the weapon you
  see is the one attacking. A weapon whose item has no worn model leaves the current one in hand;
- a weapon's **special attack** animation, played whole ([Special attacks](weapons-and-evolutions.md#special-attacks));
- the **death** animation (836) when the run ends in death.

The model follows your character, feet on the ground, and turns to face the way you move. Megabonk's own character
model is hidden. Character select portraits are rendered from the same OSRS model, and on character select the
selected adventurer's OSRS model stands in place of Megabonk's character, at its height, facing you, playing its
standing animation.

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

<!-- sources: src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/PlayerSkin.cs src/Bonkscape.Plugin/Systems/Animator.cs src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Plugin.cs sheets/characters.json sheets/weapons.json src/Bonkscape.Plugin/Systems/Barrows.cs src/Bonkscape.Plugin/Systems/SetEffects.cs src/Bonkscape.Plugin/Systems/Unlocks.cs src/Bonkscape.Plugin/Systems/Skills.cs src/Bonkscape.Plugin/Systems/Pets.cs src/Bonkscape.Plugin/Core/Rows.cs src/Bonkscape.Plugin/Systems/AttackStyles.cs -->
