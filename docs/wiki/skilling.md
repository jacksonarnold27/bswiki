# Skilling

Each map's own trees, rocks and shores are skilling spots (Lumbridge's, Morytania's, TzHaar City's). <span class="st st-built">built</span>

## How to gather

Stand next to a spot for **1.2 seconds**. Walking out of reach resets the timer. There's no button, no tool and no
level requirement: being close is enough, so you can skill while you fight.

| Spot | How many | Reach | Reward | XP | Back after |
|---|---|---|---|---|---|
| **Tree** (the map's trees and oaks) | 14 | about 1.8 tiles | **25 coins** and Megabonk's **Haste** speed boost. *"You get some logs."* | 25 Woodcutting | 30 s |
| **Rocks** | 10 | about 1.6 tiles | Megabonk's **Shield**. *"You manage to mine some tin."* (the rock's ore) | 17.5 Mining | 30 s |
| **Fishing spot** (on the water by the shore) | 6 | about 1.6 tiles | **Heals 20 HP**. *"You catch some shrimps."* | 10 Fishing | 20 s |

The Haste and Shield are the same effects as Megabonk's own Haste and Shield pickups. Each spot plays an OSRS sound
when you gather from it.

## Where the spots are

- **Trees and rocks** are the map's real OSRS objects: 14 of the objects named *Tree* or *Oak*, and 10 ore rocks (*Copper
  rocks*, *Tin rocks*, *Iron rocks*, *Clay rocks*, *Coal rocks*; plain *Rocks* only when there are fewer than 4 ore
  rocks). They're the same ones every run. The mining line names the rock's ore, *stone* for plain rocks.
- **Fishing spots** are 6 water tiles next to walkable shore, in Lumbridge on the River Lum and in the swamp. Each shows OSRS's
  fishing spot model on the water and disappears while it's used up.

Within 10 tiles of you, each usable spot shows its skill's icon, with a progress bar under it while you gather
([HUD](hud-and-chat.md#in-a-run)). A used-up spot loses its icon; the tree or rock itself looks the same and gives
nothing until it's back.

In the fallback stage ([Maps](maps.md#when-a-map-isnt-built)) the spots are OSRS models placed around where you
start: 10 trees, 8 rocks and 4 fishing spots.

## The sheet and the code

Each map row's skilling node names its reward, a row of the drops sheet's `skilling` table, and the reward is that
row's `effect` string:

| Node | Drops row | Effect | What it does |
|---|---|---|---|
| Tree | Logs | `gold:25;speed:0.2:6` | 25 coins, and Megabonk's Haste (its own strength and length, not the sheet's numbers) |
| Rock | Copper ore | `armor:0.15:8` | Megabonk's Shield (likewise its own) |
| Fishing | Raw shrimps | `heal:20` | Heals 20 |

The arena places 14/10/6 spots; the map row's counts (10/8/4) are used by the fallback stage, and
the respawn times by both.

Gathering levels don't change any reward yet.

<!-- sources: src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Systems/Arena.cs sheets/maps.json sheets/drops.json sheets/skills.json -->
