---
description: "Connect Claude Code, Cursor, VS Code, Claude Desktop, Codex or another MCP client to DeviceCloud with dcd mcp, on your machine or headless in CI."
---

# Connect an AI Agent

DeviceCloud has three [MCP](https://modelcontextprotocol.io) servers. Most setups need only `dcd mcp`, which this page sets up.

| Server | Where it runs | What it serves |
|---|---|---|
| `dcd mcp` | On your machine or in CI, started by your MCP client. It comes with the [CLI](../cli/overview.md) | The `dcd_*` [cloud test tools](tools.md). Teams in the [Agent Devices](agent-devices.md) beta also get the device tools through it |
| `https://api.devicecloud.dev/mcp` | Hosted by DeviceCloud. Your MCP client signs in through your browser | The device tools only, for teams in the Agent Devices beta. See [Connect your agent](agent-devices.md#connect-your-agent) |
| `dcd-mcp` | On your machine, from the npm package only | The `dcd_*` tools only. It's the [older server](overview.md): new setups use `dcd mcp` |

`dcd mcp` lets an AI agent, such as Claude Code, Cursor, VS Code, Claude Desktop or Codex, run cloud tests and read their results. It works the same on your machine and headless, such as in CI.

You don't run it yourself. You add it to your MCP client's config, and the client starts it.

::: warning
We accept no liability for anything your agent may read or execute. LLMs are a new technology: use them with care and at your own risk.
:::

## Set it up

1. Install the CLI, as in the [Quick Start](../getting-started/quickstart.md).
2. Sign in with [dcd login](../cli/dcd-login.md). For an agent that runs without you, use an API key instead: see [Headless, with an API key](#headless-with-an-api-key).
3. Add the server to your client:

```bash
dcd mcp install claude-code    # or claude-desktop, codex, cursor, vscode
```

If your dcd has no `dcd mcp`, or `dcd mcp install` doesn't list your client, update the CLI first (`dcd upgrade`, or `npm install -g @devicecloud.dev/dcd` for the npm package). Leave out the client to pick from a list. Add `--read-only` for a server that offers only the tools that change nothing, or `--print` to see what it would add without changing anything.

For Claude Code, Codex and VS Code, `dcd mcp install` runs the client's own command: `claude mcp add`, `codex mcp add` or `code --add-mcp`. For Claude Desktop and Cursor, it adds an entry to their config file and keeps everything else in it. In Claude Code, Codex, Claude Desktop and Cursor, it replaces an entry already named `devicecloud`, such as one for the hosted server. Restart the app afterwards.

## Headless, with an API key

For an agent that runs without you, such as in CI or a script, sign in with an [API key](../getting-started/api-keys.md) instead of `dcd login`. Give it to the server as `DEVICE_CLOUD_API_KEY` in its environment. For example, for Claude Code in CI:

```bash
claude mcp add --scope user devicecloud -e DEVICE_CLOUD_API_KEY="$DEVICE_CLOUD_API_KEY" -- dcd mcp
```

In a JSON config, put it in the server's `env`:

```json
{
  "mcpServers": {
    "devicecloud": {
      "command": "/Users/you/.dcd/bin/dcd",
      "args": ["mcp"],
      "env": { "DEVICE_CLOUD_API_KEY": "<your-api-key>" }
    }
  }
}
```

::: info
Store the key as a secret in your CI provider (for example, a GitHub Actions secret). Never commit it to your repository.
:::

## Setting it up by hand

Start dcd by its **full path**. Desktop apps are usually opened from the Dock or Start menu, so they don't see the `PATH` your shell sets up, and a bare `dcd` fails with "command not found". The installer prints the path when it finishes. It's `~/.dcd/bin/dcd` by default, or `%USERPROFILE%\.dcd\bin\dcd.exe` on Windows. Write it out in full, because config files don't expand `~`.

The examples below use a macOS path. On Windows, write each backslash twice inside the quotes, as in `"C:\\Users\\you\\.dcd\\bin\\dcd.exe"`.

Claude Desktop (`claude_desktop_config.json`, in `~/Library/Application Support/Claude/` on macOS or `%APPDATA%\Claude\` on Windows) and Cursor (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "devicecloud": {
      "command": "/Users/you/.dcd/bin/dcd",
      "args": ["mcp"]
    }
  }
}
```

VS Code (`.vscode/mcp.json`, or your user `mcp.json`):

```json
{
  "servers": {
    "devicecloud": {
      "type": "stdio",
      "command": "/Users/you/.dcd/bin/dcd",
      "args": ["mcp"]
    }
  }
}
```

Codex (`~/.codex/config.toml`, shared by the Codex CLI, IDE extension and ChatGPT desktop app):

```toml
[mcp_servers.devicecloud]
command = "/Users/you/.dcd/bin/dcd"
args = ["mcp"]
```

Claude Code and the Codex CLI run from a terminal, so they do see your `PATH`:

```bash
claude mcp add --scope user devicecloud -- dcd mcp
codex mcp add devicecloud -- dcd mcp
```

To run the npm package instead of an installed dcd, use `npx` as the command, with the arguments `-y`, `@devicecloud.dev/dcd` and `mcp`. That needs Node 22 or later.

`dcd mcp` signs in like the CLI: with your `dcd login` session, which it renews as it runs, or with `DEVICE_CLOUD_API_KEY`. A `dcd login` session still ends 30 days after you log in, or after 7 days without use, so use an API key for a server that stays running. See [Session limits](../security/security-overview.md#sessions).

With a `dcd login` session, the server works in your active team, the one [`dcd switch-org`](../cli/dcd-login.md#dcd-switch-org) sets. After you switch teams, restart your MCP client: a running server can keep using the old team for up to an hour.

## Tools

::: warning
The `dcd_*` tools are in beta, so they may change.
:::

`dcd mcp` serves the `dcd_*` tools: list devices, submit a cloud test run, list recent runs, check a run's status and download its artifacts. [Cloud Test Tools](tools.md) describes each one.

If your team is in the [Agent Devices](agent-devices.md) beta, `dcd mcp` also serves the device tools, which start and drive cloud devices. It passes them through from the hosted server, and adds what only a local process can do: `install_app` takes `app_path`, a build on your machine, and `run` takes `path`, a flow file or a directory of flows. [Agent Devices Tools](agent-devices-tools.md) describes each one.

## Read-only mode

`dcd_run_cloud_test` starts a test run, which is billable. For an agent that should only look, add `--read-only` after `mcp` in the arguments, or set `DCD_MCP_READONLY=1`. The server then leaves out every tool that changes anything, including the device tools that start, drive or stop a device. `dcd_download_artifacts` stays, because it only writes files on your machine.

## The older `dcd-mcp` server

The npm package also has `dcd-mcp`, an older server with the same `dcd_*` tools but no device tools. `dcd mcp` covers it, so you only need `dcd-mcp` for a setup that already uses it. See [Older dcd-mcp Server](overview.md).
