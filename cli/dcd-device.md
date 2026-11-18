# dcd device

Lease a cloud iOS simulator or Android emulator, drive it, and release it, from your terminal or a script. These are the same device sessions an AI agent uses through [Agent Devices](../mcp/agent-devices.md): you can watch any of them in the console, and they show on the same Devices page.

::: warning
**Device sessions are in a closed beta** and are billed at **$0.03/min**, excluding Sales Tax. Access is by request: contact support to have it turned on for your team. `dcd device` works with a [`dcd login`](dcd-login.md) session or an [API key](../getting-started/api-keys.md).
:::

```bash
dcd device <subcommand> [flags]
```

A typical session:

```bash
dcd device start --platform ios --app ./build/MyApp.app --wait
dcd device launch
dcd device inspect
dcd device tap --text "Log in"
dcd device type --text "ann@example.com"
dcd device run flows/login.yaml
dcd device screenshot -o after-login.jpg
dcd device stop
```

## Rules for every subcommand

- **The session id is optional** when you have exactly one open session: one you started, signed in with `dcd login` or with the API key you're using. A session someone else started is never picked for you. With none of yours open, or several, the command stops and lists the sessions to choose from. An id must look like one, such as `brave-teal-otter`: a value like `undefined` or `null`, from a variable that wasn't set, is refused before anything is sent.
- **`--force`** is for a session someone else started, another person or another API key. The commands that change a session (`stop`, `install`, `launch`, `tap`, `type`, `swipe`, `press-key`, `open-link`, `set-location`, `run` and `request-human`) refuse one with `LIVE_NOT_YOURS`, naming who started it, and exit `2`. Add `--force` only when you mean to change a teammate's session: their agent may be using it. Reading a session is never refused.
- **Unknown flags are refused**, with the flag you may have meant, so a typo such as `--sensetive` can't send a secret in the clear.
- **`--json`** prints exactly one JSON object on stdout, on success and on failure:

  ```json
  { "ok": true, "session": { "id": "brave-teal-otter", "state": "active", "...": "..." }, "data": { }, "error": null }
  ```

  `session` is the same session block the [REST API](../api/device-sessions.md) returns: state, time and idle time left, cost so far, who started it, warnings, and the console link. `list`, `models` and `stop --all` leave it out, because they aren't about one session. On failure, `ok` is `false` and `error` is `{ "code", "message" }`, where `code` is the API's error code (such as `LIVE_SPEND_CAP`) or `null`. `error` also carries what the API said that a script can act on: `retry_after_s`, `limit`, `spent` and `phase` when it gave them, and `command_id` when a flow may still be running.
- **Exit codes:**

  | Code | Meaning |
  |---|---|
  | `0` | Done |
  | `1` | Called wrongly: a bad flag or value, no session to pick, or credentials the API rejected |
  | `2` | It ran and failed: a flow or launch failed, or the API couldn't do it |
  | `3` | A limit was hit: concurrent sessions, spend cap, or rate limit |
  | `4` | The session has ended, or there is no such session |

- **Progress** goes to stderr, so stdout holds only the result. There are no prompts, and no spinners unless you are at a terminal. Text from the device, such as an element's text or a log line, is printed with its control characters removed.

Every subcommand also takes `--api-key` and `--api-url`. `--api-url` must be an `https` address, except for an API on your own machine, because your key or login session goes with every request. One outside `devicecloud.dev` gets a warning.

## `dcd device start`

Start a session. Without `--wait` it returns at once, possibly with the session still queued; it starts on its own. With `--wait --json`, the session id goes to stderr as soon as the session exists, so a script that stops waiting can still stop it.

