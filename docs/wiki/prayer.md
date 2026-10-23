# Prayer

Every monster fights in one combat style (melee, ranged or magic), shown by the icon over the nearest monsters. A
**protection prayer** against that style blocks its hits. <span class="st st-verified">verified</span>

<!-- gen:prayers -->
| Prayer | Blocks | Normal monsters | Bosses | Drain (points/s) | Default key | Status |
|---|---|---|---|---|---|---|
| **Protect from Melee** | melee | 100% | 50% | 0.333 | 1 | <span class="st st-verified">verified</span> |
| **Protect from Missiles** | ranged | 100% | 50% | 0.333 | 2 | <span class="st st-verified">verified</span> |
| **Protect from Magic** | magic | 100% | 50% | 0.333 | 3 | <span class="st st-verified">verified</span> |
<!-- /gen:prayers -->

## Using prayers

- Press **1**, **2** or **3** to turn on Protect from Melee, Missiles or Magic. Change the keys with `Prayer.Keys`
  ([Settings](settings.md)).
- **One at a time**: turning one on replaces the one that was on. Press its key again to turn it off.
- Each prayer plays its OSRS sound when it goes on, and the prayer-off sound when you turn it off.
- The keys do nothing while you're typing in Megabonk's chat.
- While a prayer is on, its OSRS **overhead icon** floats above your adventurer.

## What it blocks

When a monster hits you and your prayer matches **that monster's style**:

| Monster | Damage blocked |
|---|---|
| Bosses (anything Megabonk flags as a boss, stage boss or final boss, such as the Giant Mole) | **50%** |
| TzTok-Jad's own attacks | **100%**, when the prayer matches the attack's style as it lands ([Monsters](monsters-and-bosses.md#tztok-jad)) |
| Every other monster | **100%**: the hit shows as a blue 0 hitsplat |

A boss's hit that names no monster (the Giant Mole's ground attacks) counts as the nearest boss's within 30 m, so its
protection prayer works on it. Megabonk counts its minibosses as bosses (a test run's log: `MinibossGolem … IsBoss True`), so a protection prayer
halves a miniboss's hits too, like the Giant Mole's. Elites aren't bosses: prayers stop all of their damage.

The overhead prayer icon glints (a small sparkle) whenever the prayer stops or halves a hit. Hits from a style you're
not praying against go through in full. A quarter of Verac the Defiled's melee hits ignore the prayer
([Barrows brothers](monsters-and-bosses.md#the-barrows-brothers)). K'ril Tsutsaroth's Prayer smash goes through every protection prayer and drains your prayer points
([Monsters](monsters-and-bosses.md#the-god-wars-generals)). Protect from Magic also stops the King Black Dragon's breaths from poisoning, freezing or shocking you
([Monsters](monsters-and-bosses.md#the-king-black-dragon)). Lava burns ([Maps](maps.md#tzhaar-city)) have no style, so no prayer stops
them. Checked in test runs: Protect from Melee stops chickens, giant rats, goblins
and cows, Protect from Missiles stops Lumbridge guards, Protect from Magic stops giant frogs, and the wrong prayer
lets hits through.

## Prayer points

- You start every run with **20 + your Prayer level** points (21 at Prayer 1, 119 at 99).
- An active prayer drains **0.333 points a second**, one point every 3 seconds.
- While a prayer is on you earn **2 Prayer XP a second** ([Skills](skills-and-xp.md)), so a higher Prayer level means
  more points in later runs.
- At 0 points the prayer switches off with OSRS's empty-prayer sound and the chat says *"You have run out of Prayer
  points, you can recharge at an altar."* Pressing a key with no points left says *"You need to recharge your Prayer
  at an altar."* Bonkscape has no altars to pray at yet: potions are the only way back.

## Prayer potions

Each kill has a **2.5%** chance to drop a **Prayer potion(4)**. It spins on the ground, slides towards you once you're
within about 9 m, and you drink it when you get close: **7 points + 25% of your maximum**, *"You drink some of your
prayer potion."*

## The prayer book

The side panel's prayer tab, in the lower right (**F5**, `Interface.PrayerTabKey`, or a click on the tab), shows the
three protection prayers at their places in OSRS's prayer book, each with its key in the corner. The active one sits
on OSRS's glow and its key turns yellow. When you're out of points, the prayers that aren't on are dimmed. Your points
show under the book, as *"43 / 52"* ([HUD](hud-and-chat.md#the-side-panel)).

Your prayer points are on the **prayer orb** beside the minimap ([HUD](hud-and-chat.md#in-a-run)): the number is green
when full, yellow at half and red when empty, and the orb lights up while a prayer is on.

For the first 45 seconds of a run, a hint above the side panel reads *"Pray against the icon over a monster: 1 Melee  2
Missiles  3 Magic  (F5: prayers, F1: attack style)"*.

<!-- sources: src/Bonkscape.Plugin/Systems/Prayer.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/HudLayout.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs sheets/prayers.json sheets/drops.json src/Bonkscape.Plugin/Systems/BossFight.cs src/Bonkscape.Plugin/Systems/LavaBurn.cs src/Bonkscape.Plugin/Systems/SetEffects.cs src/Bonkscape.Plugin/Systems/Inventory.cs -->
