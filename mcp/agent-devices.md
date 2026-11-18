# Agent Devices

Agent Devices give your AI agent a real cloud iOS simulator or Android emulator to work on. Through DeviceCloud's hosted MCP server, an agent such as Claude Code, Cursor or Codex can start a device, install your app, look at the screen, tap and type, run Maestro flows, read the device logs, and ask a person for help when it gets stuck. You can watch every session live in the console and take over the device at any time.

::: warning
**Agent Devices are in a closed beta** and are billed at **$0.03/min**, excluding Sales Tax, the same as sessions you start with [`dcd device`](../cli/dcd-device.md). Access is by request: contact support to have it turned on for your team. Until it is, the hosted server offers your agent no tools.
:::

::: warning
We accept no liability for anything your agent may read or execute on a device. LLMs are a new technology: use them with care and at your own risk.
:::

## Connect your agent

The server is at `https://api.devicecloud.dev/mcp` (Streamable HTTP). The first time your MCP client connects, it opens the DeviceCloud console in your browser: sign in, choose the team the agent should use under **Organization**, and click **Connect**. Your client stays signed in while you use it. If it goes unused for 30 days, you sign in again.

In the console, **Settings → AI agents** shows these steps for your client when you choose **Hosted**, with one-click install links for Cursor and VS Code.

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

Add `?read_only=true` to the server URL for a connection that offers only the tools that change nothing. An agent connected this way can list devices and your team's sessions, check a session, inspect its screen, take screenshots and read its logs. It can't start, drive or stop a device. In a terminal, quote the URL, because some shells treat `?` as a wildcard:

```bash
claude mcp add --scope user --transport http devicecloud 'https://api.devicecloud.dev/mcp?read_only=true'
```

Read-only guards against an agent's mistakes. It isn't a permission: the same sign-in without the flag gets every tool.

### Headless, through the CLI

For an agent that can't open a browser, such as one running in CI, use `dcd mcp` from the [DeviceCloud CLI](../cli/overview.md) with an [API key](../getting-started/api-keys.md). Give the key to the server as `DEVICE_CLOUD_API_KEY`:

```bash
claude mcp add --scope user devicecloud -e DEVICE_CLOUD_API_KEY="$DEVICE_CLOUD_API_KEY" -- dcd mcp
```

`dcd mcp` runs on your machine over stdio and passes the hosted server's tools through. It adds what only a local process can do: `start_device` and `install_app` take `app_path`, a build on your machine to upload, `run` takes `path`, a flow file or a directory of flows, and `take_screenshot` with `full_size` takes `path`, where to save the PNG. Paths must be inside the folder `dcd mcp` runs in, and it never writes over a file it didn't write. It also serves the `dcd_*` tools for cloud test runs. Add `--read-only` after `mcp` to offer only the tools that change nothing.

On your own machine, `dcd mcp` can use your [`dcd login`](../cli/dcd-login.md) session instead of a key. `dcd mcp install` adds it to Claude Code, Claude Desktop, Codex, Cursor or VS Code for you: see [Connect an AI Agent](connect.md).

::: info
When you create a key for an agent, choose **Device sessions only** under **Access**. Such a key can start and drive devices and upload builds, but it can't start test runs or read results. You can't change a key's access later. With such a key, `dcd mcp` still lists its `dcd_*` tools, but they fail. Use a key with full access for an agent that also runs cloud tests.
:::

## Connected apps

Every client you sign in shows up under **Settings → Account → Connected apps**, with the team it uses and when it was last used. **Disconnect** stops it working at once. Sessions it starts run as you, and the timeline shows which app sent each command.

## How an agent works with a device

1. `list_devices` shows the devices it can start, and any sessions already open, its own first.
2. `start_device` leases a device and waits up to a minute for it. If the fleet is busy, the session is queued, which isn't an error: it starts on its own, and the agent waits for it with `get_device_status`.
3. `install_app` installs a build you uploaded, or one at an HTTPS link. `launch_app` starts it.
4. The agent loops: `inspect_screen` to see what's on screen, then `tap_on`, `input_text`, `swipe` or `press_key` for one step, or `run` for several Maestro commands, then `inspect_screen` again. `open_link` opens a deep link or a web link, and `set_location` sets the device's position. `take_screenshot` shows the screen as an image, or with `full_size` gives a link to a PNG at the device's own resolution, and `get_logs` reads the app's device log.
5. `stop_device` releases the device when it's done. A session that has ended is final: the agent starts a new one.

