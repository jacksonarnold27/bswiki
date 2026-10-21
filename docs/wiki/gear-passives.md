# Gear passives

Megabonk's *tomes* (the passive upgrades offered on level-up) become OSRS gear. Each piece of gear takes over one
Megabonk tome: its place in the level-up offers, its level cap and the one stat it raises. Bonkscape sets the stat,
the amount per level and the cap from the row, gives it the OSRS name and an icon rendered from your cache, and writes
its description, for example *"Amulet of fury (neck slot): +8% damage per level, up to level 8."*

<!-- gen:passives -->
| Gear | Slot | Megabonk tome | Stat | Per level | Max level | Status |
|---|---|---|---|---|---|---|
| **Amulet of fury** | neck | Damage | damage (multiplication) | +8% | 8 | <span class="st st-built">built</span> |
| **Berserker ring** | ring | Precision | crit chance (flat) | +7% | 8 | <span class="st st-built">built</span> |
| **Barrows gloves** | hands | Cooldown | attack speed (addition) | +7.5% | 8 | <span class="st st-built">built</span> |
| **Rune platebody** | body | Armor | armour (flat) | +12% | 8 | <span class="st st-built">built</span> |
| **Boots of lightness** | feet | Agility | move speed (addition) | +15% | 8 | <span class="st st-built">built</span> |
| **Ring of wealth** | ring | Luck | luck (flat) | +8% | 8 | <span class="st st-built">built</span> |
| **Amulet of glory** | neck | Golden | coins gained (addition) | +12% | 8 | <span class="st st-built">built</span> |
| **Kraken tentacle** | weapon upgrade | Size | attack size (addition) | +10% | 8 | <span class="st st-built">built</span> |
| **Tome of fire** | shield | Duration | duration (addition) | +15% | 8 | <span class="st st-built">built</span> |
| **Godsword shard** | weapon upgrade2 | Knockback | knockback (addition) | +20% | 3 | <span class="st st-todo">planned (phase 2)</span> |
| **Fire cape** | cape | Health | max HP (flat) | +25 | 8 | <span class="st st-todo">planned (phase 2)</span> |
<!-- /gen:passives -->

## One item per gear slot

Like your OSRS equipment, each slot holds one item. Once you've picked a piece of gear, the other pieces for the same
slot stop appearing in level-up offers:

- **Neck**: Amulet of fury *or* Amulet of glory.
- **Ring**: Berserker ring *or* Ring of wealth.
- Every other slot has a single item.

A piece also stops being offered once it reaches its max level (8).

## What's left out

In Lumbridge, level-ups offer only the gear above. Megabonk tomes without a row (Health and Knockback, for example,
until the Fire cape and Godsword shard are built) don't appear there.

Two pieces matter for [evolutions](weapons-and-evolutions.md#evolutions): the **Kraken tentacle** (Abyssal whip into
Abyssal tentacle) and the **Tome of fire** (Fire Strike into Fire Surge).

The Fire cape and Godsword shard are planned (phase 2), along with their evolutions, the Infernal cape and the
Armadyl godsword (i).

<!-- sources: src/Bonkscape.Plugin/Systems/Content.cs sheets/passives.json -->
