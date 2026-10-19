# Agent Devices

Agent Devices give your AI agent a real cloud iOS simulator or Android emulator to work on. Through DeviceCloud's hosted MCP server, an agent such as Claude Code or Cursor can start a device, install your app, look at the screen, tap and type, run Maestro flows, read the device logs, and ask a person for help when it gets stuck. You can watch every session live in the console and take over the device at any time.

{% hint style="warning" %}
**Agent Devices are in beta** and are billed at **$0.03/min**, excluding Sales Tax, the same as [Live sessions](../cli/dcd-live.md). Access is by request: contact support to have it turned on for your organization.
{% endhint %}

{% hint style="warning" %}
We accept no liability for anything your agent may read or execute on a device. LLMs are a new technology: use them with care and at your own risk.
{% endhint %}

## Connect your agent

The server is at `https://api.devicecloud.dev/mcp` (Streamable HTTP). Your MCP client signs you in through the DeviceCloud console the first time it connects, or you can give it an API key.

### Claude Code

```bash
claude mcp add --transport http devicecloud https://api.devicecloud.dev/mcp
```

Then run `/mcp` in Claude Code and choose **devicecloud** to sign in. A browser opens on the DeviceCloud console: sign in, pick the organization the agent should use, and click **Connect**.

### Cursor

Add the server to `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "devicecloud": {
      "url": "https://api.devicecloud.dev/mcp"
    }
  }
}
```

Cursor then asks you to sign in to the server, which opens the DeviceCloud console.

### Other MCP clients

Any client that supports Streamable HTTP and OAuth can connect to `https://api.devicecloud.dev/mcp`. It discovers the sign-in from the server's `401` response, registers itself, and opens the DeviceCloud console for you to approve it.

### With an API key instead

For agents that can't open a browser, such as one running in CI, send an [API key](../getting-started/api-keys.md) as a header:

```bash
claude mcp add --transport http devicecloud https://api.devicecloud.dev/mcp \
  --header "Authorization: Bearer <your-api-key>"
```

{% hint style="info" %}
When you create a key for an agent, choose **Device sessions only** under **Access**. Such a key can start and drive devices and upload builds, but it can't start test runs or read results.
{% endhint %}

## Connected apps

Every client you sign in shows up under **Settings → Account → Connected apps**, with the organization it uses and when it was last used. **Disconnect** stops it working at once. Sessions it starts run as you, and the timeline shows which app sent each command.

## How an agent works with a device

1. `list_devices` shows the devices it can start, and any sessions already open.
2. `start_device` leases a device. If the fleet is busy, the session is queued, which isn't an error: it starts on its own, and the agent waits for it.
3. `install_app` installs a build you uploaded, or one at an HTTPS link. `launch_app` starts it.
4. The agent loops: `inspect_screen` to see what's on screen, then `run` to act with Maestro commands, then `inspect_screen` again. `take_screenshot` shows the screen as an image, and `get_logs` reads the app's device log.
5. `stop_device` releases the device when it's done.

Every response carries a short **session** block: the session's state, how long it has left, its cost so far, and plain-English warnings, such as an upcoming idle timeout or the app having crashed. The agent never needs a separate call to stay oriented.

The full list of tools is in the [tool reference](agent-devices-tools.md).

## When the agent needs a person

Some things only a person can do: enter a 2FA code, solve a CAPTCHA, approve a payment sheet. The agent calls `request_human` with what it needs, and then:

- the session waits, and its idle timer pauses, for up to 30 minutes
- whoever started the session gets an email, and the organization's [webhook](../notifications/webhook-notifications.md) receives a `device.needs_human` event
- the session shows under **Needs you** on the Devices page in the console

Open the session, do what it asks (use **Take control** to tap and type on the device yourself), then click **Hand back**, optionally with a note for the agent. The agent reads the note with `get_human_status` and carries on.

If nobody hands the session back in time, it ends.

## Watching and taking over

The **Devices** page in the console lists your organization's sessions: those that need you, those running, those queued (with their place in the queue), and those that ended in the last day.

Open one to watch it. The screen is on the left and the timeline of everything the agent did is on the right, with the screen after each action. **Take control** pauses the agent: while you have control, its commands are refused and it waits. Click the screen to tap, use **Back**, **Home** and **Enter**, or type into the focused field. **Hand back** returns control to the agent.

## Secrets

Never put a password or token into a flow's YAML. Pass it in `run`'s `env` and refer to it by name:

```yaml
- tapOn: "Password"
- inputText: ${PASSWORD}
```

with `env: { "PASSWORD": "..." }`. Values sent this way are encrypted before they're stored, they never appear in the timeline, and they're masked in the command's output.

## Recordings and artifacts

Each session is recorded on video by default (`record: false` on `start_device` turns it off). A screenshot and a screen dump are kept after every action, along with the device log. The screenshots are on the session's timeline in the console. The video, the log and the screen dumps are available from the [REST API](../api/device-sessions.md#artifacts).

## Limits

| Limit | Default |
|-------|---------|
| Sessions open at once, per organization | 2 |
| Maximum session length | 120 minutes |
| Idle timeout (no commands) | 5 minutes |
| Waiting for a person | 30 minutes |
| Waiting in the queue | 15 minutes |

The idle timeout is fixed. Contact support to change the other limits for your organization, or to set a monthly spend cap on device sessions.

## Pricing

Device time is billed at $0.03 per minute, in 30-second steps, from when a device is assigned to the session until the session ends. Time spent queued isn't billed. Your organization's discount applies.
