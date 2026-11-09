---
description: "Connect Claude Code, Cursor, VS Code, Claude Desktop, Codex or another MCP client to DeviceCloud with dcd mcp, on your machine or headless in CI."
---

# Connect an AI Agent

`dcd mcp` is DeviceCloud's [MCP](https://modelcontextprotocol.io) server. It lets an AI agent, such as Claude Code, Cursor, VS Code, Claude Desktop or Codex, run cloud tests and read their results. It comes with the [CLI](../cli/overview.md), and it works the same on your machine and headless, such as in CI.

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

If your dcd has no `dcd mcp`, or `dcd mcp install` doesn't list your client, update the CLI first (`dcd upgrade`, or `npm install -g @devicecloud.dev/dcd` for the npm package). Leave out the client to pick from a list. Add `--read-only` for a server that offers only the tools that change nothing, or `--print` to see what it would add without changing anything. For Claude Code, Codex and VS Code it runs their own `mcp add` command. For Claude Desktop and Cursor it adds an entry to their config file and keeps everything else in it. Restart the app afterwards.

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

Start dcd by its **full path**. Desktop apps are usually opened from the Dock or Start menu, so they don't see the `PATH` your shell sets up, and a bare `dcd` fails with "command not found". The installer prints the path when it finishes. It's `~/.dcd/bin/dcd` by default, written out in full, because config files don't expand `~`.

Claude Desktop (`claude_desktop_config.json`) and Cursor (`~/.cursor/mcp.json`):

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

`dcd mcp` signs in like the CLI: with your `dcd login` session, which it renews as it runs, or with `DEVICE_CLOUD_API_KEY`.

## Tools

`dcd mcp` serves the `dcd_*` tools: list devices, submit a cloud test run, follow its status and download its artifacts. The [Tools Reference](tools.md) describes each one.

`dcd_run_cloud_test` starts a test run, which is billable. For an agent that should only look, add `--read-only` after `mcp` in the arguments, or set `DCD_MCP_READONLY=1`. The server then leaves out every tool that changes anything.

## The older `dcd-mcp` server

The npm package also has `dcd-mcp`, an older server with the same `dcd_*` tools. `dcd mcp` covers it, so you only need `dcd-mcp` for a setup that already uses it. See [MCP Server](overview.md).
