# Animations

You can turn off device animations during a test run. On Android this works by zeroing the three
system animation scales (`window`, `transition`, `animator`) via adb. On iOS this
enables the **Reduce Motion** accessibility setting.

## Usage

### Whole upload

Pass the flag on `dcd cloud`:

```bash
dcd cloud ... --disable-animations
```

Or set it once in the workspace `config.yaml`, separately for each platform:

```yaml
platform:
  android:
    disableAnimations: true
  ios:
    disableAnimations: true
```

The CLI reads the block for your app's platform: `platform.android` for an `.apk`, and `platform.ios` for an `.app`, `.zip` or Expo `.tar.gz` build. With `--app-binary-id` it can't see the app, so it uses `platform.ios` only when you pass `--ios-device`, `--ios-version` or `--ios-device-matrix`, and `platform.android` otherwise.

A flag on `dcd cloud` beats `config.yaml`. To keep animations on for a run, even where `config.yaml` turns them off, pass `--no-disable-animations`:

```bash
dcd cloud ... --no-disable-animations
```

### Per test (both platforms)

Override the upload-wide setting for a single flow with a [per-flow override](per-flow-overrides.md):

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS: true
---
# test steps
```

### Per test, platform-specific

When the same flow YAML runs on both Android and iOS, you can target each platform
independently. Use this when animations cause problems on one platform but you want
them on for the other (for example, animations off on Android to fix scroll/tap
flakiness, but on for iOS where Reduce Motion changes app appearance):

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_ANDROID_DISABLE_ANIMATIONS: true
    DEVICECLOUD_OVERRIDE_IOS_DISABLE_ANIMATIONS: false
---
# test steps
```

The other platform's key is ignored — only the one matching the run's platform is
consulted.

## Precedence

When more than one is set, the most specific wins:

1. `DEVICECLOUD_OVERRIDE_<PLATFORM>_DISABLE_ANIMATIONS` (per test, this platform)
2. `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` (per test, both platforms)
3. `--disable-animations` or `--no-disable-animations` on `dcd cloud` (whole upload)
4. `disableAnimations` in `config.yaml`, for the run's platform (whole upload)
5. Default: animations are **on**

A `false` override is honoured the same as `true` — a test can opt out even when the
upload-wide flag is set.
