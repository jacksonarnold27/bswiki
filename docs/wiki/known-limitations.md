# Known limitations

What isn't there yet, or behaves differently from what you'd expect. The [docket](../dev/docket.md) tracks the work.

## Not built yet

- **Music.** Release builds play Megabonk's music: the experimental OSRS music player needs its engine
  (`OsrsKit.Music.dll`), which isn't shipped yet. OSRS's jingles (level-up, death) aren't built.
- **Prayer altars.** The chat tells you to recharge at an altar, but there's none; prayer potions are the only refill.
- **More adventurers, weapons, gear, monsters and maps.** Pure, the Dwarf multicannon,
  the Barrows crypts and God Wars Dungeon are designed (phase 2 and 3) but not in the game.
- **The Infernal cape.** The Fire cape's evolution is in the evolutions sheet, but it can't happen yet.
- **The Fight Caves monsters' own abilities.** Tz-Kek don't split, Yt-MejKot don't heal, and Tok-Xil and Ket-Zek
  attack as the Megabonk enemies under them.
- **Pets, clue scrolls, the Mole's own drops** (Mole claw, Baby mole). Planned.

## Works, with caveats

- **Your cache decides what you see.** The OSRS client downloads models on demand. Monsters missing from your cache use
  stand-ins; if a map's regions are missing, you get Megabonk's own map (the Forest, the Desert or the Graveyard) instead.
- **Megabonk's other maps change a little too.** Bonkscape edits Megabonk's data when the game loads, so its reskinned
  weapons, tomes and characters keep their OSRS names, icons and stats on every map, and the Megabonk enemies it remaps
  keep the OSRS rows' HP, damage and speed.
- **The Forest's third stage is Lumbridge again.** It's named *Lumbridge Swamp Caves* but builds the same Lumbridge;
  every other stage has its own map.
- **Minibosses and bosses use Megabonk's stats** (times their map's difficulty) and, all but TzTok-Jad, the Kalphite
  Queen, the King Black Dragon and Sir Lancelot, Megabonk's own attacks; only ordinary monsters take the sheet's HP, damage and speed.
- **An adventurer's attack style decides its melee skill**: the Warrior, Zerker and Dharok train Strength, the Void
  Knight, Durial321, Guthan and Verac Attack, and only the Ironman and Torag Defence.
- **The Barrows brothers fight as Megabonk's boss and minibosses**, with their attacks; only the set effects are
  OSRS's. Torag's set slows instead of draining run energy, which Megabonk doesn't have.
- **Deep Freeze's ice block draws solid.** The ice it leaves on its target shows as an opaque tan box, not OSRS's
  see-through ice (seen in Melty test footage).
- **Starting weapon upgrades** are set when Megabonk loads; a level reached mid-session may only take effect after a
  restart (not yet tested).
- **Projectiles go through the maps' walls**, yours and the monsters', because walls are only solid to bodies.
- **Textured surfaces use one colour**, the average of their OSRS texture.
- **Spell casts don't stop you.** In OSRS you stand still to cast; here the cast plays on the upper body while your
  legs keep moving.
- **Hitboxes are Megabonk's.** Megabonk's enemy hitboxes are tall capsules, often taller than the OSRS model drawn
  for them, so a hit can land a little outside a monster's shape.
- **The King Black Dragon's breaths** freeze for 3 s (6 s in OSRS), and his shocking breath slows you instead of
  draining your combat stats. Protect from Magic stands in for an anti-dragon shield against his fire.
- **Megabonk's minibosses and portals** come from the Forest's, the Desert's and the Graveyard's own timelines and placement rules
  (the Desert's last stage has Megabonk's final portal); Bonkscape only picks which OSRS monsters they are and moves
  the portal.

## Melty test runs

These only show up in Melty's automated test runs (autoplay):

- Autoplay checks two tiles ahead on the map's grid and turns along walls; whether that stops it pressing into
  walls is *(unconfirmed: needs footage)*.
- Autoplay plays the adventurers this PC has unlocked in turn, and the maps in turn (Lumbridge, Ardougne & Seers'
  Village, Al Kharid, Morytania, TzHaar City, the Wilderness). A run on a later stage (Ardougne & Seers' Village, Morytania, TzHaar City) starts on its Megabonk map's first stage
  and moves to its own a second in;
  since its adventurer arrives without the levels the earlier stages bring, monsters there get their HP and hits
  without Megabonk's stage scaling.
- Autoplay always takes the first level-up offer, so most weapons aren't exercised. It opens chests, and a test
  shortcut readies the first evolution.
- 1:15 into a test run (test runs last 2 minutes), the adventurer is moved to the boss portal and opens it, so each
  test meets a stage boss (on the Wilderness it opens the boss door, never while a window has the game paused). The
  first PKer comes 40 s in. On TzHaar City it opens the final portal 40 s in, and the Fight Caves run at a quarter of
  their times (a wave every 5 s, Jad at 30 s), so the waves and Jad fit in. Autoplay switches prayer when Jad starts
  an attack, as a player reading his wind-up would.
- A hit that would kill the adventurer in a test run leaves 1 hitpoint instead (then heals to half), so a test run
  doesn't die; every other hit lands in full.

<!-- sources: src/Bonkscape.Plugin/ sheets/ -->
