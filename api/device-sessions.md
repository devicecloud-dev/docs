# Device sessions

The REST API behind [Agent Devices](../mcp/agent-devices.md). The MCP tools call these same endpoints. Authenticate with an [API key](../getting-started/api-keys.md) in `x-app-api-key`, as for the rest of the [REST API](overview.md#authentication). A key limited to **Device sessions only** can reach these endpoints, the hosted MCP server and the build upload endpoints, but nothing else.

A session is named by its `id` (for example `brave-teal-otter`) in every path. Every response includes a `session` block: its state, time and idle time left, cost so far, warnings and console link. [The tool reference](../mcp/agent-devices-tools.md#the-session-block) lists its fields.

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
| `POST /device/sessions/:id/actions` | One action: `tap` (`x`/`y` percent, `text` or `id`), `type` (`text`, and `sensitive: true` to keep it secret), `swipe` (`direction`: `up`, `down`, `left` or `right`, or `from`/`to` points in percent), `press_key` (`key`: `back`, `home`, `enter`, `backspace`, `tab`, `volume_up`, `volume_down`, `lock` or `power`) |
| `POST /device/sessions/:id/run` | Run Maestro: `{ "yaml": "..." }` for one flow, or `{ "flowUploadId": "...", "flow"?: "..." }` for a [flow bundle](#flow-bundles). `env` passes [secrets and variables](#secrets). Waits up to 110 s, or `waitSeconds` (0 to 300), then answers `running` with a `command_id`. A failed run's result includes `screen_text`, the app's visible text after the failure |
| `GET /device/sessions/:id/commands/:commandId` | The status and result of a `run` that answered `running`. `?waitSeconds=` (0 to 300) waits for it to finish instead of answering at once |
| `GET /device/sessions/:id/inspect` | The screen as compact JSON. The on-screen keyboard and the System UI are left out unless you add `?all=true` |
| `GET /device/sessions/:id/screenshot` | The screen as it is now, as a JPEG data URL. `fresh` is `false` when no new frame came within 3 s, so this is the latest there is |
| `GET /device/sessions/:id/logs` | The installed app's recent device log lines. `lines` (default 200, at most 2000), `level` (`warning` or `error`) and `grep` (any case) narrow them. The answer stops at 24 KB, with `truncated: true` when older lines were left out |

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

A `type` action with `sensitive: true` sends its text the same way.

## Rate limits

These endpoints have their own limits instead of the API's general one:

| What | Limit |
|---|---|
| Commands (install, launch, actions, run, asking a person) | 60 a minute, per session |
| Reads (status, inspect, screenshot, logs, timeline, artifacts) | 240 a minute, per session |
| Session lists, device models and bundle uploads | 120 a minute, per organization |

Over a limit, the API answers `LIVE_RATE_LIMITED` with how long to wait. Stopping an open session is never refused.

## Errors

Errors are JSON with a `message` and a stable `error` code:

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
