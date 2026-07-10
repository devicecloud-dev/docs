# Devices & OS Versions

### Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 7 (API level 34)

**iOS:** iPhone 14 (iOS 17.5)

### Android API Levels

DeviceCloud will default to API level 34 unless you pass the `--android-api-level` flag:

```bash
dcd cloud app.apk test.yaml --android-api-level 35
```

| Android Version | API Level |
| --------------- | --------- |
| Android 16      | 36        |
| Android 15      | 35        |
| Android 14      | 34        |
| Android 13      | 33        |
| Android 12L     | 32        |
| Android 12      | 31        |
| Android 11      | 30        |
| Android 10      | 29        |

Need Google Play? See [google-play-apis.md](../configuration/google-play-apis.md)

### Android Devices

DeviceCloud will default to Pixel 7 unless you pass the `--android-device` flag:

```bash
dcd cloud app.apk test.yaml --android-device pixel-6
```

| id               | Name                                                                                   | Dimensions  | Valid Android API Levels       |
| ---------------- | -------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `pixel-6`        | Pixel 6                                                                                | 1080 x 2400 | 29, 30, 31, 32, 33, 34, 35, 36 |
| `pixel-6-pro`    | Pixel 6 Pro                                                                            | 1440 x 3120 | 33, 35                         |
| `pixel-7`        | Pixel 7                                                                                | 1080 x 2340 | 33, 34, 35, 36                 |
| `pixel-7-pro`    | Pixel 7 Pro                                                                            | 1440 x 3120 | 33, 34, 35, 36                 |
| `generic-tablet` | Generic Tablet (Note: starts in landscape by default, use orientation=90 for portrait) | 1440 x 3120 | 33                             |

### iOS Versions

DeviceCloud will default to iOS 17 unless you pass the `--ios-version` flag:

```bash
dcd cloud app.zip test.yaml --ios-version 18
```

{% hint style="warning" %}
iOS 16 is deprecated and will be removed on 23rd August 2026, after which tests targeting it will fail. We recommend switching to iOS 17 or newer — iPhone 14 also supports 17 and 18.
{% endhint %}

| id   | Version              |
| ---- | -------------------- |
| `26` | 26.4                 |
| `18` | 18.6                 |
| `17` | 17.5                 |
| `16` | 16.4 (deprecated)    |

### iOS Devices

DeviceCloud will default to iPhone 14 unless you pass the `--ios-device` flag:

```bash
dcd cloud app.zip test.yaml --ios-device ipad-pro-6th-gen
```

| id                  | Name                      | Dimensions  | Valid iOS versions |
| ------------------- | ------------------------- | ----------- | ------------------ |
| `iphone-16-pro-max` | iPhone 16 Pro Max         | 1290 x 2796 | 18, 26             |
| `iphone-16-pro`     | iPhone 16 Pro             | 1179 x 2556 | 18, 26             |
| `iphone-16-plus`    | iPhone 16 Plus            | 1290 x 2796 | 26                 |
| `iphone-16`         | iPhone 16                 | 1170 x 2532 | 18, 26             |
| `iphone-15`         | iPhone 15                 | 1170 x 2532 | 17                 |
| `iphone-14`         | iPhone 14                 | 1170 x 2532 | 16 (deprecated), 17, 18 |
| `ipad-pro-6th-gen`  | iPad Pro (6th Generation) | 2732 x 2048 | 18, 26             |

### Targeting a single flow

The flags above set the device for the **whole upload**. When only one flow needs a particular device then that flow can name its own device in its YAML instead. See [per-flow-devices.md](../configuration/per-flow-devices.md).

### Running your whole suite across a device matrix

To run your **entire** suite against several devices in one go, pass a repeatable `--ios-config <device>:<version>` (or `--android-config <device>:<apiLevel>`) for each device you want. Every flow runs once per config, all under **one upload** — one console entry, one pass/fail rollup, results comparable side by side.

```bash
dcd cloud --app-binary-id <id> ./flows \
  --ios-config iphone-16-pro:18 \
  --ios-config iphone-16-pro:26 \
  --ios-config iphone-16-pro-max:26
# → one upload, 3 devices × N flows
```

Android works the same way — append `:play` to target a Google Play device for that cell:

```bash
dcd cloud --app-binary-id <id> ./flows \
  --android-config pixel-7:34 \
  --android-config pixel-7:34:play
```

Each `--ios-config` / `--android-config` is **one explicit device cell** — there is no cross-product. `--ios-config iphone-15:17 --ios-config iphone-16-plus:26` runs exactly those two configs, nothing else. Every config is validated against the [compatibility tables above](#ios-devices) before anything runs, so an unsupported pair fails fast, naming it, and no partial run is submitted.

Before submitting, the CLI prints the number of cells and the estimated **cost** — a device matrix bills one run per (flow × config), so a 4-config matrix over 10 flows is 40 runs.

A few rules:

- **One platform per upload.** A matrix runs one app binary, so `--ios-config` and `--android-config` can't be combined in the same run.
- **A flow that names its own device wins.** If a flow sets its own device via [`DEVICECLOUD_OVERRIDE_*`](../configuration/per-flow-devices.md), it runs once on that device and is excluded from the matrix.
- **`--json` distinguishes devices.** Under `--json`, each entry in `tests[]` carries a `device` object, so the same flow run on two devices is no longer ambiguous.

{% hint style="info" %}
Prefer separate uploads (e.g. in CI, one per shard)? You can still submit one `dcd cloud` per device with `--ios-device` / `--ios-version` and `--async` — but a single matrix upload keeps the results together and comparable.
{% endhint %}
