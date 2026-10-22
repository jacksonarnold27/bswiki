# Gotchas

Hard-won lessons, grouped by topic. Numbers in brackets are the numbered gotchas in `docs/MODLOG.md` (keep both in
step: MODLOG is the short log, this page explains). Unnumbered ones were found while writing the wiki.

## Melty and the loader

- **Melty reads at most 12 check lines per run.** Write only the recipe's `test.checks` to the checks file: an optional
  check written early pushes a required one past the limit, and the run doesn't count although the log shows it passed
  (0.2.0 run 2, 0.2.5 run 1). `TestMode.Pass` writes recipe checks only.
- **Melty must be started by the user, not from Claude's shell** [1]. `Start-Process melty://...` from the Claude
  desktop app runs Melty inside the app's MSIX package; its AppData writes (the test file, `settings.properties`) land in
  `Packages/Claude_*/LocalCache`, invisible to Megabonk, which Steam starts.
- **Melty disables BepInEx between its own launches** [2] (renames `winhttp.dll` to `winhttp.dll.melty-off`). Iterate
  with `test_release` runs rather than launching Megabonk directly.
- **The BepInEx build Melty installs isn't the listed one.** The listing says 6.0.0-pre.2; the installed build is
  **6.0.0-be.697** (.NET 6.0.7). Compile against `BepInEx/core` from the game folder (`lib/bepinex-melty`), not the
  GitHub pre.2 zip.
- **Interop assemblies only exist after a first Melty test launch** (`BepInEx/interop`). Without them the plugin builds
  without its game code (`INTEROP` undefined), and you get a stub.
- **`{game:custom-old-school-runescape}` is the Steam OSRS folder, which has no cache.** That's why the plugin searches
  RuneLite's and the official client's cache folders itself.
- **Self-checks are read line by line from the checks file**, verdict first: `pass osrs-cache` or `fail osrs-cache: why`.
  `osrs-cache=pass` or a bare name aren't read. List in the recipe's `test.checks` only names the mod reports (0.1.0's
  test failed with every check missing).
- **A 1-run test is a quick check**; only a test of 2+ runs with every self-check passing in each run lets a new mashup
  be published.

## IL2CPP and Harmony

- **Stripped Unity members** [3]. Members Megabonk never uses are missing, and calling them throws *"Method unstripping
  failed"* (0.1.1's test failed on it). Missing: `AudioClip.Create/SetData` (all runtime clip creation),
  `Renderer.forceRenderingOff`, `shadowCastingMode`, `receiveShadows`, `AudioSource.playOnAwake/spatialBlend`,
  `ScreenCapture.CaptureScreenshot`. Present: `Mesh.vertices/colors32/triangles`, `Texture2D.LoadRawTextureData`,
  `Renderer.enabled`, `GUI.DrawTexture`. Before relying on a member, scan the interop assemblies for
  `throw new NotSupportedException("Method unstripping failed")`.
