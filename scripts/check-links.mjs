#!/usr/bin/env node
/**
 * Checks every internal link in the built site (.vitepress/dist): the page must
 * exist, and so must the #anchor on it. VitePress checks pages but not anchors.
 * Run after `npm run build`.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = '.vitepress/dist';
const files = readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html') && f !== '404.html');
const urlOf = (f) => '/' + f.replace(/\\/g, '/').replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');

const pages = new Map();
for (const f of files) {
  const html = readFileSync(join(DIST, f), 'utf8');
  const main = html.slice(html.indexOf('class="vp-doc'), html.indexOf('class="VPDocFooter') >>> 0);
  pages.set(urlOf(f), {
    ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    links: [...main.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')),
  });
}

let bad = 0;
for (const [url, { links }] of pages) {
  for (const href of links) {
    if (/^[a-z]+:|^\/\//.test(href) || href.startsWith('/assets/')) continue;
    const [path, hash] = href.split('#');
    const target = path === '' ? url : path.replace(/\/$/, '') || '/';
    const page = pages.get(target);
    if (!page) { console.log(`${url}: no page for ${href}`); bad++; continue; }
    if (hash && !page.ids.has(decodeURIComponent(hash))) { console.log(`${url}: no #${hash} on ${target}`); bad++; }
  }
}
console.log(bad ? `\n${bad} broken link(s).` : `All internal links OK across ${pages.size} pages.`);
process.exit(bad ? 1 : 0);
