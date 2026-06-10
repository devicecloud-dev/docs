# Device Date & Time

Run a flow with the device clock set to a chosen date and time, useful for testing expiry logic, subscription renewals, time‑gated features, free‑trial countdowns, or other date‑specific UI (birthdays, holidays, "new this week" etc).

By default our runners take the current time when booting. Our Android runners run UTC and our iOS runners match GMT/BST in accordance with Daylight Savings Time.

## Usage

To set the time for a flow, set a DeviceCloud env variable in the flow's YAML. The value is an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date‑time string.

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DEVICE_DATETIME: "2030-01-01T09:00:00Z"
    DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE: "America/New_York"   # optional
---
# test steps
```

* `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` — target date/time, ISO 8601 (e.g.
  `2030-01-01T09:00:00Z`).
* `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` — optional [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  (e.g. `Europe/London`). Android only.

If the value can't be parsed, it is ignored and the flow runs with the default
(real) time.

Please note that due to platform limitations, this behaves very differently on Android and iOS. 
On Android it sets the real device clock, so the app sees the new time. 
On iOS it only changes the cosmetic status‑bar clock — the app's own `Date()` is unaffected as iOS simulators share their host kernel. Read the platform notes below before relying on it.

## Semantics

The override sets the device's starting clock. The clock then ticks forward normally from there for the rest of the run as it is not a frozen clock. If you need time to stand still, you'll need to drive it from within your app/test instead.

## Android

Sets the real emulator clock, so `Date.now()`, `System.currentTimeMillis()`, date pickers, and anything else the app reads all see the new time. Auto‑time sync is disabled for the run so the value sticks.

{% hint style="info" %}
Please note that this is not available on Google Play images.** [Google Play](google-play-apis.md) emulators are not rootable, so the clock cannot be set. Those flows log a warning and continue on the real time (auto‑time is left on so the device stays correctly synced). Use the standard image if you need the date/time override.
{% endhint %}

## iOS — cosmetic only

iOS simulators read the host machine's clock and there is no per‑simulator API to change it, so:

* The app's `Date()` / `NSDate` is not changed — your app logic will still see the real time. iOS cannot time‑travel app code.
* DeviceCloud applies a cosmetic status‑bar time only via the simulator status‑bar override.
* Apple's tooling only accepts whole `HH:MM` times and rejects a zero minute, so a requested time on the hour (e.g. `09:00`) is shown as `09:01`, and midnight (`00:xx`) is left at the real time. You can workaround this by setting the time one minute before you need, for example if you need `09:00`, you can set `08:58` and in most cases the simulator will have been running for long enough to increment the clock.

If you need real time‑travel on iOS, control the date from inside your app (e.g. a debug/launch argument) rather than relying on this override.

## Precedence

1. `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` (per test)
2. Default: the real current device time
