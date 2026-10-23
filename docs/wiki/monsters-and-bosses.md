# Monsters and bosses

## How a monster is made

Each OSRS monster takes over one or more Megabonk enemies: their spawn slots, movement and attacks. Bonkscape draws
it with its **OSRS NPC model** from your cache (the six Barrows brothers instead as an OSRS body in
their own Barrows armour, since their NPC models are pink in the cache), lit the way the OSRS client lights it, and plays its OSRS
[animations](#animations). Megabonk's own model is hidden. The OSRS model follows the enemy, feet on the ground, and
turns to face you.

For ordinary monsters, Bonkscape also replaces Megabonk's **HP, damage, speed and knockback resistance** with the
row's values. **Minibosses and bosses keep Megabonk's own stats**, so the Giant Mole fights with the HP and damage of
the Megabonk boss it replaces, not the sheet's 9000 HP (TzTok-Jad, the Kalphite Queen, the King Black Dragon and the God Wars
generals: not theirs). A map's difficulty (`maps.difficulty`) scales HP and damage for all of them; every map's is 1. Each row joins the spawn pool of its own maps (the roster's **Maps** column): Lumbridge's,
Ardougne & Seers' Village's and the God Wars Dungeon's monsters on Megabonk's Forest; Al Kharid's, Morytania's and TzHaar City's on the Desert; the Wilderness's on the Graveyard. The maps of one Megabonk
map share its enemy types: when a stage starts, its map's rows take the types over (names, models and stats). The Fight
Caves' monsters (Maps `tztok_jad_boss`) join no pool; the arena spawns them itself. Megabonk enemies that no row takes
over are removed from those maps' pools, so only OSRS monsters spawn on Bonkscape's maps. On a later
stage, Megabonk's own stage scaling multiplies every monster's HP and damage on top, as it does in any run.

## Roster

<!-- gen:enemies -->
| Monster | OSRS NPC (id) | Stand-in NPC ids | Combat | Style | Megabonk enemies | HP | Damage | Speed | Knockback resist | Size x | Maps | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Chicken** | Chicken (1173) | 1174, 2804, 2805, 1175 | 1 | melee | Slime | 6 | 8 | 6.5 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Goblin** | Goblin (3031) | 3029, 655, 657, 659, 674, 2484 | 2 | melee | Goblin, GoblinStrong | 7 | 15 | 5 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant rat** | Giant rat (2510) | 2511, 2512, 2856, 2492, 1020 | 3 | melee | Ghoul | 9 | 12 | 9 | 0 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Guard** | Guard (3010) | 3011, 1546, 1547, 1548, 995, 397 | 21 | ranged | Skeleton | 20 | 20 | 5.5 | 0.1 | 1 | lumbridge | <span class="st st-verified">verified</span> |
| **Cow** | Cow (2790) | 2791, 2793, 2795 | 2 | melee | ArmoredSkeleton, GoblinTank, MinibossPig | 30 | 22 | 4 | 0.3 | 1.1 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant frog** | Giant frog (477) | 478 | 99 | magic | Golem, MinibossGolem | 20 | 20 | 5 | 0.2 | 1.6 | lumbridge | <span class="st st-verified">verified</span> |
| **Giant Mole** | Giant Mole (5779) | 6499 | 230 | melee | Ent1, Ent2, Ent3 | 9000 | 40 | 7 | 1 | 2.2 | lumbridge | <span class="st st-built">built</span> |
| **Myre blamish snail** | Myre Blamish Snail (2634) | 2649 | 9 | melee | Mummy | 8 | 13 | 5.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Bat** | Bat (2827) | 10888, 14042 | 6 | melee | Tumblebone | 7 | 9 | 11 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Crawling Hand** | Crawling Hand (448) | 453, 454 | 8 | melee | Scorpion | 16 | 20 | 7 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Ghoul** | Ghoul (289) | - | 42 | melee | SkeletonDusty | 16 | 22 | 6.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Loar Shade** | Loar Shade (1277) | - | 40 | melee | Wisp | 8 | 13 | 7.5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Banshee** | Banshee (414) | - | 23 | magic | CactusShooter | 15 | 30 | 5 | 0 | 1 | morytania | <span class="st st-built">built</span> |
| **Vampyre Juvenile** | Vampyre Juvenile (4436) | 9732, 4438 | 45 | melee | ArmoredSkeletonDusty | 25 | 16 | 4.5 | 0.1 | 1 | morytania | <span class="st st-built">built</span> |
| **Feral Vampyre** | Feral Vampyre (3237) | - | 61 | melee | ScorpionMedium | 30 | 30 | 6.5 | 0.1 | 1 | morytania | <span class="st st-built">built</span> |
| **Vampyre Juvinate** | Vampyre Juvinate (4430) | 4427, 4428 | 54 | melee | MummyTank | 45 | 30 | 5 | 0.3 | 1 | morytania | <span class="st st-built">built</span> |
| **Vyrewatch** | Vyrewatch (3719) | 3717, 3730 | 105 | melee | MummyAncient | 70 | 40 | 5 | 0.5 | 1 | morytania | <span class="st st-built">built</span> |
| **Vyrewatch Sentinel** | Vyrewatch Sentinel (9761) | 9759, 9756 | 151 | melee | MinibossScorpion | 250 | 35 | 7 | 0.8 | 1.2 | morytania | <span class="st st-todo">planned (phase 2)</span> |
| **Dharok the Wretched** | Dharok the Wretched (1673) | 12317, 12323 | 115 | melee | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Ahrim the Blighted** | Ahrim the Blighted (1672) | - | 98 | magic | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Green dragon** | Green dragon (260) | 261, 263, 264, 262 | 79 | melee | Zombie | 12 | 20 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant imp** | Revenant imp (7881) | 14814 | 7 | melee | Head | 12 | 8 | 7 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **TzHaar-Ket** | TzHaar-Ket (2179) | 2173, 2174, 2175, 2176 | 149 | melee | ScorpionMedium, MummyTank, MummyAncient | 30 | 30 | 6.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Xil** | TzHaar-Xil (2171) | 2168, 2172, 2167, 2169 | 133 | melee | ArmoredSkeletonDusty | 25 | 16 | 4.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Hur** | TzHaar-Hur (7684) | 2166, 7686, 2161, 2162 | 74 | melee | Mummy, Wisp, Scorpion, SkeletonDusty, Tumblebone | 8 | 13 | 5.5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Mej** | TzHaar-Mej (2157) | 2156, 2160, 2154, 2155 | 103 | magic | CactusShooter | 15 | 30 | 5 | 0 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzHaar-Ket** | TzHaar-Ket (7679) | 2173, 2174 | 221 | melee | MinibossScorpion, MinibossGolemSand | 250 | 35 | 7 | 0.8 | 1.2 | tzhaar_city | <span class="st st-verified">verified</span> |
| **TzTok-Jad** | TzTok-Jad (3127) | 6506, 15574 | 702 | magic | Pharaoh3 | 8000 | 40 | 3 | 1 | 1 | tzhaar_city | <span class="st st-verified">verified</span> |
| **Tz-Kih** | Tz-Kih (3116) | 2189, 2190, 3117 | 22 | melee | Tumblebone | 7 | 9 | 11 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tz-Kek** | Tz-Kek (3118) | 2191, 2192, 3119 | 45 | melee | Scorpion | 16 | 20 | 7 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tz-Kek** | Tz-Kek (3120) | 2191, 2192 | 22 | melee | Mummy | 8 | 13 | 5.5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Tok-Xil** | Tok-Xil (3121) | 2193, 2194, 3122 | 90 | ranged | CactusShooter | 15 | 30 | 5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Yt-MejKot** | Yt-MejKot (3123) | 3124 | 180 | melee | MummyTank | 45 | 30 | 5 | 1 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Ket-Zek** | Ket-Zek (3125) | 3126, 15572 | 360 | magic | MummyAncient | 70 | 40 | 5 | 1 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Yt-HurKot** | Yt-HurKot (3128) | 7701, 7705 | 108 | melee | SkeletonDusty | 16 | 22 | 6.5 | 0 | 1 | tztok_jad_boss | <span class="st st-verified">verified</span> |
| **Guthan the Infested** | Guthan the Infested (1674) | 12318, 12324 | 115 | melee | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Karil the Tainted** | Karil the Tainted (1675) | 12319, 12325 | 98 | ranged | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Torag the Corrupted** | Torag the Corrupted (1676) | 12320, 12326 | 115 | melee | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Verac the Defiled** | Verac the Defiled (1677) | 12321, 12327 | 115 | melee | Pharaoh2, MinibossGolemSand, MinibossScorpion | 8000 | 40 | 7 | 1 | 1.6 | morytania | <span class="st st-built">built</span> |
| **Scorpion** | Scorpion (3024) | 13001, 2480 | 14 | melee | Mummy | 8 | 13 | 5.5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Al Kharid warrior** | Al Kharid warrior (3292) | - | 9 | melee | Tumblebone | 7 | 9 | 11 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Hill Giant** | Hill Giant (10374) | 10375, 10376, 2098, 2099 | 28 | melee | CactusShooter | 15 | 30 | 5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Shantay Guard** | Shantay Guard (4643) | - | 22 | melee | Wisp | 8 | 13 | 7.5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Ugthanki** | Ugthanki (4652) | - | 42 | melee | ScorpionMedium | 30 | 30 | 6.5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Kalphite Worker** | Kalphite Worker (956) | 955, 961 | 28 | melee | ArmoredSkeletonDusty | 25 | 16 | 4.5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Kalphite Soldier** | Kalphite Soldier (958) | 957, 138 | 85 | melee | MummyAncient | 70 | 40 | 5 | 1 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Desert Lizard** | Desert Lizard (460) | 459, 461, 12003 | 24 | melee | Scorpion | 16 | 20 | 7 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Bandit** | Bandit (695) | 690, 6605 | 57 | melee | MummyTank | 45 | 30 | 5 | 1 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Desert Wolf** | Desert Wolf (4649) | 4650, 4651 | 27 | melee | SkeletonDusty | 16 | 22 | 6.5 | 0 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Kalphite Guardian** | Kalphite Guardian (960) | 959, 962 | 141 | melee | MinibossScorpion, MinibossGolemSand | 250 | 35 | 7 | 0.8 | 1.2 | al_kharid | <span class="st st-built">built</span> |
| **Kalphite Queen** | Kalphite Queen (963) | 4303, 6500 | 333 | melee | Pharaoh1 | 8000 | 40 | 7 | 1 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Kalphite Queen** | Kalphite Queen (965) | 4304, 6501 | 333 | melee | Pharaoh1 | 8000 | 40 | 7 | 1 | 1 | al_kharid | <span class="st st-built">built</span> |
| **Revenant goblin** | Revenant goblin (7931) | 14864 | 15 | melee | Ghost | 10 | 10 | 6 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant hobgoblin** | Revenant hobgoblin (7933) | 15178 | 60 | melee | Ghoul | 9 | 12 | 9 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant cyclops** | Revenant cyclops (7934) | 15179 | 82 | melee | GreaterGhost | 20 | 13 | 7 | 1 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant hellhound** | Revenant hellhound (7935) | 15180 | 90 | melee | Skeleton | 20 | 20 | 5.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant demon** | Revenant demon (7936) | 15181 | 98 | melee | ArmoredSkeleton | 30 | 25 | 4 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant knight** | Revenant knight (7939) | 15184 | 126 | melee | GhostPurple | 40 | 20 | 8 | 1 | 1 | wilderness | <span class="st st-built">built</span> |
| **Revenant dragon** | Revenant dragon (7940) | 15185 | 135 | melee | GhostRed | 100 | 30 | 10 | 1 | 1 | wilderness | <span class="st st-built">built</span> |
| **Chaos Elemental** | Chaos Elemental (2054) | 6505 | 305 | magic | CalciumDad | 320 | 40 | 8 | 0.8 | 1.2 | wilderness | <span class="st st-built">built</span> |
| **Revenant maledictus** | Revenant maledictus (11246) | - | 397 | ranged | Ghostham | 320 | 45 | 6.5 | 0.8 | 1.2 | wilderness | <span class="st st-built">built</span> |
| **King Black Dragon** | King Black Dragon (239) | 6502, 12440 | 276 | melee | Ent1 | 30000 | 40 | 7 | 1 | 1 | wilderness | <span class="st st-built">built</span> |
| **Pure Spec** | Rogue (6603) | - | 70 | ranged | SkeletonDusty | 70 | 25 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Ice Tank** | Rogue (6603) | - | 98 | magic | SkeletonDusty | 98 | 29 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Ags Main** | Rogue (6603) | - | 126 | melee | SkeletonDusty | 126 | 34 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Claw Swap** | Rogue (6603) | - | 126 | melee | SkeletonDusty | 126 | 34 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Whip Hybrid** | Rogue (6603) | - | 112 | melee | SkeletonDusty | 112 | 32 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Pipe Ranger** | Rogue (6603) | - | 104 | ranged | SkeletonDusty | 104 | 30 | 6.5 | 0 | 1 | wilderness | <span class="st st-built">built</span> |
| **Goblin** | Goblin (5207) | 5205, 3028, 3029, 3030 | 2 | melee | Goblin | 7 | 15 | 5 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Guard** | Guard (6056) | 4099, 4100 | 10 | ranged | GoblinStrong | 15 | 25 | 5.5 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Guard dog** | Guard dog (114) | 131, 7209 | 44 | melee | BoomerSpider | 18 | 30 | 6 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Grizzly bear** | Grizzly bear (2838) | 3423, 11989 | 21 | melee | Skeleton | 20 | 20 | 5.5 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Giant bat** | Giant bat (2834) | 6824, 4504 | 27 | melee | Bee | 10 | 15 | 6.5 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Warrior** | Warrior (3260) | 11925, 11926, 11927, 11928 | 24 | melee | Golem | 20 | 20 | 5 | 1 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Ogre** | Ogre (1153) | 2233, 136 | 63 | melee | GoblinTank | 40 | 30 | 5 | 1 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Monkey** | Monkey (2848) | 1038, 1469 | 3 | melee | Slime | 6 | 8 | 6.5 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Knight of Ardougne** | Knight of Ardougne (3297) | 8799, 8800, 8801, 8854 | 46 | melee | ArmoredSkeleton | 30 | 25 | 4 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Snake** | Snake (2845) | 3544, 12084, 13002, 14916 | 5 | melee | Ghoul | 9 | 12 | 9 | 0 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Hero** | Hero (3295) | 11934, 11935 | 69 | melee | MinibossGolem | 250 | 40 | 6 | 0.8 | 1.2 | ardougne_seers | <span class="st st-built">built</span> |
| **Paladin** | Paladin (3293) | 3294, 8150, 8853, 11893 | 62 | melee | MinibossPig | 250 | 40 | 6 | 0.8 | 1.2 | ardougne_seers | <span class="st st-built">built</span> |
| **Sir Lancelot** | Sir Lancelot (4354) | 4344 | 127 | melee | Ent2 | 8000 | 40 | 7 | 1 | 1 | ardougne_seers | <span class="st st-built">built</span> |
| **Sir Bedivere** | Sir Bedivere (4361) | 4345 | 110 | melee | Mummy | 196 | 24 | 6 | 0 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Pelleas** | Sir Pelleas (4360) | 4347 | 112 | melee | Zombie | 215 | 26 | 6 | 0 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Tristram** | Sir Tristram (4359) | 4346 | 115 | melee | SkeletonDusty | 228 | 26 | 6 | 0 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Palomedes** | Sir Palomedes (4358) | 4343 | 118 | melee | ArmoredSkeletonDusty | 217 | 31 | 6 | 0 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Lucan** | Sir Lucan (4357) | 4342 | 120 | melee | MummyTank | 228 | 33 | 6 | 1 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Gawain** | Sir Gawain (4356) | 4348 | 122 | melee | MummyAncient | 239 | 33 | 6 | 1 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Sir Kay** | Sir Kay (4355) | 4349 | 124 | melee | Tumblebone | 239 | 38 | 6 | 0 | 1 | knights_boss | <span class="st st-built">built</span> |
| **Imp** | Imp (3134) | 5007, 14207 | 7 | melee | Slime | 6 | 8 | 6.5 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Goblin** | Goblin (2248) | 2487, 2489 | 15 | melee | Goblin | 7 | 15 | 5 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Aviansie** | Aviansie (3169) | 3177, 3178 | 69 | ranged | Bee | 10 | 15 | 6.5 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Hobgoblin** | Hobgoblin (2241) | 3050, 132 | 47 | melee | Ghoul | 9 | 12 | 9 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Bloodveld** | Bloodveld (3138) | 484, 485 | 81 | magic | GoblinStrong | 15 | 25 | 5.5 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Werewolf** | Werewolf (3136) | 3135, 2593 | 93 | melee | Skeleton | 20 | 20 | 5.5 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Knight of Saradomin** | Knight of Saradomin (2214) | 2213 | 101 | melee | Golem | 20 | 20 | 5 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Ork** | Ork (2240) | 2237, 2238, 2239 | 107 | melee | BoomerSpider | 18 | 30 | 6 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Saradomin priest** | Saradomin priest (2209) | - | 113 | magic | ArmoredSkeleton | 30 | 25 | 4 | 0 | 1 | god_wars | <span class="st st-built">built</span> |
| **Spiritual ranger** | Spiritual ranger (3167) | 2211, 3160 | 127 | ranged | GoblinTank | 40 | 30 | 5 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Spiritual warrior** | Spiritual warrior (2243) | 2210, 3166 | 134 | melee | MinibossGolem | 250 | 40 | 6 | 0.8 | 1.2 | god_wars | <span class="st st-built">built</span> |
| **Spiritual mage** | Spiritual mage (2212) | 3161, 2244 | 120 | magic | MinibossPig | 250 | 40 | 6 | 0.8 | 1.2 | god_wars | <span class="st st-built">built</span> |
| **General Graardor** | General Graardor (2215) | 6494, 12444 | 624 | melee | Ent3 | 10000 | 22 | 3 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Sergeant Strongstack** | Sergeant Strongstack (2216) | - | 141 | melee | SkeletonDusty | 125 | 10 | 6 | 0 | 1 | graardor_boss | <span class="st st-built">built</span> |
| **Sergeant Steelwill** | Sergeant Steelwill (2217) | - | 142 | magic | Zombie | 125 | 10 | 6 | 0 | 1 | graardor_boss | <span class="st st-built">built</span> |
| **Sergeant Grimspike** | Sergeant Grimspike (2218) | - | 142 | ranged | Mummy | 143 | 14 | 6 | 0 | 1 | graardor_boss | <span class="st st-built">built</span> |
| **Kree'arra** | Kree'arra (3162) | 6492, 12443, 15697 | 580 | ranged | Ent3 | 10000 | 22 | 3 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Flight Kilisa** | Flight Kilisa (3165) | - | 159 | melee | Ghost | 130 | 9 | 6 | 0 | 1 | kree_arra_boss | <span class="st st-built">built</span> |
| **Wingman Skree** | Wingman Skree (3163) | - | 143 | magic | GreaterGhost | 119 | 9 | 6 | 1 | 1 | kree_arra_boss | <span class="st st-built">built</span> |
| **Flockleader Geerin** | Flockleader Geerin (3164) | - | 149 | ranged | GhostPurple | 129 | 14 | 6 | 1 | 1 | kree_arra_boss | <span class="st st-built">built</span> |
| **K'ril Tsutsaroth** | K'ril Tsutsaroth (3129) | 6495, 12446 | 650 | melee | Ent3 | 10000 | 22 | 3 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Tstanon Karlak** | Tstanon Karlak (3130) | - | 145 | melee | SkeletonDusty | 139 | 12 | 6 | 0 | 1 | kril_boss | <span class="st st-built">built</span> |
| **Zakl'n Gritch** | Zakl'n Gritch (3131) | - | 142 | ranged | Zombie | 147 | 17 | 6 | 0 | 1 | kril_boss | <span class="st st-built">built</span> |
| **Balfrug Kreeyath** | Balfrug Kreeyath (3132) | - | 151 | magic | Mummy | 158 | 13 | 6 | 0 | 1 | kril_boss | <span class="st st-built">built</span> |
| **Commander Zilyana** | Commander Zilyana (2205) | 6493, 12445 | 596 | melee | Ent3 | 10000 | 22 | 3 | 1 | 1 | god_wars | <span class="st st-built">built</span> |
| **Starlight** | Starlight (2206) | - | 149 | melee | SkeletonDusty | 157 | 22 | 6 | 0 | 1 | zilyana_boss | <span class="st st-built">built</span> |
| **Growler** | Growler (2207) | - | 139 | magic | Zombie | 143 | 24 | 6 | 0 | 1 | zilyana_boss | <span class="st st-built">built</span> |
| **Bree** | Bree (2208) | - | 146 | ranged | Mummy | 159 | 24 | 6 | 0 | 1 | zilyana_boss | <span class="st st-built">built</span> |
<!-- /gen:enemies -->

The **Combat** column is the monster's OSRS combat level. It isn't used in play yet, and neither are the sheet's
per-monster XP value and drop table: XP comes from the damage you deal ([Skills](skills-and-xp.md)) and every monster
drops the same things ([Loot](#loot)).

## Combat styles

Every monster fights in **melee**, **ranged** or **magic**. In Lumbridge only the guards are ranged and only the giant
frogs are magic. In Ardougne & Seers' Village only the guards are ranged. In the God Wars Dungeon aviansies and spiritual rangers are
ranged, bloodvelds, Saradomin priests and spiritual mages magic, and the rest melee; each general's bodyguards are one
of each style. In Al Kharid every monster is melee. In the Wilderness the Chaos Elemental is magic, the Revenant maledictus ranged
and the rest melee, PKers fight in their weapon's style, and the King Black Dragon's attacks each have their own. In Morytania banshees and Ahrim the Blighted are magic, Karil the Tainted is ranged, and the rest are melee. In TzHaar City the
TzHaar-Mej are magic and the rest melee; in the Fight Caves the Tok-Xil are ranged, the Ket-Zek magic and the rest
melee, and each of TzTok-Jad's attacks has its own style ([below](#tztok-jad)). The OSRS skill icon for its style (Attack, Ranged or Magic) floats over the 10
nearest monsters, so you know which [protection prayer](prayer.md) to use. The style is the monster's, not its
attack's: a guard's hit counts as ranged even when Megabonk has it attack up close.

## When monsters come

<!-- gen:waves -->
| Map | Minute | Monsters | Event | Status |
|---|---|---|---|---|
| lumbridge | 0 | Chicken, Goblin, Giant rat, Guard | start | <span class="st st-built">built</span> |
| lumbridge | 1.5 | Cow, Giant frog | unlock | <span class="st st-built">built</span> |
| lumbridge | 3 | Giant frog, Cow | miniboss | <span class="st st-built">built</span> |
| lumbridge | 4 | Goblin | swarm | <span class="st st-built">built</span> |
| lumbridge | 7 | Giant rat | swarm | <span class="st st-built">built</span> |
| lumbridge | 8 | Cow, Giant frog | miniboss | <span class="st st-built">built</span> |
| lumbridge | 10 | Giant Mole | boss | <span class="st st-built">built</span> |
| tzhaar_city | 0 | TzHaar-Hur, TzHaar-Mej | start | <span class="st st-verified">verified</span> |
| tzhaar_city | 1.5 | TzHaar-Xil | unlock | <span class="st st-verified">verified</span> |
| tzhaar_city | 1.5 | TzHaar-Ket | miniboss | <span class="st st-verified">verified</span> |
| tzhaar_city | 2.5 | TzHaar-Hur | swarm | <span class="st st-verified">verified</span> |
| tzhaar_city | 3 | TzHaar-Ket | unlock | <span class="st st-verified">verified</span> |
| tzhaar_city | 4 | TzHaar-Hur | swarm | <span class="st st-verified">verified</span> |
| tzhaar_city | 5 | TzHaar-Ket | miniboss | <span class="st st-verified">verified</span> |
| tzhaar_city | 8 | TzTok-Jad | boss | <span class="st st-verified">verified</span> |
| al_kharid | 0 | Scorpion, Shantay Guard, Desert Lizard, Desert Wolf, Hill Giant, Al Kharid warrior | start | <span class="st st-built">built</span> |
| al_kharid | 1.5 | Kalphite Worker | unlock | <span class="st st-built">built</span> |
| al_kharid | 3 | Ugthanki, Bandit | unlock | <span class="st st-built">built</span> |
| al_kharid | 3 | Kalphite Guardian | miniboss | <span class="st st-built">built</span> |
| al_kharid | 4 | Scorpion | swarm | <span class="st st-built">built</span> |
| al_kharid | 6 | Kalphite Soldier | unlock | <span class="st st-built">built</span> |
| al_kharid | 7 | Desert Lizard | swarm | <span class="st st-built">built</span> |
| al_kharid | 8 | Kalphite Guardian | miniboss | <span class="st st-built">built</span> |
| al_kharid | 10 | Kalphite Queen | boss | <span class="st st-built">built</span> |
| morytania | 0 | Myre blamish snail, Loar Shade, Crawling Hand, Ghoul, Banshee, Bat | start | <span class="st st-built">built</span> |
| morytania | 1.5 | Vampyre Juvenile | unlock | <span class="st st-built">built</span> |
| morytania | 2 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | miniboss | <span class="st st-built">built</span> |
| morytania | 3 | Feral Vampyre, Vampyre Juvinate | unlock | <span class="st st-built">built</span> |
| morytania | 3 | Myre blamish snail | swarm | <span class="st st-built">built</span> |
| morytania | 6 | Vyrewatch | unlock | <span class="st st-built">built</span> |
| morytania | 6 | Crawling Hand | swarm | <span class="st st-built">built</span> |
| morytania | 7 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | miniboss | <span class="st st-built">built</span> |
| morytania | 9 | Dharok the Wretched, Ahrim the Blighted, Guthan the Infested, Karil the Tainted, Torag the Corrupted, Verac the Defiled | boss | <span class="st st-built">built</span> |
| wilderness | 0 | Revenant imp, Revenant goblin, Revenant hobgoblin, Green dragon, Revenant hellhound | start | <span class="st st-built">built</span> |
| wilderness | 1.5 | Revenant demon | unlock | <span class="st st-built">built</span> |
| wilderness | 3 | Revenant cyclops | unlock | <span class="st st-built">built</span> |
| wilderness | 3 | Chaos Elemental, Revenant maledictus | miniboss | <span class="st st-built">built</span> |
| wilderness | 4 | Revenant goblin | swarm | <span class="st st-built">built</span> |
| wilderness | 7 | Revenant knight | unlock | <span class="st st-built">built</span> |
| wilderness | 7 | Chaos Elemental, Revenant maledictus | miniboss | <span class="st st-built">built</span> |
| wilderness | 8 | Revenant cyclops | swarm | <span class="st st-built">built</span> |
| wilderness | 10 | Chaos Elemental, Revenant maledictus | miniboss | <span class="st st-built">built</span> |
| wilderness | 11 | Revenant knight | swarm | <span class="st st-built">built</span> |
| wilderness | 12 | Revenant dragon | unlock | <span class="st st-built">built</span> |
| wilderness | 13 | Chaos Elemental, Revenant maledictus | miniboss | <span class="st st-built">built</span> |
| wilderness | 14 | Revenant dragon | swarm | <span class="st st-built">built</span> |
| wilderness | 16 | King Black Dragon | boss | <span class="st st-built">built</span> |
| ardougne_seers | 0 | Monkey, Goblin, Snake, Giant bat, Guard, Grizzly bear, Guard dog | start | <span class="st st-built">built</span> |
| ardougne_seers | 1.5 | Warrior, Knight of Ardougne | unlock | <span class="st st-built">built</span> |
| ardougne_seers | 2 | Warrior, Paladin | miniboss | <span class="st st-built">built</span> |
| ardougne_seers | 3 | Ogre | unlock | <span class="st st-built">built</span> |
| ardougne_seers | 3 | Goblin | swarm | <span class="st st-built">built</span> |
| ardougne_seers | 6 | Guard | swarm | <span class="st st-built">built</span> |
| ardougne_seers | 7 | Paladin, Hero | miniboss | <span class="st st-built">built</span> |
| ardougne_seers | 9 | Sir Lancelot | boss | <span class="st st-built">built</span> |
| god_wars | 0 | Imp, Goblin, Hobgoblin, Aviansie, Bloodveld, Werewolf, Ork | start | <span class="st st-built">built</span> |
| god_wars | 1.5 | Knight of Saradomin, Saradomin priest | unlock | <span class="st st-built">built</span> |
| god_wars | 1.5 | Spiritual warrior, Spiritual mage | miniboss | <span class="st st-built">built</span> |
| god_wars | 2.5 | Goblin | swarm | <span class="st st-built">built</span> |
| god_wars | 3 | Spiritual ranger | unlock | <span class="st st-built">built</span> |
| god_wars | 4 | Bloodveld | swarm | <span class="st st-built">built</span> |
| god_wars | 5 | Spiritual mage, Spiritual warrior | miniboss | <span class="st st-built">built</span> |
| god_wars | 8 | General Graardor, Kree'arra, K'ril Tsutsaroth, Commander Zilyana | boss | <span class="st st-built">built</span> |
<!-- /gen:waves -->

How those rows apply, each on its own map's stage (Lumbridge on the Forest's first, Ardougne & Seers' Village on its second, the God Wars Dungeon on its third; Al Kharid, Morytania and TzHaar
City on the Desert's first, second and third; the Wilderness on the Graveyard's first):

- **start** (minute 0): the run's first monsters. Lumbridge: chickens, goblins, giant rats and guards. Ardougne & Seers' Village: monkeys,
  goblins, snakes, giant bats, guards, grizzly bears and guard dogs. The God Wars Dungeon: imps, goblins, hobgoblins, aviansies, bloodvelds,
  werewolves and orks. Al Kharid: scorpions, Shantay Guards,
  desert lizards, desert wolves, hill giants and Al Kharid warriors. Morytania: Myre
  blamish snails, bats, crawling hands, ghouls, Loar Shades and banshees. TzHaar City: TzHaar-Hur and TzHaar-Mej. The Wilderness:
  revenant imps, goblins, hobgoblins and hellhounds, and green dragons.
- **unlock**: the rows join the spawn pool from that minute. Lumbridge: cows and giant frogs at 1.5. Ardougne & Seers' Village:
  warriors and Knights of Ardougne at 1.5, ogres at 3. The God Wars Dungeon: Knights of Saradomin and Saradomin priests
  at 1.5, spiritual rangers at 3. Al Kharid: Kalphite
  Workers at 1.5, ugthanki and bandits at 3, Kalphite Soldiers at 6. Morytania:
  vampyre juveniles at 1.5, vampyre juvinates and feral vampyres at 3, the Vyrewatch at 6. TzHaar City:
  TzHaar-Xil at 1.5, TzHaar-Ket at 3. The Wilderness: revenant demons at 1.5, cyclopes at 3, knights at 7, dragons
  at 12.
- **swarm**: Megabonk's swarm event at that minute spawns the row's monsters. Lumbridge: goblins at 4, giant rats at
  7. Ardougne & Seers' Village: goblins at 3, guards at 6. The God Wars Dungeon: goblins
  at 2.5, bloodvelds at 4. Al Kharid: scorpions at 4, desert lizards at 7. Morytania: Myre blamish snails at 3,
  crawling hands at 6. TzHaar City: TzHaar-Hur at 2.5 and 4. The Wilderness: revenant goblins at 4, cyclopes at 8,
  knights at 11, dragons at 14.
- **miniboss**: Megabonk's miniboss event at that minute spawns each row's miniboss. Lumbridge: a Cow and a Giant frog
  at 3 and 8. Ardougne & Seers' Village: a Warrior and a Paladin at 2, a Paladin and a Hero at 7. The God Wars Dungeon: a
  spiritual warrior and a spiritual mage at 1.5 and 5. Al Kharid:
  a Kalphite Guardian at 3 and 8. Morytania: Barrows brothers at 2
  and 7, the five not hidden this run in turn ([below](#the-barrows-brothers)). TzHaar City: a TzHaar-Ket champion at
  1.5 and 5. The Wilderness: the Chaos Elemental and the Revenant maledictus at 3, 7, 10 and 13.
- **boss** (minute 10; Ardougne & Seers' Village's and Morytania's 9, the God Wars Dungeon's 8, TzHaar City's 8, the Wilderness's 16): the plan only. The stage boss comes when you open the boss
  portal (Lumbridge: the Giant Mole; Ardougne & Seers' Village: Sir Lancelot, after the Knights of the
  Round Table; the God Wars Dungeon: its final portal, this run's general; Al Kharid: the Kalphite Queen; Morytania: the run's hidden Barrows brother); TzHaar City's when you open its final portal
  (TzTok-Jad, in the Fight Caves), and the Wilderness's when you open its boss door (the King Black Dragon).

A swarm or miniboss row whose minute has no matching event in Megabonk's timeline spawns nothing; the log says how
many events each map set (*"waves: Morytania on Megabonk's Desert stage 0: N timeline events set"*). Megabonk's own
pacing decides how many monsters spawn and how fast.

## Stand-ins

The six Barrows brothers are built from their armour (each one's helm, body, legs and weapon); when those items aren't
in your cache, they use their NPC model and its stand-ins as below.

Your OSRS client downloads a model the first time it shows it, so your cache may not have every monster. For each
monster Bonkscape tries its own NPC first, then each **stand-in NPC id** in the order listed, and uses the first one
whose models are all in your cache (the log says *"Goblin: NPC 3031 isn't in this cache, using stand-in NPC 3029"*).
If none is there, the monster borrows the map's fallback monster (Lumbridge, Ardougne & Seers' Village and the God Wars Dungeon: the Goblin; Al Kharid: the Scorpion; Morytania: the Ghoul;
TzHaar City and its Fight Caves: TzHaar-Hur; the Wilderness: the revenant goblin). If that's missing too, you see
Megabonk's own model.

Turn stand-ins off with `OSRS.UseStandIns = false` ([Settings](settings.md)).

## Size

A monster's height is worked out when it spawns, and once more a moment later:

1. **OSRS proportions on your adventurer's scale**: its model height in OSRS units, converted to metres exactly like
   your adventurer's. So an OSRS human (a guard) stands about as tall as your adventurer, and every other monster keeps
   its OSRS ratio to them.
2. Times the row's **Size x** (Cow 1.1, Giant frog 1.6, Giant Mole 2.2, Vyrewatch 1.2, the Barrows brothers 1.6, Kalphite Guardian 1.2, Hero and Paladin 1.2, spiritual warrior and mage 1.2, TzHaar-Ket champion 1.2, Chaos Elemental and Revenant
   maledictus 1.2) and
   `Models.MonsterSize`.
3. Times part of Megabonk's own enlargement of elites, minibosses and bosses, capped by tier (below). Megabonk
   enlarges them a moment after they spawn, so this is applied again once the monster's hitbox is live.
4. Optionally, at least a share of its Megabonk hitbox's height (`Models.MinHitboxShare`). **Off by default**:
   Megabonk's hitboxes are tall capsules (5.4 m for a 3 m skeleton), and drawing monsters to fit them undoes the OSRS
   proportions.
5. Never taller than its tier's ceiling, measured against your adventurer.

| Tier | Megabonk enlargement passed on, at most | Tallest, as a multiple of your adventurer |
|---|---|---|
| Normal | 1.15 x | 1.1 x |
| Elite | 1.4 x | 1.35 x |
| Miniboss | 1.6 x | 1.7 x |
| Boss | 2.0 x | 2.2 x (`Models.BossMaxHeight`) |

Model heights in OSRS units, before step 2, as the main session measured them from the cache (the standing model with
the NPC definition's width and height scale): Warrior 216, Guard 201, Cow 153, Giant Mole 150, Goblin 129 (0.64 of a
guard), Giant rat 125, Giant frog 85, Chicken 79. How big they look next to each other in a run is
*(unconfirmed: needs a Melty run or footage)*.

A monster's **hitbox** is always Megabonk's; only the drawing changes, so a monster can be hit (and hit you) a little
outside its drawn shape.

## Animations

Each monster plays its own OSRS sequences (their ids are in the enemies sheet's `animation_ids`):

- **Standing** while it's still.
- **Walking** while it moves, the cycle sped up or slowed (0.5 to 2.5 times) to match how fast it really goes,
  against OSRS's one tile per 0.6 s at its size.
- **Attacking** when it gets within reach of your adventurer (max(1.2 m, 0.4 x its height) + 0.8 m), when a
  shooter (guards, banshees) starts its ranged or magic attack, and when its hit on you lands; merged with walking
  when it's still moving and the sequence allows it (as the OSRS client does). An attack plays out (up to 1.4 s)
  before the next can start.
- **Dying** where it fell: its body plays the death sequence for up to 1.8 s while Megabonk reuses the enemy.

A monster shown as a [stand-in](#stand-ins) or as the fallback Goblin plays that model's sequences. How the animations
look in a run is *(unconfirmed: needs a Melty run or footage)*.

## How monsters move

In Megabonk, enemies run straight at you. On Bonkscape's maps they find their way on the **OSRS tile grid**
instead, like OSRS monsters:

- Every half second, or whenever you step onto a new tile, Bonkscape works out how many steps every tile is from you,
  moving in 8 directions, never through a wall edge, water or big scenery. A diagonal step needs both side steps open,
  as in OSRS.
- Each monster heads for its neighbouring tile that is one step closer, so they go around buildings and over bridges.
- The search reaches 48 tiles from you in each direction (Morytania's grid is 384 x 450 tiles). Farther out, within
  3 steps of you, or off the grid, Megabonk's own chase takes over.

## The Giant Mole

<!-- gen:bosses -->
| Boss | Attacks | Phase thresholds | Pet (rate) | Status |
|---|---|---|---|---|
| **Giant Mole** | Claw (melee, 0 ms telegraph, contact); Dig (melee, 1200 ms telegraph, burrow teleport every 12s) | 50% HP | Baby Mole, 1/50 | <span class="st st-built">built</span> |
| **TzTok-Jad** | Magic (magic, 1800 ms telegraph, random); Ranged (ranged, 1800 ms telegraph, random); Bite (melee, 0 ms telegraph, random) | 50% HP | TzRek-Jad, 1/20 | <span class="st st-verified">verified</span> |
| **Kalphite Queen** | Jaws (melee, 0 ms telegraph, random); Spines (ranged, 600 ms telegraph, random); Lightning (magic, 900 ms telegraph, random) | 50% HP | Kalphite Princess, 1/50 | <span class="st st-built">built</span> |
| **King Black Dragon** | Bite (melee, 0 ms telegraph, random); Dragonfire (magic, 600 ms telegraph, random); Toxic breath (magic, 600 ms telegraph, random); Icy breath (magic, 600 ms telegraph, random); Shocking breath (magic, 600 ms telegraph, random) | 50% HP | Prince Black Dragon, 1/30 | <span class="st st-built">built</span> |
| **Sir Lancelot** | Slash (melee, 0 ms telegraph, random); Lunge (melee, 0 ms telegraph, random) | 50% HP | Dwarf remains, 1/0 | <span class="st st-built">built</span> |
| **General Graardor** | Smash (melee, 0 ms telegraph, random); Slam (ranged, 600 ms telegraph, random) | 50% HP | Pet General Graardor, 1/40 | <span class="st st-built">built</span> |
| **Kree'arra** | Wind (ranged, 600 ms telegraph, random); Tornado (magic, 600 ms telegraph, random); Claw (melee, 0 ms telegraph, random) | 50% HP | Pet Kree'arra, 1/40 | <span class="st st-built">built</span> |
| **K'ril Tsutsaroth** | Slash (melee, 0 ms telegraph, random); Prayer smash (melee, 0 ms telegraph, random); Fireball (magic, 600 ms telegraph, random) | 50% HP | Pet K'ril Tsutsaroth, 1/40 | <span class="st st-built">built</span> |
| **Commander Zilyana** | Sword (melee, 0 ms telegraph, random); Light (magic, 0 ms telegraph, random) | 50% HP | Pet Zilyana, 1/40 | <span class="st st-built">built</span> |
<!-- /gen:bosses -->

The Giant Mole is Lumbridge's stage boss <span class="st st-built">built</span>. You call it by using the boss portal
at the swamp's dark hole ([Maps](maps.md)). **The fight then moves into the Mole's lair** (0.2.10): the screen shows
*Loading - please wait.* for a moment, and you land in the Falador Mole Lair from your own OSRS cache, with the Mole
in the middle of it and the chat box saying *"You follow the Giant Mole down into its lair."* The cave is darker, with
black beyond its walls. Monsters still alive come with you, and chests and shrines move onto the lair's open ground.

The Mole attacks with Megabonk's own boss attacks; Protect from Melee halves them, its ground attacks too (a hit
that names no monster counts as the nearest boss's within 30 m). Bonkscape adds its **dig**:

1. **12 seconds** after it appears, and 12 seconds after each dig, the chat box says *"The Giant Mole burrows into
   the ground!"* and it plays its OSRS burrowing sequence (3314). Without the sequences in your cache, it sinks into
   the ground over 1.2 s instead.
2. Once it's under, it moves: **in its lair, to another spot 8 to 18 steps' walk from you** (never behind a wall you
   can't get round), as in OSRS. If the lair couldn't be built, the fight stays on the map and it surfaces next to you.
3. It comes back up with its OSRS surfacing sequence (3315), or rises over 1.2 s.

Below **50% HP** it digs more often, every 8 seconds. After the kill you stay in the lair. Where Megabonk's portal
to the next stage appears then is *(unconfirmed: needs a Melty run or footage)*: no test run has killed the Mole yet.
Dying in the lair restarts the run on Lumbridge with its own sky.

Its death can drop its pet, the Baby mole (1 in 50, [Boss pets](#boss-pets)). Planned for the Mole: its own drop (the
Mole claw) and OSRS stats; neither is built.

## Ardougne and Seers' Village

Ardougne & Seers' Village's monsters are its townsfolk and wildlife, all melee but the guards (ranged): monkeys,
goblins, snakes, giant bats, guards, grizzly bears and guard dogs from the start, warriors and Knights of Ardougne
from 1.5 minutes, ogres from 3. Its minibosses are **Heroes** and **Paladins** (size x 1.2), with Megabonk's miniboss
stats and attacks. Its boss is Sir Lancelot, after the other Knights of the Round Table.

## The Knights of the Round Table

Opening the boss portal at Camelot doesn't move the fight: the knights come to you on the map, in waves, while Sir
Lancelot (OSRS NPC 4354, on Megabonk's `Ent2`) waits where he rose, unseen, frozen and unhurt:

| Time | Knights |
|---|---|
| 0 s | Sir Bedivere and Sir Pelleas |
| 15 s | Sir Tristram and Sir Palomedes |
| 30 s | Sir Lucan, Sir Gawain and Sir Kay |
| 45 s, or once every knight is down | Sir Lancelot: *"Sir Lancelot appears!"* |

Each knight has his own row's HP (196 to 239, scaled like the map's monsters) and speed, and fights with the attacks of the Megabonk enemy he rides.
Sir Lancelot's attacks are OSRS's: every **2.4 seconds**, start to start, a Slash or a Lunge (melee, only when you're
beside him), each dealt as 13% to 20% of your maximum health (his max hit, 23, against Jad's 97). Megabonk's own
attacks for `Ent2` are off and touching him doesn't hurt. Protect from Melee halves his hits, as for any boss. His
HP is Megabonk's boss's.

## The God Wars Dungeon

The God Wars Dungeon's monsters are the four gods' armies: imps, goblins, hobgoblins, aviansies, bloodvelds, werewolves
and orks from the start, Knights of Saradomin and Saradomin priests from 1.5 minutes, spiritual rangers from 3. Its
minibosses are **spiritual warriors** and **spiritual mages** (size x 1.2), with Megabonk's miniboss stats and
attacks. Its boss is one of the four generals.

## The God Wars generals

Each run one general is picked at random to be the God Wars Dungeon's final boss: opening the final portal loads
Megabonk's final stage, and the fight moves into his room ([Maps](maps.md#the-generals-rooms)), where he comes at once
with his three bodyguards: *"You enter General Graardor's arena; the waves come first."* Each general rides
Megabonk's `Ent3`, with Megabonk's boss HP; his bodyguards fight with the attacks of the Megabonk enemies they ride.
Megabonk's own attacks for `Ent3` are off and touching a general doesn't hurt: his attacks are OSRS's, picked by
weight, start to start, and a melee one only when you're beside him (measured across the floor):

| General | Bodyguards | Every | Attacks (weight; hit as a share of your maximum health) |
|---|---|---|---|
| **General Graardor** (Bandos) | Sergeants Strongstack, Steelwill and Grimspike | 3.6 s | Smash, melee (2; 34% to 53%); Slam, ranged, lands 1.8 s after (1; 20% to 31%) |
| **Kree'arra** (Armadyl) | Flight Kilisa, Wingman Skree, Flockleader Geerin | 1.8 s | Wind, ranged, 1.8 s (2; 39% to 60%); Tornado, magic, 1.8 s (1; 12% to 18%); Claw, melee (0.5; 15% to 23%) |
| **K'ril Tsutsaroth** (Zamorak) | Tstanon Karlak, Zakl'n Gritch, Balfrug Kreeyath | 3.6 s | Slash, melee (8; 26% to 40%; a quarter of the time it poisons you for 5 s); Prayer smash, melee (4; 28% to 43%); Fireball, magic, 1.8 s (6; 17% to 26%) |
| **Commander Zilyana** (Saradomin) | Starlight, Growler, Bree | 1.2 s | Sword, melee (1; 15% to 24%); Light, magic, beside her only, 0.6 s (1; 11% to 18%) |

The hits are scaled by each attack's OSRS max hit against Jad's 97. The right protection prayer halves them, as for
any boss, and stops K'ril's poison, except his **Prayer smash**: it goes straight through your protection prayer and
drains your prayer points, half your maximum times the share of your health it took.

The general's death ends the run, and can drop his pet (1 in 40, [Boss pets](#boss-pets)). Melty's test of 0.11.0 showed General
Graardor in his room with his bodyguards, his melee reaching the adventurer; the other generals, the Prayer smash and
a general's death are *(unconfirmed: needs a Melty run or footage)*

## Al Kharid

Al Kharid's monsters are desert folk and beasts, all melee: scorpions, Shantay Guards, desert lizards, desert wolves,
hill giants and Al Kharid warriors from the start, Kalphite Workers from 1.5 minutes, ugthanki and bandits from 3,
Kalphite Soldiers from 6. Its minibosses are **Kalphite Guardians** (OSRS NPC 960, on Megabonk's `MinibossScorpion`
and `MinibossGolemSand`, size x 1.2), with Megabonk's miniboss stats and attacks. Its boss is the Kalphite Queen.

## The Kalphite Queen

Opening Al Kharid's boss portal moves the fight into [the Kalphite Lair](maps.md#the-kalphite-lair). The Queen (OSRS
NPC 963, on Megabonk's `Pharaoh1`) fights in two forms, as in OSRS: **crawling** first, then **airborne**.

**Her attacks are OSRS's.** Megabonk's own attacks are off and touching her doesn't hurt. Every **2.4 seconds**, start
to start, she uses one of three at random, with her form's OSRS animation and graphics:

| Attack | Style | Lands | |
|---|---|---|---|
| Jaws | melee | 0.3 s after she starts it | Only when you're beside her; it misses if you've stepped away |
| Spines | ranged | 1.8 s after | Her spines fly at you |
| Lightning | magic | 2.1 s after | Lightning strikes you |

Her OSRS max hit is 31 against Jad's 97, so a hit is dealt as 18% to 27% of your maximum health. The right protection
prayer halves it, as for any boss (only Jad's are blocked completely).

**Her second form.** When the crawling Queen dies, her death is called off: she's back at full health, the crawling
husk stays behind, and she rises airborne (OSRS NPC 965), still and unhurt while she rises; the chat says *"Kalphite
Queen rises again!"* Then she fights on with the same attacks in her airborne animations. Only her second death
counts: it ends the fight and the stage. *(unconfirmed: needs a Melty run or footage)*

Her second death can drop her pet, the Kalphite princess (1 in 50, [Boss pets](#boss-pets)).

## The Wilderness

The Wilderness's monsters are revenants, from imps to dragons, and green dragons, all melee. Its minibosses are the
**Chaos Elemental** (magic) and the **Revenant maledictus** (ranged), size x 1.2, with Megabonk's miniboss stats and
attacks. Its boss is the King Black Dragon.

**PKers.** Six player killers in classic gear hunt you there, never part of the waves: one ambushes you 60 to
90 seconds into the stage, then one every three to four minutes, from 8 to 14 tiles away, with *"Ice Tank is attacking
you!"* (its name). None comes while you're in a boss's lair.

| PKer | Combat | Weapon and special attack |
|---|---|---|
| Pure Spec | 70 | Magic shortbow (Snapshot) |
| Ice Tank | 98 | Ice Barrage (Deep Freeze) |
| Pipe Ranger | 104 | Toxic blowpipe (Toxic Siphon) |
| Whip Hybrid | 112 | Abyssal whip (Energy Drain) |
| Ags Main | 126 | Armadyl godsword (The Judgement) |
| Claw Swap | 126 | Dragon claws (Slice and Dice) |

Each is an OSRS player body in its gear, with HP and damage set by its combat level. Every 10 to 14 seconds, when
you're in its reach (4.5 m for melee, 18 m otherwise), it fires its weapon's special attack, with its OSRS animation
and graphic: a hit of 20% to 33% of your maximum health, which the protection prayer for its style cuts as for any
monster.

## The King Black Dragon

The Graveyard's final boss, in [his lair](maps.md#the-king-black-dragons-lair) below the boss door: OSRS NPC 239, on
Megabonk's `Ent1`. His HP is Megabonk's final boss's. Megabonk's own attacks are off and touching him doesn't hurt;
every **2.4 seconds**, start to start, he picks one of five OSRS attacks by weight:

| Attack | Style | Lands | Weight | Hit, as a share of your maximum health |
|---|---|---|---|---|
| Bite | melee | 0.3 s after he starts it; only beside him | 1.5 | 14% to 22% |
| Dragonfire | magic | 1.8 s after | 1.5 | 37% to 57% |
| Toxic breath | magic | 1.8 s after | 0.5 | 28% to 44%; half the time it poisons you for 5 s |
| Icy breath | magic | 1.8 s after | 0.5 | 28% to 44%; half the time it freezes you in place for 3 s |
| Shocking breath | magic | 1.8 s after | 0.5 | 28% to 44%; half the time it slows you for 3 s |

So beside him a third of his attacks are bites, and away from him half are dragonfire. The hits are scaled by his OSRS
max hits (25, 65 and 50) against Jad's 97. **Protect from Magic** halves his fire and breaths, as for any boss, and
stops the breaths' poison, freeze and shock. In OSRS an anti-dragon shield blocks dragonfire; there's none here.

His death ends the run, and can drop his pet, the Prince black dragon (1 in 30, [Boss pets](#boss-pets)). The breaths' effects and his death
are *(unconfirmed: needs a Melty run or footage)*

## The Barrows brothers

Morytania's boss is one of the six Barrows brothers, **hidden**: each time Morytania's stage starts, one is picked at
random, and he rises when you open the boss portal at the Barrows
([Maps](maps.md#morytania)), named on the boss bar. The other five are the map's **minibosses**, one after another at
Megabonk's miniboss events. All six take over Megabonk's `Pharaoh2` (as the boss) and its `MinibossGolemSand` and
`MinibossScorpion` (as minibosses), size x 1.6, each in his own armour with his own weapon and animations. As boss or
miniboss they keep Megabonk's attacks and stats.

| Brother | Style | Set effect, on his hits (and yours, when you play him) |
|---|---|---|
| **Dharok the Wretched** | melee | Every hit grows as the hitter's health drops, up to +98% at 1 hitpoint |
| **Ahrim the Blighted** | magic | 25% of magic hits: whoever was hit hits 10% weaker for 6 s |
| **Guthan the Infested** | melee | 25% of melee hits: the hitter heals by the damage dealt |
| **Karil the Tainted** | ranged | 25% of ranged hits: whoever was hit is slowed for 4 s (a monster to 80% speed) |
| **Torag the Corrupted** | melee | 25% of melee hits: whoever was hit is slowed for 2 s (a monster to 80% speed); OSRS drains run energy, which Megabonk doesn't have |
| **Verac the Defiled** | melee | 25% of melee hits: his hit on you ignores your protection prayer; your hit on a monster does 25% more |

A brother's set works on his projectiles and slams too: a hit on you that names no monster counts as the nearest
brother's within 10 m. Each effect but Dharok's plays its OSRS graphic.

**The Barrows chest.** Beating the hidden brother gives, besides Megabonk's own reward, one **Barrows piece** you don't
own yet, picked at random from all 24 (each brother's helm, body, legs and weapon): *"You find Dharok's helm in the
Barrows chest!"* Pieces are yours for good, shared by all your adventurers. A brother's four pieces together unlock him
as an [adventurer](adventurers.md#unlocking): *"You have Dharok's full set: he can join you as an adventurer."* With
all 24 owned, the chest gives nothing more.

Melty's test of 0.7.0 showed Torag the Corrupted as the hidden boss, named on the boss bar and swinging his hammers.
The set effects, the chest's pieces and a brother's unlock are *(unconfirmed: needs a Melty run or footage)*

## TzHaar City

TzHaar City's monsters are the TzHaar, on the Desert's enemy types from its third stage on: **TzHaar-Hur** and
**TzHaar-Mej** (magic) from the start, **TzHaar-Xil** from 1.5 minutes and **TzHaar-Ket** from 3. Its minibosses are
**TzHaar-Ket champions** (OSRS NPC 7679, on Megabonk's `MinibossScorpion` and `MinibossGolemSand`, size x 1.2): as
minibosses they keep Megabonk's stats and attacks, and a protection prayer halves their hits. Its boss is TzTok-Jad,
in the Fight Caves.

## TzTok-Jad

Opening TzHaar City's final portal moves the fight into the [Fight Caves](maps.md#the-fight-caves), as the Mole's
portal moves it into its lair. TzTok-Jad (OSRS NPC 3127, on Megabonk's `Pharaoh3`) is placed on his tile there but
held out of the fight, unseen, frozen and unhurt, while six waves of Fight Caves monsters come first, each 6 to 16
tiles from you on ground you can reach:

| Time in the caves | What comes |
|---|---|
| 0 s | 6 Tz-Kih |
| 20 s | 6 Tz-Kek |
| 40 s | 6 Tok-Xil (ranged) |
| 60 s | 6 Yt-MejKot |
| 80 s | 3 Ket-Zek (magic) |
| 100 s | 6 Ket-Zek |
| 120 s | TzTok-Jad: *"TzTok-Jad appears!"* |

The waves are timed: each comes whether or not the last is dead. Their monsters are OSRS models on Megabonk's enemy
types and fight with those types' attacks; their OSRS abilities (Tz-Kek splitting, Yt-MejKot healing, Tok-Xil's
spines, Ket-Zek's fire) aren't built.

**His attacks are OSRS's, not Megabonk's.** Megabonk's own attacks for `Pharaoh3` are switched off, and touching him
doesn't hurt. Two seconds after he appears, and then every 4.8 seconds (start to start, as in OSRS), he starts one of
three attacks at random, with its OSRS animation and graphics:

| Attack | Style | Lands | |
|---|---|---|---|
| Magic | magic | 3.1 s after he starts it | A fireball flies from him to you |
| Ranged | ranged | 3.1 s after he starts it | A boulder falls on you |
| Bite | melee | 0.3 s after he starts it | Only when you're beside him; it misses if you've stepped away |

A hit is dealt as 55% to 85% of your maximum health, through Megabonk's own damage (armour still counts). The protection prayer for its style, on when the hit **lands**, blocks
it completely ([Prayer](prayer.md#what-it-blocks)): watch his wind-up and switch, as in OSRS.

**Healers.** The first time he drops below half health, the chat box says *"TzTok-Jad calls for help!"* and four
**Yt-HurKot** appear around him. They walk to him and, once beside him, heal him 2% of his maximum health every 1.2
seconds. Hit one and it leaves him for good and comes after you.

**The Fire cape.** Killing him unlocks the [Fire cape](gear-passives.md#the-fire-cape) for the adventurer you're
playing: *"You have been awarded a Fire cape!"* His death can also drop his pet,
TzRek-Jad (1 in 20, [Boss pets](#boss-pets)).

As a boss his HP is Megabonk's (its `Pharaoh3`'s), times TzHaar City's difficulty of 1. Melty's test of 0.5.0 showed
the Fight Caves, the waves and Jad joining the fight; his attacks against a prayer, the healers, his death and the
Fire cape are *(unconfirmed: needs a Melty run or footage)*.

## Loot

Monsters drop Megabonk's normal pickups, dressed as OSRS items, plus Bonkscape's own prayer potions:

| Drop | What it is | What it does |
|---|---|---|
| **Coins** (in TzHaar City, **Tokkul**) | Megabonk's gold, drawn as the map's OSRS currency stack for the amount (coins: 1 coin up to the big pile) | Megabonk's gold |
| **Shrimps** (60%), **Lobster** (30%), **Shark** (10%) | Megabonk's health pickup, as a random OSRS food | Heals 15, 30 or 60 HP in place of Megabonk's amount: *"You eat the shrimps. It heals some health."* |
| **Prayer potion(4)** | Bonkscape's own pickup, 2.5% chance per kill | Restores prayer points ([Prayer](prayer.md#prayer-potions)) |
| **Casket** | Megabonk's chest | Megabonk's chest reward, and [evolutions](weapons-and-evolutions.md#evolutions) |
| **Clue scroll (easy)** | Bonkscape's own pickup, 0.2% chance per kill (1 in 500) | Starts a clue trail ([Clue scrolls](#clue-scrolls)) |

The sheet also plans the Giant Mole's own drop, the Mole claw; it isn't built.

## Boss pets

A boss with an OSRS pet can drop it when its last form dies (the Kalphite Queen's second):

| Boss | Pet | Chance |
|---|---|---|
| Giant Mole | Baby mole | 1 in 50 |
| TzTok-Jad | TzRek-Jad | 1 in 20 |
| Kalphite Queen | Kalphite princess | 1 in 50 |
| King Black Dragon | Prince black dragon | 1 in 30 |
| Each God Wars general | his own pet | 1 in 40 |

Sir Lancelot and the Barrows brothers have none. A drop says *"You have a funny feeling like you're being followed."*,
or *"You have a funny feeling like you would have been followed..."* for a pet you already own.

A pet is yours for good, for every adventurer (kept in `unlocks.json`). One is out at a time: your first pet comes out
at once, and the pet line on character select (*"Pet: ..."*, *"Click to change"*) goes through the ones you own, then
none. The pet out follows you through each run as its OSRS NPC, walking and standing with its own animations, and
gives every adventurer +1% luck (Megabonk's Luck). *(unconfirmed: needs a Melty run or footage)*

## Clue scrolls

Any kill can drop an **easy clue scroll**, a 0.2% chance (1 in 500), while you have no clue going. It spins on the
ground and slides to you once you're within about 9 m: *"You find a clue scroll!"* and *"You read the clue scroll: 3
steps on Lumbridge & Swamp."*

The trail is 2 or 3 of the map's own clue steps, nearest first, each a dig, a search or a talk:

- The step's hint shows in the chat box, as a dialogue (*"Clue scroll (easy): step 1 of 2"*) for a few seconds, and
  stays under the minimap. OSRS's yellow hint arrow stands over the spot, and a minimap arrow marks it (on the
  minimap's edge when it's further away). For a talk step, the NPC stands at the spot, facing you.
- Stand there for 0.8 s (within 1.5 tiles to dig, 1.8 to search, 2.5 to talk): *"You dig and find another clue (2 of
  3)."*
- The last step pays a **reward casket**: 100 to 200 coins (*"You dig and find a reward casket: 150 coins!"*) and one
  of Megabonk's free chests.

One clue at a time. It waits while you're in a boss's lair, and moving on to another stage loses it.

## Planned monsters

## Planned monsters

The Vyrewatch Sentinel is in the roster above as a planned row (phase 2). It doesn't spawn.

<!-- sources: src/Bonkscape.Plugin/Systems/EnemySkins.cs src/Bonkscape.Plugin/Systems/Animator.cs src/Bonkscape.Plugin/Systems/Bosses.cs src/Bonkscape.Plugin/Systems/Pathing.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Loot.cs src/Bonkscape.Plugin/Systems/Combat.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Core/Osrs.cs src/Bonkscape.Plugin/Core/Rows.cs sheets/enemies.json sheets/bosses.json sheets/waves.json sheets/drops.json src/Bonkscape.Plugin/Systems/BossFight.cs src/Bonkscape.Plugin/Systems/Bonk.cs src/Bonkscape.Plugin/Systems/Unlocks.cs sheets/maps.json src/Bonkscape.Plugin/Systems/Barrows.cs src/Bonkscape.Plugin/Systems/SetEffects.cs src/Bonkscape.Plugin/Systems/SecondForm.cs src/Bonkscape.Plugin/Systems/Pkers.cs src/Bonkscape.Plugin/Systems/Graveyard.cs src/Bonkscape.Plugin/Systems/Pets.cs src/Bonkscape.Plugin/Systems/Clues.cs sheets/clue_steps.json -->
