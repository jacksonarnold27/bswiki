# How to update these docs

The `wiki-update` skill (`.claude/skills/wiki-update/`) runs this whole process, safely while other sessions commit
to the same folder: start there after each version is built and its Melty test has a result.

**The changelog and the wiki get updated with every version.** A version isn't finished until its changelog entry,
patch notes and the wiki pages it touches say what the code now does. The wikis describe the code as it is, not the
plan: a planned feature is marked planned until it's built.

## With every commit

A Claude Code hook (`.claude/hooks/bonkscape_after_commit.py`, registered in the user's `~/.claude/settings.json` for
Bash and PowerShell `git` commands, so it runs in every session whatever its folder) follows each commit to this repo
and tells the session that made it:

- **Docket:** unless the commit already changed [docket.md](docket.md), update the row of any task it starts,
  finishes or blocks, add `todo` rows for follow-ups it turned up, set "Last updated <date>, at <version>", and commit
  `docs/dev/docket.md` alone, by name. Game code is `done` only once it is in a version whose Melty test passed;
  until then `doing`, with the commit hash. Tools and docs work is `done` when committed. Nothing changed on the
  docket: leave it.
- **Milestone plan:** when a row in a "Milestone X.Y" section changes, the release's Status in the "at a glance" table
  of `docs/design/milestones.md` follows it: `todo`, `doing` once a row has started, `done` when every row is. The
  docs check fails when the two disagree, and when a release is in one but not the other.
- **Docs check:** the result of `check_docs.py --head --release`, the same check `package.py` runs; any FAIL is fixed
  in a follow-up commit by the session that caused it.
- **New version:** when the commit bumps `Plugin.Version`, to run the `wiki-update` skill once that version is built
  and tested.

It reports each commit once, says nothing for other commands or other repositories, and never blocks a commit.

## With every version

1. **Changelog** ([changelog.md](changelog.md)): add the version at the top with
   - the build date and time (local, UTC-5), the commit it was built from and the commit that holds its code,
   - the Melty test id and result (update it when the test finishes or its footage is reviewed),
   - **patch notes**: 1 to 4 short, player-facing bullets (paste these into the Melty release changelog),
   - **changes**: what changed for developers, naming files, settings and sheet columns.
2. **Wiki pages**: run the checker (below) and re-read every page it lists as touched by the changes. Fix what's no
   longer true. New settings go on [Settings](../wiki/settings.md), new patches in
   [Architecture](architecture.md#harmony-patches), new gotchas in [Gotchas](gotchas.md) and `docs/MODLOG.md`.
3. **Version lines**: the version and code commit at the top of [the wiki home](../wiki/index.md) and
   [the dev home](index.md), and `documented_commit` in `tools/wiki-site/docs_state.json`.
4. **Statuses**: rows that were seen working in a Melty test become `verified` in their sheet; rows newly built become
   `built`. Then regenerate the tables.
5. **Docket** ([docket.md](docket.md)): move finished tasks to done, add what the test or review turned up.
6. **Tables**: `python tools/wiki-site/gen_tables.py`.
7. **Check**: `python tools/wiki-site/check_docs.py` must pass. `tools/package.py` won't build a release until
   `--head --release` passes ([below](#the-docs-checker)).

## Generated tables

Tables of sheet data (weapons, monsters, gear, prayers, skills, waves, drops, UI and audio rows, hooks, the sheet list)
are generated from `sheets/*.json`. In a page they sit between markers:

```markdown
<!-- gen:weapons -->
(generated: don't edit by hand)
<!-- /gen:weapons -->
```

`python tools/wiki-site/gen_tables.py` rewrites every marked table; `--check` only reports stale ones. To add a table,
write a `t_<name>()` function in `gen_tables.py`, add it to `TABLES`, and put the markers in a page. Names come from
`sheets/cache_assets.json`, so run the preflight first when OSRS ids changed.

## The docs checker

`python tools/wiki-site/check_docs.py` checks what can be checked mechanically, against the working tree. With
`--at REV` it reads the code (`src/Bonkscape.Plugin`) from commit REV instead, which ignores other sessions'
unfinished edits in the same folder and any code committed after REV; docs pages and sheets still come from the
working tree. Use `--at <code commit>` when you document a released version (the commit that set its
`Plugin.Version`), `--head` (the same as `--at HEAD`) for the latest commit, and the plain run to check uncommitted
work.

**It gates every release:** `python tools/package.py <version>` runs `check_docs.py --head --release` first and
refuses to build the zip (non-zero exit, nothing written to `dist/`) when any check fails. `--release` leaves out the
Version check, because a version's changelog entry and wiki-home line are written after its build and Melty test (the
`wiki-update` skill); every other check applies, so the session that adds a setting, patch, sheet column or self-check
documents it in the same commit. Fix the FAIL lines and package again. `package.py --skip-docs` builds anyway, for
emergencies only; it prints a warning, and the docs still need fixing.

| Check | Fails when |
|---|---|
| Tables | A generated table is out of date. |
| Settings | A `Config.Bind` key in `Plugin.cs` isn't on the Settings page. |
| Patches | A `[HarmonyPatch]` target has no row in Architecture's patch table, or a row in that table (its first column, `(args)` ignored) has no patch in the code. |
| Sheet columns | A sheet column isn't mentioned in the Sheets reference. |
| Self-checks | A name in `TestMode.Checks` isn't on the Testing page. |
| Version | `Plugin.Version` has no changelog heading, or the wiki home doesn't name it. Skipped with `--release`. |
| Docket | A task row's status isn't one of `todo`/`doing`/`done`/`blocked` (as `<span class="st st-X">X</span>`), a task appears twice, a backticked `src/`, `sheets/`, `tools/` or `docs/` path doesn't exist, or the "Last updated ..., at X.Y.Z" line is missing or names a version newer than `Plugin.Version`. Without `--release` it must name `Plugin.Version` itself. |
| Links | A relative link points to a missing page or heading. |

It also lists **pages to re-read**: every page ends with a `<!-- sources: ... -->` comment naming the code and sheets
it describes. The checker compares those against the files changed since `documented_commit` (in
`tools/wiki-site/docs_state.json`, which itself doesn't count) plus uncommitted changes; with `--at REV` or `--head`,
only the files changed from `documented_commit` to REV. A listed page isn't necessarily wrong; it's where to look.
After re-reading them, set `documented_commit` to the commit you checked against.

What it can't check: whether the prose is true. That takes reading the code (or a test run) for each listed page.
Things only a run can show (whether Megabonk counts minibosses as bosses, how big things look) stay marked
unconfirmed until a Melty run, its footage or a log line shows them.

## Writing style

- Say what the code does, with the numbers it uses. Quote in-game text exactly, in italics.
- Mark anything planned with its phase (the generated tables do this from `status`).
- Player pages (`docs/wiki`) explain how to play; developer detail (file names, hooks) goes in `docs/dev`.
- Link pages with relative links (`[Prayer](prayer.md#prayer-points)`); the site and GitHub both follow them.

## The site

`python tools/wiki-site/server.py 8791`, then open <http://localhost:8791>. It renders `docs/wiki` and `docs/dev`
straight from disk, so a refresh shows your edits. The `bonkscape-wiki` entry in `.claude/launch.json` starts it from
Claude Code's preview. Simplest: double-click `Bonkscape Hub.cmd` (or the Desktop shortcut), which starts the site and
links its pages ([The hub](hub.md)).

<!-- sources: tools/wiki-site/ -->
