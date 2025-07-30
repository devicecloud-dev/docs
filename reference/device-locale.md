# Device Locale

Set device language and region for localization testing.

{% hint style="info" %}
The default locale for Android is `en_US` . The default locale for iOS is currently `en_GB` but will be changing to `en_US` later in 2025.
{% endhint %}

## Format

`{language_code}_{COUNTRY_CODE}`

* Language: ISO-639-1 (lowercase)
* Country: ISO-3166-1 (uppercase)

## Usage

```bash
# German
dcd cloud ... --device-locale de_DE

# With device selection
dcd cloud ... --android-device pixel-6 --device-locale ja_JP
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
