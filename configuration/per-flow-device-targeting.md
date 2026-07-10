# Per-flow Device Targeting

By default every flow in an upload runs on the same device, set by the `--ios-device`,
`--ios-version`, `--android-device` and `--android-api-level` flags on `dcd cloud`.

Sometimes a single flow only matters on one device — a checkout flow you must verify on a
tablet, an onboarding flow that has to work on your oldest supported OS. Rather than running
a separate upload per flow, a flow can declare the device it needs directly in its YAML.

A flow that declares a device runs **exactly once**, on that device. Flows that declare
nothing inherit the upload's device, exactly as before. Your run count does not change.

## Usage

Set the device in the flow's `env:` frontmatter.

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

{% hint style="info" %}
Quote version numbers (`"26"`, `"30"`). Unquoted, YAML reads them as numbers, which still
works, but quoting keeps the intent obvious.
{% endhint %}

See [devices-configuration.md](../getting-started/devices-configuration.md) for the valid
device ids and the OS versions each one supports.

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

**Device and OS must be a supported combination.** The device/version matrix is ragged — for
example `iphone-15` only supports iOS 17, and `iphone-16-plus` only iOS 26. If any flow names
an unsupported pair, the whole upload is rejected before anything runs, and the error names the
offending flow file and the supported values for that device.

**You cannot target across platforms.** One upload carries one binary, so an Android device
override on an iOS upload is an error rather than being silently ignored — otherwise a flow you
believed was covered would quietly run somewhere else.

**Google Play must be a supported combination too.** A flow combining
`DEVICECLOUD_OVERRIDE_GOOGLE_PLAY` with a device override is validated against the Play device
matrix, which is currently only `pixel-7` on API level `34`. See
[google-play-apis.md](google-play-apis.md).

**Not supported on `m1` runners.** `--runner-type m1` always runs `pixel-7` on API level 34, so
a per-flow Android device override there could never be honoured and is rejected rather than
silently ignored.

**Sequential flows do not share device state.** A `--sequential` chain whose flows target
different devices still just orders them. Every flow boots its own clean simulator, so nothing
carries across the chain — this is true of same-device chains today as well.

## Running a whole suite across several devices

Per-flow targeting picks a device for *one* flow. To run your **entire** suite against several
devices, submit one upload per device:

```bash
for device in iphone-16-pro iphone-16-pro-max; do
  dcd cloud --app-binary-id <id> ./flows \
    --ios-device "$device" --ios-version 18 --async
done
```

{% hint style="warning" %}
`--async` matters here. Without it, each `dcd cloud` blocks on its own poll loop waiting for
results, so the uploads run one after another instead of concurrently.
{% endhint %}
