# Device Date & Time

Run a flow with the device clock set to a chosen date and time, useful for testing expiry logic, subscription renewals, time-gated features, free-trial countdowns, or other date-specific UI (birthdays, holidays, "new this week" etc).

By default, a run uses the real current time. Our Android runners use UTC, and our iOS runners use UK time (GMT, or BST in summer).

## Usage

To set the time for a flow, set a [per-flow override](per-flow-overrides.md) in the flow's YAML. The value is an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time string. There's no `dcd cloud` flag for this, so it's set per flow.

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DEVICE_DATETIME: "2030-01-01T09:00:00Z"
    DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE: "America/New_York"   # optional
---
# test steps
```

* `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` — target date/time, ISO 8601 (e.g. `2030-01-01T09:00:00Z`).
* `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` — optional [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (e.g. `Europe/London`). Android only, and only applied together with `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME`. Setting it needs a rootable image, so it isn't available on [Google Play](google-play-apis.md) images.

If the value can't be parsed, it is ignored and the flow runs with the default
(real) time.

Please note that due to platform limitations, this behaves very differently on Android and iOS. 
On Android it sets the real device clock, so the app sees the new time. 
On iOS it only changes the cosmetic status-bar clock — the app's own `Date()` is unaffected as iOS simulators share their host kernel. Read the platform notes below before relying on it.

## Android

Sets the real emulator clock, so `Date.now()`, `System.currentTimeMillis()`, date pickers, and anything else the app reads all see the new time. Auto-time sync is disabled for the run so the value sticks.

The override sets the clock the run starts with. The clock then ticks forward normally for the rest of the run; it isn't frozen. If you need time to stand still, drive it from within your app or test instead.

::: info
Please note that this is not available on Google Play images. [Google Play](google-play-apis.md) emulators are not rootable, so the clock cannot be set. Google Play flows will log a warning and continue on real time. Use the standard image if you need the date/time override.
:::

## iOS

iOS simulators read the host machine's clock and there is no per-simulator API to change it, so:

* The app's `Date()` / `NSDate` is not changed — your app logic will still see the real time. iOS cannot time-travel app code.
* DeviceCloud applies a cosmetic status-bar time only via the simulator status-bar override.
* The status bar shows the hour and minute of the requested time in UTC, so write the value with a `Z` suffix (e.g. `2030-01-01T09:30:00Z` shows `9:30`). `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` is ignored on iOS.
* Apple's tooling only accepts whole `HH:MM` times and rejects a zero minute, so a requested time on the hour (e.g. `09:00`) is shown as `9:01`, and midnight (`00:xx` UTC) is left at the real time.

If you need real time-travel on iOS, control the date from inside your app (e.g. a debug/launch argument) rather than relying on this override.
