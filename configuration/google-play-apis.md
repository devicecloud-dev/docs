# Google Play APIs

Flows can run on Android emulators with the Google Play APIs, for apps that need Play Services. These runs are charged at the advanced rate, see [pricing](../billing/test-run-billing.md).

::: warning
**On 14 December 2026, Google Play runs move from x86 (`cpu1`) to Apple Silicon (`m1`) emulators**, at the same price. You can test your app on them now: add `--runner-type m1` to your Google Play runs. Your app needs arm64-v8a native code. See [Moving to Apple Silicon](#moving-to-apple-silicon-m1).
:::

## Usage

### Whole upload

Pass the flag on `dcd cloud`:

```bash
dcd cloud ... --google-play
```

Every Android flow in the upload runs on a Google Play emulator.

### Per test

When most of your suite is fine on the standard image but a single flow needs Play
Services (for example, a Google Sign-In step or a Play-billing screen), opt that
one flow in with a [per-flow override](per-flow-overrides.md) in its YAML:

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: true
---
# test steps
```

Only that flow boots on a Google Play emulator; the rest of the upload uses the
standard image. Billing is per flow — Play-image flows are charged at the advanced
rate, the others at the standard rate.

## Which flows use Google Play

A flow runs on a Google Play image when the upload passes `--google-play` or the flow sets `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: true`. Otherwise it uses the standard Google APIs image.

A flow can't opt out of `--google-play`. `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: false` has no effect, so the flow still runs on Google Play and is charged at the advanced rate. To put only some flows on Google Play, leave out `--google-play` and opt those flows in.

In a [device matrix](device-matrix.md) upload, each cell's own setting decides instead (`:play` on the cell, or `--google-play` for every cell). A flow's `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY` is ignored there unless the flow also names its own device.

## Device availability

Google Play APIs are available on these devices:

| Device | API levels |
|--------|------------|
| `pixel-8` | `34` |
| `pixel-10` | `36`, `37` |
| `pixel-7` (deprecated) | `34` |

`pixel-7` is deprecated. See [Deprecations & Removals](../getting-started/deprecations.md) for its removal date and what to move to.

On the `m1` [runner type](runner-type.md), Google Play is available on `pixel-8` (API `34`) and `pixel-10` (API `36`, `37`).

Pass the device and API level together on Google Play runs:

```bash
dcd cloud ... --google-play --android-device pixel-8 --android-api-level 34
```

If you pass only one of them, DeviceCloud picks the other so the pair has a Google Play image: a device runs on its Google Play API level, and an API level runs on a Google Play device that offers it. If you pass neither, the run uses the default Android device, Pixel 10 on API 36, which has a Google Play image. A device with no Google Play image, or an API level no Google Play device offers, is rejected.

If only some flows opt in with `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY`, those flows are resolved the same way, from the device and API level the flow names, then the ones the upload names. A flow that opts in runs on Pixel 10 on API 36 when neither the flow nor the upload names a device or API level. To choose the device, pin it on the upload, or on those flows with [per-flow devices](per-flow-devices.md).

## Moving to Apple Silicon (`m1`)

From **14 December 2026**, every Google Play run runs on an Apple Silicon (`m1`) emulator instead of an x86 (`cpu1`) one. You don't need to change anything for that to happen, but test your app on `m1` before then.

### Test now

For the whole upload:

```bash
dcd cloud ... --google-play --runner-type m1
```

Or for one flow, next to its Google Play setting:

```yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: true
    DEVICECLOUD_OVERRIDE_RUNNER_TYPE: m1
---
# test steps
```

### What to check

* **arm64-v8a native code.** The `m1` emulators run arm64-v8a code only. If your APK ships native libraries, it must include arm64-v8a ones. A build cut down to `x86_64` for emulators won't install, so DeviceCloud rejects `m1` runs for it with an error saying so. Builds with no native code run as they are.
* **Devices.** Google Play on `m1` runs on `pixel-8` (API `34`) and `pixel-10` (API `36`, `37`). Pixel 7 isn't offered on `m1`, because it's deprecated.
* **Concurrency.** Google Play runs on `m1` count towards your `m1` limit, not your `cpu1` limit. [Concurrency Protection](../getting-started/concurrency-and-parallel-runs.md) doesn't cover `m1`.

Google Play images work the same way on both runner types: they come with Google Play Services and the Play Store, the price is the same, and they can't be rooted, so the [device date and time override](device-settings.md#date-and-time) isn't applied.

Please contact support if you would like more device/API availability.
