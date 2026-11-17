---
description: "Set the device's language and region for a whole upload with --device-locale, or for one flow, plus the locale format, the defaults and common locales."
---

# Device Locale

Set device language and region for localisation testing.

::: info
If you don't set a locale, Android runs use `en_US` and iOS runs use `en_GB`. Pass `--device-locale` to get the same locale on both.
:::

## Format

`{language_code}_{COUNTRY_CODE}`

* Language: ISO-639 (two or three lowercase letters)
* Country: ISO-3166-1 (two uppercase letters)

The underscore is required: use `de_DE`, not `de-DE`.

::: warning
The locale isn't checked when you submit a run, only when the device is prepared. If it doesn't match this format:

* **Android:** the error is logged and the test runs in the default locale.
* **iOS:** the device can't be prepared, so the test is retried and eventually fails.
:::

## Usage

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

## Common Locales

### European

* `en_GB`: English (UK)
* `de_DE`: German
* `fr_FR`: French
* `it_IT`: Italian

### Asian

* `zh_CN`: Chinese
* `ja_JP`: Japanese
* `ko_KR`: Korean

### RTL

* `ar_SA`: Arabic
* `he_IL`: Hebrew
