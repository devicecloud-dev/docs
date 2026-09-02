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
iOS 16 was removed on 24th August 2026 and tests targeting it will now fail. Switch to iOS 17 or newer — iPhone 14 also supports 17 and 18.
{% endhint %}

| id   | Version              |
| ---- | -------------------- |
| `26` | 26.4                 |
| `18` | 18.6                 |
| `17` | 17.5                 |

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
| `iphone-14`         | iPhone 14                 | 1170 x 2532 | 17, 18             |
| `ipad-pro-6th-gen`  | iPad Pro (6th Generation) | 2732 x 2048 | 18, 26             |

### Targeting a single flow

The flags above set the device for the whole upload. When only one flow needs a particular device then that flow can name its own device in its YAML instead. See [per-flow-devices.md](../configuration/per-flow-devices.md).

### Running your suite across several devices

To run every flow against several devices from a single `dcd cloud` invocation use a [device matrix](../configuration/device-matrix.md).

## Device Support Policy

We aim to provide a wide range of devices and OS versions so that you can test your apps as thoroughly as you need. However, due to storage constraints we can only provide access to certain devices and OS levels. Our policy on this is written below so you know what to expect. 

If you need a device or OS that we don't currently offer, please feel free to reach out to support on [Discord](https://discord.gg/gm3mJwcNw8) or Slack (Enterprise customers only) or via email at [support@devicecloud.dev](mailto:support@devicecloud.dev) and we'll see what we can do.

### iOS Support Policy

We will always aim to have the following devices available as a baseline:

- The latest even-numbered iPhone model & it's variations, i.e. iPhone 18, 18 Plus, 18 Pro & 18 Pro Max.
- The previous two supported generations of iPhones, i.e. iPhone 16 & iPhone 14.
- The latest generation of iPad Pro.
Additionally we will aim to provide the latest odd-numbered iPhone in it's base configuration if there is a noticeable difference in dimensions however this may not always be possible.

We will always aim to have the following iOS versions available as a baseline:

- The latest version plus the previous two.
- These should always be the latest point release.

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest even-numbered base iPhone we support running the previous version of iOS, i.e. iPhone 16 running iOS 26.

### Android Support Policy

We will always aim to have the following devices available as a baseline:

- The two latest Google Pixel models & all variations.
- A generic-tablet model.

We will always aim to have the following Android versions available as a baseline:
- The latest version.
- Any version still supported by Google Play Services.

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest base Pixel we support running the previous version of Android, i.e. Pixel 10 running Android 16/API 36.
