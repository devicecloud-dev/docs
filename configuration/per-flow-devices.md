# Per-flow Devices

By default every flow in an upload runs on the same device, set by the `--ios-device`,
`--ios-version`, `--android-device` and `--android-api-level` flags on `dcd cloud`.

Sometimes a single flow only matters on one device for example a flow you must verify on a
tablet, or a flow that has to work on your oldest supported OS. Rather than running
a separate upload per flow, a flow can declare the device it needs directly in its YAML.

A flow that declares a device runs as normal on that device. Flows that declare
nothing inherit the upload's device, exactly as before. Your run count does not change.

## Usage

Set the device in the flow's `env:` block. You can find a list of supported devices and operating systems [here](../getting-started/devices-configuration.md).

### iOS

```yaml
# checkout-tablet.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_IOS_DEVICE: ipad-pro-6th-gen
    DEVICECLOUD_OVERRIDE_IOS_VERSION: "26"
---
# test steps
```

### Android

```yaml
# onboarding-oldest-os.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_ANDROID_DEVICE: pixel-6
    DEVICECLOUD_OVERRIDE_ANDROID_API_LEVEL: "30"
---
# test steps
```

Either key may be set on its own. A flow that sets only `DEVICECLOUD_OVERRIDE_IOS_DEVICE`
keeps the upload's iOS version, and vice versa.

## Precedence

1. `DEVICECLOUD_OVERRIDE_*` in the flow's YAML (per test)
2. The upload-wide `--ios-device` / `--ios-version` / `--android-device` / `--android-api-level` flags
3. Default: iPhone 14 on iOS 17, or Pixel 7 on API level 34

## Billing

Each flow still runs once, so your total run count is unchanged. What can change is a flow's
**rate**: iPad and Google Play flows are charged at our advanced rate as per our
[pricing](../billing/test-run-billing.md). Targeting an iPad from one flow in an otherwise
iPhone upload charges that one flow at the advanced rate, and the rest at the standard rate.

## Rules

- Device and OS must be a supported combination, including Google Play if applicable.

- You cannot target across platforms in the same upload.

- Currently not supported on `m1` runners due to device limitations.

## Running a suite across several devices

Per-flow targeting picks a device for *one* flow. To run your **entire** suite against several
devices, use a [device matrix](device-matrix.md) — every flow runs once per device, under a single
upload.