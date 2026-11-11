# Agent Devices

Agent Devices give your AI agent a real cloud iOS simulator or Android emulator to work on. Through DeviceCloud's hosted MCP server, an agent such as Claude Code, Cursor or Codex can start a device, install your app, look at the screen, tap and type, run Maestro flows, read the device logs, and ask a person for help when it gets stuck. You can watch every session live in the console and take over the device at any time.

::: warning
**Agent Devices are in a closed beta** and are billed at **$0.03/min**, excluding Sales Tax, the same as [Live sessions](../cli/dcd-live.md). Access is by request: contact support to have it turned on for your organization. Until it is, the hosted server offers your agent no tools.
:::

::: warning
We accept no liability for anything your agent may read or execute on a device. LLMs are a new technology: use them with care and at your own risk.
:::

## Connect your agent

The server is at `https://api.devicecloud.dev/mcp` (Streamable HTTP). The first time your MCP client connects, it opens the DeviceCloud console in your browser: sign in, pick the organization the agent should use, and click **Connect**.

In the console, **Settings → AI agents** shows these steps for your client, with one-click install links for Cursor and VS Code.

### Claude Code

```bash
claude mcp add --scope user --transport http devicecloud https://api.devicecloud.dev/mcp
```

Then run `/mcp` in Claude Code and choose **devicecloud** to sign in.

### Cursor

Add the server to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "devicecloud": {
      "url": "https://api.devicecloud.dev/mcp"
    }
  }
}
```

If the file already lists servers, add `devicecloud` alongside them. Cursor opens your browser to sign in the first time it connects.

### VS Code

Add the server to `.vscode/mcp.json`, or to your user `mcp.json` (run **MCP: Open User Configuration** from the Command Palette):

```json
{
  "servers": {
    "devicecloud": {
      "type": "http",
      "url": "https://api.devicecloud.dev/mcp"
    }
  }
}
```

VS Code opens your browser to sign in the first time the server starts.

### Claude Desktop

In Claude Desktop, open **Settings → Connectors** and choose **Add custom connector**. Name it DeviceCloud and paste `https://api.devicecloud.dev/mcp` as the URL. Claude opens your browser to sign in. Free Claude plans allow one custom connector.

### Codex

```bash
codex mcp add devicecloud --url https://api.devicecloud.dev/mcp
```

Codex opens your browser to sign in. If it doesn't, run `codex mcp login devicecloud`. The Codex CLI, IDE extension and ChatGPT desktop app share this setup (`~/.codex/config.toml`).

### Other MCP clients

Any client that supports Streamable HTTP and MCP sign-in (OAuth) can connect to `https://api.devicecloud.dev/mcp`. It finds the sign-in from the server's `401` response, registers itself, and opens the DeviceCloud console for you to approve it.

### Read-only

Add `?read_only=true` to the server URL for a connection that offers only the tools that change nothing. An agent connected this way can list devices and your organization's sessions, check a session, inspect its screen, take screenshots and read its logs. It can't start, drive or stop a device. In a terminal, quote the URL, because some shells treat `?` as a wildcard:

```bash
claude mcp add --scope user --transport http devicecloud 'https://api.devicecloud.dev/mcp?read_only=true'
```

Read-only guards against an agent's mistakes. It isn't a permission: the same sign-in without the flag gets every tool.

### Headless, through the CLI

For an agent that can't open a browser, such as one running in CI, use `dcd mcp` from the [DeviceCloud CLI](../cli/overview.md) with an [API key](../getting-started/api-keys.md). Give the key to the server as `DEVICE_CLOUD_API_KEY`:

```bash
claude mcp add --scope user devicecloud -e DEVICE_CLOUD_API_KEY="$DEVICE_CLOUD_API_KEY" -- dcd mcp
```

`dcd mcp` runs on your machine over stdio and passes the hosted server's tools through. It adds what only a local process can do: `install_app` takes `app_path`, a build on your machine to upload, and `run` takes `path`, a flow file or a directory of flows. It also serves the `dcd_*` tools for cloud test runs. Add `--read-only` after `mcp` to offer only the tools that change nothing.

On your own machine, `dcd mcp` can use your [`dcd login`](../cli/dcd-login.md) session instead of a key. `dcd mcp install` adds it to Claude Code, Claude Desktop, Cursor or VS Code for you.

