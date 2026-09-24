# Google Play APIs

DeviceCloud allows flow execution using Android emulators with the Google Play APIs. Please note that these are charged at our advanced rate as per our [pricing](../billing/test-run-billing.md).

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

Pixel 7 is targeted for removal on 26 October 2026, so move Google Play runs to `pixel-8` (to stay on API 34) or `pixel-10`.

Google Play isn't available on the `m1` or `gpu1` [runner types](runner-type.md).

Pass the device and API level together on Google Play runs:

```bash
dcd cloud ... --google-play --android-device pixel-8 --android-api-level 34
```

If you pass only one of them, the CLI checks the pair against its default device (`pixel-7`) and API level (`34`) and rejects combinations that don't have a Google Play image, telling you which device to pass instead.

If only some flows opt in with `DEVICECLOUD_OVERRIDE_GOOGLE_PLAY`, pin the device and API level on the upload, or on those flows with [per-flow devices](per-flow-devices.md).

Please contact support if you would like more device/API availability.
