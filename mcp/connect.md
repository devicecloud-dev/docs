---
description: "Connect Claude Code, Cursor, VS Code, Claude Desktop, Codex or another MCP client to DeviceCloud, through the hosted MCP server or the dcd CLI."
---

# Connect an AI Agent

DeviceCloud's [MCP](https://modelcontextprotocol.io) server lets an AI agent, such as Claude Code, Cursor, VS Code, Claude Desktop or Codex, drive cloud devices and run cloud tests. You connect it in one of two ways:

| | Install | Tools | Use it when |
| --- | --- | --- | --- |
| **Hosted**, `https://api.devicecloud.dev/mcp` | nothing | device tools | the agent drives cloud devices with apps and flows you've already uploaded |
| **`dcd mcp`**, through the CLI | the CLI | device tools and the `dcd_*` cloud-test tools | the agent also installs local builds, runs local flow files or runs cloud tests |

::: info
The device tools are in beta, and need device sessions turned on for your organization: contact support to turn them on. If your team has them, **Settings → AI agents** in the console fills in everything on this page for you, with one-click install for Cursor and VS Code.
:::

::: warning
We accept no liability for anything your agent may read or execute. LLMs are a new technology: use them with care and at your own risk.
:::

## Hosted server

The server is at `https://api.devicecloud.dev/mcp` (Streamable HTTP). The first time your client connects, it opens the DeviceCloud console in your browser: sign in, pick the organization the agent should use, and choose **Connect**.

### Claude Code

```bash
claude mcp add --scope user --transport http devicecloud https://api.devicecloud.dev/mcp
```

Then run `/mcp` in Claude Code and choose **devicecloud** to sign in.

### Cursor

Add the server to `~/.cursor/mcp.json`, next to any servers already in it:

```json
{
  "mcpServers": {
    "devicecloud": { "url": "https://api.devicecloud.dev/mcp" }
  }
}
```

### VS Code

```bash
code --add-mcp '{"name":"devicecloud","type":"http","url":"https://api.devicecloud.dev/mcp"}'
```

Or add it to `.vscode/mcp.json`, or to your user `mcp.json` (**MCP: Open User Configuration** in the Command Palette):

```json
{
  "servers": {
    "devicecloud": { "type": "http", "url": "https://api.devicecloud.dev/mcp" }
  }
}
```

### Claude Desktop

Open **Settings → Connectors** and choose **Add custom connector**. Name it DeviceCloud and paste `https://api.devicecloud.dev/mcp`. Claude Desktop's config file only takes servers that run on your machine, so the hosted server goes here. Free Claude plans allow one custom connector.

### Codex

```bash
codex mcp add devicecloud --url https://api.devicecloud.dev/mcp
codex mcp login devicecloud
```

Or add it to `~/.codex/config.toml`, then run `codex mcp login devicecloud`:

```toml
[mcp_servers.devicecloud]
url = "https://api.devicecloud.dev/mcp"
```

The Codex CLI, IDE extension and ChatGPT desktop app share this file, so one setup covers all three.

### Other clients

Any client that supports Streamable HTTP and MCP sign-in (OAuth) can connect to `https://api.devicecloud.dev/mcp`. It finds the sign-in from the server's `401` response, registers itself, and opens the console for you to approve it.

### Read-only

Add `?read_only=true` to the URL for a server that offers only the tools that change nothing: `list_devices`, `get_device_status`, `inspect_screen`, `take_screenshot`, `get_command_status`, `get_logs`, `get_human_status` and `cheat_sheet`. Your agent can look at your organization's devices but can't start, drive or stop them.

On a command line, quote the URL, because `?` is a wildcard in zsh, the default macOS shell:

```bash
claude mcp add --scope user --transport http devicecloud 'https://api.devicecloud.dev/mcp?read_only=true'
```

::: warning
Read-only keeps an agent from changing anything by mistake. It isn't a permission: the same sign-in works on the URL without the flag.
:::

### With an API key

For an agent that can't open a browser, such as one running in CI, send an [API key](../getting-started/api-keys.md) as a header instead of signing in:

```bash
claude mcp add --scope user --transport http devicecloud https://api.devicecloud.dev/mcp \
  --header "Authorization: Bearer <your-api-key>"
```

When you create a key for an agent, choose **Device sessions only** under [Access](../getting-started/api-keys.md#access). That key can start and drive devices, but it can't start test runs or read their results.

## Through the CLI: `dcd mcp`

`dcd mcp` runs on your machine and is started by your MCP client. It passes the hosted server's device tools through, and adds what only a local process can do: `install_app` takes `app_path`, a build on your machine, and `run` takes `path`, a flow file or a directory of flows. It also serves the `dcd_*` cloud-test tools from the [Tools Reference](tools.md).

1. Install the CLI, as in the [Quick Start](../getting-started/quickstart.md).
2. Sign in with [dcd login](../cli/dcd-login.md).
3. Add the server to your client:

```bash
dcd mcp install claude-code    # or claude-desktop, codex, cursor, vscode
```

If your dcd has no `dcd mcp`, or `dcd mcp install` doesn't list your client, update the CLI first (`dcd upgrade`, or `npm install -g @devicecloud.dev/dcd` for the npm package). Leave out the client to pick from a list. Add `--read-only` for a server that offers only the tools that change nothing, or `--print` to see what it would add without changing anything. For Claude Code, Codex and VS Code it runs their own `mcp add` command. For Claude Desktop and Cursor it adds an entry to their config file and keeps everything else in it. Restart the app afterwards.

### Setting it up by hand

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

Codex (`~/.codex/config.toml`):

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

`dcd mcp` signs in like the CLI: with your `dcd login` session, which it renews as it runs, or with `DEVICE_CLOUD_API_KEY` set in the server's `env`. For an agent that runs unattended, such as in CI, use an API key. For read-only, add `--read-only` after `mcp` in the arguments, or set `DCD_MCP_READONLY=1`.

## Connected apps

Every client you sign in to the hosted server is listed under **Settings → Account → Connected apps**, with the organization it uses and when it was last used. **Disconnect** stops it working at once. Device sessions it starts run as you.

## The older `dcd-mcp` server

The npm package also has `dcd-mcp`, an older server with the `dcd_*` tools only. `dcd mcp` serves the same tools, so you only need `dcd-mcp` for a setup that already uses it. See [MCP Server](overview.md).
