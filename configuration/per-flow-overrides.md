---
description: "Pin one flow to its own device, plus every DEVICECLOUD_OVERRIDE_* key a flow can set in its env block to change its own device, runner type, locale, clock, animations or time limit."
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

To run one flow on its own device, see [Pin a flow to a device](#pin-a-flow-to-a-device). [Keys](#keys) lists every override.

## Pin a flow to a device

By default every flow in an upload runs on the same device, set by the `--ios-device`,
`--ios-version`, `--android-device` and `--android-api-level` flags on `dcd cloud`.

Sometimes a single flow only matters on one device: for example, a flow you must verify on a
tablet, or a flow that has to work on your oldest supported OS. Rather than running
a separate upload per flow, a flow can declare the device it needs directly in its YAML.

A flow that declares a device runs as normal on that device. Flows that declare
nothing inherit the upload's device. Your run count does not change.

### Usage

Set the device in the flow's `env:` block, like the other [per-flow overrides](#keys). Supported devices and OS versions are listed in [Devices & OS Versions](../getting-started/devices-configuration.md).

#### iOS

```yaml
# checkout-tablet.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_IOS_DEVICE: ipad-pro-m5-13
    DEVICECLOUD_OVERRIDE_IOS_VERSION: "26"
---
# test steps
```

#### Android

```yaml
# onboarding-oldest-os.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_ANDROID_DEVICE: pixel-6
    DEVICECLOUD_OVERRIDE_ANDROID_API_LEVEL: "32"
---
# test steps
```

Either key may be set on its own. A flow that sets only `DEVICECLOUD_OVERRIDE_IOS_DEVICE`
keeps the upload's iOS version, and vice versa.

### Precedence

1. `DEVICECLOUD_OVERRIDE_*` in the flow's YAML (per test)
2. The upload-wide `--ios-device` / `--ios-version` / `--android-device` / `--android-api-level` flags
3. Default: iPhone 16 on iOS 26, or Pixel 10 on API level 36 (see [Default Devices](../getting-started/devices-configuration.md#default-devices))

### Billing

Each flow still runs once, so your total run count is unchanged. What can change is a flow's
**rate**: iPad, iPhone Duo, Generic Tablet, Pixel 10 Pro Fold and Google Play flows are charged at our advanced rate as per our
[pricing](../billing/test-run-billing.md). Targeting an iPad from one flow in an otherwise
iPhone upload charges that one flow at the advanced rate, and the rest at the standard rate.

### Rules

- Device and OS must be a supported combination, including Google Play if applicable.

- You cannot target across platforms in the same upload.

- On the `m1` [runner type](runner-type.md), a flow's device must be on API level 34 to 37. Google Play is available only on `pixel-8` (API 34) and `pixel-10` (API 36, 37), and Generic Tablet isn't available.

### Running a suite across several devices

Per-flow targeting picks a device for *one* flow. To run your **entire** suite against several
devices, use a [device matrix](device-matrix.md) — every flow runs once per device, under a single
upload.

## Keys

| Key | Values | What it does | Details |
|-----|--------|--------------|---------|
| `DEVICECLOUD_OVERRIDE_IOS_DEVICE` | An iOS device, such as `ipad-pro-m5-13` | Runs the flow on this iOS device instead of the upload's | [Pin a flow to a device](#pin-a-flow-to-a-device) |
| `DEVICECLOUD_OVERRIDE_IOS_VERSION` | An iOS version, such as `"26"` | Runs the flow on this iOS version instead of the upload's | [Pin a flow to a device](#pin-a-flow-to-a-device) |
| `DEVICECLOUD_OVERRIDE_ANDROID_DEVICE` | An Android device, such as `pixel-6` | Runs the flow on this Android device instead of the upload's | [Pin a flow to a device](#pin-a-flow-to-a-device) |
| `DEVICECLOUD_OVERRIDE_ANDROID_API_LEVEL` | An API level, such as `"32"` | Runs the flow on this API level instead of the upload's | [Pin a flow to a device](#pin-a-flow-to-a-device) |
| `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY` | `true` | Runs the flow on a Google Play image. `false` doesn't take a flow off `--google-play` | [Google Play APIs](google-play-apis.md#per-test) |
| `DEVICECLOUD_OVERRIDE_RUNNER_TYPE` | A runner type, such as `m4` or `m1` | Runs the flow on this runner type instead of the upload's `--runner-type` | [Runner Types](runner-type.md#overriding-the-runner-type-for-a-single-flow) |
| `DEVICECLOUD_OVERRIDE_DEVICE_LOCALE` | A locale, such as `de_DE` | Sets the device's language and region instead of `--device-locale` | [Locale](device-settings.md#setting-the-locale) |
| `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` | An ISO 8601 date-time, such as `"2030-01-01T09:00:00Z"` | Starts the flow with the device clock set to this time. On iOS, only the status-bar clock changes | [Date and time](device-settings.md#date-and-time) |
| `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` | An IANA time zone, such as `America/New_York` | Sets the time zone, together with `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME`. Android only, and not on Google Play images | [Date and time](device-settings.md#date-and-time) |
| `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | `true` or `false` | Turns animations off (`true`) or keeps them on (`false`) for the flow, on both platforms | [Animations](device-settings.md#per-test-both-platforms) |
| `DEVICECLOUD_OVERRIDE_ANDROID_DISABLE_ANIMATIONS` | `true` or `false` | The same, on Android only. Beats `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | [Animations](device-settings.md#per-test-platform-specific) |
| `DEVICECLOUD_OVERRIDE_IOS_DISABLE_ANIMATIONS` | `true` or `false` | The same, on iOS only. Beats `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` | [Animations](device-settings.md#per-test-platform-specific) |
| `DEVICECLOUD_OVERRIDE_EXTENDED_RUNTIME` | `true` | Gives the flow up to 20 minutes instead of 10, charged at 2× its rate | [Extended Runtime](extended-runtime.md) |
| `DEVICECLOUD_OVERRIDE_DEVICE_CONTROL` | `"true"` | Starts a device-control server for the flow and sets `DCD_CONTROL_URL`. Foldable runs always have one | [Foldable Devices](foldable-devices.md#using-the-commands-on-other-devices) |
