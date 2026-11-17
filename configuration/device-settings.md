---
description: "Settings DeviceCloud applies to the device before a flow runs: animations, locale, date and time, orientation and Chrome onboarding."
---

# Device Settings

These settings are applied to the device before a flow runs. Each section says whether you set it for the whole upload with a `dcd cloud` flag, for one flow with a [per-flow override](per-flow-overrides.md), or both.

## Animations

You can turn off device animations during a test run. On Android this works by zeroing the three
system animation scales (`window`, `transition`, `animator`) via adb. On iOS this
enables the **Reduce Motion** accessibility setting.

### Turning animations off

#### Whole upload

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

#### Per test (both platforms)

Override the upload-wide setting for a single flow with a [per-flow override](per-flow-overrides.md):

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS: true
---
# test steps
```

#### Per test, platform-specific

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

### Precedence

When more than one is set, the most specific wins:

1. `DEVICECLOUD_OVERRIDE_<PLATFORM>_DISABLE_ANIMATIONS` (per test, this platform)
2. `DEVICECLOUD_OVERRIDE_DISABLE_ANIMATIONS` (per test, both platforms)
3. `--disable-animations` or `--no-disable-animations` on `dcd cloud` (whole upload)
4. `disableAnimations` in `config.yaml`, for the run's platform (whole upload)
5. Default: animations are **on**

A `false` override is honoured the same as `true` — a test can opt out even when the
upload-wide flag is set.

## Locale

Set device language and region for localisation testing.

::: info
If you don't set a locale, Android runs use `en_US` and iOS runs use `en_GB`. Pass `--device-locale` to get the same locale on both.
:::

### Format

`{language_code}_{COUNTRY_CODE}`

* Language: ISO-639 (two or three lowercase letters)
* Country: ISO-3166-1 (two uppercase letters)

The underscore is required: use `de_DE`, not `de-DE`.

::: warning
The locale isn't checked when you submit a run, only when the device is prepared. If it doesn't match this format:

* **Android:** the error is logged and the test runs in the default locale.
* **iOS:** the device can't be prepared, so the test is retried and eventually fails.
:::

### Setting the locale

To set locale for the whole upload:

```bash
# German
dcd cloud ... --device-locale de_DE

# With device selection
dcd cloud ... --android-device pixel-6 --device-locale ja_JP
```

To override the locale for a single test, set a [per-flow override](per-flow-overrides.md) in its `env:` block. It overrides the upload setting above, for that test only:

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DEVICE_LOCALE: de_DE
---
# test steps
```

### Common locales

#### European

* `en_GB`: English (UK)
* `de_DE`: German
* `fr_FR`: French
* `it_IT`: Italian

#### Asian

* `zh_CN`: Chinese
* `ja_JP`: Japanese
* `ko_KR`: Korean

#### RTL

* `ar_SA`: Arabic
* `he_IL`: Hebrew

## Date and time

Run a flow with the device clock set to a chosen date and time, useful for testing expiry logic, subscription renewals, time-gated features, free-trial countdowns, or other date-specific UI (birthdays, holidays, "new this week" etc).

By default, a run uses the real current time. Our Android runners use UTC, and our iOS runners use UK time (GMT, or BST in summer).

### Setting the date and time

To set the time for a flow, set a [per-flow override](per-flow-overrides.md) in the flow's YAML. The value is an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time string. There's no `dcd cloud` flag for this, so it's set per flow.

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_DEVICE_DATETIME: "2030-01-01T09:00:00Z"
    DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE: "America/New_York"   # optional
---
# test steps
```

* `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME` — target date/time, ISO 8601 (e.g. `2030-01-01T09:00:00Z`).
* `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` — optional [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (e.g. `Europe/London`). Android only, and only applied together with `DEVICECLOUD_OVERRIDE_DEVICE_DATETIME`. Setting it needs a rootable image, so it isn't available on [Google Play](google-play-apis.md) images.

If the value can't be parsed, it is ignored and the flow runs with the default
(real) time.

Due to platform limitations, this behaves very differently on Android and iOS.
On Android it sets the real device clock, so the app sees the new time.
On iOS it only changes the cosmetic status-bar clock — the app's own `Date()` is unaffected as iOS simulators share their host kernel. Read the platform notes below before relying on it.

### Android

Sets the real emulator clock, so `Date.now()`, `System.currentTimeMillis()`, date pickers, and anything else the app reads all see the new time. Auto-time sync is disabled for the run so the value sticks.

The override sets the clock the run starts with. The clock then ticks forward normally for the rest of the run; it isn't frozen. If you need time to stand still, drive it from within your app or test instead.

::: info
This is not available on Google Play images. [Google Play](google-play-apis.md) emulators are not rootable, so the clock cannot be set. Google Play flows will log a warning and continue on real time. Use the standard image if you need the date/time override.
:::

### iOS

iOS simulators read the host machine's clock and there is no per-simulator API to change it, so:

* The app's `Date()` / `NSDate` is not changed — your app logic will still see the real time. iOS cannot time-travel app code.
* DeviceCloud applies a cosmetic status-bar time only via the simulator status-bar override.
* The status bar shows the hour and minute of the requested time in UTC, so write the value with a `Z` suffix (e.g. `2030-01-01T09:30:00Z` shows `9:30`). `DEVICECLOUD_OVERRIDE_DEVICE_TIMEZONE` is ignored on iOS.
* Apple's tooling only accepts whole `HH:MM` times and rejects a zero minute, so a requested time on the hour (e.g. `09:00`) is shown as `9:01`, and midnight (`00:xx` UTC) is left at the real time.

If you need real time-travel on iOS, control the date from inside your app (e.g. a debug/launch argument) rather than relying on this override.

## Orientation

Control Android device orientation during test execution.

::: info
Android only. `--orientation` is ignored on iOS, where devices stay in portrait.
:::

### Options

* `0`: Portrait (default)
* `90`: Landscape

Only `0` and `90` are accepted. The legacy `180` and `270` values are rejected.

::: info
Generic Tablet starts in landscape, so on it `0` (and the default) is landscape and `90` is portrait.
:::

### Setting the orientation

```bash
# Portrait
dcd cloud ... --orientation 0

# Landscape
dcd cloud ... --orientation 90
```

## Chrome onboarding

Chrome Onboarding pre-configures Chrome browser settings before your tests run on Android devices, ensuring that first-run dialogs don't interfere with test execution.

### Onboarding methods

By default we use a config-based Chrome onboarding which adds minimal overhead and works for most scenarios.

If config-based onboarding can't be confirmed on the device, we automatically switch to Maestro-based onboarding, which runs a Maestro flow that opens Chrome and taps through its first-run screens. It's more thorough, but it adds significant overhead, because the flow runs on the device before your test.

If Maestro-based onboarding fails, the test goes back in the queue to start again on a fresh device. This doesn't use up a [retry](../advanced/retry-strategies.md) and isn't charged. If onboarding still fails on the last attempt, the test starts anyway, and the test's log notes that Chrome may show its welcome screen first.

### Forcing Maestro-based onboarding

If you're experiencing issues with Chrome, you can force Maestro-based onboarding using the CLI flag `--maestro-chrome-onboarding`.

::: warning
Maestro-based onboarding **will slow your test suite down**. We only recommend it if you're having issues with the default config-based method.
:::
