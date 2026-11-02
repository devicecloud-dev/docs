# DeviceCloud docs

Public docs for DeviceCloud, served at https://docs.devicecloud.dev. Built with
VitePress and deployed to Cloudflare Workers on every push to `main`. See
CONTRIBUTING.md for how to run, write and add pages.

## Rules that break things if missed

- **`SUMMARY.md` sets each page's URL**: `/<section heading>/<page title>`,
  both slugified. Renaming a heading or page title there changes the URL, so
  the same PR must add a redirect from the old URL in `public/_redirects`.
  Moving or renaming a `.md` file doesn't change its URL. Only `SUMMARY.md` does.
- **Every page must be listed in `SUMMARY.md`.** A page that isn't is not
  published, and links to it fail the build.
- **Link between pages with relative `.md` paths and real link text**:
  `[Device Matrix](../configuration/device-matrix.md#examples)`. Don't use a
  file name as the link text. `npm run check` fails on broken pages, broken
  `#anchors` and file-name link text.
- **`security/ip-addresses.md` is generated** from the IP-addresses API by
  `.github/scripts/render-ip-addresses.mjs`. Never edit it by hand. Change the
  script instead.
- **Callouts and tabs use VitePress syntax** (`::: info`, `::: warning`,
  `::::tabs` with `== Tab name`). GitBook syntax (`{% hint %}`, `{% tabs %}`)
  no longer renders.

## Writing style

- Plain language, short sentences.
- Commands, flags and config keys must match the current `dcd` CLI and API.
  Flag a doc change that names a flag, input or endpoint the rest of the docs
  don't use, so a reviewer can confirm it exists.
