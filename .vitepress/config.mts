import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { ROOT, readSummary, repoPathRedirects, sourceRelativeLinks } from './summary';

const { sections, rewrites } = readSummary();

export default defineConfig({
  title: 'DeviceCloud',
  description: 'Documentation for DeviceCloud, the fast and affordable Maestro Cloud alternative.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://docs.devicecloud.dev' },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#121419' }],
    // Same fonts as devicecloud.dev. Inter ships with VitePress; this adds the mono.
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fragment+Mono&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'DeviceCloud Docs' }],
    ['meta', { property: 'og:image', content: 'https://docs.devicecloud.dev/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // Pages live where they always have; SUMMARY.md maps them to their public URLs.
  srcDir: '.',
  srcExclude: ['SUMMARY.md', 'CONTRIBUTING.md', 'CLAUDE.md', 'AGENTS.md', '.github/**', 'node_modules/**'],
  rewrites,

  // GitBook also answered at each page's repo path (/ci-cd/github-actions), so
  // keep those working too. public/_redirects holds the hand-written ones.
  buildEnd({ outDir }) {
    appendFileSync(join(outDir, '_redirects'), '\n# Generated from SUMMARY.md\n' + repoPathRedirects(rewrites));
  },

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(sourceRelativeLinks(rewrites, ROOT));
      // Inline code like `${{ github.sha }}` must render literally, not as a
      // Vue template expression. (Fenced code blocks are already protected.)
      const codeInline = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (tokens, idx, ...rest) => {
        tokens[idx].attrSet('v-pre', '');
        return codeInline(tokens, idx, ...rest);
      };
    },
  },

  themeConfig: {
    // The wordmark already says "DeviceCloud". The top bar is always dark, like
    // devicecloud.dev, so the white logo is used in both colour modes.
    logo: '/logo-dark.png',
    siteTitle: 'Docs',
    sidebar: sections.map((s) => ({
      text: s.text,
      collapsed: false,
      items: s.items.map((i) => ({ text: i.text, link: i.url })),
    })),
    outline: [2, 3],
    search: { provider: 'local' },
    editLink: {
      pattern: 'https://github.com/devicecloud-dev/docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Blog', link: 'https://devicecloud.dev/blog/' },
      { text: 'Changelog', link: 'https://devicecloud.dev/changelog/' },
      { text: 'Status', link: 'https://status.devicecloud.dev' },
      { text: 'Go to Console', link: 'https://console.devicecloud.dev' },
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/gm3mJwcNw8' },
      { icon: 'github', link: 'https://github.com/devicecloud-dev' },
    ],
  },
});
