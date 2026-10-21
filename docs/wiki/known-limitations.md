# Known limitations

What isn't there yet, or behaves differently from what you'd expect. The [docket](../dev/docket.md) tracks the work.

## Not built yet

- **Animations.** Your adventurer and every monster stand in their OSRS standing pose: no walking, attacking or dying
  animations. They're the next milestone, 0.2.0.
- **Music.** Megabonk's music plays. OSRS music and jingles (Lumbridge's *Harmony*, level-up, death) need an OSRS music
  synthesiser.
- **Special attacks.** Named in the weapons sheet, not built.
- **OSRS projectiles and weapon sounds.** Weapons look and sound like their Megabonk base. Hitting and killing
  monsters plays Megabonk's sounds, not OSRS's.
- **Prayer altars.** The chat tells you to recharge at an altar, but there's none; prayer potions are the only refill.
- **More adventurers, weapons, gear, monsters and maps.** Pure, Ironman, the Dwarf multicannon, Dharok's greataxe, the
  Scythe of vitur, the Armadyl godsword, Dragon claws, the Fire cape, Godsword shards, Barrows, the Wilderness, God
  Wars Dungeon and the Fight Caves are designed (phase 2 and 3) but not in the game.
- **Pets, clue scrolls, the Mole's own drops** (Mole claw, Baby mole). Planned.

## Works, with caveats

- **Your cache decides what you see.** The OSRS client downloads models on demand. Monsters missing from your cache use
  stand-ins; if Lumbridge's map regions are missing, you get the Forest instead.
- **Megabonk's other maps change a little too.** Bonkscape edits Megabonk's data when the game loads, so its reskinned
  weapons, tomes and characters keep their OSRS names, icons and stats on every map, and the Megabonk enemies it remaps
  keep the OSRS rows' HP, damage and speed.
- **Every Forest stage is the same Lumbridge.** The later stages are renamed *Lumbridge Swamp* and *Lumbridge Swamp
  Caves* but build the same arena.
- **Minibosses and the Giant Mole use Megabonk's stats** and Megabonk's own attacks; only ordinary monsters take the
  sheet's HP, damage and speed.
- **Defence can't be trained**: no phase-1 adventurer fights defensively. The Warrior trains Strength, not Attack.
- **Starting weapon upgrades** are set when Megabonk loads; a level reached mid-session may only take effect after a
  restart (not yet tested).
- **Projectiles go through Lumbridge's walls**, yours and the monsters', because walls are only solid to bodies.
- **Colours look paler than in OSRS** under Megabonk's lighting, and textured surfaces use one average colour.
- **Hitboxes are Megabonk's.** Megabonk's enemy hitboxes are tall capsules, often taller than the OSRS model drawn
  for them, so a hit can land a little outside a monster's shape.
- **Megabonk's minibosses and boss portal** come from the Forest's own timeline and placement rules; Bonkscape only
  moves them.
- **Trees and rocks that are skilling spots** aren't marked.
- **The OSRS HUD hasn't been confirmed in a run yet** (orbs, XP counter, health bars, prayer panel, level-up dialogue
  and fireworks, minimap frame and compass). Unconfirmed until a Melty run's footage shows them: whether Megabonk's minimap gets measured (the frame and compass are drawn only then), which way the compass
  turns, and how the layout sits next to what's left of Megabonk's HUD at each resolution.

## Melty test runs

These only show up in Melty's automated test runs (autoplay):

- The autoplay route often presses the adventurer and camera against walls in recordings.
- Autoplay always plays the Warrior and always takes the first level-up offer, so the other adventurers and most
  weapons aren't exercised by tests yet. (Since 0.1.16 it does open chests.)

<!-- sources: src/Bonkscape.Plugin/ sheets/ -->
