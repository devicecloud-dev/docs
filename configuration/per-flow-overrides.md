---
description: "Every DEVICECLOUD_OVERRIDE_* key a flow can set in its env block to change its own device, runner type, locale, clock, animations or time limit."
---

# Per-flow Overrides

Most run settings apply to every flow in an upload. A flow can change some of them for itself by setting a `DEVICECLOUD_OVERRIDE_*` key in its `env:` block:

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_ANDROID_DEVICE: pixel-8
    DEVICECLOUD_OVERRIDE_ANDROID_API_LEVEL: "34"
    DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS: true
---
# test steps
```

An override applies only to the flow that sets it. The other flows in the upload keep the upload's settings.

Overrides only work in a flow's `env:` block. Passed with `-e`, they're treated as ordinary variables and have no effect.

## Keys

| Key | Values | What it does | Details |
|-----|--------|--------------|---------|
| `DEVICECLOUD_OVERRIDE_IOS_DEVICE` | An iOS device, such as `ipad-pro-m5-13` | Runs the flow on this iOS device instead of the upload's | [Per-flow Devices](per-flow-devices.md) |
| `DEVICECLOUD_OVERRIDE_IOS_VERSION` | An iOS version, such as `"26"` | Runs the flow on this iOS version instead of the upload's | [Per-flow Devices](per-flow-devices.md) |
| `DEVICECLOUD_OVERRIDE_ANDROID_DEVICE` | An Android device, such as `pixel-6` | Runs the flow on this Android device instead of the upload's | [Per-flow Devices](per-flow-devices.md) |
| `DEVICECLOUD_OVERRIDE_ANDROID_API_LEVEL` | An API level, such as `"32"` | Runs the flow on this API level instead of the upload's | [Per-flow Devices](per-flow-devices.md) |
| `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY` | `true` | Runs the flow on a Google Play image. `false` doesn't take a flow off `--google-play` | [Google Play APIs](google-play-apis.md#per-test) |
| `DEVICECLOUD_OVERRIDE_RUNNER_TYPE` | A runner type, such as `m4` or `m1` | Runs the flow on this runner type instead of the upload's `--runner-type` | [Runner Types](runner-type.md#overriding-the-runner-type-for-a-single-flow) |
| `DEVICECLOUD_OVERRIDE_DEVICE_LOCALE` | A locale, such as `de_DE` | Sets the device's language and region instead of `--device-locale` | [Device Locale](device-locale.md#usage) |
| `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` | An ISO 8601 date-time, such as `"2030-01-01T09:00:00Z"` | Starts the flow with the device clock set to this time. On iOS, only the status-bar clock changes | [Device Date & Time](device-datetime.md) |
| `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` | An IANA time zone, such as `America/New_York` | Sets the time zone, together with `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME`. Android only, and not on Google Play images | [Device Date & Time](device-datetime.md) |
| `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | `true` or `false` | Turns animations off (`true`) or keeps them on (`false`) for the flow, on both platforms | [Animations](disable-animations.md#per-test-both-platforms) |
| `DEVICECLOUD_OVERRIDE_ANDROID_DISABLE_ANIMATIONS` | `true` or `false` | The same, on Android only. Beats `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | [Animations](disable-animations.md#per-test-platform-specific) |
| `DEVICECLOUD_OVERRIDE_IOS_DISABLE_ANIMATIONS` | `true` or `false` | The same, on iOS only. Beats `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | [Animations](disable-animations.md#per-test-platform-specific) |
| `DEVICECLOUD_OVERRIDE_EXTENDED_RUNTIME` | `true` | Gives the flow up to 20 minutes instead of 10, charged at 2× its rate | [Extended Runtime](extended-runtime.md) |
| `DEVICECLOUD_OVERRIDE_DEVICE_CONTROL` | `"true"` | Starts a device-control server for the flow and sets `DCD_CONTROL_URL`. Foldable runs always have one | [Foldable Devices](foldable-devices.md#using-the-commands-on-other-devices) |
