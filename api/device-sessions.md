# Device sessions

The REST API behind [Agent Devices](../mcp/agent-devices.md). The MCP tools call these same endpoints. Authenticate with an [API key](../getting-started/api-keys.md) in `x-app-api-key`, as for the rest of the [REST API](overview.md#authentication). A key limited to **Device sessions only** can reach these endpoints, the hosted MCP server and the build upload endpoints, but nothing else.

A session is named by its `id` (for example `brave-teal-otter`) in every path. Every successful response about a session includes a `session` block: its state, time and idle time left, cost so far, warnings and console link. [The tool reference](../mcp/agent-devices-tools.md#the-session-block) lists its fields.

## Sessions

| Method and path | What it does |
|---|---|
| `GET /device/models` | The devices you can start: models, OS versions and the defaults |
| `POST /device/sessions` | Start a session. Body: `platform` (`ios` or `android`), and optionally `model`, `os`, `googlePlay`, `binaryUploadId`, `deviceLocale` (such as `de_DE`), `maxDurationMin`, `clientLabel`, `record` (default `true`) |
| `GET /device/sessions` | Your organization's open sessions. `?all=true` adds those that ended in the last day |
| `GET /device/sessions/:id` | One session |
| `DELETE /device/sessions/:id` | Stop a session and release the device |

## The device

| Method and path | What it does |
|---|---|
| `POST /device/sessions/:id/install` | Install a build: `{ "binaryUploadId": "..." }`, or `{ "url": "https://..." }` for an `.apk` or a zipped simulator `.app` at a link (up to 500 MB). It installs in the background. A command sent meanwhile waits up to 45 s for it, then answers `LIVE_NOT_READY` |
| `POST /device/sessions/:id/launch` | Launch an app: `{ "appId"?: "...", "clearState"?: true }`. Without `appId`, the installed build |
| `POST /device/sessions/:id/actions` | One action: `tap` (`x`/`y` percent, `text` or `id`), `type` (`text`, and `sensitive: true` to keep it secret), `swipe` (`direction`: `up`, `down`, `left` or `right`, or `from`/`to` points in percent), `press_key` (`key`: `back`, `home`, `enter`, `backspace`, `tab`, and on Android `volume_up`, `volume_down`, `lock` or `power`), `open_link` (`url`: see [links](#links)) or `set_location` (`latitude`, `longitude`: see [location](#location)). Answered once the screen has settled. `text` and `id` are matched whole, ignoring case. A `tap` on text or an id that is not on screen waits for it, 17 s unless `timeoutSeconds` (0 to 60) says otherwise, and then fails. `0` looks at the screen once |
| `POST /device/sessions/:id/run` | Run a Maestro flow, within [what a session runs](#what-a-session-runs): `{ "yaml": "..." }` for one flow, or `{ "flowUploadId": "...", "flow"?: "..." }` for a [flow bundle](#flow-bundles). `env` passes [secrets and variables](#secrets). Waits up to 110 s, or `waitSeconds` (0 to 300), then answers `running` with a `command_id`. A failed run's result includes `screen_text`, the app's visible text after the failure |
| `GET /device/sessions/:id/commands/:commandId` | The status and result of a `run` that answered `running`. `?waitSeconds=` (0 to 300) waits for it to finish instead of answering at once |
| `GET /device/sessions/:id/inspect` | The screen as compact JSON. The on-screen keyboard and the System UI are left out unless you add `?all=true`. Some apps also drop their own fields from the tree while a keyboard is open, and `all` cannot bring them back: hide the keyboard first (`run` with `- hideKeyboard`), then inspect again |
| `GET /device/sessions/:id/screenshot` | The screen as it is now, as a JPEG data URL. `fresh` is `false` when no new frame came within 3 s, so this is the latest there is |
| `GET /device/sessions/:id/logs` | The installed app's recent device log lines. `lines` (default 200, at most 2000), `level` (`warning` or `error`) and `grep` (any case) narrow them. The answer stops at 24 KB, with `truncated: true` when older lines were left out |

## What a session runs

A session takes Maestro YAML and runs the common Maestro commands: `tapOn`, `doubleTapOn`, `longPressOn`, `inputText`, `eraseText`, `hideKeyboard`, `pressKey` (`Back`, `Home` and `Enter`), `swipe`, `scroll`, `scrollUntilVisible`, `assertVisible`, `assertNotVisible`, `extendedWaitUntil`, `waitForAnimationToEnd`, `launchApp`, `stopApp`, `killApp`, `clearState`, `setPermissions`, `openLink`, `takeScreenshot`, `back`, and `runFlow`, `repeat` and `retry`.

It doesn't run flow scripts: `runScript`, `evalScript`, or a JavaScript condition or expression. Only `${NAME}` variables from `env` are filled in. It also doesn't run `copyTextFrom`, `pasteText`, `inputRandom*`, `setLocation`, `travel` or `addMedia`, or other `pressKey` keys. A flow with a command it doesn't run fails before its first step, and the error names the line. To set the device's position, use the [`set_location` action](#location).

A flow's `openLink` opens the link inside the flow's app. On Android a web link that app doesn't handle fails there. To open a link the way the device would, use the [`open_link` action](#links).

`launch` grants the app every permission before it opens it, so no permission dialog covers its first screen, and a flow's `launchApp` does the same unless it sets `permissions` itself. See [permissions](#permissions) to deny one.

These flows are run by a Maestro-compatible engine, not by Maestro itself. A [test run](../getting-started/quickstart.md) runs your flows on Maestro, so check a flow there before you rely on it there.

Two things differ by platform:

- **iOS.** A session works on the app in front. On the home screen the screen reads as empty and a tap is refused, so launch an app first. When a tap or a link opens another app, such as a link into Safari, the session follows it. There is no back key: `back` presses the app's own back button, or taps the top-left corner where one usually is, and fails if the screen doesn't change. It doesn't close a keyboard. `lock`, `power`, `volume_up` and `volume_down` aren't available on a simulator.
- **Android.** `eraseText` must be at the top level of a flow, not inside `runFlow`, `repeat` or `retry`.

## Links

`open_link` opens a link the way the device would if someone tapped it:

```json
{ "type": "open_link", "url": "myapp://orders/42" }
```

- A link your app handles opens in your app: its own scheme, such as `myapp://orders/42`, or a web link it claims.
- Any other web link opens in the browser: Chrome on Android, Safari on iOS.
- When nothing on the device opens the link, the action fails and says so.

The action answers once the link has opened. `inspect` next shows where it led. On iOS the session then works on whichever app the link brought to the front.

The first link of a session can meet a screen that is shown only once:

- **iOS, a link into your app.** iOS asks "Open in “Your App”?" the first time. The action presses **Open** for you, and its result says so.
- **Android, a web link.** Chrome opens on its welcome screens. Tap **Use without an account**, then **No thanks**, and the page is behind them.
- **iOS, a web link.** Safari may cover the page with a tip. Tap **Close**.

A link into your app takes about a second on Android and 3 to 4 seconds on iOS. The first web link starts the browser, which takes 2 to 3 seconds on Android and 10 seconds or more on iOS.

A sign-in link is a credential. Send it with `"sensitive": true` and it is encrypted before it is stored and never shown in the timeline, like a sensitive `type`.

## Location

`set_location` sets the device's GPS position, in decimal degrees. South and west are negative:

```json
{ "type": "set_location", "latitude": 51.5074, "longitude": -0.1278 }
```

- It applies to the whole device, and stays until you set another or the session ends. Leaving an app, relaunching it, and `launch` with `clearState` all keep it.
- An app that is watching the position gets a new one within about 2 seconds. An app that asks later gets it when it asks.
- An app reads it only once it has the location permission, and gets nothing without it. `launch` grants your app every permission.
- Values are kept to six decimal places. iOS gives an app all six. Android gives about five: `51.507351` reads as `51.50735`.
- A position within `0.0001` of `0, 0` on both axes is refused, because a device takes 0, 0 to mean no position. One axis at 0 is fine, such as `0, 10`.

Until you set a position, an iOS app that asks is told the position is unavailable, and an Android app gets the emulator's own default, in California. Every session starts on a new device, so nothing carries over from an earlier one.

A web page reads the position through the browser, and the browser asks first. On Android, give Chrome the permission in a flow, and Chrome then asks for the site (**Allow while visiting the site**):

```yaml
appId: com.android.chrome
---
- setPermissions:
    appId: com.android.chrome
    permissions:
      location: allow
```

On iOS, Safari asks twice: **Allow While Using App** for Safari, then **Allow** for the site.

## Permissions

`launch` grants the app every permission. To deny one, or to see the app ask for it, set it in a flow before the app needs it:

```yaml
- setPermissions:
    permissions:
      notifications: deny
```

A permission is `allow`, `deny` or `unset`, and `unset` makes the app ask again. The names are `all`, `camera`, `microphone`, `photos`, `contacts`, `notifications`, `calendar`, `location`, `medialibrary`, `motion`, `reminders` and `siri`. `launchApp` takes the same `permissions`. A permission the app doesn't declare fails the step, and the error names it.

## Flow bundles

To run several flows, or a flow that runs others, upload them as a zip, then pass its id to `run` as `flowUploadId`. `flow` names the entry file inside the zip; without it, every flow runs. [`dcd device run <directory>`](../cli/dcd-device.md) does this for you.

| Method and path | What it does |
|---|---|
| `POST /device/bundles/upload-url` | `{ "bytes"?: 1234 }`. Returns the bundle's `id`, and signed URLs to `PUT` the zip to: `upload` and `mirror` (either may be `null`). Upload to each one given |
| `POST /device/bundles` | Register it: `{ "id", "sha", "bytes", "supabase": true, "backblaze": true }`, where `sha` is the SHA-256 of the zip in hex, and `supabase` and `backblaze` say which URLs you uploaded to. Returns `{ "bundle" }` |

A bundle can be up to 50 MB. Bundles are deleted a day after they're uploaded, once no command needs them.

## Asking a person

| Method and path | What it does |
|---|---|
| `POST /device/sessions/:id/request-human` | `{ "reason": "..." }`, up to 500 characters. The session waits for a person, with its idle timer paused, for up to 30 minutes. Your [webhook](../notifications/webhook-notifications.md#device-needs-human) gets a `device.needs_human` event |
| `GET /device/sessions/:id/human` | Whether it's still waiting, or was handed back, with the person's note |
| `POST /device/sessions/:id/hand-back` | `{ "note"?: "..." }`, up to 2000 characters. Hand the session back to the agent |

Taking control of a device is for people in the console. While someone has control, commands that change the device answer `LIVE_HUMAN_IN_CONTROL`, and those already queued wait until the hand-back.

## Artifacts

| Method and path | What it does |
|---|---|
| `GET /device/sessions/:id/timeline` | Every command and event, newest first: who sent it, its status, and the screenshot after it. Paged with `limit` (default 50, at most 200) and `before` (the last page's `next_before`) |
| `GET /device/sessions/:id/artifacts` | Short-lived links to the session's video, device log, and the screenshot and screen dump after each action. Paged the same way. The video and log arrive after the session ends |

## Secrets

`env` on `run` is an object of names to string values: up to 50 of them, each up to 4096 characters. Names are letters, digits and `_`, and don't start with a digit. Names starting with `DCD_` are reserved. Refer to them in the YAML as `${NAME}`. They're encrypted before they're stored, never shown in the timeline, and masked in the command's output and in `inspect`.

A `type` action with `sensitive: true` sends its text the same way, and an `open_link` action its link.

## Rate limits

These endpoints have their own limits instead of the API's general one:

| What | Limit |
|---|---|
| Commands (install, launch, actions, run, asking a person, handing back) | 60 a minute, per session |
| Reads (status, inspect, screenshot, logs, a command's status, whether a person is needed, timeline, artifacts) | 240 a minute, per session |
| Session lists, device models and bundle uploads | 120 a minute, per organization |

Over a limit, the API answers HTTP `429` with `LIVE_RATE_LIMITED`, and `retry_after_s` in the body is how many seconds to wait. Stopping an open session is never refused. Starting a session has no per-minute limit, but your organization can only have so many sessions open at once (`LIVE_CONCURRENCY_LIMIT`).

## Errors

Errors are JSON with a `message`. Most also have a stable `error` code, listed below. A few have only the `message`, such as a malformed request to start a session.

| Code | Meaning |
|---|---|
| `LIVE_NOT_ENABLED` | Device sessions aren't enabled for your organization |
| `LIVE_CONCURRENCY_LIMIT` | Your organization has as many sessions open as it may |
| `LIVE_SPEND_CAP` | Your organization reached its monthly spend cap |
| `LIVE_NOT_FOUND` | No such session in your organization |
| `LIVE_NOT_READY` | The device is still starting, or installing an app: retry shortly |
| `LIVE_SESSION_ENDED` | The session has ended |
| `LIVE_INVALID_ACTION` | The request is malformed: the message says how |
| `LIVE_INVALID_APP` | The build isn't one this device can install |
| `LIVE_APP_DOWNLOAD_FAILED` | The build at the URL couldn't be downloaded |
| `LIVE_NO_APP` | No app is installed, and none was named |
| `LIVE_COMMAND_NOT_FOUND` | No such command in this session |
| `LIVE_LOGS_UNAVAILABLE` | The device logs couldn't be read |
| `LIVE_SESSION_REQUIRED` | MCP only: more than one session is open, so pass `session_id` |
| `LIVE_RATE_LIMITED` | Too many requests: slow down |
| `LIVE_NOT_WAITING_FOR_HUMAN` | Hand-back on a session that isn't waiting for a person |
| `LIVE_HUMAN_IN_CONTROL` | A person has taken control in the console: wait for them to hand back |
| `LIVE_CONSOLE_ONLY` | Only a person signed in to the console can do this (take control) |
| `LIVE_NOT_IN_CONTROL` | Only the person in control can do this (remove a held step) |
| `LIVE_SECRETS_UNAVAILABLE` | Secrets can't be accepted right now |
| `API_KEY_SCOPE` | The API key isn't allowed to reach this endpoint |
