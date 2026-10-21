# Skilling

Lumbridge's own trees, rocks and shores are skilling spots. <span class="st st-built">built</span>

## How to gather

Stand next to a spot for **1.2 seconds**. Walking out of reach resets the timer. There's no button, no tool and no
level requirement: being close is enough, so you can skill while you fight.

| Spot | How many | Reach | Reward | XP | Back after |
|---|---|---|---|---|---|
| **Tree** (Lumbridge's trees and oaks) | 14 | about 1.8 tiles | **25 coins** and Megabonk's **Haste** speed boost. *"You get some logs."* | 25 Woodcutting | 30 s |
| **Rocks** | 10 | about 1.6 tiles | Megabonk's **Shield**. *"You manage to mine some copper."* | 17.5 Mining | 30 s |
| **Fishing spot** (on the water by the shore) | 6 | about 1.6 tiles | **Heals 20 HP**. *"You catch some shrimps."* | 10 Fishing | 20 s |

The Haste and Shield are the same effects as Megabonk's own Haste and Shield pickups. Each spot plays an OSRS sound
when you gather from it.

## Where the spots are

- **Trees and rocks** are real Lumbridge objects: 14 of the objects named *Tree* or *Oak* and 10 named *Rocks* are
  picked as spots. They're the same ones every run. They look like every other tree and rock, and nothing marks which
  ones are spots yet.
- **Fishing spots** are 6 water tiles next to walkable shore, on the River Lum and in the swamp. Each shows OSRS's
  fishing spot model on the water and disappears while it's used up.

A used-up tree or rock looks the same; it just gives nothing until it's back.

In the Forest fallback ([Maps](maps.md#when-lumbridge-isnt-built)) the spots are OSRS models placed around where you
start: 10 trees, 8 rocks and 4 fishing spots.

## The sheet and the code

The drops sheet describes the rewards a little differently from what runs:

| Sheet row | Sheet effect | What the code does |
|---|---|---|
| Logs | `gold:25;speed:0.2:6` (25 coins, +20% speed for 6 s) | 25 coins and Megabonk's Haste effect |
| Copper ore | `armor:0.15:8` (+15% armour for 8 s) | Megabonk's Shield effect |
| Raw shrimps | `heal:20` | Heals 20 |

The arena places 14/10/6 spots; the map row's counts (10/8/4) and respawn times are used by the Forest fallback, and
the respawn times by both.

Gathering levels don't change any reward yet.

<!-- sources: src/Bonkscape.Plugin/Systems/Skilling.cs src/Bonkscape.Plugin/Systems/Arena.cs sheets/maps.json sheets/drops.json sheets/skills.json -->
