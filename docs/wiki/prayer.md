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
| Every other monster | **100%**: the hit shows as a blue 0 hitsplat |

Whether Megabonk flags its minibosses (the Cow and Giant frog minibosses) as bosses hasn't been checked yet.

*"Protected!"* flashes over your adventurer whenever the prayer stops (or halves) a hit. Hits from a style you're not
praying against go through in full.

## Prayer points

- You start every run with **20 + your Prayer level** points (21 at Prayer 1, 119 at 99).
- An active prayer drains **0.333 points a second**, one point every 3 seconds.
- While a prayer is on you earn **2 Prayer XP a second** ([Skills](skills-and-xp.md)), so a higher Prayer level means
  more points in later runs.
- At 0 points the prayer switches off with OSRS's empty-prayer sound and the chat says *"You have run out of Prayer
  points, you can recharge at an altar."* Pressing a key with no points left says *"You need to recharge your Prayer
  at an altar."* There's no altar in Lumbridge yet: potions are the only way back.

## Prayer potions

Each kill has a **2.5%** chance to drop a **Prayer potion(4)**. It spins on the ground, slides towards you once you're
within about 9 m, and you drink it when you get close: **7 points + 25% of your maximum**, *"You drink some of your
prayer potion."*

## The prayer panel

At the bottom right of the screen, on a small OSRS stone panel: the three protection prayer icons as in OSRS's prayer
book, each with its key under it. The active one sits on OSRS's yellow glow and its key turns yellow. When you're out
of points, the prayers that aren't on are dimmed.

Your prayer points are on the **prayer orb** beside the minimap ([HUD](hud-and-chat.md#in-a-run)): the number is green
when full, yellow at half and red when empty, and the orb lights up while a prayer is on.

For the first 45 seconds of a run, a hint above the panel reads *"Pray against the icon over a monster: 1 Melee 2
Missiles 3 Magic"*.

<!-- sources: src/Bonkscape.Plugin/Systems/Prayer.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/HudLayout.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs sheets/prayers.json sheets/drops.json -->
