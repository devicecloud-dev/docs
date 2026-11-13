# Agent instructions for Agent Devices

Your agent works better with [Agent Devices](agent-devices.md) when it knows the loop: look at the screen, act, look again. Copy one of these into your project so it does.

## `AGENTS.md`

Codex, Cursor, Claude Code and most other agents read an `AGENTS.md` file at the root of your repository. Add this section to it:

````markdown
## Testing on a device (DeviceCloud)

Use the DeviceCloud MCP tools to check app changes on a real iOS simulator or Android emulator.

1. Call `cheat_sheet` once: it lists the Maestro commands a session runs.
2. `start_device` with the platform (`list_devices` shows the models). Give the user the session's `monitor_url`, where they can watch. A queued session is normal: it starts on its own. Until it is ready, call `get_device_status` with `wait: true`.
3. `install_app`, then `get_device_status` with `wait: true` until the install is done, then `launch_app`.
4. Loop: `inspect_screen` to see what is on screen, then act: `tap_on`, `input_text`, `swipe` or `press_key` for one step (the fastest path), or `run` with Maestro commands for several steps or an assertion, then `inspect_screen` again. Target elements by their text or id from `inspect_screen`, not by coordinates. Use `take_screenshot` when the layout matters. If the app's own fields are missing from `inspect_screen` while a keyboard is open, hide it (`run` with `- hideKeyboard`) and inspect again.
5. If a step needs a person (a 2FA code, a CAPTCHA, a payment sheet), call `request_human` with what they should do, tell the user, and poll `get_human_status` until it is handed back.
6. Always `stop_device` when you are done, even after a failure. A session bills by the minute.

Never write passwords or tokens into the YAML. Pass them in `run`'s `env` and use `${NAME}` in the flow.
Read the `warnings` in every result's session block: they say when the idle timeout or the session's time is running out.
````

## Claude Code skill

To load the instructions only when they're needed, save this as `.claude/skills/devicecloud-devices/SKILL.md` in your repository:

````markdown
---
name: devicecloud-devices
description: Check app changes on a real cloud iOS simulator or Android emulator with the DeviceCloud MCP tools. Use when asked to try, test, or reproduce something in the mobile app.
---

# Testing on a DeviceCloud device

1. Call `cheat_sheet` once: it lists the Maestro commands a session runs.
2. `start_device` with the platform, and give the user the session's `monitor_url`. A queued session starts on its own: call `get_device_status` with `wait: true` until it is ready.
3. `install_app` (with `app_path` for a local build when using `dcd mcp`), wait with `get_device_status` until it is installed, then `launch_app`.
4. Loop: `inspect_screen`, then `tap_on`, `input_text`, `swipe` or `press_key` for one step, or `run` with Maestro commands for several, then `inspect_screen` again. Target elements by text or id, not coordinates. If the app's fields are missing while a keyboard is open, hide it (`- hideKeyboard`) and inspect again.
5. If a person is needed (2FA, CAPTCHA, payment), call `request_human`, tell the user, and poll `get_human_status` until it is handed back.
6. Always `stop_device` when done, even after a failure.

Pass secrets in `run`'s `env` and use `${NAME}` in the flow; never write them into YAML.
````

Both assume the DeviceCloud MCP server is connected: see [Connect your agent](agent-devices.md#connect-your-agent).
