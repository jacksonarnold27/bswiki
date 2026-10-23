# BSWiki

Bonkscape is a Megabonk mod that puts an Old School RuneScape adventurer into a Megabonk horde-survival run through
real OSRS places: Lumbridge, Ardougne & Seers' Village, the God Wars Dungeon, Al Kharid, Morytania, TzHaar City and the
Wilderness. The maps, monsters, items, icons, fonts and sound effects are read from
your own OSRS install while the game starts. Nothing from either game ships with the mod.

This wiki says how each system works **in the code as it is now**. It doesn't describe plans as if they were built.

> **Version:** BSWiki matches Bonkscape **0.16.1** (code at `f716b88`). What changed in each version:
> [patch notes](../dev/changelog.md). How each version tested: [test history](../dev/testing.md#test-history).

## Pages

| Page | What it covers |
|---|---|
| [Getting started](getting-started.md) | What you need, installing through Melty, the first launch |
| [Maps](maps.md) | Lumbridge, Ardougne & Seers' Village, the God Wars Dungeon, Al Kharid, Morytania, TzHaar City and the Wilderness: what's built from your cache, spawn, portals, lava, minimap, see-through walls |
| [Adventurers](adventurers.md) | The fourteen adventurers: unlocks, special rules, starting weapons, stats, looks and size |
| [Weapons and evolutions](weapons-and-evolutions.md) | Every weapon, its Megabonk behaviour and level-ups; caskets and the three evolutions |
| [Gear passives](gear-passives.md) | The OSRS gear that replaces Megabonk's tomes, one item per slot, and the Fire cape |
| [Monsters and bosses](monsters-and-bosses.md) | Who spawns when, combat styles, sizes, the Giant Mole's dig, the Knights of the Round Table, the God Wars generals, the Kalphite Queen, the Barrows brothers, the Fight Caves and TzTok-Jad, PKers and the King Black Dragon, boss pets, clue scrolls |
| [Prayer](prayer.md) | Protection prayers: keys, drain, how much they block, potions, the prayer bar |
| [Skills and XP](skills-and-xp.md) | OSRS's XP table, what trains what, saving, unlocks by level, combat level |
| [HUD and chat](hud-and-chat.md) | Hitsplats, XP drops, chat box, the inventory and prayer book, the title screen, Megabonk's windows, the character select panel |
| [Skilling](skilling.md) | Trees, rocks and fishing spots, and what they give |
| [Settings](settings.md) | Every config key, its default and what it does |
| [Known limitations](known-limitations.md) | What isn't there yet, or behaves oddly |
| [Glossary](glossary.md) | OSRS, Megabonk and Bonkscape terms |

## Status labels

Every system comes from a row in the design sheets (`sheets/*.json`), and every row has a status. The wiki shows it
the same way everywhere:

- <span class="st st-verified">verified</span>: built and confirmed working in a Melty test run (self-checks or footage).
- <span class="st st-built">built</span>: in the mod, not yet confirmed in a test run.
- <span class="st st-todo">planned (phase 2)</span>: designed in the sheets but **not built**. Phase 2 and 3 are later
  milestones; phase 1 is what's in the mod now.

## In one minute

- You start a run on Megabonk's first map. With Bonkscape loaded it's **Lumbridge & Swamp**: you appear in the
  castle courtyard, and the castle, the River Lum, the church, the fields and the swamp are built from your cache.
  Its second stage is **[Ardougne & Seers' Village](maps.md#ardougne-and-seers-village)**, up to Camelot, and its third
  **[the God Wars Dungeon](maps.md#the-god-wars-dungeon)**, where one of the four generals waits.
  Megabonk's Desert becomes **[Al Kharid](maps.md#al-kharid)**, then **[Morytania](maps.md#morytania)** (Canifis,
  Mort Myre and the Barrows) and **[TzHaar City](maps.md#tzhaar-city)**, whose final portal leads into the Fight
  Caves. The Graveyard becomes **[the Wilderness](maps.md#the-wilderness)**, with the King Black Dragon below it.
- You play one of fourteen [adventurers](adventurers.md): the Warrior, Ranger, Mage, Zerker, Void Knight or Durial321,
  the Ironman or the Pure once you've earned them, or a Barrows brother once you own his set. Level-ups offer
  [OSRS weapons](weapons-and-evolutions.md) and [OSRS gear](gear-passives.md) in place of Megabonk's.
- [Monsters](monsters-and-bosses.md) in Lumbridge are chickens, goblins, giant rats, guards, cows and giant frogs,
  with the Giant Mole as the boss. Ardougne & Seers' Village ends with the Knights of the Round Table, the God Wars
  Dungeon with one of its four generals, and Al Kharid with the two-form Kalphite Queen. Morytania has its snails,
  ghouls, banshees, vampyres and the Vyrewatch, with a hidden Barrows brother as the boss and the others as minibosses;
  TzHaar City has the TzHaar, and the Fight Caves' waves end with TzTok-Jad, whose attacks the right prayer blocks
  completely; the Wilderness has revenants, PKers and the King Black Dragon. Each monster fights in melee, ranged or
  magic, shown by the icon over its head.
- Press **1 / 2 / 3** to [pray](prayer.md) against melee, missiles or magic, and **F** for your weapon's
  [special attack](weapons-and-evolutions.md#special-attacks) (**Q** picks which weapon's). On a controller they're on
  the d-pad, Y and a left-stick click ([Playing on a controller](getting-started.md#playing-on-a-controller)).
- Damage trains your OSRS [skills](skills-and-xp.md), and they're kept between runs. Your levels climb OSRS's weapon ladders (bronze to dragon scimitars,
  normal to magic shortbows, Wind to Fire Strike) and open stronger weapons, and **F1** picks your attack style.
- Stand next to the maps' trees, rocks and fishing spots to [skill](skilling.md) for coins, buffs and food.

Developer documentation (architecture, sheets, gotchas, testing, changelog, task docket) is in [BSWiki's developer pages](../dev/index.md).

<!-- sources: src/Bonkscape.Plugin/Plugin.cs src/Bonkscape.Plugin/Systems/Controls.cs -->
