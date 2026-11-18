# CLI Reference

The dcd CLI is the primary way to interact with DeviceCloud from your terminal or CI/CD pipeline. It is a drop-in replacement for `maestro cloud` — in most cases you can swap `maestro cloud` for `dcd cloud`.

The CLI is published as `@devicecloud.dev/dcd` on npm and as a standalone binary. Both include `dcd mcp`, an [MCP server](../mcp/connect.md) that lets AI agents run cloud tests and read their results.

## Installation

The recommended install is the standalone binary — it has no dependencies and doesn't require Node.

::::tabs
== macOS / Linux
```bash
curl -fsSL https://get.devicecloud.dev/install.sh | sh
```

== Windows
```powershell
irm https://get.devicecloud.dev/install.ps1 | iex
```

== npm
Requires Node 22 or newer.

```bash
npm install -g @devicecloud.dev/dcd
```
::::

In CI, you can skip a separate install step and run the CLI directly with `npx`:

```bash
npx --yes @devicecloud.dev/dcd@latest cloud <appFile> <flowFile>
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

::: info
`dcd upgrade` is only for binary installs. Automatic upgrade is not yet supported on Windows — re-run the PowerShell installer to update.

`dcd upgrade` stays on the release channel you installed from: a beta upgrades to the latest beta. To go back to the stable release, run the installer again without `DCD_BETA`.
:::

## Authentication

There are two ways to authenticate. See [Authentication](../getting-started/api-keys.md) for full detail.

- **`dcd login`** (recommended for local use) — authenticate once in your browser. The CLI stores a session, so you don't have to pass a key on every command.
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
| [`dcd list`](dcd-list.md) | List recent uploads for your team |
| [`dcd artifacts`](dcd-artifacts.md) | Download artifacts or reports for a completed run |
| [`dcd login`](dcd-login.md) | Authenticate via your browser |
| [`dcd logout`](dcd-login.md#dcd-logout) | Clear the stored session |
| [`dcd whoami`](dcd-login.md#dcd-whoami) | Show the logged-in user and active team |
| [`dcd switch-org`](dcd-login.md#dcd-switch-org) | Switch the active team |
| [`dcd device`](dcd-device.md) | Lease a cloud device, drive it and release it (beta) |
| [`dcd mcp`](../mcp/connect.md) | Run the DeviceCloud MCP server on stdio |
| [`dcd mcp install`](../mcp/connect.md#set-it-up) | Add the MCP server to Claude Code, Claude Desktop, Codex, Cursor or VS Code |
| [`dcd live`](dcd-live.md) | Deprecated: use `dcd device` |
| `dcd upgrade` | Upgrade the standalone binary in place |

Every command except the `dcd mcp` server takes `--json`, which prints one JSON object on stdout for scripts to read. Commands that call the API also take `--api-url`, which you only need for an environment other than production. See [Exit Codes](../advanced/exit-codes.md) for what each command's exit code means.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DEVICE_CLOUD_API_KEY` | API key to use when `--api-key` isn't passed. Takes precedence over a `dcd login` session |
| `DCD_CONFIG_DIR` | Directory for the `dcd login` session file (default `$XDG_CONFIG_HOME/dcd`, or `~/.dcd`) |
| `DCD_ENCRYPT` | `dcd cloud`, `dcd upload`, `dcd device` (when it uploads a local build) and the MCP server apply envelope encryption to the app binary, flows and `--env` values on your machine before upload by default. Set to `0` to turn it off, the same as passing `--no-encrypt`; uploads are still encrypted in transit. A flag on the command line takes precedence |
| `DCD_TELEMETRY_DISABLED` | Set to `1` to turn off [telemetry](#telemetry) |
| `DCD_API_URL` | MCP server only. The API base URL to use (CLI commands take `--api-url` instead) |
| `DCD_MCP_READONLY` | MCP server only. Set to `1` to offer only the tools that change nothing, the same as `dcd mcp --read-only` (see [Read-only mode](../mcp/connect.md#read-only-mode)) |

The standalone binary installers also read these:

| Variable | Description |
|----------|-------------|
| `DCD_VERSION` | Install a specific version instead of the latest stable release, e.g. `5.14.0` |
| `DCD_BETA` | Set to `1` to install the latest beta |
| `DCD_INSTALL_DIR` | Where to install the binary (default `~/.dcd/bin`, or `$env:USERPROFILE\.dcd\bin` on Windows) |

```bash
curl -fsSL https://get.devicecloud.dev/install.sh | DCD_VERSION=5.14.0 sh
```

## Telemetry

The CLI sends usage and error events to DeviceCloud to help us find and fix problems. Only commands that authenticate send anything — `--help`, `--version` and `dcd whoami`, for example, don't. Events include:

- the command and its arguments, with the values of `--api-key`, `--app-url` and `--env` / `-e`, the text you pass to `dcd device type` and the link you pass to `dcd device open-link`, redacted. Other values are sent as you typed them. CLI versions before 5.14.0 also sent the `dcd device type` text.
- how long the command took and its exit code
- the error message and stack trace when a command fails
- the names, durations and errors of [MCP server](../mcp/connect.md) tool calls
- the CLI version, install method (binary or npm), Node version, operating system and architecture, a random ID for the invocation and, with `dcd login`, your email address and team ID

To opt out, set `DCD_TELEMETRY_DISABLED=1`.

## Getting Help

```bash
dcd --help
dcd cloud --help
dcd device --help
```
