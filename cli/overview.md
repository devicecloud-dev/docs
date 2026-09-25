# CLI Reference

The DCD CLI is the primary way to interact with DeviceCloud from your terminal or CI/CD pipeline. It is a drop-in replacement for `maestro cloud` — in most cases you can swap `maestro cloud` for `dcd cloud`.

The CLI is published as `@devicecloud.dev/dcd` on npm and as a standalone binary. The npm package also ships an [MCP server](../mcp/overview.md) (`dcd-mcp`) so AI agents can drive DeviceCloud directly. The standalone binary doesn't include the MCP server.

{% hint style="info" %}
**New in v5:** browser-based [`dcd login`](dcd-login.md) (no more passing a key on every command), a standalone binary installer with `dcd upgrade`, interactive [`dcd live`](dcd-live.md) device sessions, and an [MCP server](../mcp/overview.md). Existing API keys and `dcd cloud` usage continue to work unchanged.
{% endhint %}

## Installation

The recommended install is the standalone binary — it has no dependencies and doesn't require Node.

{% tabs %}
{% tab title="macOS / Linux" %}
```bash
curl -fsSL https://get.devicecloud.dev/install.sh | sh
```
{% endtab %}

{% tab title="Windows" %}
```powershell
irm https://get.devicecloud.dev/install.ps1 | iex
```
{% endtab %}

{% tab title="npm" %}
Requires Node 22 or newer.

```bash
npm install -g @devicecloud.dev/dcd
```
{% endtab %}
{% endtabs %}

In CI, you can skip a separate install step and run the CLI directly with `npx`:

```bash
npx --yes @devicecloud.dev/dcd@latest cloud <app-file> <flows-dir>
```

## Upgrading

If you installed the standalone binary, update it in place:

```bash
dcd upgrade
```

If you installed via npm, upgrade with npm instead:

```bash
npm install -g @devicecloud.dev/dcd@latest
```

{% hint style="info" %}
`dcd upgrade` is only for binary installs. Automatic upgrade is not yet supported on Windows — re-run the PowerShell installer to update.
{% endhint %}

## Authentication

There are two ways to authenticate. See [Authentication](../getting-started/api-keys.md) for full detail.

- **`dcd login`** (recommended for local use) — authenticate once in your browser. The CLI stores a session, so you don't have to pass a key on every command, and it unlocks live test updates.
- **API key** (recommended for CI/headless) — set the `DEVICE_CLOUD_API_KEY` environment variable, or pass `--api-key <key>` on any command.

```bash
# Local: log in once
dcd login

# CI / headless: provide an API key
export DEVICE_CLOUD_API_KEY=your-api-key
```

When both are present, precedence is: `--api-key` flag → `DEVICE_CLOUD_API_KEY` env var → stored `dcd login` session.

## Commands

| Command | Description |
|---------|-------------|
| [`dcd cloud`](dcd-cloud.md) | Upload an app and run Maestro flows on DeviceCloud |
| [`dcd upload`](dcd-upload.md) | Upload an app binary and get a reusable binary ID |
| [`dcd status`](dcd-status.md) | Check the status of a test upload |
| [`dcd list`](dcd-list.md) | List recent uploads for your organisation |
| [`dcd artifacts`](dcd-artifacts.md) | Download artifacts or reports for a completed run |
| [`dcd login`](dcd-login.md) | Authenticate via your browser |
| [`dcd logout`](dcd-login.md#dcd-logout) | Clear the stored session |
| [`dcd whoami`](dcd-login.md#dcd-whoami) | Show the logged-in user and active organisation |
| [`dcd switch-org`](dcd-login.md#dcd-switch-org) | Switch the active organisation |
| [`dcd live`](dcd-live.md) | Start and interact with a live device session (beta) |
| `dcd upgrade` | Upgrade the standalone binary in place |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DEVICE_CLOUD_API_KEY` | API key to use when `--api-key` isn't passed. Takes precedence over a `dcd login` session |
| `DCD_CONFIG_DIR` | Directory for the `dcd login` session file (default `$XDG_CONFIG_HOME/dcd`, or `~/.dcd`) |
| `DCD_ENCRYPT` | Set to `1` to make `dcd cloud` (and the MCP server) encrypt the app binary, flows and `--env` values on your machine before upload, the same as passing `--encrypt` |
| `DCD_TELEMETRY_DISABLED` | Set to `1` to turn off [telemetry](#telemetry) |
| `DCD_API_URL` | MCP server only. The API base URL to use (CLI commands take `--api-url` instead) |
| `DCD_MCP_READONLY` | MCP server only. Set to `1` for [read-only mode](../mcp/overview.md#read-only-mode) |

The standalone binary installers also read these:

| Variable | Description |
|----------|-------------|
| `DCD_VERSION` | Install a specific version instead of the latest stable release, e.g. `5.5.0` |
| `DCD_BETA` | Set to `1` to install the latest beta |
| `DCD_INSTALL_DIR` | Where to install the binary (default `~/.dcd/bin`, or `$env:USERPROFILE\.dcd\bin` on Windows) |

```bash
curl -fsSL https://get.devicecloud.dev/install.sh | DCD_VERSION=5.5.0 sh
```

## Telemetry

The CLI sends usage and error events to DeviceCloud to help us find and fix problems. Only commands that authenticate send anything — `--help`, `--version` and `dcd whoami`, for example, don't. Events include:

- the command and its arguments, with the values of `--api-key`, `--app-url` and `--env` / `-e` redacted
- how long the command took and its exit code
- the error message and stack trace when a command fails
- the names, durations and errors of [MCP server](../mcp/overview.md) tool calls
- the CLI version, install method (binary or npm), Node version, operating system and architecture, a random ID for the invocation and, with `dcd login`, your email address and team ID

To opt out, set `DCD_TELEMETRY_DISABLED=1`.

## Getting Help

```bash
dcd --help
dcd cloud --help
dcd live --help
```