- **Rebuilt members crash natively** [19]. Some stripped members aren't missing: Il2CppInterop *rebuilds* them from
  Unity's reference code, and a rebuilt copy can disagree with the game's Unity. `GUI.DrawTextureWithTexCoords` did:
  it smashed the stack (coreclr `c0000005`) on the first HUD frame of every run, 0.1.17-0.1.21. A bound member has a
  `NativeMethodInfoPtr_<name>` field in its interop type; a rebuilt one doesn't. `bonk unstripped <Bonkscape.dll>
  <interopDir>` lists every rebuilt member the plugin calls, and `tools/package.py` refuses to package when there is
  one not on its known-safe list. Draw part of a sprite from its own cut texture (`UnityConv.SpritePart`) instead.
- **Sound without AudioClips** [4]: OSRS sounds are synthesised and mixed into the output from an injected
  MonoBehaviour's `OnAudioFilterRead` on the AudioListener's object, re-attached when scenes replace the camera.
- **Harmony on IL2CPP virtual methods recurses** [5]. Calling the original from a patch goes back through virtual
  dispatch into the patch: stack overflow. Never let Harmony run the original of a virtual/override (`GetIcon`,
  `GetDescription`). Set data fields instead (`WeaponData.icon`, `TomeData.description`), or reimplement and return
  false (`GetName` reads `localizedName` itself).
- **`ReadOnlySpan` overloads** [6] in interop (`AudioClip.SetData`, `Il2CppStructArray` constructors) break overload
  resolution and reflection lookups. Cast sizes to `long`; avoid reflection over those methods.
- **Name collisions** [11] with Megabonk's global types: `MeshData` (alias it inside the namespace), the `Assets`
  namespace.
- **Static initialisers that touch Unity can kill a whole class.** 0.1.0's test logged *"The type initializer for
  'Bonkscape.Core.UnityConv' threw an exception"* on every use. Create Unity objects lazily, on the main thread.

- **IL2CPP inlines small methods, and a patch on an inlined method never runs** [20]. Harmony patches the method, but
  its callers carry their own copy. Three Bonkscape hooks never fired: `WeaponBase.Use` for weapon attacks (0.1.31;
  `WeaponAttack.SuccessfullySpawnedProjectile` works), `InteractableChest.OpenChestImplementation` for caskets (0.1.33;
  `ChestWindowUi.OpenButton` works) and `PlayerInput.MovementInput` for autoplay (0.1.35; movement is now written in
  `LateUpdate`). Give every hook a counter or a self-check, and prefer public entry points.

## Megabonk runtime

- **A game started from Claude's shell writes the user's real saves**: Claude's desktop app is an MSIX package, and
  programs its shell starts see AppData through it, but it redirects only **new** files (into
  `%LOCALAPPDATA%\Packages\Claude_*\LocalCache`, seen only from inside the package). Overwriting a file that already
  exists writes the real one. Megabonk saves in place (`LocalLow\Ved\Megabonk\Saves\CloudDir\<steam id>\stats.json`,
  `progression.json`, synced by Steam Cloud; `LocalDir\config.json`), and `Skills.Save` writes a new `.tmp` (redirected)
  then copies it over the existing `skills_<adventurer>.json` (real). The 0.3 loop first assumed the package isolated
  them (a probe file, a new file, landed in `LocalCache`), and 24 launches on 2026-10-21/22 changed the real saves before
  that was caught; since then the loop backs every save up before a launch and restores it byte for byte after
  ([Testing](testing.md#the-local-loop)). The scenario and report live in the game folder (`BepInEx/config/Bonkscape`),
  which every process sees.
- **Megabonk ignores Unity's `-screen-fullscreen/-screen-width/-screen-height` flags** and runs at its own settings;
  the UI test sets sizes in game with `Screen.SetResolution`, which clamps to the desktop (3840x2160 became
  3840x1934 on a 2560x1600 screen).
- **`ScreenCapture.CaptureScreenshot` and `ImageConversion.EncodeToPNG` are stripped from Megabonk** (`bonk
  unstripped`), and the interop has only the generic `GetRawTextureData<T>`: screenshots are `ReadPixels` in an IMGUI
  repaint, `GetPixels32`, and a PNG written by the plugin (`Systems/Shot.cs`).
- **A boss summoned before the arena is built never gets its lair**: `Arena.BossSummoned` needs `Arena.Active`.
  Players can't reach the portal that fast, but a scenario spawning at 3 s could (a suite's later runs build their
  arena in 3-4 s): scenario clocks start once the arena is built.

- **Megabonk's transforms are scaled and rotated for its own art** [7]: enemy and player renderer bounds report about
  4.5 m. OSRS models are separate objects that follow their owner (positioned every `LateUpdate`, facing the player or
  the movement), not children of Megabonk's model.
- **Level-up and shrine windows pause the game** [8] (`deltaTime` 0). Autoplay timers use unscaled time; press the
  first `UpgradeButton.SelectUpgrade()`, and `BaseEncounterWindow.ChooseOffer(0)` for shrine windows.
- **The player object appears a moment after the run starts** [9]: start-of-run setup keys off `MyPlayer.Instance`,
  and a new player object means a new stage.
- **The Forest stage's structure** [15]: 600 m square centred on (0, 10, 0), built from generated tile prefabs
  (`ProceduralTileGeneration.tilesParent/newRoot/collider`) plus prop roots. Layers: Ground 8, Object 12, Water 4,
  TransparentFX 1 (tree camera colliders), minimap 14. Camera collision is 1\|8\|12; spawns raycast Ground\|Object
  inside `SpawnPositions.minX..maxZ`, which `FindBounds` recomputes, so override it in a postfix. A catch box
  `WorldCollider` sits at y -60 (top about -30). (Learned from the 0.1.6 diagnostic build.)
- **Moving the player** [16]: `TeleportPlayerImmediate`/`TeleportPlayer` alone don't stick during the spawn intro.
  Wait until `!isTeleporting && grounded`, then set `playerMovement.rb.position` (velocity 0) and the transform, and
  repeat for a moment. (0.1.7 and 0.1.8 built the arena but never reported a kill, pickup, prayer or XP drop; 0.1.8
  added this wait, and 0.1.9, with re-wound ground triangles, was the first arena build to pass.)
- **Megabonk's bosses and minibosses** are recognised in `Content.ApplyEnemies` as `Miniboss*` names or
  `maps == None && hp >= 1000`; their stats are left alone.

## OSRS cache and models

- **OSRS item models lie flat.** Fit ground items and projectiles by their longest side (`UnityConv.Longest`,
  `AttachFit`), not their height: 0.2.0 drew rune arrows metres long and single coins as big gold discs.
- **Players' caches are partial** (the client downloads models on demand), hence stand-ins and graceful fallbacks
  everywhere. The creator's PC uses `OSRS.CacheFolder = D:/Modding/osrscache/cache`, a full cache, for testing; this
  PC's RuneLite cache now has the full archive too (preflight: 143/143 phase-1 assets).
- **OSRS NPC models need their standing frame** [12] or they T-pose. Lighting is computed before the pose and the NPC
  scale after it, as the client does.
- **Facing** [10]: MODLOG says OSRS models face +z after flipping OSRS y and z (yaw offset 0). Since `UnityConv` also
  flips z (0.1.7, next point), they face -z (south) in Unity, so `EnemySkins` and `PlayerSkin` use a 180 degree
  `YawOffset`.
- **Handedness** [13]. OSRS axes (x east, y down, z north) are right-handed; Unity is left-handed. `MeshData` keeps
  OSRS's frame with y and z flipped (a rotation), so `UnityConv` flips z once more (a reflection), or every model is
  mirrored (the sword in the wrong hand, the River Lum west of the castle). A reflection reverses winding, so triangles
  are re-wound: Unity mesh colliders and raycasts are one-sided, and ground facing down let the player and Megabonk's
  spawn raycasts fall through (fixed in 0.1.9).
- **The current map index (5) is unnamed** [14]: one group per region numbered `x << 8 | y`, file 0 terrain (16-bit
  attributes, a trailing byte), file 1 objects, readable without XTEA keys. Older caches name them `m{x}_{y}`/`l{x}_{y}`.
- **The Barrows brothers' NPC models are pink in the cache** [22]: hue 60 on every face, recoloured by the client at
  run time; their armour items are grey. `enemies.model_ids` `worn:<item ids>` builds Dharok and
  Ahrim as a male body in their own armour instead (`Osrs.BuildWorn`); `bonk modelcolors <model...>` prints a
  model's commonest face colours.
- **Textures are one average colour.** Faces with a texture are drawn in its sprite's average colour, part of why
  Lumbridge looks paler than in OSRS.

- **Megabonk renders in Linear colour space** [21]. OSRS colours are gamma (sRGB) values; as vertex colours in a Linear
  project they come out paler. `UnityConv` converts each channel gamma-to-linear when
  `QualitySettings.activeColorSpace` is Linear (logged as *"colours: Linear colour space, ..."*).

## Sizing and the arena

- **Measure the character once, upright** [18]. Player collider bounds read 0 (or tilted) at some moments. The
  height is kept for the game session while the adventurer stays the same; since 0.1.30 `Sizing.Measure` resets and
  measures again when the adventurer changes (`sizing: adventurer changed (A -> B), measuring again` in the log), so an
  adventurer whose Megabonk character has a different collider gets its own measurement.
- **Arena colliders** [17]: walls are separate meshes in 8x8-tile cells, hidden while between camera and adventurer.
  MODLOG describes the first version, colliders on layer 0. Since 0.1.11 they sit on a free physics layer (the highest
  unnamed one) that is set to collide with the player's and the enemy layer, while Megabonk's camera, spawn raycasts
  and projectiles ignore it.
- **Monster hitboxes read 0 at spawn, then turn out huge.** `Enemy.collider` bounds are 0 when `InitEnemy` runs and
  go live a moment later, which is also when Megabonk enlarges elites and minibosses; `FitHitbox` re-sizes then.
  Megabonk's hitboxes are tall capsules (5.4 m for a 3 m skeleton), so "never smaller than the hitbox" made monsters
  far too big: the floor is off by default since 0.1.15 (`Models.MinHitboxShare`).
- **Megabonk's camera isn't always `Camera.main`.** The wall hiding looks for `PlayerCamera`'s own camera; the minimap
  has a separate orthographic camera (whose `orthographicSize` `Minimap.Zoom` divides).
- **`Bonk.Active` is per map, not per stage**: every stage of the Forest map gets the same Lumbridge.

## Build, release and docs

- **`tools/package.py` builds the plugin itself.** Before, it zipped whatever was in `bin/Release`: 0.2.1's
  first zip carried a DLL built before the last three edits (its log said 0.2.0). It now runs `dotnet build -c Release`
  first and refuses when `Plugin.Version` isn't the version asked for.
- **Renaming a config key is how you reset a default.** BepInEx keeps the value already in a player's `.cfg`, so a
  new default never reaches existing installs. `HitboxFill` became `MinHitboxShare` in 0.1.15 for that reason (and
  `PlayerFit` became `AdventurerScale` in 0.1.12, with a new default); the old lines are then ignored.
- **Bump `Plugin.Version` for every upload**; the version Melty shows comes from the release, the log line from the DLL.
- **The DLL records the commit it was built from**: its informational version is `1.0.0+<HEAD hash>`. Uncommitted
  changes aren't reflected, so a zip built from a dirty tree carries the previous commit's hash (0.1.0 to 0.1.3 all
  say `7b77aa6`).
- **`tools/package.py` copies `README.md` as it is.** Update the README before packaging: 0.1.7 to 0.1.11 shipped the
  pre-arena README describing "Megabonk's Forest map becomes Lumbridge".
- **The preflight writes generated code even when it has phase-1 findings.** Check its exit code (4 = open items).
- **`sheets/hooks.json` is behind the code**: ten patches have no row, five rows have no patch
  ([Architecture](architecture.md#harmony-patches)). The preflight can only verify targets that have a row.
- **Starting weapons are set in the `DataManager.Load` postfix**, once per game start; the character select panel
  computes them live, so it can show a weapon the run doesn't give until Megabonk restarts (untested).

<!-- sources: docs/MODLOG.md -->
