/**
 * Plain-Markdown copies of the docs for AI agents and LLM tools, written into
 * the build output:
 *
 *   /llms.txt          an index of every page, per https://llmstxt.org
 *   /llms-full.txt     every page in one file
 *   /<page>.md         each page on its own, e.g. /cli-reference/cloud.md
 *
 * VitePress-only syntax is turned into standard Markdown: callouts become
 * blockquotes, tabs become bold labels, and links become absolute .md URLs.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import type { Section } from './summary';
import { SITE, firstParagraph, markdownPathOf, shorten } from './seo';

const LABELS: Record<string, string> = { info: 'Note', tip: 'Tip', warning: 'Warning', danger: 'Danger' };

interface Page {
  file: string; // source path, e.g. cli/dcd-cloud.md
  title: string;
  description: string;
  markdown: string;
}

export function writeLlmsFiles(opts: {
  outDir: string;
  srcDir: string;
  rewrites: Record<string, string>;
  sections: Section[];
  siteTitle: string;
  siteDescription: string;
}) {
  const { outDir, srcDir, rewrites, sections } = opts;
  const assets = readdirSync(join(outDir, 'assets'));
  const mdUrl = (file: string) => SITE + markdownPathOf(rewrites[file]);

  const load = (file: string): Page => {
    const source = readFileSync(join(srcDir, file), 'utf8');
    const fm = source.match(/^---\n([\s\S]*?)\n---\n/);
    const fmDescription = fm?.[1].match(/^description:\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g, '');
    const markdown = toPlainMarkdown(source.slice(fm ? fm[0].length : 0), file, rewrites, assets, mdUrl);
    const title = markdown.match(/^# (.+)$/m)?.[1].trim() ?? file;
    return { file, title, description: fmDescription ?? shorten(firstParagraph(source)), markdown };
  };

  const home = load('README.md');
  const groups = sections.map((s) => ({ name: s.text, pages: s.items.map((i) => load(i.file)) }));
  const all = [home, ...groups.flatMap((g) => g.pages)];

  for (const page of all) {
    const out = join(outDir, markdownPathOf(rewrites[page.file]));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page.markdown);
  }

  const entry = (p: Page) => `- [${p.title}](${mdUrl(p.file)})${p.description ? `: ${p.description}` : ''}`;
  const index = [
    `# ${opts.siteTitle}`,
    '',
    `> ${opts.siteDescription}`,
    '',
    home.description,
    '',
    `Every page is also available as Markdown: add \`.md\` to its URL. All pages in one file: ${SITE}/llms-full.txt`,
    '',
    ...groups.flatMap((g) => [`## ${g.name}`, '', ...g.pages.map(entry), '']),
  ].join('\n');
  writeFileSync(join(outDir, 'llms.txt'), index);

  const full = all.map((p) => `<!-- Source: ${mdUrl(p.file)} -->\n\n${p.markdown.trim()}\n`).join('\n---\n\n');
  writeFileSync(join(outDir, 'llms-full.txt'), full);

  return all.length;
}

function toPlainMarkdown(
  body: string,
  file: string,
  rewrites: Record<string, string>,
  assets: string[],
  mdUrl: (file: string) => string,
) {
  const out: string[] = [];
  let fence: string | null = null;
  let quote: string | null = null; // label of the callout we're inside, if any

  for (const line of body.split('\n')) {
    const fenceMark = line.match(/^\s*(```+|~~~+)/)?.[1];
    if (fenceMark) {
      if (!fence) fence = fenceMark;
      else if (fenceMark.startsWith(fence)) fence = null;
      out.push(quote ? `> ${line}` : line);
      continue;
    }
    if (fence) {
      out.push(quote ? `> ${line}` : line);
      continue;
    }

    const open = line.match(/^:::\s*(info|tip|warning|danger)\b\s*(.*)$/);
    if (open) {
      quote = LABELS[open[1]];
      out.push(`> **${open[2].trim() || quote}:**`, '>');
      continue;
    }
    if (/^:{4,}tabs\s*$/.test(line) || /^:{4,}\s*$/.test(line)) continue;
    if (/^:::\s*$/.test(line)) {
      quote = null;
      continue;
    }
    const tab = line.match(/^==\s+(.+)$/);
    if (tab) {
      out.push(`**${tab[1].trim()}**`);
      continue;
    }

    const text = rewriteLinks(line, file, rewrites, assets, mdUrl);
    out.push(quote ? (text ? `> ${text}` : '>') : text);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function rewriteLinks(
  line: string,
  file: string,
  rewrites: Record<string, string>,
  assets: string[],
  mdUrl: (file: string) => string,
) {
  return line.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (match, bang, text, href) => {
    if (/^[a-z]+:|^#|^\//i.test(href)) return match;
    const [path, hash] = href.split('#');
    const target = posix.normalize(posix.join(posix.dirname(file), decodeURI(path)));
    if (bang) {
      // Images are content-hashed in the build: assets/name.png -> /assets/name.<hash>.png
      const base = posix.basename(target).replace(/\.[^.]+$/, '');
      const ext = posix.extname(target);
      const built = assets.find((a) => a.startsWith(base + '.') && a.endsWith(ext));
      return built ? `![${text}](${SITE}/assets/${built})` : match;
    }
    if (!rewrites[target]) return match;
    return `[${text}](${mdUrl(target)}${hash ? '#' + hash : ''})`;
  });
}
