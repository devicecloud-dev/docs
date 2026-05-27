# Google Play APIs

DeviceCloud allows flow execution using Android emulators with the Google Play APIs.

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

The upload-wide flag is a floor, not a ceiling — once `--google-play` is set on the
upload, every flow runs on Play and a per-test override cannot turn it off.

## Device availability

Google Play APIs are currently only available on a single device:

* `pixel-7` on API level `34`

Please contact support if you would like more device/API availability.
