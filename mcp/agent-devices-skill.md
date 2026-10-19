# Agent instructions for Agent Devices

Your agent works better with [Agent Devices](agent-devices.md) when it knows the loop: look at the screen, act, look again. Copy one of these into your project so it does.

## `AGENTS.md`

Codex, Cursor, Claude Code and most other agents read an `AGENTS.md` file at the root of your repository. Add this section to it:

````markdown
## Testing on a device (DeviceCloud)

Use the DeviceCloud MCP tools to check app changes on a real iOS simulator or Android emulator.

1. Call `cheat_sheet` once for Maestro syntax.
2. `start_device` with the platform (`list_devices` shows the models). A queued session is normal: it starts on its own.
3. `install_app`, then `launch_app`.
4. Loop: `inspect_screen` to see what is on screen, then `run` with Maestro commands to act, then `inspect_screen` again. Target elements by their text or id from `inspect_screen`, not by coordinates. Use `take_screenshot` when the layout matters.
5. If a step needs a person (a 2FA code, a CAPTCHA, a payment sheet), call `request_human` with what they should do, and poll `get_human_status` until it is handed back.
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

1. Call `cheat_sheet` once for Maestro syntax.
2. `start_device` with the platform. A queued session starts on its own.
3. `install_app` (with `app_path` for a local build when using `dcd mcp`), then `launch_app`.
4. Loop: `inspect_screen`, then `run` with Maestro commands, then `inspect_screen` again. Target elements by text or id, not coordinates.
5. If a person is needed (2FA, CAPTCHA, payment), call `request_human` and poll `get_human_status` until it is handed back.
6. Always `stop_device` when done, even after a failure.

Pass secrets in `run`'s `env` and use `${NAME}` in the flow; never write them into YAML.
````

Both assume the DeviceCloud MCP server is connected: see [Connect your agent](agent-devices.md#connect-your-agent).