Every response about a session carries a short **session** block: the session's state, how long it has left, its cost so far, its page in the console, and plain-English warnings, such as an upcoming idle timeout or the app having crashed. The agent never needs a separate call to stay oriented. Agents are told to give you the session's console link as soon as they have it, so you can watch.

The full list of tools is in the [tool reference](agent-devices-tools.md). To teach your agent this loop, add the [agent instructions](agent-devices-skill.md) to your project.

## Whose session it is

Teammates' agents share your team's sessions, so each session says who started it. Its session block has `started_by`: the person's email or the API key's name, and whether it was you, and this connection.

- A tool called without `session_id` uses the session this connection started, or else your one open session. It never picks a session someone else started.
- An agent that tries to change a session someone else started, another person or another API key, is refused with `LIVE_NOT_YOURS`, which names who started it. With `force: true` it goes ahead: use that only when you mean to change a teammate's session.
- Looking at a session (status, the screen, screenshots, logs) is never refused, and nor is a person in the console.
- Your own session used from another connection, such as a second agent with the same sign-in, works, with a warning in the session block in case the other one is still using it.

## What a session runs

A session takes Maestro YAML and runs the common Maestro commands: `tapOn`, `doubleTapOn`, `longPressOn`, `inputText`, `eraseText`, `hideKeyboard`, `pressKey` (`Back`, `Home` and `Enter`), `swipe`, `scroll`, `scrollUntilVisible`, `assertVisible`, `assertNotVisible`, `extendedWaitUntil`, `waitForAnimationToEnd`, `launchApp`, `stopApp`, `killApp`, `clearState`, `setPermissions`, `openLink`, `takeScreenshot`, `back`, and `runFlow`, `repeat` and `retry`. Conditions on `visible`, `notVisible` and `platform` work.

`takeScreenshot` takes a name, or a relative path of plain names such as `screens/login`, and a run's result links each PNG it takes. A path that could lead out of the session's own folder, or is built from a variable, fails the flow.

