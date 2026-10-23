# The hub

One local page that links every Bonkscape web tool and starts, stops and restarts their servers, so nothing has to be
started by hand. It runs on this PC only, at <http://localhost:8789>.

## Starting it

- **Desktop:** double-click **Bonkscape Hub**. It runs `pythonw`, so no console window opens. Make the shortcut once
  with `python tools/hub/hub.py --shortcut` (or the button at the bottom of the hub).
- **Repo:** double-click `Bonkscape Hub.cmd` in the repo root (a console flashes and closes).
- **Terminal:** `python tools/hub/hub.py --open`.
- **Claude Code:** the `bonkscape-hub` entry in `.claude/launch.json` (serves the hub without opening a browser).

Starting the hub starts the wiki and the map sketch tool when they aren't running, then opens the hub in your browser.
Launching it again while it runs just opens the page. When `hub.py` or `hub.json` changed since the running hub
started, the new hub replaces it; the servers keep running. `python tools/hub/hub.py --stop-all` stops the hub and
every server.

## What's on it

| Section | What | Port |
|---|---|---|
| BSWiki | `tools/wiki-site/server.py`: `docs/wiki` and `docs/dev`, with links to the player home, getting started, the dev home, changelog, docket, gotchas and this page | 8791 |
| Map sketch tool | `tools/sketch/server.py`: the world map from your cache, your outlines and the Ideas layer, plus a link to the map ideas write-up | 8790 |
| Docs | Markdown the wiki site doesn't show, rendered by the hub's own viewer (`doc.html`): the README, `docs/design/` (map ideas, UI style), `docs/MODLOG.md`, `docs/preflight.md`, and osrs-kit's README, `docs/`, `docs/research/` and `tools/music/README.md` | 8789 |
| Folders | Opens the repo, `sketches/`, `dist/`, osrs-kit or the hub's logs in Explorer | |
| Commands | The docs checker, table generator, map ideas build, packaging, the wiki export, the offline OSRS Wiki, the music lookup and `osrs.exe gamevals`, with absolute paths and a Copy button | |

Each server card shows whether it's running, its port and pid, who started it (the hub, or something else such as
Claude Code's preview) and since when, with Start, Stop, Restart and Log buttons. **Start all**, **Stop all** and
**Quit** (leaving the servers running, or stopping them too) are at the top.

## How it handles servers

