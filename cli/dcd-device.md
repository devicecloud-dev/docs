# dcd device

Lease a cloud iOS simulator or Android emulator, drive it, and release it, from your terminal or a script. These are the same device sessions an AI agent uses through [Agent Devices](../mcp/agent-devices.md): you can watch any of them in the console, and they show on the same Devices page.

{% hint style="warning" %}
**Device sessions are in beta** and are billed at **$0.03/min**, excluding Sales Tax. Access is by request: contact support to have it turned on for your organization. `dcd device` works with a [`dcd login`](dcd-login.md) session or an [API key](../getting-started/api-keys.md).
{% endhint %}

```bash
dcd device <subcommand> [flags]
```

A typical session:

```bash
dcd device start --platform ios --app ./build/MyApp.app --wait
dcd device launch
dcd device inspect
dcd device run flows/login.yaml
dcd device screenshot -o after-login.jpg
dcd device stop
```

## Rules for every subcommand

- **The session id is optional** when your organization has exactly one open session. With none, or several, the command stops and lists the sessions to choose from.
- **`--json`** prints exactly one JSON object on stdout, on success and on failure:

  ```json
  { "ok": true, "session": { "id": "brave-teal-otter", "state": "active", "...": "..." }, "data": { }, "error": null }
  ```

  `session` is the same session block the [REST API](../api/device-sessions.md) returns: state, time and idle time left, cost so far, warnings, and the console link. On failure, `ok` is `false` and `error` is `{ "code", "message" }`, where `code` is the API's error code (such as `LIVE_SPEND_CAP`) or `null`.
- **Exit codes:**

  | Code | Meaning |
  |---|---|
  | `0` | Done |
  | `1` | Called wrongly: a bad flag or value, or no session to pick |
  | `2` | It ran and failed: a flow or launch failed, or the API couldn't do it |
  | `3` | A limit was hit: concurrent sessions, spend cap, or rate limit |
  | `4` | The session has ended, or there is no such session |

- **Progress** goes to stderr, so stdout holds only the result. There are no prompts, and no spinners unless you are at a terminal.

Every subcommand also takes `--api-key` and `--api-url`.

## `dcd device start`

Start a session. Without `--wait` it returns at once, possibly with the session still queued; it starts on its own.

| Flag | Description |
|------|-------------|
| `--platform <ios\|android>` | The platform. Optional with `--app`, which implies it |
| `--model <model>` | A device model, such as `iphone-16` or `pixel-10`. See `dcd device models` |
| `--os <version>` | The iOS major version or Android API level, such as `18` or `35` |
| `--google-play` | Android only: an image with Google Play services |
| `--app <path\|url>` | A build to install: a local `.apk`, `.app`, `.zip` or Expo `.tar.gz` (uploaded first), or an HTTPS link to an `.apk` or a zipped `.app` |
| `--app-binary-id <id>` | A build you already uploaded |
| `--locale <locale>` | The device locale, such as `de_DE` |
| `--name <label>` | Who is driving the session, shown in the console (default `dcd-cli`) |
| `--ttl <minutes>` | The longest the session may run (default: your organization's limit) |
| `--no-record` | Don't record a video of the session |
| `--wait` | Wait until the device is ready for commands |

## `dcd device list`

Your organization's open sessions. `--all` adds those that ended in the last 24 hours.

## `dcd device status [id]`

A session's state, time left, idle timeout and cost so far.

## `dcd device stop [id]`

Stop a session and release the device. `--all` stops every open session in your organization.

## `dcd device models`

The devices a session can ask for, with their OS versions and the defaults. `--platform` shows one platform.

## `dcd device install [id] <path|url>`

Install a build: a local file (uploaded first), an HTTPS link, or `--app-binary-id <id>`. Commands answer "not ready" until the install finishes; `--wait` waits for it.

## `dcd device launch [id] [app-id]`

Launch an app: the installed one, or a bundle id or package name. `--clear-state` clears its data first. A failed launch exits `2`.

## `dcd device inspect [id]`

The screen as compact JSON: each element with its text, id, accessibility label or hint, and its bounds. Use these to target `tapOn` in a flow.

## `dcd device screenshot [id]`

Save a screenshot. `-o <file>` sets where (default `./<session>-<time>.jpg`). With `--json`, `data` gives the file's path.

## `dcd device run [id] <flow.yaml|directory>`

Run Maestro on the device and wait for the result. A failed flow exits `2`, and prints Maestro's output either way.

| Flag | Description |
|------|-------------|
| `<flow.yaml>` | One flow file, run whole |
| `<directory>` | A directory of flows, uploaded as a bundle. Every flow in it runs, unless you pass `--entry` |
| `--entry <path>` | With a directory: the one flow to run, as a path inside it, such as `flows/login.yaml` |
| `--yaml <flow>` | The flow inline, instead of a file |
| `--env KEY=VALUE` | A variable for the flow, used as `${KEY}`. Repeat it for more. Values are encrypted before they're stored, and masked in the output |

A directory is zipped without `.git`, other hidden folders and `node_modules`, up to 50 MB.

## `dcd device logs [id]`

The installed app's recent device log lines. `--lines <n>` sets how many (default 200, at most 2000). `--follow` keeps printing new lines until the session ends (not with `--json`).

## `dcd device open [id]`

Open the session's page in the console, where you can watch the device and take control. In a script, it prints the link instead.

## `dcd device artifacts [id]`

Download what a session left behind into `./<session>-artifacts` (or `-o <dir>`): `recording.mp4`, `device.log`, and the screenshot and screen dump after each action (`actions/001-screenshot.jpg`, `actions/001-screen.json`, …), numbered in order. `--links` lists the download links instead. The video and log are saved when the session ends.

## Replacing `dcd live`

`dcd device` replaces [`dcd live`](dcd-live.md), which still works but is deprecated. The main differences: the session id is a positional argument instead of `--session`, `run` takes a directory, and every command has `--json` and meaningful exit codes.
