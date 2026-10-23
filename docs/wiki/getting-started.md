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
> Forest, the Desert or the Graveyard) with OSRS scenery instead ([Maps](maps.md#when-a-map-isnt-built)).

## Installing

Bonkscape is installed through Melty. It isn't public yet, so for now that means a test build from the creator.

Melty puts BepInEx in Megabonk's folder and the mod in `BepInEx/plugins/Bonkscape/`. That folder holds:

| File | What it is |
|---|---|
| `Bonkscape.dll` | The mod |
| `OsrsKit.Cache.dll` | The OSRS cache reader (from osrs-kit, Bonkscape's shared RuneScape library) |
| `README.md`, `LICENSE`, `LICENSES/RuneLite-cache-BSD-2-Clause.txt` | Readme and licences |

No OSRS or Megabonk files are in the download. A `Bonkscape.Cache.dll` left there by an older version is no longer
used and can be deleted.

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
   adventurers, items and icons, sprites, fonts, sounds, then the arenas of every map and the bosses' lairs. Menus work meanwhile; the log line
   `OSRS assets ready in ... ms` says how long it took.
3. Megabonk's main menu shows as OSRS's login screen, its buttons running Megabonk's menu
   ([HUD](hud-and-chat.md#title-screen)); press **Play**.
4. On character select, the selected adventurer's OSRS model stands where Megabonk's character would, and a
   panel above it shows that adventurer's name, combat level, skill levels and starting weapon
   ([HUD](hud-and-chat.md#character-select-panel)).
5. Pick an adventurer: **Warrior** (it takes Megabonk's `SirOofie` slot), **Ranger** (`Robinette`), **Mage** (`Fox`),
   **Zerker** (`Calcium`), **Void Knight** (`Athena`) or **Durial321** (`Vlad`); the **Ironman** (`SirChadwell`), the **Pure** (`Ninja`) and the six
   Barrows brothers are earned ([Adventurers](adventurers.md#unlocking)). Then start a
   run on Megabonk's Forest map, which Bonkscape renames **Lumbridge & Swamp** (its later stages are Ardougne & Seers' Village and the God Wars Dungeon), or its Desert map, which becomes
   **Al Kharid**, then Morytania and TzHaar City on its later stages ([Maps](maps.md#al-kharid)), or its Graveyard map, which
   becomes **the Wilderness** ([Maps](maps.md#the-wilderness)). Bonkscape weapons and gear count as unlocked
   whatever your Megabonk progress is.
6. Behind OSRS's *Loading - please wait.* screen you're moved into the castle courtyard (on the Desert, Al Kharid). A chat line greets
   you: *"Welcome to Lumbridge. Press 1, 2 or 3 to pray against melee, missiles or magic."* (on another map, its
   own name).

Only the Forest, the Desert and the Graveyard become OSRS maps. Megabonk's other maps aren't fully plain Megabonk, though: Bonkscape edits
Megabonk's data once when the game loads, so the weapons, tomes and characters it reskins keep their OSRS names,
icons and stats on every map, and the Megabonk enemies it remaps keep the OSRS rows' HP, damage and speed. On those
maps, monsters keep Megabonk's models and level-ups offer Megabonk's full pool
([Known limitations](known-limitations.md)).

## Playing on a controller

Megabonk's own controls work on a gamepad as before. Bonkscape's actions also answer to a controller button, beside
their keys, on buttons Megabonk leaves free in a run:

| Action | Key | Controller | Setting |
|---|---|---|---|
| Protect from Melee, Missiles, Magic | 1, 2, 3 | d-pad left, up, right | `Controller.Prayers` |
| Prayer book or inventory | F5 | d-pad down | `Controller.PrayerTab` |
| Special attack | F | Y | `Controller.SpecFire` |
| Arm the next weapon's special attack | Q | left stick click | `Controller.SpecSwitch` |
| Camera near or far | V | right stick click | `Controller.CameraToggle` |
| Next attack style | F1 | Back | `Controller.AttackStyle` |

They're buttons of Rewired's standard gamepad layout (Megabonk reads its input through Rewired), so they mean the same
on any controller Rewired sees as a gamepad. They do nothing while a Megabonk window has the game paused. Change them
in [Settings](settings.md); `None` turns one off. Test runs press them through Bonkscape's test tools, not on a real
controller: whether a real pad's presses reach Bonkscape is *(unconfirmed: needs a run with a controller)*.

## Leaderboards

Runs with Bonkscape loaded never upload scores to Megabonk's Steam leaderboards.

## Where your progress lives

- Skills: `%LOCALAPPDATA%\Bonkscape\skills_<adventurer>.json`, one per adventurer ([Skills and XP](skills-and-xp.md#saving)).
- Unlocks (the Fire cape, Barrows pieces, pets and the pet out) and each adventurer's attack style:
  `%LOCALAPPDATA%\Bonkscape\unlocks.json`.
- Settings: `BepInEx/config/gg.melty.bonkscape.cfg` in Megabonk's folder ([Settings](settings.md)).
- Log: `BepInEx/LogOutput.log`. Bonkscape's lines start with `[Info   : Bonkscape]`, and every chat message is
  logged too, as `[chat] ...`.

<!-- sources: src/Bonkscape.Plugin/Plugin.cs src/Bonkscape.Plugin/Systems/Content.cs src/Bonkscape.Plugin/Systems/Hud.cs src/Bonkscape.Plugin/Patches/CorePatches.cs tools/package.py src/Bonkscape.Plugin/Systems/CharacterSelect.cs src/Bonkscape.Plugin/Systems/Unlocks.cs src/Bonkscape.Plugin/Systems/TitleScreen.cs src/Bonkscape.Plugin/Systems/Controls.cs -->
