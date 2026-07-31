#!/usr/bin/env node
/**
 * Post-build checks on dist/.
 *
 * Each assertion here corresponds to a bug that actually shipped at some point
 * during the Astro migration, so they are worth keeping as a regression net:
 *   - cross-guide links pointing at the pre-Astro `<slug>.html` paths (404s)
 *   - in-page anchors that no longer resolve after a section was renamed
 *   - `&amp;` surviving in frontmatter and rendering literally in the TOC
 *   - the legacy redirect stubs going missing or pointing nowhere
 *
 * Usage: npm run verify   (runs automatically in CI after the build)
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = '/system-design-guide';
const failures = [];

const fail = (page, msg) => failures.push(`${page}: ${msg}`);

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST}/ not found — run \`npm run build\` first.`);
  process.exit(1);
}

const pages = htmlFiles(DIST);

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const name = file.replace(`${DIST}/`, '');
  const isRedirectStub = /<meta http-equiv="refresh"/.test(html);

  // 1. No links to the pre-Astro flat .html routes, except the redirect stubs
  //    themselves and genuinely external URLs.
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:')) continue;
    if (href.endsWith('.html') && !isRedirectStub) {
      fail(name, `links to legacy path ${href}`);
    }
  }

  if (isRedirectStub) {
    // 2. Every redirect stub must point at a page that exists.
    const target = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    if (!target) fail(name, 'redirect stub has no canonical target');
    else {
      const rel = target.replace(BASE, '').replace(/^\//, '');
      const dest = join(DIST, rel, rel.endsWith('/') || rel === '' ? 'index.html' : '');
      if (!existsSync(dest)) fail(name, `redirect target does not exist: ${target}`);
    }
    continue;
  }

  // 3. Every in-page anchor resolves to an id on that page.
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
    if (anchor && !ids.has(anchor)) fail(name, `broken in-page anchor #${anchor}`);
  }

  // 4. Entities must not survive into rendered text (YAML is not entity-decoded,
  //    so `&amp;` in frontmatter used to print literally in the sidebar).
  if (html.includes('&amp;amp;')) fail(name, 'literal &amp; in rendered output');
}

const guideCount = pages.filter((p) => p.includes(`${DIST}/guides/`)).length;
if (guideCount !== 12) failures.push(`expected 12 guide pages, found ${guideCount}`);

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s) in ${DIST}/:\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(`✓ ${pages.length} pages checked — links, anchors, entities and redirects all clean.`);