It doesn't run flow scripts: `runScript`, `evalScript`, or a JavaScript condition or expression. Only `${NAME}` variables from `env` are filled in. It also doesn't run `copyTextFrom`, `pasteText`, `inputRandom*`, `setLocation`, `travel` or `addMedia`, or other `pressKey` keys. A flow with a command it doesn't run fails before its first step, and the error names the line. To set the device's position, use the [`set_location`](agent-devices-tools.md#set-location) tool: [location](../api/device-sessions.md#location) says what an app then reads.

A flow's `openLink` opens the link inside the flow's app. On Android a web link that app doesn't handle fails there. To open a link the way the device would, use the [`open_link`](agent-devices-tools.md#open-link) tool. The first link of a session can meet a screen that is shown only once: see [links](../api/device-sessions.md#links).

`launch` grants the app every permission before it opens it, so no permission dialog covers its first screen, and a flow's `launchApp` does the same unless it sets `permissions` itself. See [permissions](../api/device-sessions.md#permissions) to deny one.

These flows are run by a Maestro-compatible engine, not by Maestro itself. A [test run](../getting-started/quickstart.md) runs your flows on Maestro, so check a flow there before you rely on it there.

Two things differ by platform:

- **iOS.** A session works on the app in front. On the home screen the screen reads as empty and a tap is refused, so launch an app first. When a tap or a link opens another app, such as a link into Safari, the session follows it. There is no back key: `back` presses the app's own back button, or taps the top-left corner where one usually is, and fails if the screen doesn't change. It doesn't close a keyboard. `lock`, `power`, `volume_up` and `volume_down` aren't available on a simulator.
- **Android.** `eraseText` must be at the top level of a flow, not inside `runFlow`, `repeat` or `retry`.

The agent is told all of this by the `cheat_sheet` tool.

## When the agent needs a person

Some things only a person can do: enter a 2FA code, solve a CAPTCHA, approve a payment sheet. The agent calls `request_human` with what it needs, and then:

- the session waits, and its idle timer pauses, for up to 30 minutes, until someone takes control
- the agent tells you what it needs, with a link to the session
- your team's [webhook](../notifications/webhook-notifications.md#device-needs-human) receives a `device.needs_human` event
- the session shows under **Needs you** on the **Devices** page in the console

Open the session and click its screen to take control. Do what the agent asked, then click **Hand back**, optionally with a note for the agent. The agent reads the note with `get_human_status` and carries on. Only a person in the console can hand back: the agent can't do it for you, and waits.

If nobody takes control in time, the session ends. Once you have control, it ends after 5 minutes without a command from you, as any session does.

## Watching and taking over

The **Devices** page in the console lists your team's sessions: those that need you, those running, those queued, and those that ended in the last day. **History** below them goes back a month, a page at a time. **Open** on an ended session shows its recording and its steps.

Open one to watch it: the device's screen, and a script of every step the agent took, with the result of each and the screen after it. To step in, click **Pause agent**, or click the screen. While you have control, the agent's steps wait and run after you hand back, and any new command it sends is refused until then. Click the screen to tap, drag to swipe, use the buttons beside and under it (such as **Home**, **Back** on Android, and **Enter**), or type into the focused field. Tick **Secret** to keep what you type out of the timeline. **Resume agent** hands control back.

While you have control, you can also add Maestro lines to the script to run them, and remove the agent's held steps so they don't run. A paused session shows under **Needs you**, as a request for help does. While you have control it ends after 5 minutes without a command from you, so resume the agent before you step away.

## Secrets

Never put a password or token into a flow's YAML. Pass it in `run`'s `env` and refer to it by name:

```yaml
- tapOn: "Password"
- inputText: ${PASSWORD}
```

with `env: { "PASSWORD": "..." }`. Values sent this way are encrypted before they're stored, they never appear in the timeline, and they're masked in the command's output and in `inspect_screen`.

## Recordings and artifacts

Each session is recorded on video by default (`record: false` on `start_device` turns it off). A screenshot and a screen dump are kept after every action, along with the device log. The session's page in the console links the screen after each step, and shows the video and device log once the session ends. [`dcd device artifacts`](../cli/dcd-device.md) downloads all of them, and the [REST API](../api/device-sessions.md#artifacts) lists them. They're deleted a month after the session ends.

The screenshots kept after each action are scaled down. For a PNG at the device's own resolution, such as a baseline image, `take_screenshot` with `full_size: true` gives a link to one, valid for an hour. A flow's `takeScreenshot` steps are kept the same way, and the run's result lists them. See [full-size screenshots](../api/device-sessions.md#full-size-screenshots).

## Limits

| Limit | Default |
|-------|---------|
| Sessions open at once, per team | 2 |
| Maximum session length | 60 minutes |
| Idle timeout (no commands) | 5 minutes |
| Waiting for a person, until someone takes control | 30 minutes |
| Waiting in the queue | 15 minutes |

The idle timeout is fixed, and no session can run longer than 60 minutes. Contact support to change the other limits for your team, or to set a monthly spend cap on device sessions.

Each session also has rate limits on commands and reads: see [Rate limits](../api/device-sessions.md#rate-limits).

## Pricing

Device time is billed at $0.03 per minute, in 30-second steps, from when a device is assigned to the session until the session ends. Time spent queued isn't billed. Your team's discount applies.

A session is charged the way a test run is: from your prepaid credits first, then your plan's included usage, then as [overage](../billing/overage.md). A session whose device never became ready because of a problem on our side (an error on the device's host, or contact with the device lost) isn't charged. One you stop before its device is ready is still charged, from when the device was assigned.

A session is refused before it starts, with `402` and `USAGE_LIMIT_EXCEEDED`, when at its maximum length it would take your usage past your [Overage Limit](../billing/overage.md#when-a-run-would-go-over-the-limit) or a usage alert's [hard stop](../billing/usage-alerts.md#hard-stop). A session already running isn't stopped by them. A monthly spend cap on device sessions, which support can set, does stop one.
