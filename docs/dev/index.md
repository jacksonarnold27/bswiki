# BSWiki: developer pages

How Bonkscape is built, why it is the way it is, and what's next. Player-facing pages are in [BSWiki's player pages](../wiki/index.md).
Written against **0.16.1** (code at `f716b88`).

| Page | What it covers |
|---|---|
| [Architecture](architecture.md) | Projects, load sequence, the background asset build, sheets to code, the run lifecycle, the arena pipeline, every Harmony patch, tools, build and release |
| [Sheets reference](sheets-reference.md) | Every sheet and column, what reads it, and what the preflight checks |
| [Gotchas](gotchas.md) | Hard-won lessons from `MODLOG.md`, grouped by topic |
| [Testing](testing.md) | The local loop and its scenarios, Melty test mode, self-checks, footage review, the test history |
| [Cookbook](cookbook.md) | Recipes: add a map, a boss arena, a weapon and its special attack, an adventurer, a test check |
| [Changelog and patch notes](changelog.md) | Every version 0.0.1 to 0.16.1: date, commit, test, patch notes and changes |
| [Docket](docket.md) | Ideas and tasks by milestone, with status |
| [How to update these docs](updating-docs.md) | What to update with every version, the table generator and the checker |
| [The hub](hub.md) | One page that starts and links the wiki, the map sketch tool and the docs (`Bonkscape Hub.cmd`); the public BSWiki at jacksonarnold27.github.io/bswiki |

## Where things are

```
sheets/*.json                      design data (source of truth)
../osrs-kit/src/OsrsKit.Cache/     OSRS cache reader (no Unity), in osrs-kit beside this repo
src/Bonkscape.Plugin/              the BepInEx plugin
  Core/                            runner, asset build, sizing, Unity conversion, rows, JSON
  Dev/                             data dump, timing marks, test breadcrumbs
  Systems/                         one file per system (TitleArt.cs and HudLayout.cs are Unity-free, also in bonk)
  Patches/CorePatches.cs           leaderboards, data load, death screen
  Generated/Sheets.g.cs            generated from the sheets, don't edit
src/Bonkscape.Tools/               bonk.exe (preflight, codegen, cache and map tools)
tools/package.py                   release zip (and its gates)
tools/loop.py, tools/scenarios/    the local loop and its scenarios (Testing)
tools/pipeline/                    a map's, lair's or adventurer's rows and checks, staged from an outline
tools/mapideas/                    map ideas and monster rosters (writes docs/design/)
tools/sketch/                      map sketch tool (port 8790)
tools/wiki-site/                   this wiki's site (port 8791), table generator, docs checker
tools/hub/                         the hub (port 8789): starts and links the tools; Bonkscape Hub.cmd launches it
docs/MODLOG.md                     short log: versions, workflow, numbered gotchas
docs/preflight.md                  generated preflight report
docs/design/                       milestone plan, map ideas, UI style, private reference (not in BSWiki)
docs/wiki/, docs/dev/              these wikis
```

## The working loop

1. Change the sheets (design) or the code.
2. `bonk preflight ...` until phase 1 has 0 open items (regenerates `Sheets.g.cs` and `cache_assets.json`).
3. Try it with the local loop (`python -I tools/loop.py tools/scenarios/<name>.json`): it builds, installs, plays a
   scenario and reports ([Testing](testing.md#the-local-loop)).
4. Once per release: bump `Plugin.Version`, `python tools/package.py <version>` (it builds the plugin first), upload
   and test through Melty; read the self-checks and review the footage ([Testing](testing.md)).
5. Update the docs: changelog and patch notes, affected wiki pages, docket, statuses
   ([How to update these docs](updating-docs.md)).

<!-- sources: src/Bonkscape.Plugin/Plugin.cs -->
