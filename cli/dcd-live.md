# dcd live

Start an interactive cloud device session and drive it from your terminal — install a build, run individual Maestro commands or a whole flow, capture screenshots, and dump the view hierarchy. This is ideal for authoring and debugging flows against a real cloud device.

{% hint style="warning" %}
**Live is in beta** and is billed at **$0.03/min**. Access is limited and by request only. If you would like to try Live, please contact support to request access. `dcd live` requires a [`dcd login`](dcd-login.md) session.
{% endhint %}

```bash
dcd live <subcommand> [flags]
```

A typical session: start a device, install a build, interact, then stop.

```bash
dcd live start --platform android --wait
dcd live install --session <name> --app-binary-id <id> --wait
dcd live run --session <name> path/to/flow.yaml
dcd live stop --session <name>
```

Every subcommand (except `start`) takes a `--session <name>` flag identifying the session, and accepts `--api-key` / `--api-url`.

## `dcd live start`

Start a new live device session. Prints the session name and a console URL you can open to watch the device.

| Flag | Description |
|------|-------------|
| `--platform <android\|ios>` | Device platform (default: `android`) |
| `--app-binary-id <id>` | Binary upload ID to install on the device at start |
| `--device-locale <locale>` | Device locale, e.g. `de_DE` |
| `--android-device <device>` | Android only. Device profile (`pixel-6`, `pixel-6-pro`, `pixel-7`, `pixel-7-pro`) |
| `--android-api-level <level>` | Android only. API level, e.g. `34` (must be passed together with `--android-device`) |
| `--wait` | Block until the device is ready to accept commands |

## `dcd live install`

Install a binary on a running session's device.

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |
| `--app-binary-id <id>` | **Required.** Binary upload ID to install |
| `--wait` | Block until the device is ready again after installing |

## `dcd live exec`

Execute one or more Maestro YAML commands against the session.

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |
| `--yaml <commands>` | Inline Maestro YAML commands, e.g. `--yaml "- launchApp"` |
| `--file <path>` | Read the Maestro YAML to execute from a file (alternative to `--yaml`) |
| `--wait` | Wait for the device to be ready before executing |

Pass either `--yaml` or `--file`, not both.

## `dcd live run`

Run a whole Maestro flow file against the session. The flow's `appId:` header is handled automatically.

| Flag | Description |
|------|-------------|
| `<flow-file>` | **Required.** Path to the Maestro flow file (positional argument) |
| `--session <name>` | **Required.** Live session name |
| `--timeout <seconds>` | Max seconds to wait for the flow to finish (default: `600`) |
| `--wait` | Wait for the device to be ready before running |

## `dcd live screenshot`

Save the current device screen to an image file (PNG or JPEG, matching the device format).

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |
| `--output <path>`, `-o` | File path to write to (default: `live-screenshot.<ext>`) |

## `dcd live hierarchy`

Dump the current view hierarchy — the selectors (text, accessibility labels, resource IDs) you can tap and assert on.

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |
| `--json` | Output the raw hierarchy as JSON |
| `--output <path>`, `-o` | Write the output to a file instead of stdout |

## `dcd live status`

Show a session's status — platform, readiness, current device phase, device model, locale, and time until auto-cancel.

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |

## `dcd live stop`

Stop a live session.

| Flag | Description |
|------|-------------|
| `--session <name>` | **Required.** Live session name |
