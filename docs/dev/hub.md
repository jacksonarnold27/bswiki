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
Launching it again while it runs just opens the page. When `hub.py` changed since the running hub started, the new
hub replaces it; the servers keep running. `python tools/hub/hub.py --stop-all` stops the hub and every server.

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
- `hub.ico`: the shortcut's icon, drawn by `hub.py` (no image file in the repo).

If double-clicking does nothing, read `hub.log`, or run `python tools/hub/hub.py --open` in a terminal to see the error.

## Safety

- It listens on 127.0.0.1 only. It refuses requests whose `Host` isn't `localhost` or `127.0.0.1` (DNS rebinding), and
  its buttons send an `X-Bonkscape-Hub` header that another website can't send to it, so no web page can start or stop
  anything.
- The doc viewer serves only the files `DOCS` in `hub.py` lists; the folder buttons open only `FOLDERS`.
- Stdlib Python, nothing to install. Made for Windows: elsewhere pids come from `lsof`, and there's no shortcut and no
  older-code check.

## Adding a tool

In `tools/hub/hub.py`, add a row to `SERVICES` for a server (id, name, default port, script, a probe path and a
function that recognises the answer, links), to `DOCS` for Markdown the hub should render, or to `COMMANDS` for a
command to copy. A reload of the page shows it. Then add it to the table above and to
[Architecture](architecture.md#projects).

## Hosting BSWiki

Prepared, **not done**: nothing is published, and there's no remote repo or site.

`python tools/hub/export_wiki.py` writes BSWiki as a static site to `build/bswiki-site/` (gitignored): the wiki site's
`index.html`, `app.js` and `style.css`, the Markdown pages, `api/nav` and `api/pages` (what the local server's API
returns), `robots.txt` and a `_headers` file asking search engines not to index it, and `.nojekyll` (so GitHub Pages
serves the `.md` files as they are). It saves what the wiki server serves, so it's the local site page for page.
`--with-dev` adds the developer pages; `--serve` shows the export on <http://localhost:8799>.

**What would be public:** the player pages (`docs/wiki`) by default. With `--with-dev`, also the developer pages:
the architecture with every Harmony patch on Megabonk, the docket, gotchas, test history and changelog. Never map
tiles, sprites, models, renders or anything else read from the OSRS cache or Megabonk: the export is text only and
refuses a page that embeds an image or any other file. Player pages link into the developer pages in a few places;
those links break when the developer pages are left out, and the export lists them.

The export uses relative paths, so it works at a domain's root or in a subfolder. Two ways to put it online:

- **Cloudflare Pages:** `npx wrangler pages deploy build/bswiki-site --project-name bswiki`. To keep it private, put a
  Cloudflare Access application (Zero Trust; free for up to 50 users) in front of the `pages.dev` hostname, allowing
  only your e-mail address.
- **GitHub Pages:** a small public repo holding only the export (say `bswiki`, served at
  `https://<user>.github.io/bswiki/`), so Bonkscape's own repo can stay private. On a free account Pages needs a public
  repo, and the site is public either way.

<!-- sources: tools/hub/ -->
