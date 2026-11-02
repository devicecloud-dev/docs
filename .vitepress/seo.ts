/**
 * Per-page SEO: a description for each page, plus canonical and social tags.
 *
 * A page's description is its `description:` front matter if it has one.
 * Otherwise it's the page's first paragraph of prose, shortened to fit in a
 * search result. To change what Google shows for a page, add front matter:
 *
 *   ---
 *   description: One or two sentences about this page.
 *   ---
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HeadConfig, PageData } from 'vitepress';

export const SITE = 'https://docs.devicecloud.dev';
const MAX = 160;

/** Turns inline Markdown into plain text. */
export function plain(md: string) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|\W)[*_](.+?)[*_](?=\W|$)/g, '$1$2')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The first paragraph of prose after the title: not a heading, list, table, code or callout. */
export function firstParagraph(source: string) {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<!--[\s\S]*?-->/g, '');
  const lines = body.split('\n');
  let inFence = false;
  let inBlock = 0;
  let para: string[] = [];
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    if (/^:{3,}\s*\S/.test(line)) inBlock++;
    else if (/^:{3,}\s*$/.test(line)) inBlock = Math.max(0, inBlock - 1);
    if (inBlock || /^:{3,}/.test(line)) continue;
    if (line.trim() === '') {
      if (para.length) break;
      continue;
    }
    if (/^\s*(#|\||[-*+] |\d+\. |<|!\[|>|```|---$|==)/.test(line)) {
      if (para.length) break;
      continue;
    }
    para.push(line);
  }
  // A sentence that leads into a list or code block ("…as follows:") ends with a full stop instead.
  return plain(para.join(' ')).replace(/:$/, '.');
}

export function shorten(text: string, max = MAX) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s—-]+$/, '') + '…';
}

/** For transformPageData: fill in pageData.description from the page itself. */
export function describe(pageData: PageData, srcDir: string) {
  if (pageData.frontmatter.description) return;
  const text = firstParagraph(readFileSync(join(srcDir, pageData.filePath), 'utf8'));
  if (text) pageData.description = shorten(text);
}

/** Public URL path of a page, from its rewritten path (e.g. "cli-reference/cloud.md"). */
export const pathOf = (relativePath: string) =>
  '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');

/** Markdown copy of a page (see llms.ts). The home page's copy is /index.md. */
export const markdownPathOf = (relativePath: string) => {
  const p = pathOf(relativePath);
  return (p === '/' ? '/index' : p) + '.md';
};

/** For transformHead: canonical URL, social tags, and the Markdown alternate. */
export function headFor(pageData: PageData, siteTitle: string): HeadConfig[] {
  const url = SITE + pathOf(pageData.relativePath);
  const title = pageData.relativePath === 'index.md' ? `${siteTitle} Docs` : `${pageData.title} | ${siteTitle}`;
  const description = pageData.frontmatter.description ?? pageData.description;
  return [
    ['link', { rel: 'canonical', href: url }],
    ['link', { rel: 'alternate', type: 'text/markdown', href: SITE + markdownPathOf(pageData.relativePath) }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { name: 'twitter:title', content: title }],
    ...(description
      ? ([
          ['meta', { property: 'og:description', content: description }],
          ['meta', { name: 'twitter:description', content: description }],
        ] as HeadConfig[])
      : []),
  ];
}