| Flag | Description |
|------|-------------|
| `--platform <ios\|android>` | The platform. Optional with `--model` or `--app`, which imply it |
| `--model <model>` | A device model, such as `iphone-16` or `pixel-10`. See `dcd device models` |
| `--os <version>` | The iOS major version or Android API level, such as `26` or `36` |
| `--google-play` | Android only: an image with Google Play services |
| `--app <path\|url>` | A build to install: a local `.apk`, `.app`, `.zip` or Expo `.tar.gz` (uploaded first), or an HTTPS link to an `.apk` or a zipped `.app`. A link ending in `.apk` means Android and one ending in `.zip` means iOS, so it can stand in for `--platform`. An empty value, such as a variable that wasn't set, is refused instead of starting a session with no app |
| `--app-binary-id <id>` | A build you already uploaded |
| `--locale <locale>` | The device locale, such as `de_DE` |
| `--name <label>` | Who is driving the session, shown in the console (default `dcd-cli`) |
| `--ttl <minutes>` | The longest the session may run (default: your team's limit, at most 60) |
| `--no-record` | Don't record a video of the session |
| `--wait` | Wait until the device is ready for commands |

## `dcd device list`

Your team's open sessions, yours first. `--all` adds those that ended in the last 24 hours. With `--json`, each session's `started_by` says who started it.

## `dcd device status [id]`

A session's state, time left, idle timeout and cost so far. `--wait` waits until the session is ready for commands and its app is installed, and exits `4` if it ends first.

## `dcd device stop [id]`

Stop a session and release the device. `--all` stops every open session of yours. With `--force` too, it stops everyone's in your team.

## `dcd device models`

The devices a session can ask for, with their OS versions and the defaults. `--platform` shows one platform.

## `dcd device install [id] <path|url>`

Install a build: a local file (uploaded first), an HTTPS link, or `--app-binary-id <id>`. It installs in the background: a command sent meanwhile waits for the install, for up to 45 seconds. `--wait` waits until the device is ready again.

## `dcd device launch [id] [app-id]`

Launch an app: the installed one, or a bundle id or package name. `--clear-state` clears its data first. A failed launch exits `2`.

## `dcd device inspect [id]`

The screen as compact JSON: each element with its text, id, accessibility label or hint, any state (checked, selected, focused or disabled), and its bounds. Use these to target `tapOn` in a flow. The on-screen keyboard's keys and the System UI (the status and navigation bars) are left out; `--all` lists them too.

With `--json`, `data.screen` is that JSON. Without it, a heading gives the screen's size and how many elements it has, then each element is one line: its text in quotes, `a11y:"…"` for an accessibility label that differs from the text, `id:` and the resource id, `hint:"…"`, any state, and its bounds as `[left,top][right,bottom]`. Copy the text or the id into `dcd device tap --text` or `--rid`. A note at the end says when a keyboard is open, and how many keyboard and System UI elements were left out.

While a keyboard is open, some apps report their own fields and buttons with clipped accessibility bounds, so they are missing from `inspect` even with `--all`, while the screenshot still shows them. Seen with React Native apps on Android that slide an input bar up above the keyboard. Hide the keyboard first, with a flow that runs `- hideKeyboard`, then inspect again. Typing does not need the keyboard on screen.

## `dcd device screenshot [id]`

Save a screenshot. `-o <file>` sets where (default `./<session>-<time>.jpg`). With `--json`, `data` gives the file's path.

`--full` saves a PNG at the device's own resolution instead of the smaller JPEG, for a baseline image (default `./<session>-<time>.png`). It takes a few seconds, and `data` also gives its `width`, `height` and `bytes`. A device too old for it answers `LIVE_NOT_SUPPORTED`. See [full-size screenshots](../api/device-sessions.md#full-size-screenshots).

```bash
dcd device screenshot --full -o baseline/login.png
```

## `dcd device tap [id]`

Tap one thing on the screen, by exactly one target. Answers once the screen has settled. A `--text` or `--rid` that is not on screen is waited for, 17 seconds unless `--timeout` says otherwise, and then the tap fails. So `dcd device inspect` first, or give a short `--timeout` when the element may not be there. A failed tap exits `2`.

| Flag | Description |
|------|-------------|
| `--text <text>` | The element's text, label or hint, matched whole and ignoring case (not a regex) |
| `--rid <id>` | The element's resource id, `rid` in `dcd device inspect` |
| `--x <n> --y <n>` | A point, as percentages of the screen (0 to 100) |
| `--timeout <seconds>` | With `--text` or `--rid`: how long to wait for it to appear, from 0 to 60. `0` looks at the screen once and fails at once if it isn't there. Requires CLI 5.14.0 or later |

## `dcd device type [id] --text <text>`

Type into the focused field (tap it first). `--sensitive` treats the text as a secret: DeviceCloud stores it encrypted and masks it in the output. `--text-stdin` reads the text from standard input instead of `--text`, so a secret stays out of your shell history and the process list:

```bash
printf %s "$PASSWORD" | dcd device type --text-stdin --sensitive
```

::: warning
CLI versions before 5.14.0 also send the text you type with `dcd device type` in their usage [telemetry](overview.md#telemetry), with or without `--sensitive`. [Upgrade](../getting-started/quickstart.md#upgrading-the-cli) before you type real passwords or codes this way.
:::

## `dcd device swipe [id] <up|down|left|right>`

Swipe across most of the screen in a direction (`up` scrolls the content up, down the page), or from one point to another with `--from x,y --to x,y`, in percentages, such as `--from 50,80` or `--from 50%,80%`.

## `dcd device press-key [id] <key>`

Press a key: `back`, `home`, `enter`, `backspace`, `tab`, and on Android `volume_up`, `volume_down`, `lock` or `power`. `enter` submits the focused field. On Android `back` closes a keyboard or goes back. iOS has no back key: there `back` presses the app's own back button, or taps the top-left corner where one usually is, and fails if the screen doesn't change. It is navigation, not a way to close a keyboard: press `enter`, or tap outside the field. On iOS, `enter`, `backspace` and `tab` need a focused field.

## `dcd device open-link [id] <url>`

Open a link on the device, the way tapping it would. A link your app handles, such as `myapp://orders/42`, opens in your app. Any other web link opens in the browser. Nothing on the device opening the link is a failure, and exits `2`. See [links](../api/device-sessions.md#links) for what the first link of a session can meet. Requires CLI 5.14.0 or later.

`--sensitive` is for a link that carries a token, such as a sign-in link: it is stored encrypted, never shown in the timeline, and not printed.

```bash
dcd device open-link myapp://orders/42
dcd device open-link "https://example.com/welcome?token=..." --sensitive
```

Quote a link that has a `?` or an `&` in it, so your shell passes it whole.

## `dcd device set-location [id] --latitude <n> --longitude <n>`

Set the device's GPS position, in decimal degrees. South and west are negative. It stays until you set another or the session ends. A position at `0, 0` is refused. See [location](../api/device-sessions.md#location) for what an app then reads. Requires CLI 5.14.0 or later.

```bash
dcd device set-location --latitude 51.5074 --longitude -0.1278
```

Each of these sends one [typed action](../api/device-sessions.md). For several steps, an assertion, scrolling until something is visible, or launching an app, use `run`.

## `dcd device run [id] <flow.yaml|directory>`

Run Maestro on the device and wait for the result. A failed flow exits `2`. Maestro's output is printed either way, and after a failure, so is the app's visible text.

It waits for as long as the flow runs, but no longer than the session: if the session ends first, it exits `4`. A request that fails along the way is tried again. If it gives up waiting, its error keeps the flow's `command_id`, because the flow may still be running.

A device session runs the common Maestro commands, not all of them. It refuses flow scripts (`runScript`, `evalScript`, and JavaScript conditions or expressions), and doesn't run `addMedia`, `copyTextFrom`, `pasteText`, `inputRandom*`, `setLocation` or `travel`. A flow that uses one fails before its first step, and the error names the line. See [What a session runs](../mcp/agent-devices.md#what-a-session-runs) for the full list.

| Flag | Description |
|------|-------------|
| `<flow.yaml>` | One flow file, run whole. If it uses other files (`runFlow`, `addMedia` and the like), they're uploaded with it as a bundle |
| `<directory>` | A directory of flows, uploaded as a bundle. Every flow in it runs, unless you pass `--entry` |
| `--entry <path>` | With a directory: the one flow to run, as a path inside it, such as `flows/login.yaml` |
| `--yaml <flow>` | The flow inline, instead of a file |
| `--env KEY=VALUE` | A variable for the flow, used as `${KEY}`. Repeat it for more. Values are encrypted before they're stored, and masked in the output. A value given here is in your shell history: use `--env-file` for secrets |
| `--env-file <file>` | Variables for the flow from a file of `KEY=VALUE` lines, such as a `.env` file. `--env` wins over it for the same name |

For a directory, only the YAML files, the files the flows refer to and the `includedPaths` in its `config.yaml` are uploaded, up to 50 MB.

## `dcd device logs [id]`

The installed app's recent device log lines. `--lines <n>` sets how many (default 200, at most 2000). `--level warning` or `--level error` keeps only lines at that level and above, and `--grep <text>` only lines that contain the text, in any case. The answer stops at 24 KB: when older lines were left out, it says so. `--follow` (`-f`) keeps printing new lines until the session ends (not with `--json`). Reading the logs doesn't count as activity, so it doesn't keep a session open.

## `dcd device request-human <reason> [id]`

Ask a person for help, such as entering a 2FA code or solving a CAPTCHA. The session waits for them, with its idle timer paused, and they see your reason on the session's page in the console. Your team's [webhook](../notifications/webhook-notifications.md#device-needs-human) gets a `device.needs_human` event. The reason can be up to 500 characters. `--wait` waits until they hand the session back. Only they can hand it back, from the console.

`--reason <text>` gives the reason as a flag, so the session id can come first, as in every other command: `dcd device request-human brave-teal-otter --reason "Enter the 2FA code"`. A lone argument that is the id of an open session is refused, rather than asking a person to "brave-teal-otter".

## `dcd device human [id]`

Whether a session is waiting for a person, or a person has control, and their note once they hand it back. `--wait` waits for the hand-back. Ctrl-C stops waiting and leaves the session as it is.

## `dcd device open [id]`

Open the session's page in the console, where you can watch the device and take control. In a script, it prints the link instead.

## `dcd device artifacts [id]`

Download what a session left behind into `./<session>-artifacts` (or `-o <dir>`): `recording.mp4`, `device.log`, and the screenshot and screen dump after each action (`actions/001-screenshot.jpg`, `actions/001-screen.json`, …), numbered in order. `--links` lists the download links instead. The video and log are saved when the session ends. Without an id, it takes your most recent session of the last day, open or ended.

## Replacing `dcd live`

`dcd device` replaces [`dcd live`](dcd-live.md), which still works but is deprecated. The main differences: the session id is a positional argument instead of `--session`, `run` takes a directory, and every command has `--json` and meaningful exit codes.
