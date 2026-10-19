# Device sessions

The REST API behind [Agent Devices](../mcp/agent-devices.md). The MCP tools call these same endpoints. Authenticate with an [API key](../getting-started/api-keys.md) in `x-app-api-key`. A key limited to **Device sessions only** can reach these endpoints and the build upload endpoints, but nothing else.

A session is named by its `id` (for example `brave-teal-otter`) in every path. Every response includes a `session` block (see [the tool reference](../mcp/agent-devices-tools.md)).

## Sessions

| Method and path | What it does |
|---|---|
| `GET /device/models` | The devices you can start: models, OS versions and the defaults |
| `POST /device/sessions` | Start a session. Body: `platform` (`ios` or `android`), and optionally `model`, `os`, `googlePlay`, `binaryUploadId`, `maxDurationMin`, `clientLabel`, `record` (default `true`) |
| `GET /device/sessions` | Your organization's open sessions. `?all=true` adds those that ended in the last day |
| `GET /device/sessions/:id` | One session |
| `DELETE /device/sessions/:id` | Stop a session and release the device |

## The device

| Method and path | What it does |
|---|---|
| `POST /device/sessions/:id/install` | Install a build: `{ "binaryUploadId": "..." }`, or `{ "url": "https://..." }` for an `.apk` or a zipped simulator `.app` at a link (up to 500 MB) |
| `POST /device/sessions/:id/launch` | Launch an app: `{ "appId"?: "...", "clearState"?: true }`. Without `appId`, the installed build |
| `POST /device/sessions/:id/actions` | One action: `tap` (`x`/`y` percent, `text` or `id`), `type` (`text`, and `sensitive: true` to keep it secret), `swipe` (`direction`, or `from`/`to`), `press_key` (`key`) |
| `POST /device/sessions/:id/run` | Run Maestro: `{ "yaml": "..." }` for one flow, or `{ "flowUploadId": "...", "flow"?: "..." }` for a [flow bundle](#flow-bundles). `env` passes secrets and variables (see below). Waits about 110 s, then answers `running` |
| `GET /device/sessions/:id/commands/:commandId` | The status and result of a `run` that answered `running` |
| `GET /device/sessions/:id/inspect` | The screen as compact JSON |
| `GET /device/sessions/:id/screenshot` | The latest screenshot, as a data URL |
| `GET /device/sessions/:id/logs?lines=200` | The installed app's recent device log lines |

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
| `POST /device/sessions/:id/request-human` | `{ "reason": "..." }`. The session waits for a person. Its idle timer pauses for up to 30 minutes, and the starter and your [webhook](../notifications/webhook-notifications.md#device-needs-human) are told |
| `GET /device/sessions/:id/human` | Whether it's still waiting, or was handed back, with the person's note |
| `POST /device/sessions/:id/hand-back` | `{ "note"?: "..." }`. Hand the session back to the agent |

## Artifacts

| Method and path | What it does |
|---|---|
| `GET /device/sessions/:id/timeline` | Every command and event, newest first: who sent it, its status, and the screenshot after it. Paged with `limit` and `before` |
| `GET /device/sessions/:id/artifacts` | Links to the session's video, device log, and the screenshot and screen dump after each action. Paged the same way |

## Secrets

`env` on `run` is an object of names to string values. Names are letters, digits and `_`; names starting with `DCD_` are reserved. Refer to them in the YAML as `${NAME}`. They're encrypted before they're stored, never shown in the timeline, and masked in the command's output.

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
| `LIVE_SECRETS_UNAVAILABLE` | Secrets can't be accepted right now |
| `API_KEY_SCOPE` | The API key isn't allowed to reach this endpoint |
