// BSWiki site (Bonkscape's own wiki): renders docs/wiki and docs/dev (served by server.py) in the browser.
// Routes are #/<section>/<page>#<heading>, e.g. #/wiki/prayer#prayer-points.
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const app = $('#app'), nav = $('#nav'), page = $('#page'), toc = $('#toc'), foot = $('#foot'), q = $('#q');
  let navData = [], flat = [], index = null, current = null, searchTimer = 0;

  // ------------------------------------------------------------ helpers

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // the same slugs as tools/wiki-site/check_docs.py (and, for plain headings, GitHub)
  function stripMd(t) {
    return t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[`*]/g, '');
  }
  function slug(t) {
    return stripMd(t).trim().toLowerCase().replace(/[^a-z0-9_\- ]/g, '').replace(/\s/g, '-');
  }

  function parseHash() {
    let h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    let anchor = '';
    const i = h.indexOf('#');
    if (i >= 0) { anchor = h.slice(i + 1); h = h.slice(0, i); }
    const [section, name] = h.split('/');
    if (!section || !name) return { section: 'wiki', slug: 'index', anchor };
    return { section, slug: name, anchor };
  }

  // a link in a page in docs/<section>/ -> a route, or null to leave it alone
  function route(href, section, name) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null;
    if (href.startsWith('#')) return '#/' + section + '/' + name + href;
    const hashAt = href.indexOf('#');
    const path = hashAt >= 0 ? href.slice(0, hashAt) : href;
    const anchor = hashAt >= 0 ? href.slice(hashAt) : '';
    if (!path.endsWith('.md')) return null;
    const parts = ['docs', section];
    for (const seg of path.split('/')) {
      if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg);
    }
    if (parts.length !== 3 || parts[0] !== 'docs' || !['wiki', 'dev'].includes(parts[1])) return null;
    return '#/' + parts[1] + '/' + parts[2].replace(/\.md$/, '') + anchor;
  }

  function titleOf(section, name) {
    const p = flat.find((x) => x.section === section && x.slug === name);
    return p ? p.title : name;
  }

  // ------------------------------------------------------------ markdown

  let counts = {}, headings = [], ctx = { section: 'wiki', slug: 'index' };

  marked.use({
    gfm: true,
    renderer: {
      heading(text, level, raw) {
        let id = slug(raw);
        const n = counts[id] || 0;
        counts[id] = n + 1;
        if (n) id += '-' + n;
        if (level === 2 || level === 3) headings.push({ id, level, text: stripMd(raw) });
        const link = level > 1 ? '<a class="anchor" href="#/' + ctx.section + '/' + ctx.slug + '#' + id + '" aria-label="Link to this section">#</a>' : '';
        return '<h' + level + ' id="' + id + '">' + text + link + '</h' + level + '>\n';
      },
      link(href, title, text) {
        const r = route(href || '', ctx.section, ctx.slug);
        const t = title ? ' title="' + esc(title) + '"' : '';
        if (r) return '<a href="' + esc(r) + '"' + t + '>' + text + '</a>';
        const ext = /^https?:/i.test(href || '');
        return '<a href="' + esc(href || '') + '"' + t + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + text + '</a>';
      },
      code(code, info) {
        const lang = (info || '').trim().split(/\s+/)[0];
        let html;
        if (lang && window.hljs && hljs.getLanguage(lang)) html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        else html = esc(code);
        return '<pre><code class="hljs' + (lang ? ' language-' + esc(lang) : '') + '">' + html + '</code></pre>\n';
      },
      table(header, body) {
        return '<div class="table-wrap"><table><thead>' + header + '</thead><tbody>' + body + '</tbody></table></div>\n';
      },
    },
  });

  function render(md, section, name) {
    counts = {}; headings = []; ctx = { section, slug: name };
    const html = marked.parse(md.replace(/<!--[\s\S]*?-->/g, ''));
    return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
  }

  // ------------------------------------------------------------ pages

  function drawNav() {
    let html = '';
    for (const s of navData) {
      html += '<h3>' + esc(s.title) + '</h3>';
      for (const p of s.pages) {
        const on = current && current.section === s.key && current.slug === p.slug ? ' class="on"' : '';
        html += '<a' + on + ' href="#/' + s.key + '/' + p.slug + '">' + esc(p.title) + '</a>';
      }
    }
    nav.innerHTML = html;
  }

  function scrollTo(anchor) {
    if (!anchor) { window.scrollTo(0, 0); return; }
    const el = document.getElementById(anchor);
    if (!el) return;
    el.scrollIntoView({ block: 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }

  async function show() {
    const { section, slug: name, anchor } = parseHash();
    app.classList.remove('open');
    if (current && current.section === section && current.slug === name) { scrollTo(anchor); return; }
    current = { section, slug: name };
    if (!q.value.trim()) drawNav(); // keep search results up while you open them
    let md;
    try {
      const r = await fetch('docs/' + section + '/' + name + '.md', { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
      md = await r.text();
    } catch (e) {
      page.innerHTML = '<h1>Page not found</h1><p class="error">docs/' + esc(section) + '/' + esc(name) + '.md: ' + esc(String(e.message || e)) + '</p><p><a href="#/wiki/index">Wiki home</a></p>';
      toc.innerHTML = ''; foot.innerHTML = '';
      return;
    }
    page.innerHTML = render(md, section, name);
    const title = (md.match(/^#\s+(.+)$/m) || [, name])[1];
    document.title = stripMd(title) + ' · BSWiki';
    $('#crumb').textContent = (section === 'dev' ? 'BSWiki dev' : 'BSWiki') + ' / ' + stripMd(title);

    toc.innerHTML = headings.length > 2
      ? '<div class="t-head">On this page</div>' + headings.map((h) => '<a class="l' + h.level + '" href="#/' + section + '/' + name + '#' + h.id + '">' + esc(h.text) + '</a>').join('')
      : '';

    const i = flat.findIndex((p) => p.section === section && p.slug === name);
    const prev = i > 0 ? flat[i - 1] : null, next = i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
    foot.innerHTML = '<div class="pn"><span>' + (prev ? '← <a href="#/' + prev.section + '/' + prev.slug + '">' + esc(prev.title) + '</a>' : '') + '</span>' +
      '<span>' + (next ? '<a href="#/' + next.section + '/' + next.slug + '">' + esc(next.title) + '</a> →' : '') + '</span></div>' +
      'File: <code>docs/' + esc(section) + '/' + esc(name) + '.md</code>. Edit it and refresh.';
    scrollTo(anchor);
  }

  // ------------------------------------------------------------ search

  function plain(md) {
    return md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*|>#]/g, ' ').replace(/-{3,}/g, ' ').replace(/\s+/g, ' ').trim();
  }

  async function ensureIndex() {
    if (index) return index;
    const r = await fetch('api/pages', { cache: 'no-store' });
    const pages = await r.json();
    index = [];
    for (const p of pages) {
      const title = titleOf(p.section, p.slug);
      const seen = {};
      let heading = title, anchor = '', buf = [], fence = false;
      const flush = () => { if (buf.length) index.push({ section: p.section, slug: p.slug, title, heading, anchor, text: plain(buf.join('\n')) }); buf = []; };
      for (const line of p.text.split('\n')) {
        if (line.startsWith('```')) fence = !fence;
        const m = !fence && line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
        if (m) {
          flush();
          let id = slug(m[2]); const n = seen[id] || 0; seen[id] = n + 1; if (n) id += '-' + n;
          heading = stripMd(m[2]); anchor = m[1].length === 1 ? '' : id;
        } else buf.push(line);
      }
      flush();
    }
    return index;
  }

  function highlight(text, terms) {
    let out = esc(text);
    for (const t of terms) {
      if (!t) continue;
      out = out.replace(new RegExp('(' + esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    }
    return out;
  }

  async function search(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { drawNav(); return []; }
    const idx = await ensureIndex();
    const hits = [];
    for (const e of idx) {
      const head = e.heading.toLowerCase(), title = e.title.toLowerCase(), text = e.text.toLowerCase();
      let score = 0, all = true;
      for (const t of terms) {
        const inHead = head.includes(t), inTitle = title.includes(t);
        let n = 0, at = text.indexOf(t);
        while (at >= 0 && n < 20) { n++; at = text.indexOf(t, at + t.length); }
        if (!inHead && !inTitle && !n) { all = false; break; }
        score += n + (inHead ? 8 : 0) + (inTitle ? 4 : 0);
      }
      if (all) hits.push({ e, score });
    }
    hits.sort((a, b) => b.score - a.score);
    const top = hits.slice(0, 40);
    let html = '<h3>' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' · <a href="#" id="clear">clear</a></h3><div class="results">';
    for (const { e } of top) {
      const lower = e.text.toLowerCase();
      const at = Math.max(0, lower.indexOf(terms[0]));
      const start = Math.max(0, at - 50);
      const snip = (start ? '…' : '') + e.text.slice(start, at + 110) + (at + 110 < e.text.length ? '…' : '');
      const href = '#/' + e.section + '/' + e.slug + (e.anchor ? '#' + e.anchor : '');
      html += '<a href="' + href + '"><span class="r-title">' + highlight(e.heading, terms) + '</span>' +
        '<span class="r-where"> · ' + (e.section === 'dev' ? 'Dev' : 'Wiki') + ' / ' + esc(e.title) + '</span>' +
        '<span class="r-snip">' + highlight(snip, terms) + '</span></a>';
    }
    if (!hits.length) html += '<p class="muted" style="padding:4px 8px">Nothing matches every word.</p>';
    nav.innerHTML = html + '</div>';
    const c = $('#clear');
    if (c) c.addEventListener('click', (ev) => { ev.preventDefault(); q.value = ''; drawNav(); });
    return top;
  }

  q.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => search(q.value), 120); });
  q.addEventListener('focus', () => { ensureIndex().catch(() => {}); });
  q.addEventListener('keydown', async (ev) => {
    if (ev.key === 'Escape') { q.value = ''; drawNav(); q.blur(); }
    if (ev.key === 'Enter') {
      const top = await search(q.value);
      if (top.length) { const e = top[0].e; current = null; location.hash = '#/' + e.section + '/' + e.slug + (e.anchor ? '#' + e.anchor : ''); }
    }
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === '/' && document.activeElement !== q && !/input|textarea/i.test(document.activeElement.tagName)) { ev.preventDefault(); q.focus(); }
  });

  // ------------------------------------------------------------ theme and layout

  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
    const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    $('#hl-dark').disabled = !dark;
    $('#hl-light').disabled = dark;
  }
  let theme = null;
  try { theme = localStorage.getItem('bonkscape-wiki-theme'); } catch (e) { /* storage blocked */ }
  applyTheme(theme);
  $('#theme').addEventListener('click', () => {
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('bonkscape-wiki-theme', theme); } catch (e) { /* storage blocked */ }
    applyTheme(theme);
  });
  $('#menu').addEventListener('click', () => app.classList.toggle('open'));
  nav.addEventListener('click', (ev) => { if (ev.target.closest('a')) app.classList.remove('open'); });

  // ------------------------------------------------------------ start

  window.addEventListener('hashchange', show);
  fetch('api/nav', { cache: 'no-store' }).then((r) => r.json()).then((data) => {
    navData = data;
    flat = [];
    for (const s of data) for (const p of s.pages) flat.push({ section: s.key, slug: p.slug, title: p.title });
    show();
  }).catch((e) => { page.innerHTML = '<p class="error">Couldn\'t reach the wiki server: ' + esc(String(e)) + '</p>'; });
})();
