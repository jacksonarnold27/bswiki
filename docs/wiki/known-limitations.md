# Known limitations

What isn't there yet, or behaves differently from what you'd expect. The [docket](../dev/docket.md) tracks the work.

## Not built yet

- **Music.** Release builds play Megabonk's music: the experimental OSRS music player needs its engine
  (`OsrsKit.Music.dll`), which isn't shipped yet. OSRS's jingles (level-up, death) aren't built.
- **Prayer altars.** The chat tells you to recharge at an altar, but there's none; prayer potions are the only refill.
- **More adventurers, weapons, gear, monsters and maps.** Pure, Ironman, the Dwarf multicannon, Dharok's greataxe, the
  Fire cape, Barrows, the Wilderness, God Wars Dungeon and the Fight Caves are designed (phase 2 and 3) but not in the game.
- **Pets, clue scrolls, the Mole's own drops** (Mole claw, Baby mole). Planned.

## Works, with caveats

- **Your cache decides what you see.** The OSRS client downloads models on demand. Monsters missing from your cache use
  stand-ins; if a map's regions are missing, you get Megabonk's own map (the Forest or the Desert) instead.
- **Megabonk's other maps change a little too.** Bonkscape edits Megabonk's data when the game loads, so its reskinned
  weapons, tomes and characters keep their OSRS names, icons and stats on every map, and the Megabonk enemies it remaps
  keep the OSRS rows' HP, damage and speed.
- **Every stage is the same arena.** The Forest's later stages are renamed *Lumbridge Swamp* and *Lumbridge Swamp
  Caves* but build the same Lumbridge; every Desert stage is *Morytania*.
- **Minibosses and the stage bosses (the Giant Mole, Dharok) use Megabonk's stats** (times their map's difficulty) and Megabonk's own attacks; only ordinary monsters take the
  sheet's HP, damage and speed.
- **Defence can't be trained**: no phase-1 adventurer fights defensively. The Warrior trains Strength, not Attack.
- **Starting weapon upgrades** are set when Megabonk loads; a level reached mid-session may only take effect after a
  restart (not yet tested).
- **Projectiles go through the maps' walls**, yours and the monsters', because walls are only solid to bodies.
- **Textured surfaces use one colour**, the average of their OSRS texture.
- **Spell casts don't stop you.** In OSRS you stand still to cast; here the cast plays on the upper body while your
  legs keep moving.
- **Hitboxes are Megabonk's.** Megabonk's enemy hitboxes are tall capsules, often taller than the OSRS model drawn
  for them, so a hit can land a little outside a monster's shape.
- **Megabonk's minibosses and boss portal** come from the Forest's and the Desert's own timelines and placement
  rules; Bonkscape only picks which OSRS monsters they are and moves the portal.

## Melty test runs

These only show up in Melty's automated test runs (autoplay):

- Autoplay checks two tiles ahead on the map's grid and turns along walls; whether that stops it pressing into
  walls is *(unconfirmed: needs footage)*.
- Autoplay plays the Warrior, Ranger and Mage in turn, and Lumbridge and Morytania in turn, so a two-run test plays
  both maps. It always takes the first level-up offer, so most weapons aren't exercised. It opens chests, and a test
  shortcut readies the first evolution.
- 1:15 into a test run (test runs last 2 minutes), the adventurer is moved to the boss portal and opens it, so each
  test meets a stage boss.
- A hit that would kill the adventurer in a test run leaves 1 hitpoint instead (then heals to half), so a test run
  doesn't die; every other hit lands in full.

<!-- sources: src/Bonkscape.Plugin/ sheets/ -->
