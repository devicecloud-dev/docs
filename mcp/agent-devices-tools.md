# Agent Devices tool reference

These are the tools DeviceCloud's hosted MCP server (`https://api.devicecloud.dev/mcp`) offers for [Agent Devices](agent-devices.md). Each description below is the one your agent sees. Every tool except `list_devices` and `cheat_sheet` takes an optional `session_id`. You can leave it out when your organization has exactly one open session.

A [read-only connection](agent-devices.md#read-only) offers only the tools marked **Read-only**. [`dcd mcp`](agent-devices.md#headless-through-the-cli) serves the same tools, and adds `app_path` to `install_app` and `path` to `run` for files on your machine.

## The session block

Every result includes a `session` block, so the agent never needs a separate call to stay oriented:

| Field | What it says |
|-------|--------------|
| `id` | The session id, such as `brave-teal-otter` |
| `state` | `queued`, `provisioning`, `ready`, `active`, `needs_human`, `released`, `expired` or `failed` |
| `release_reason` | Why the session ended, once it has |
| `platform`, `model` | The device, such as `ios` and `iphone-16-ios-26.5` |
| `client_label` | Who is driving, such as `claude-code` |
| `created_at`, `started_at`, `released_at` | When the session was asked for, got its device, and ended |
| `expires_at` | When it reaches its maximum length |
| `queue` | While it's queued: its `position`, `eta_s` (an estimate, or `null`), `waited_s`, and `reason` (`waiting_for_device` or `fleet_busy`) |
| `time_remaining_s` | Seconds until its maximum length |
| `idle_remaining_s` | Seconds until the idle timeout. `null` while it waits for a person |
| `cost_so_far_usd` | What it has cost so far, after your organization's discount |
| `install` | The build it was asked to install: `binary_upload_id`, `status` (`installing`, `installed` or `failed`) and `error` |
| `last_crash` | The app's last crash: `at` and `summary` |
| `warnings` | Plain-English warnings, such as an upcoming idle timeout, a crash or a failed install |
| `monitor_url` | The session's page in the console, where you can watch it and take control |

## Errors

When a tool fails, its result is an error with the same `error` code and `message` as the [REST API](../api/device-sessions.md#errors), plus the session block when there is one.

## `list_devices`

List the cloud devices you can start (iOS simulators and Android emulators, with their OS versions and the defaults) and your organization's open device sessions. Use this first, before start_device, or to find a session_id.

Read-only.

No inputs.

## `start_device`

Lease a fresh cloud iOS simulator or Android emulator. Use this when you need a mobile device and none is available locally. Billed per minute from when a device is assigned until the session ends ($0.03/min before any discount); call stop_device when you are done. Sessions end on their own after 5 idle minutes or their max duration. If a start_device call fails without an answer (a connection error, or a 502 or 504 from a proxy), a session may still have started: call list_devices before you start another. When the fleet is busy the session is "queued": that is not an error, it starts on its own. Waits up to 60s for the device and the app_binary_id install (wait: false returns at once). If it is still queued or provisioning, or install.status is "installing", call get_device_status with wait: true until it is not, and do not end your turn meanwhile: a device that becomes ready with nobody driving it is billed and stops after 5 idle minutes. Ask the user anything you need before you start the device; a question asked while it starts ends your turn, so use a sensible default instead. Give the user session.monitor_url as soon as you have it: there they can watch the screen live and take control. Share it and carry on; do not wait for a reply.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `platform` | `ios` or `android` | Yes | ios or android. |
| `model` | string | No | A model from list_devices, e.g. "iphone-16" or "pixel-10". Default: the platform default. |
| `os` | string | No | iOS major (e.g. "26") or Android API level (e.g. "36"). Default: the model default. |
| `google_play` | boolean | No | Android only: an image with Google Play services. |
| `app_binary_id` | string | No | An uploaded build to install when the device is ready. |
| `max_duration_min` | integer, more than 0 | No | End the session after this many minutes. Default and ceiling: your organization's limit, at most 60. |
| `client_label` | string | No | Who is driving, e.g. "claude-code". Shown to people watching the session. |
| `record` | boolean | No | Record the session on video. Default true. A screenshot after each action and the device log are kept either way. |
| `wait` | boolean | No | Wait up to 60s for the device to be ready. Default true. |

## `get_device_status`

A session's state (queued, provisioning, ready, active, needs_human, released, expired, failed), its queue position, time and idle time left, cost so far, the app's last crash and warnings. After start_device or install_app, call this with wait: true until state is "ready" and install.status is not "installing"; each call waits up to 60s.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `wait` | boolean | No | If the session is queued or provisioning, or an app is installing, wait up to 60s for it to finish. Default false. |

## `stop_device`

End a device session and release the device. Billing stops. Call this as soon as you are done with a device.

Ends the session.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `install_app`

Install an app on the session's device: an uploaded build (app_binary_id; upload with `dcd upload` or the DeviceCloud console), or a build at an https URL (app_url, up to 500 MB). Android takes an .apk; iOS takes a zipped simulator .app (not an .ipa). Returns the app id. It installs in the background: call get_device_status with wait: true until install.status is "installed", then launch it with launch_app. A command sent meanwhile waits up to 45s for the install, then answers LIVE_NOT_READY (phase "installing_app").

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

The current screen as compact JSON: every element of the app with text, an id, a label or a hint, with its bounds and any state (checked, selected, focused, enabled: false). Use it before tapping, and copy txt and rid values exactly into run commands (tapOn text / id). Shows the result of your last command. The on-screen keyboard's keys and the System UI (status bar, navigation bar) are left out and counted in `hidden`; keyboard_open says a keyboard is showing.

While a keyboard is open, some apps report their own fields and buttons with clipped accessibility bounds, and those elements are then missing from inspect_screen even with `all`, while the screenshot still shows them. Seen with React Native apps on Android that slide an input bar up above the keyboard. Hide the keyboard first, with `run` and `- hideKeyboard`, then inspect_screen again. Typing does not need the keyboard on screen: `inputText` goes to the focused field.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `all` | boolean | No | Also list the keyboard keys and System UI elements. Default false. |

## `take_screenshot`

A screenshot of the device, showing the result of your last command. Prefer inspect_screen for finding things to tap; use this to see layout, images and colours.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `run`

Run a Maestro flow on the device: `yaml` is one flow (a header naming the app, `---`, then commands), run whole. Or `flow_upload_id` runs an uploaded zip of flows (`flow` names the entry file; omitted, all of them run). A device session runs the common Maestro commands and no flow scripts (runScript, evalScript, JavaScript conditions): cheat_sheet lists what it runs. A command it does not run fails the flow before its first step, with its line. Waits up to 110s (wait_seconds changes it); a longer flow answers status "running" with a command_id: call get_command_status with wait: true. A failed run's result has screen_text, the app's visible text after the failure, and failed_at: the file, line and command that failed. See cheat_sheet for syntax.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `yaml` | string | No | One Maestro flow, e.g. "appId: com.example\n---\n- tapOn: \"Log in\"". |
| `flow_upload_id` | string | No | The id of a flow bundle (a zip of flows) registered at POST /device/bundles. The local `dcd mcp` server uploads a directory for you. |
| `flow` | string | No | The entry flow inside the bundle, e.g. "flows/login.yaml". |
| `env` | object of strings | No | Secrets and variables for the flow, used in the YAML as ${NAME}, e.g. {"PASSWORD": "..."} with inputText: ${PASSWORD}. Stored encrypted, never shown, and masked in the output. Names starting with DCD_ are reserved. |
| `wait_seconds` | number, 0 to 300 | No | How long to wait for the flow before answering "running", up to 300. Default 110. Raise it for a flow you expect to take longer, so it finishes in one call. |

## `get_command_status`

The status and result of a run that answered "running" because it outlasted the wait. Call it with wait: true rather than polling or sleeping; each call waits up to 110s.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `command_id` | string | Yes | The command_id run returned. |
| `wait` | boolean | No | If the run is still going, wait up to 110s for it to finish. Default false. |

## `get_logs`

The installed app's recent device log lines (logcat on Android, the unified log on iOS). Use after a failure or when the session warns that the app crashed. Narrow with level and grep: the newest 2000 lines are searched. The answer stops at 24 KB (truncated: true when older lines were left out).

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `lines` | integer, at most 2000 | No | How many lines. Default 200. |
| `level` | `warning` or `error` | No | Only lines at this level and above. iOS has no warning level, so warning gives its errors and faults. |
| `grep` | string, up to 200 characters | No | Only lines containing this text, any case. |

## `request_human`

Ask a person to do something on the device that you can't: enter a 2FA code, solve a CAPTCHA, approve a payment sheet, log in with credentials you don't have. The session waits for them (its idle timer pauses, for up to 30 minutes by default) and they see your reason in the DeviceCloud console. Tell the user what you need and give them session.monitor_url, where they can take control and hand back. Then poll get_human_status until handed_back is true, and read their note.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |
| `reason` | string, up to 500 characters | Yes | What the person should do, e.g. "Enter the 2FA code sent to the test phone, then hand back". |

## `get_human_status`

Whether the session is still waiting for a human (waiting, reason, expires_at), or a human has handed it back (handed_back, with their note). Poll this every 30 seconds or so after request_human.

Read-only.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | No | The session id from start_device, e.g. "brave-teal-otter". Optional when your organization has exactly one open session. |

## `cheat_sheet`

How to work with DeviceCloud device sessions, and the Maestro commands a session runs. Read it before your first run.

Read-only.

No inputs.
