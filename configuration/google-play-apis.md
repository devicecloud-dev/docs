# Google Play APIs

DeviceCloud allows flow execution using Android emulators with the Google Play APIs. Please note that these are charged at our advanced rate as per our [pricing](../billing/test-run-billing.md).

{% hint style="warning" %}
**On 14 December 2026, Google Play runs move from x86 (`cpu1`) to Apple Silicon (`m1`) emulators**, at the same price. You can test your app on them now: add `--runner-type m1` to your Google Play runs. Your app needs arm64-v8a native code. See [Moving to Apple Silicon](#moving-to-apple-silicon-m1).
{% endhint %}

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
one flow in via a DeviceCloud env variable in its YAML:

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: true
---
# test steps
```

Only that flow boots on a Google Play emulator; the rest of the upload uses the
standard image. Billing is per flow — Play-image flows are charged at the Google
Play rate, the others at the standard rate.

## Precedence

1. `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY: true` (per test, opt-in)
2. The upload-wide `--google-play` flag
3. Default: standard Google APIs image

In a [device matrix](device-matrix.md) upload, each cell's own setting decides instead (`:play` on the cell, or `--google-play` for every cell). A flow's `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY` is ignored there unless the flow also names its own device.

## Device availability

Google Play APIs are available on these devices:

| Device | API levels |
|--------|------------|
| `pixel-8` | `34` |
| `pixel-10` | `36`, `37` |
| `pixel-7` (deprecated) | `34` |

Pixel 7 is targeted for removal on 9 November 2026, subject to change based on usage, so move Google Play runs to `pixel-8` (to stay on API 34) or `pixel-10`.

On the `m1` [runner type](runner-type.md), Google Play is available on `pixel-8` (API `34`) and `pixel-10` (API `36`, `37`). It isn't available on `gpu1`.

Pass the device and API level together on Google Play runs:

```bash
dcd cloud ... --google-play --android-device pixel-8 --android-api-level 34
```

If you pass only one of them, DeviceCloud picks the other so the pair has a Google Play image: a device runs on its Google Play API level, and an API level runs on a Google Play device that offers it. If you pass neither, the run uses the default Android device, Pixel 10 on API 36, which has a Google Play image. A device with no Google Play image, or an API level no Google Play device offers, is rejected. Older CLI versions check a single value against an older default device instead, so update the CLI if one of these is refused.

If only some flows opt in with `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY`, those flows are resolved the same way, from the device and API level the flow names, then the ones the upload names. A flow that opts in and names neither runs on Pixel 10 on API 36. To choose the device, pin it on the upload, or on those flows with [per-flow devices](per-flow-devices.md).

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
* **Devices.** Google Play on `m1` runs on `pixel-8` (API `34`) and `pixel-10` (API `36`, `37`). Pixel 7 isn't offered on `m1`, because it is removed on 9 November 2026.
* **Concurrency.** Google Play runs on `m1` count towards your `m1` limit, not your `cpu1` limit. [Concurrency Protection](../getting-started/concurrency-and-parallel-runs.md) doesn't cover `m1`.

Google Play images work the same way on both runner types: they come with Google Play Services and the Play Store, the price is the same, and they can't be rooted, so the [device date and time override](device-datetime.md) isn't applied.

Please contact support if you would like more device/API availability.
