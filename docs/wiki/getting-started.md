# Getting started

## What you need

- **Megabonk** on Steam.
- **Old School RuneScape**, logged in at least once on this PC with RuneLite or the official client, so its game
  files (the *cache*) exist. Bonkscape reads models, map data, icons, fonts and sounds from that cache and never writes
  to it.
- **Melty**, which installs the mod and its loader (BepInEx 6 for IL2CPP games) by itself.

> **Your cache fills up as you play OSRS.** The OSRS client downloads most game files the first time it needs them.
> If you've only logged in once, some monsters or items may be missing from your cache. Bonkscape then uses an OSRS
> stand-in that *is* in your cache (another chicken for a chicken, for example; see
> [Monsters](monsters-and-bosses.md#stand-ins)). If a map's regions are missing, you get Megabonk's own map (the
> Forest or the Desert) with OSRS scenery instead ([Maps](maps.md#when-a-map-isnt-built)).

## Installing

Bonkscape is installed through Melty. It isn't public yet, so for now that means a test build from the creator.

Melty puts BepInEx in Megabonk's folder and the mod in `BepInEx/plugins/Bonkscape/`. That folder holds:

| File | What it is |
|---|---|
| `Bonkscape.dll` | The mod |
| `Bonkscape.Cache.dll` | The OSRS cache reader |
| `README.md`, `LICENSE`, `LICENSES/RuneLite-cache-BSD-2-Clause.txt` | Readme and licences |

No OSRS or Megabonk files are in the download.

## Where Bonkscape looks for your OSRS files

It checks these folders in order and uses the first that holds a cache:

1. The `OSRS.CacheFolder` setting ([Settings](settings.md)). When that's empty, the `OSRS_CACHE` line in
   `%LOCALAPPDATA%\Bonkscape\settings.properties`, if there is one.
2. The OSRS folder Melty passes in (the `OSRS_DIR` line in that same file), then `jagexcache\oldschool\LIVE` inside it.
3. RuneLite's cache: `%USERPROFILE%\.runelite\jagexcache\oldschool\LIVE`.
4. The official client's cache: `%USERPROFILE%\jagexcache\oldschool\LIVE`.
5. `%ProgramData%\Jagex\oldschool`.

Every file is opened read-only and shared, so OSRS can stay open while you play.

If none has a cache, the screen says *"Bonkscape can't find Old School RuneScape's game files. Run OSRS once, then
start Megabonk again."* and the mod stays out of the way.

## First launch

1. Start Megabonk the way Melty tells you to. The first start after installing takes longer, because BepInEx
   prepares itself.
2. While the main menu loads, Bonkscape decodes what it needs from your cache in the background: monsters, the
   adventurers, items and icons, sprites, fonts, sounds, then the Lumbridge, Morytania and TzHaar City
   arenas and the bosses' lairs (the Mole's and the Fight Caves). Menus work meanwhile; the log line
   `OSRS assets ready in ... ms` says how long it took.
3. On character select, the selected adventurer's OSRS model stands where Megabonk's character would, and a
   **Bonkscape** panel above it shows your combat level, your skill levels and the weapon that adventurer will start
   with ([HUD](hud-and-chat.md#character-select-panel)).
4. Pick an adventurer: **Warrior** (it takes Megabonk's `SirOofie` slot), **Ranger** (`Robinette`), **Mage** (`Fox`),
   **Zerker** (`Calcium`), **Void Knight** (`Athena`) or **Durial321** (`Vlad`); the **Ironman** (`SirChadwell`) and the six
   Barrows brothers are earned ([Adventurers](adventurers.md#unlocking)). Then start a
   run on Megabonk's Forest map, which Bonkscape renames **Lumbridge & Swamp**, or its Desert map, which becomes
   **Morytania**, and TzHaar City on its third stage ([Maps](maps.md#morytania)). Bonkscape weapons and gear count as unlocked
   whatever your Megabonk progress is.
5. Behind OSRS's *Loading - please wait.* screen you're moved into the castle courtyard (in Morytania, Canifis). A chat line greets
   you: *"Welcome to Lumbridge. Press 1, 2 or 3 to pray against melee, missiles or magic."*

Only the Forest and the Desert become OSRS maps. Megabonk's other maps aren't fully plain Megabonk, though: Bonkscape edits
Megabonk's data once when the game loads, so the weapons, tomes and characters it reskins keep their OSRS names,
icons and stats on every map, and the Megabonk enemies it remaps keep the OSRS rows' HP, damage and speed. On those
maps, monsters keep Megabonk's models and level-ups offer Megabonk's full pool
([Known limitations](known-limitations.md)).

## Leaderboards

Runs with Bonkscape loaded never upload scores to Megabonk's Steam leaderboards.

## Where your progress lives

- Skills: `%LOCALAPPDATA%\Bonkscape\skills_<adventurer>.json`, one per adventurer ([Skills and XP](skills-and-xp.md#saving)).
- Settings: `BepInEx/config/gg.melty.bonkscape.cfg` in Megabonk's folder ([Settings](settings.md)).
- Log: `BepInEx/LogOutput.log`. Bonkscape's lines start with `[Info   : Bonkscape]`, and every chat message is
  logged too, as `[chat] ...`.

<!-- sources: src/Bonkscape.Cache/OsrsCache.cs src/Bonkscape.Plugin/Plugin.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Patches/CorePatches.cs tools/package.py src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Systems/Unlocks.cs -->