::: info
When you create a key for an agent, choose **Device sessions only** under **Access**. Such a key can start and drive devices and upload builds, but it can't start test runs or read results. You can't change a key's access later.
:::

## Connected apps

Every client you sign in shows up under **Settings → Account → Connected apps**, with the organization it uses and when it was last used. **Disconnect** stops it working at once. Sessions it starts run as you, and the timeline shows which app sent each command.

## How an agent works with a device

1. `list_devices` shows the devices it can start, and any sessions already open.
2. `start_device` leases a device and waits up to a minute for it. If the fleet is busy, the session is queued, which isn't an error: it starts on its own, and the agent waits for it with `get_device_status`.
3. `install_app` installs a build you uploaded, or one at an HTTPS link. `launch_app` starts it.
4. The agent loops: `inspect_screen` to see what's on screen, then `tap_on`, `input_text`, `swipe` or `press_key` for one step, or `run` for several Maestro commands, then `inspect_screen` again. `take_screenshot` shows the screen as an image, and `get_logs` reads the app's device log.
5. `stop_device` releases the device when it's done.

Every response carries a short **session** block: the session's state, how long it has left, its cost so far, its page in the console, and plain-English warnings, such as an upcoming idle timeout or the app having crashed. The agent never needs a separate call to stay oriented. Agents are told to give you the session's console link as soon as they have it, so you can watch.

The full list of tools is in the [tool reference](agent-devices-tools.md). To teach your agent this loop, add the [agent instructions](agent-devices-skill.md) to your project.

## When the agent needs a person

Some things only a person can do: enter a 2FA code, solve a CAPTCHA, approve a payment sheet. The agent calls `request_human` with what it needs, and then:

- the session waits, and its idle timer pauses, for up to 30 minutes
- the agent tells you what it needs, with a link to the session
- your organization's [webhook](../notifications/webhook-notifications.md#device-needs-human) receives a `device.needs_human` event
- the session shows under **Needs you** on the **Devices** page in the console

Open the session and click its screen to take control. Do what the agent asked, then click **Hand back**, optionally with a note for the agent. The agent reads the note with `get_human_status` and carries on.

If nobody hands the session back in time, it ends.

## Watching and taking over

The **Devices** page in the console lists your organization's sessions: those that need you, those running, those queued, and those that ended in the last day.

Open one to watch it: the device's screen, and a script of every step the agent took, with the result of each and the screen after it. To step in, click **Pause agent**, or click the screen. While you have control, the agent's steps wait and run after you hand back, and any new command it sends is refused until then. Click the screen to tap, drag to swipe, use the buttons beside and under it (such as **Home**, **Back** on Android, and **Enter**), or type into the focused field. Tick **Secret** to keep what you type out of the timeline. **Resume agent** hands control back.

## Secrets

Never put a password or token into a flow's YAML. Pass it in `run`'s `env` and refer to it by name:

```yaml
- tapOn: "Password"
- inputText: ${PASSWORD}
```

with `env: { "PASSWORD": "..." }`. Values sent this way are encrypted before they're stored, they never appear in the timeline, and they're masked in the command's output and in `inspect_screen`.

## Recordings and artifacts

Each session is recorded on video by default (`record: false` on `start_device` turns it off). A screenshot and a screen dump are kept after every action, along with the device log. The session's page in the console links the screen after each step, and shows the video and device log once the session ends. [`dcd device artifacts`](../cli/dcd-device.md) downloads all of them, and the [REST API](../api/device-sessions.md#artifacts) lists them.

## Limits

| Limit | Default |
|-------|---------|
| Sessions open at once, per organization | 2 |
| Maximum session length | 60 minutes |
| Idle timeout (no commands) | 5 minutes |
| Waiting for a person | 30 minutes |
| Waiting in the queue | 15 minutes |

The idle timeout is fixed, and no session can run longer than 60 minutes. Contact support to change the other limits for your organization, or to set a monthly spend cap on device sessions.

## Pricing

Device time is billed at $0.03 per minute, in 30-second steps, from when a device is assigned to the session until the session ends. Time spent queued isn't billed. Your organization's discount applies.