- **Reuse.** The hub recognises a server by what it serves (the wiki by `/api/nav`, the sketch tool by its `app.js`),
  not just by a busy port, so a server started elsewhere (Claude Code's preview, a terminal) is reused, never doubled.
- **Free ports.** When another program holds a server's port, Start takes the first free port from the default + 100
  (8890, 8891, ... for the sketch tool) and remembers it; the card links there. The defaults stay 8789 to 8791.
- **No windows.** Servers run under `python.exe` with no window (`CREATE_NO_WINDOW`), their output going to a log.
  They keep running when the hub quits or crashes, and the next hub finds them.
- **Older code.** When a running server's `server.py` changed after the server started, its card says so, and Restart
  loads the new code. The hub never restarts a server by itself.
- **Stop** ends the process that holds the port (found with `netstat -ano`), also one the hub didn't start; the page
  asks first in that case.

## Logs and state

Outside the repo, in `%LOCALAPPDATA%\Bonkscape\hub\`:

- `logs\<server>.log`: each server's output (the card's Log button shows the end), trimmed past 1 MB.
- `logs\hub.log`: the hub's own output when it runs without a console.
- `state.json`: the hub's port, and each server's last port and pid.
- `config.txt`: the hub config that owns this folder; another project with the same name gets
  `%LOCALAPPDATA%\Bonkscape-<6 hex>\hub\` instead.

The engine also lists this hub in `%LOCALAPPDATA%\project-hub\hubs.json`, the PC-wide registry the kit's
`scaffold.py` reads to give a new project ports no other hub uses.
- `hub.ico`: the shortcut's icon, drawn by `hub.py` (no image file in the repo).

If double-clicking does nothing, read `hub.log`, or run `python tools/hub/hub.py --open` in a terminal to see the error.

## Safety

- It listens on 127.0.0.1 only. It refuses requests whose `Host` isn't `localhost` or `127.0.0.1` (DNS rebinding),
  and buttons that change anything send an `X-Project-Hub` header that another website can't send to it; a foreign
  `Origin` is refused too. So no web page can start or stop anything.
- The doc viewer serves only the files `hub.json`'s doc groups list; the folder buttons open only its `folders`.
- Stdlib Python, nothing to install. Made for Windows: elsewhere pids come from `lsof`, and there's no shortcut and no
  older-code check.

## Adding a tool

Everything Bonkscape-specific is in `tools/hub/hub.json`: `services` (a server: id, name, port, the command with
`{port}`, a `probe` that only it answers, links), `docs` (Markdown the hub renders, and `routes` for pages the wiki
renders), `folders` and `commands`. The full list of keys is in the project-hub kit's `config.md`. Then:

```
python tools/hub/hub.py --check       validates hub.json
python tools/hub/hub.py --selftest    serves the hub on a spare port and fetches every page and doc
```

Relaunch the hub (it replaces the running one, because hub.json changed), then add the tool to the table above and to
[Architecture](architecture.md#projects).

**The engine** (`hub.py`, `index.html`, `app.js`, `style.css`, `doc.html`, `doc.js`) is a copy from the project-hub
kit, its own repo beside this one, which any project can use. Don't edit it here: change the kit, then copy it in with
`python ../project-hub/scaffold.py update .` from the repo root. `export_wiki.py` is Bonkscape's own.

## Hosting BSWiki

BSWiki is online, **public**, at <https://jacksonarnold27.github.io/bswiki/>: the player and developer pages, from the
public repo [jacksonarnold27/bswiki](https://github.com/jacksonarnold27/bswiki) (GitHub Pages, branch `main`). That repo
holds only the exported wiki; Bonkscape's own repo stays private. Its local clone sits beside this repo, as `bswiki`
(`hub.json`'s `site`, `{root}/../bswiki`), and its commits use the GitHub no-reply address, not your e-mail.

**To update it** after editing the docs (also on the hub's Commands card):

```
python tools/hub/export_wiki.py --with-dev --out ../bswiki --push
```

Run it from the repo root (from a worktree elsewhere, give the clone's full path). It exports, commits in that clone
and pushes; the site changes a minute or two later. Nothing is pushed
when the export hasn't changed.

**What the export holds:** the wiki site's `index.html`, `app.js` (its paths made relative, so it works in a
subfolder) and `style.css`, the Markdown pages, `api/nav` and `api/pages` (what the local server's API returns), plus
`robots.txt`, a `_headers` file (for Cloudflare Pages) and a `noindex` tag asking search engines not to list it, and
`.nojekyll` (so GitHub Pages serves the `.md` files as they are). It saves what the wiki server serves, so it's the
local site page for page. Without `--with-dev` it's the player pages only; `--serve` shows an export on
<http://localhost:8799>; with no `--out` it goes to `build/bswiki-site/` (gitignored).

**Never online:** map tiles, sprites, models, renders or anything else read from the OSRS cache or Megabonk. The
export is text only and refuses a page that embeds an image or any other file. Anything written in `docs/wiki` or
`docs/dev` goes public with the next update, so keep personal paths and private notes out of those pages.

For a private copy instead, Cloudflare Pages can serve the same export
(`npx wrangler pages deploy build/bswiki-site --project-name bswiki`) behind a Cloudflare Access application (Zero
Trust, free for up to 50 users) that lets in only your e-mail address. GitHub Pages sites on a free account are
always public.

<!-- sources: tools/hub/ -->
