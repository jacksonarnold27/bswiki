# Settings

Bonkscape's settings are in **`BepInEx/config/gg.melty.bonkscape.cfg`** in Megabonk's folder. BepInEx writes the file,
with every key at its default, the first time Megabonk starts with Bonkscape. Edit it with Megabonk closed: settings
are read once, when the game starts. For the `Models`, `Camera`, `Minimap` and `Map` number keys, a value outside the range is clamped to the
nearest end.

| Section | Key | Default | Range | What it does |
|---|---|---|---|---|
| `OSRS` | `CacheFolder` | *(empty)* | a folder | The folder holding OSRS's `main_file_cache.dat2` and `.idx` files. Empty: Bonkscape finds it ([Getting started](getting-started.md#where-bonkscape-looks-for-your-osrs-files)). |
| `OSRS` | `UseStandIns` | `true` | true / false | When a monster's own model isn't in your cache, use the next stand-in NPC that is ([Monsters](monsters-and-bosses.md#stand-ins)). Off: such monsters borrow the Goblin's model, or keep Megabonk's. |
| `Models` | `AdventurerScale` | `1.6` | 0.5 to 3 | Your adventurer's height as a share of Megabonk's character (1 = the same height). Lumbridge scales with it. |
| `Models` | `MonsterSize` | `1.0` | 0.3 to 3 | OSRS monsters' size relative to your adventurer's scale. 1 = OSRS proportions: OSRS humans (guards) about as tall as your adventurer, goblins, rats and chickens smaller. An old `MonsterScale` line is ignored. |
| `Models` | `MinHitboxShare` | `0` | 0 to 2 | Draw monsters at least this share of their Megabonk hitbox's height, up to their size ceiling. 0 = off: Megabonk's hitboxes are tall capsules (5.4 m for a 3 m skeleton), so a floor undoes OSRS proportions. Replaced `HitboxFill` (0.85, then 0.6) in 0.1.15; an old `HitboxFill` line is ignored. |
| `Models` | `BossMaxHeight` | `2.2` | 1 to 6 | The tallest a boss may be drawn, as a multiple of your adventurer's height. New in 0.1.13. |
| `Camera` | `Distance` | `0.8` | 0.4 to 1.5 | Megabonk's follow camera distance (1 = Megabonk's own; lower = closer). Scales both the camera's offset (about 11 m) and the extra zoom-out it adds as hordes grow (up to about 15 m). New in 0.1.13. |
| `Camera` | `FarDistance` | `1.6` | 0.4 to 3 | The far camera distance that `ToggleKey` switches to, on the same scale as `Distance`. |
| `Special` | `FireKey` | `F` | a Unity key name | Fires the armed weapon's special attack at the nearest monster in reach, if the special attack bar has enough energy (each spec's cost is its OSRS one; Bonkscape's invented magic specs cost 50%). Nothing in reach or too little energy spends nothing. New in 0.4. |
| `Special` | `SwitchKey` | `Q` | a Unity key name | Arms the next weapon you hold that has a special attack; the chat names it. New in 0.4. |
| `Camera` | `NearPitch` | `45` | 5 to 85 | Degrees the near camera looks down. Every run starts (and restarts, and enters or leaves a boss's lair) facing north at this pitch, as OSRS's camera does at the Lumbridge respawn; turn it freely after. Megabonk's own pitch is 20. New in 0.4. |
| `Camera` | `FarPitch` | `65` | 5 to 85 | Degrees the far camera looks down when `ToggleKey` picks it: OSRS's highest camera is about 67, almost straight down. New in 0.4. |
| `Camera` | `ToggleKey` | `V` | a Unity key name | Switches the camera between `Distance` (near) and `FarDistance` (far) during a run; the chat says *Camera: far.* or *Camera: near.* A name Unity doesn't know keeps `V`. |
| `Minimap` | `Zoom` | `2.5` | 1 to 6 | Zooms Megabonk's minimap in on Lumbridge (1 = Megabonk's own scale; OSRS's minimap is about 3x closer). New in 0.1.15. |
| `Map` | `RealLumbridge` | `true` | true / false | Build the real OSRS maps from your cache as the arenas: Lumbridge on the Forest and, since 0.2.1, Morytania on the Desert. Off: Megabonk's stages with OSRS scenery ([Maps](maps.md#when-a-map-isnt-built)). The key keeps its old name so existing settings files still work. |
| `Map` | `LargeMapMinFaces` | `300` | 0 to 5000 | On large maps (over 40,000 tiles, such as Morytania): leave out ground decorations (flowers, grass tufts, small stones) and small scenery that blocks nothing and has fewer faces than this. 0 keeps every object, which nearly doubles what Morytania has to build and draw. New in 0.2.1. |
| `Map` | `DrawDistance` | `200` | 0 to 5000 | OSRS scenery and walls farther than this many metres from your adventurer aren't drawn; the ground always is. 0 draws everything. New in 0.2.1. |
| `Audio` | `OsrsVolume` | `0.55` | 0 to 1 | Volume of OSRS sound effects (0 = silent). Not clamped, so keep it in range. |
| `Audio` | `OsrsMusic` | `true` | true or false | EXPERIMENTAL: play each map's OSRS track from your cache (Lumbridge: Harmony) instead of Megabonk's music. Needs `OsrsKit.Music.dll`, which release builds don't include, so in a release it does nothing. |
| `Audio` | `OsrsMusicVolume` | `1` | 0 to 2 | OSRS music volume relative to Megabonk's own music volume setting. |
| `Prayer` | `Keys` | `Alpha1,Alpha2,Alpha3` | three Unity key names | Keys for Protect from Melee, Missiles and Magic, comma-separated, as Unity `KeyCode` names: `Alpha1` is the 1 key above the letters, `Keypad1` the number pad's, `Z`, `X`, `C` letters. A name Unity doesn't know keeps that prayer's default. |
| `Dev` | `DumpData` | `false` | true / false | Writes Megabonk's loaded data (weapons, tomes, enemies, maps, characters, music) to `BepInEx/config/Bonkscape/dump.json`. For development. |
| `Debug` | `HideMegabonkHud` | `true` | true / false | Hide Megabonk's own health bar, XP bar and monster health bars, which the OSRS HUD replaces. Off: the OSRS HUD is still drawn, Megabonk's bars stay up beside it, and Bonkscape doesn't read Megabonk's XP bar. For tracking down problems. |
| `Debug` | `OsrsHud` | `true` | true / false | Draw Bonkscape's OSRS HUD. Off: no HUD is drawn, its interface sprites aren't loaded, and Megabonk's own HUD stays as it is. For tracking down problems. |
| `Dev` | `AutoStartRun` | `false` | true / false | Starts a Lumbridge run with autoplay by itself, the way Melty's test does ([Testing](../dev/testing.md)). For development. |
| `Dev` | `ManualTest` | `false` | true / false | Hand-over tests: Melty test runs leave the playing to you (no autoplay) while Bonkscape still writes its self-checks, for features autoplay can't reach ([Testing](../dev/testing.md)). |

The camera distance is applied at the start of every stage. The `Models` settings decide sizes when a run starts and
when each monster spawns.

## Other files

| File | What it is |
|---|---|
| `%LOCALAPPDATA%\Bonkscape\skills_<adventurer>.json` | Each adventurer's skills' XP ([Skills](skills-and-xp.md#saving)) |
| `%LOCALAPPDATA%\Bonkscape\settings.properties` | Read if present: `OSRS_DIR=` (the OSRS folder Melty passes in) and `OSRS_CACHE=` (a cache folder, used when `OSRS.CacheFolder` is empty) |
| `BepInEx/LogOutput.log` | BepInEx's log, with Bonkscape's lines |

<!-- sources: src/Bonkscape.Plugin/Plugin.cs src/Bonkscape.Plugin/Systems/CameraTweak.cs src/Bonkscape.Plugin/Core/Sizing.cs src/Bonkscape.Plugin/Dev/DataDump.cs -->
