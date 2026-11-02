/**
 * Reads SUMMARY.md, the single source of truth for page order and the sidebar.
 *
 * Each page is served at /<section heading slug>/<page title slug>, the same
 * URL scheme GitBook used, so every link shared before the move keeps working.
 * Renaming a heading or page title in SUMMARY.md therefore CHANGES its URL:
 * add a redirect in public/_redirects when you do.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { posix, sep } from 'node:path';

export const ROOT = fileURLToPath(new URL('..', import.meta.url)).split(sep).join('/');
const SUMMARY = ROOT + 'SUMMARY.md';

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export interface Section {
  text: string;
  items: { text: string; file: string; url: string }[];
}

export function readSummary() {
  const sections: Section[] = [];
  const rewrites: Record<string, string> = {};
  let current: Section | undefined;

  for (const line of readFileSync(SUMMARY, 'utf8').split('\n')) {
    const heading = line.match(/^## (.+)/);
    const page = line.match(/^\* \[(.+?)\]\((.+?\.md)\)/);
    if (heading) {
      current = { text: heading[1], items: [] };
      sections.push(current);
    } else if (page) {
      const [, text, file] = page;
      if (file === 'README.md') {
        rewrites[file] = 'index.md';
        continue;
      }
      if (!current) throw new Error(`SUMMARY.md: page "${text}" is not under a "## " section`);
      const url = `${slugify(current.text)}/${slugify(text)}`;
      rewrites[file] = `${url}.md`;
      current.items.push({ text, file, url: `/${url}` });
    }
  }
  return { sections, rewrites };
}

/**
 * markdown-it plugin: resolves relative `.md` links against the SOURCE file
 * and points them at the page's public URL. VitePress alone would resolve them
 * against the rewritten URL, which breaks `./sibling.md` links.
 */
export function sourceRelativeLinks(rewrites: Record<string, string>, srcDir: string) {
  const toUrl = (target: string) => '/' + target.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
  return (md: any) => {
    const next = md.renderer.rules.link_open ?? ((t: any, i: number, o: any, _e: any, self: any) => self.renderToken(t, i, o));
    md.renderer.rules.link_open = (tokens: any[], idx: number, options: any, env: any, self: any) => {
      const href: string = tokens[idx].attrGet('href') ?? '';
      const m = href.match(/^([^:#?]+\.md)(#.*)?$/);
      if (m && !href.startsWith('/') && env.realPath) {
        const from = posix.relative(srcDir, env.realPath.split(sep).join('/'));
        const file = posix.normalize(posix.join(posix.dirname(from), decodeURI(m[1])));
        const target = rewrites[file];
        if (!target) throw new Error(`${from}: link to ${href} points at ${file}, which is not in SUMMARY.md`);
        tokens[idx].attrSet('href', toUrl(target) + (m[2] ?? ''));
      }
      return next(tokens, idx, options, env, self);
    };
  };
}

/** `_redirects` lines from each page's repo path to its public URL. */
export function repoPathRedirects(rewrites: Record<string, string>) {
  const url = (f: string) => '/' + f.replace(/\.md$/, '').replace(/^index$/, '');
  const live = new Set(Object.values(rewrites).map(url));
  return Object.entries(rewrites)
    .map(([from, to]) => [url(from), url(to)])
    .filter(([from, to]) => from !== to && !live.has(from))
    .map(([from, to]) => `${from} ${to} 301\n`)
    .join('');
}
