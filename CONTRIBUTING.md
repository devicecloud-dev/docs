# Contributing to the docs

The docs are built with [VitePress](https://vitepress.dev) and hosted on
Cloudflare Workers (static assets). Every push to `main` deploys.

## Run it locally

```bash
npm install
npm run dev        # live-reloading site at http://localhost:5173
npm run build      # build to .vitepress/dist
npm run check      # check every internal link and #anchor in the build
npm run preview    # build, then serve it the way Cloudflare does (redirects included)
```

## Add or move a page

1. Write the page as a normal Markdown file in the right folder.
2. Add it to `SUMMARY.md`. This file sets the sidebar order **and** the URL.

A page's URL is `/<section heading>/<page title>`, both slugified. For example,
`[Quick Start](getting-started/quickstart.md)` under `## Getting Started` is
served at `/getting-started/quick-start`. This matches the URLs GitBook used,
so old links keep working.

**Renaming a title or section heading changes the URL.** When you do, add a
redirect from the old URL to `public/_redirects`.

Link to other pages with relative `.md` paths, as before:
`[Device Matrix](../configuration/device-matrix.md#examples)`.

## Callouts and tabs

```md
::: info
A note.
:::

::: warning
Something to watch out for.
:::

::::tabs
== macOS / Linux
Content for the first tab.

== Windows
Content for the second tab.
::::
```

`::: tip` and `::: danger` also work. Put images in `assets/` and link them
with a relative path and alt text: `![What it shows](../assets/name.png)`.

## Search results and AI agents

Each page's search-result description is its first paragraph, shortened. If
that paragraph is a weak summary (for example, it just leads into a list), set
one in front matter. Quote it, because a colon inside breaks the YAML:

```md
---
description: "One or two sentences about what this page covers."
---
```

The build also writes plain-Markdown copies for AI tools: `/llms.txt` (an
index), `/llms-full.txt` (everything), and a `.md` copy of every page, such as
`/cli-reference/cloud.md`. You don't need to do anything for these.

Link to pages with real link text. `[Device Matrix](../configuration/device-matrix.md)`
is right, while `[device-matrix.md](...)` is caught by `npm run check`.
