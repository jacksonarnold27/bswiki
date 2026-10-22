# Glossary

## Old School RuneScape

| Term | Meaning |
|---|---|
| **OSRS** | Old School RuneScape, Jagex's MMO. Bonkscape reads its game files from your PC. |
| **Cache** | The folder of game files the OSRS client keeps (`main_file_cache.dat2` and `.idx` files). It fills up as you play, because the client downloads things the first time it needs them. |
| **Gielinor** | The OSRS world. |
| **Tile** | One square of the OSRS map. Positions like (3222, 3218) are OSRS world tiles: x east, y north. |
| **Region** | A 64 x 64-tile block of the map, the unit the cache stores map data in. |
| **NPC** | A non-player character, including every monster. Each has a numbered definition in the cache. |
| **Identity kit** | One of the body parts (head, torso, legs...) a player model is built from. |
| **Combat style** | Melee, ranged or magic. |
| **Special attack (spec)** | A weapon's special move, paid for with special attack energy. |
| **Attack style** | How a melee attack trains: accurate (Attack), aggressive (Strength) or defensive (Defence). |
| **Protection prayer** | A prayer that blocks one combat style: Protect from Melee, Missiles or Magic. |
| **Hitsplat** | The small marker with a damage number over whoever was hit. Red for damage, blue for 0. |
| **XP drop** | The `+XP` that floats up the screen when you gain experience. |
| **Game tick** | OSRS's 0.6-second heartbeat. Bonkscape groups XP drops per tick. |
| **Combat level** | One number summing up your combat skills, worked out with OSRS's formula. |
| **Total level** | All of a character's skill levels added up. |
| **Ironman** | An OSRS account that plays alone, without trading. Bonkscape's Ironman can't buy from shops. |
| **Barrows brothers** | Six undead brothers buried at the Barrows in Morytania: Dharok, Ahrim, Guthan, Karil, Torag and Verac. Each wears an armour set with its own effect. |
| **Set effect** | What a full Barrows set does on its wearer's hits, such as Guthan's healing. |
| **Casket** | An OSRS reward container. In Bonkscape, Megabonk's chests. |
| **Tokkul** | The TzHaar's currency. In TzHaar City, Megabonk's gold. |
| **Sequence** | An OSRS animation: frames that move a model's parts (stand, walk, run, attack, death). |
| **Interleave** | How the OSRS client plays an attack on the upper body while the legs keep walking or running. |
| **Spot animation (spotanim)** | A graphic effect such as a spell's projectile or impact. Bonkscape uses them for spell projectiles and the level-up fireworks. |

## Megabonk

| Term | Meaning |
|---|---|
| **Run** | One game from character select until you die or win. |
| **Stage** | One part of a map's run; the Forest and the Desert have several each. |
| **Tome** | Megabonk's passive upgrades. Bonkscape turns them into OSRS gear. |
| **Level-up offer** | The choice of upgrades Megabonk shows when you level up. |
| **Elite / miniboss / boss** | Bigger, stronger enemies. Megabonk enlarges them; Bonkscape caps how much of that it passes on. |
| **Boss portal** | The object you use to call a stage's boss. |
| **Final portal** | The boss portal of a map's last stage; it calls the final boss. |
| **Shrine** | A Megabonk interactable that offers a reward. |
| **Swarm** | A timeline event that spawns a crowd of one kind of enemy. |
| **Hitbox** | The invisible shape that decides whether something hits. Bonkscape never changes hitboxes, only how things look. |

## Bonkscape

| Term | Meaning |
|---|---|
| **Adventurer** | Your OSRS character: Warrior, Ranger, Mage, Zerker, Void Knight, Durial321, Ironman or a Barrows brother. |
| **Arena** | A real OSRS map built from your cache (Lumbridge on the Forest, Morytania and TzHaar City on the Desert, and the bosses' lairs) that replaces the stage's ground. |
| **Fallback stage** | Megabonk's own map (the Forest or the Desert) dressed in OSRS scenery, used when the arena can't be built. |
| **Gear passive** | A piece of OSRS gear that replaces a Megabonk tome. One per gear slot. |
| **Evolution** | A maxed weapon plus its gear passive becoming its OSRS upgrade when a casket opens. |
| **Stand-in** | Another OSRS NPC used when a monster's own model isn't in your cache. |
| **Style icon** | The Attack, Ranged or Magic icon over a monster, showing its combat style. |
| **Sheet** | One of the design data files in `sheets/*.json`. Every weapon, monster, prayer and so on is a row. |
| **Phase** | Which milestone a row belongs to. Phase 1 is in the mod now; phases 2 and 3 are later. |
| **Status** | A row's state: *todo* (planned), *built* (in the mod) or *verified* (confirmed in a Melty test run). |
| **Preflight** | The `bonk preflight` tool that checks every sheet against Megabonk and an OSRS cache before a build. |
| **Melty** | The service that installs, tests and publishes the mod. |
| **Test mode / autoplay** | How Melty's automated test plays a run by itself. |
| **Self-check** | A named result the mod reports to Melty during a test run, such as `prayer-switched`. |

<!-- sources: sheets/ -->
