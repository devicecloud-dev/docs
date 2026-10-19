# Agent Devices tool reference

The tools DeviceCloud's hosted MCP server (`https://api.devicecloud.dev/mcp`) offers for [Agent Devices](agent-devices.md). Every tool except `list_devices` and `cheat_sheet` takes an optional `session_id`. You can leave it out when your organization has exactly one open session.

Every result includes the session block: `id`, `state`, `platform`, `model`, `queue` (position, ETA and reason while queued), `time_remaining_s`, `idle_remaining_s`, `cost_so_far_usd`, `last_crash`, `warnings`, and `monitor_url` (the session's page in the console).

When a tool fails, the result is an error with a stable `error` code, the same codes as the [REST API](../api/device-sessions.md#errors).

## `list_devices`

List the cloud devices you can start (iOS simulators and Android emulators, with their OS versions and the defaults) and your organization's open device sessions. Use this first, before start_device, or to find a session_id.

Read-only.

No inputs.

## `start_device`

Lease a fresh cloud iOS simulator or Android emulator. Use this when you need a mobile device and none is available locally. Billed per minute from when a device is assigned until the session ends ($0.03/min before any discount); call stop_device when you are done. Sessions end on their own after 5 idle minutes or their max duration. When the fleet is busy the session is "queued": that is not an error, it starts on its own. Waits up to 60s for the device (wait: false returns at once); if it is still queued or provisioning, poll get_device_status until state is "ready".

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `platform` | `ios` or `android` | Yes | ios or android. |
| `model` | string | No | A model from list_devices, e.g. "iphone-16" or "pixel-10". Default: the platform default. |
| `os` | string | No | iOS major (e.g. "26") or Android API level (e.g. "36"). Default: the model default. |
| `google_play` | boolean | No | Android only: an image with Google Play services. |
| `app_binary_id` | string | No | An uploaded build to install when the device is ready. |
| `max_duration_min` | integer | No | End the session after this many minutes. Default and ceiling: your organization's limit. |
| `client_label` | string | No | Who is driving, e.g. "claude-code". Shown to people watching the session. |
| `record` | boolean | No | Record the session on video. Default true. A screenshot after each action and the device log are kept either way. |
| `wait` | boolean | No | Wait up to 60s for the device to be ready. Default true. |

## `get_device_status`

A session's state (queued, provisioning, ready, active, needs_human, released, expired, failed), its queue position, time and idle time left, cost so far, the app's last crash and warnings. Poll this after start_device until state is "ready".

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `stop_device`

End a device session and release the device. Billing stops. Call this as soon as you are done with a device.

Ends the session.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `install_app`

Install an app on the session's device: an uploaded build (app_binary_id; upload with `dcd upload` or the DeviceCloud console), or a build at an https URL (app_url, up to 500 MB). Android takes an .apk; iOS takes a zipped simulator .app (not an .ipa). Returns the app id. While it installs, commands answer LIVE_NOT_READY (phase "installing_app"); retry them after a few seconds. Then launch it with launch_app.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `app_binary_id` | string | No | An uploaded build's id. Pass this or app_url. |
| `app_url` | string | No | An https link to the build, e.g. a CI artifact or a signed storage URL. Pass this or app_binary_id. |

## `launch_app`

Launch an app on the device: the installed build by default, or any app by id (e.g. "com.apple.Preferences" for iOS Settings). clear_state wipes its data first.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `app_id` | string | No | Bundle id or package name. Default: the installed build. |
| `clear_state` | boolean | No | Clear the app's data before launching. |

## `inspect_screen`

The current screen as compact JSON: every element with text, an id, a label or a hint, with its bounds. Use it before tapping, and copy txt and rid values exactly into run commands (tapOn text / id). Shows the result of your last command.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `take_screenshot`

A screenshot of the device, showing the result of your last command. Prefer inspect_screen for finding things to tap; use this to see layout, images and colours.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `run`

Run Maestro on the device: `yaml` is one flow (a header naming the app, `---`, then commands), run whole. Or `flow_upload_id` runs an uploaded zip of flows (`flow` names the entry file; omitted, all of them run). Waits up to ~110s; a longer flow answers status "running" with a command_id for get_command_status. See cheat_sheet for syntax.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `yaml` | string | No | One Maestro flow, e.g. "appId: com.example\n---\n- tapOn: \"Log in\"". |
| `flow_upload_id` | string | No | An uploaded flow bundle (zip). |
| `flow` | string | No | The entry flow inside the bundle, e.g. "flows/login.yaml". |
| `env` | object of strings | No | Secrets and variables for the flow, used in the YAML as ${NAME}, e.g. {"PASSWORD": "..."} with inputText: ${PASSWORD}. Stored encrypted, never shown, and masked in the output. Names starting with DCD_ are reserved. |

## `get_command_status`

The status and result of a run that answered "running" because it outlasted the wait.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `command_id` | string | Yes | The command_id run returned. |

## `get_logs`

The installed app's recent device log lines (logcat on Android, the unified log on iOS). Use after a failure or when the session warns that the app crashed.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `lines` | integer | No | How many lines. Default 200. |

## `request_human`

Ask a person to do something on the device that you can't: enter a 2FA code, solve a CAPTCHA, approve a payment sheet, log in with credentials you don't have. The session waits for them (its idle timer pauses, for up to 30 minutes by default) and they see your reason in the DeviceCloud console. Then poll get_human_status until handed_back is true, and read their note.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `reason` | string | Yes | What the person should do, e.g. "Enter the 2FA code sent to the test phone, then hand back". |

## `get_human_status`

Whether the session is still waiting for a human (waiting, reason, expires_at), or a human has handed it back (handed_back, with their note). Poll this every 30 seconds or so after request_human.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `cheat_sheet`

Maestro syntax and how to work with DeviceCloud device sessions. Read it before your first run.

Read-only.

No inputs.

