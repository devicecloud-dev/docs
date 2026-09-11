# Devices & OS Versions

### Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 7 (API level 34) - **from 19 October 2026 the default becomes API level 36** (still Pixel 7). Pin `--android-api-level 34` if you need to stay on it.

**iOS:** iPhone 14 (iOS 17.5)

### Android API Levels

DeviceCloud will default to API level 34 unless you pass the `--android-api-level` flag:

```bash
dcd cloud app.apk test.yaml --android-api-level 37
```

{% hint style="warning" %}
The default version of Android is changing to API 36 on the 19th October 2026.
{% endhint %}

| Android Version | API Level       |
| --------------- | --------------- |
| Android 17      | 37              |
| Android 16      | 36              |
| Android 15      | 35              |
| Android 14      | 34              |
| Android 13      | 33              |
| Android 12L     | 32              |
| Android 12      | 31 (deprecated) |
| Android 11      | 30 (deprecated) |
| Android 10      | 29 (deprecated) |

{% hint style="warning" %}
API levels 29-31 (Android 10-12) are deprecated and we're targetting removal on **19 October 2026**. This is subject to change based on usage, see the [Android Support Policy](devices-configuration.md#android-support-policy) for more information.
{% endhint %}

Need Google Play? See [google-play-apis.md](../configuration/google-play-apis.md)

### Android Devices

DeviceCloud will default to Pixel 7 unless you pass the `--android-device` flag:

```bash
dcd cloud app.apk test.yaml --android-device pixel-6
```

| id               | Name                                                                                   | Dimensions  | Valid Android API Levels           |
| ---------------- | -------------------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `pixel-6`        | Pixel 6                                                                                | 1080 x 2400 | 29, 30, 31, 32, 33, 34, 35, 36, 37 |
| `pixel-6-pro`    | Pixel 6 Pro                                                                            | 1440 x 3120 | 33, 35                             |
| `pixel-7`        | Pixel 7                                                                                | 1080 x 2400 | 33, 34, 35, 36, 37                 |
| `pixel-7-pro`    | Pixel 7 Pro                                                                            | 1440 x 3120 | 33, 34, 35, 36, 37                 |
| `generic-tablet` | Generic Tablet (Note: starts in landscape by default, use orientation=90 for portrait) | 2560 x 1440 | 33, 36                             |

### iOS Versions

DeviceCloud will default to iOS 17 unless you pass the `--ios-version` flag:

```bash
dcd cloud app.zip test.yaml --ios-version 18
```

| id   | Version |
| ---- | ------- |
| `26` | 26.4    |
| `18` | 18.6    |
| `17` | 17.5    |

### iOS Devices

DeviceCloud will default to iPhone 14 unless you pass the `--ios-device` flag:

```bash
dcd cloud app.zip test.yaml --ios-device ipad-pro-6th-gen
```

| id                  | Name                      | Dimensions  | Valid iOS versions |
| ------------------- | ------------------------- | ----------- | ------------------ |
| `iphone-16-pro-max` | iPhone 16 Pro Max         | 1320 x 2868 | 18, 26             |
| `iphone-16-pro`     | iPhone 16 Pro             | 1206 x 2622 | 18, 26             |
| `iphone-16-plus`    | iPhone 16 Plus            | 1290 x 2796 | 26                 |
| `iphone-16`         | iPhone 16                 | 1179 x 2556 | 18, 26             |
| `iphone-15`         | iPhone 15                 | 1179 x 2556 | 17                 |
| `iphone-14`         | iPhone 14                 | 1170 x 2532 | 17, 18             |
| `ipad-pro-6th-gen`  | iPad Pro (6th Generation) | 2048 x 2732 | 18, 26             |

### Targeting a single flow

The flags above set the device for the whole upload. When only one flow needs a particular device then that flow can name its own device in its YAML instead. See [per-flow-devices.md](../configuration/per-flow-devices.md).

### Running your suite across several devices

To run every flow against several devices from a single `dcd cloud` invocation use a [device matrix](../configuration/device-matrix.md).

## Device & OS Support Policy

{% hint style="info" %}
This policy is undergoing a staged rollout. Devices and iOS will come into effect at a later date.
{% endhint %}

We aim to provide a wide range of devices and OS versions so that you can test your apps as thoroughly as you need. However, due to storage constraints we can only provide access to certain devices and OS levels. Our policy on this is written below so you know what to expect.

If you need a device or OS that we don't currently offer, please feel free to reach out to support on [Discord](https://discord.gg/gm3mJwcNw8) or Slack (Enterprise customers only) or via email at [support@devicecloud.dev](mailto:support@devicecloud.dev) and we'll see what we can do.

### iOS Support Policy

We will always aim to have the following devices available as a baseline:

* The latest even-numbered iPhone model & its variations, i.e. iPhone 17, 17e, 17 Pro & 17 Pro Max.
* The previous two supported generations of iPhones, i.e. iPhone 16 & iPhone 14.
* The latest "un-numbered" iPhones provided their screen dimensions are noticeably different from currently support devices, i.e. iPhone Air & iPhone Duo.
* The latest odd-numbered iPhone provided it's screen dimensions are noticeably different from currently supported devices.
* The latest generation of iPad Pro.

We will always aim to support the latest versions of iOS and additionally continue to provide support for previous versions. Our policy for this is as follows:

* We will always support the latest version plus the previous two.
* Supported versions will always be the latest point release (i.e. 26.x rather than 26.0).
* Once a version is two major versions old, we'll mark it as deprecated.
* Deprecated versions are then removed after 30 days provided it's total usage over seven days is less than 1%.

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest even-numbered base iPhone we support running the previous version of iOS, i.e. iPhone 16 running iOS 26. Before we change the default, we will always provide a minimum of 30 days notice.

Additionally when removing Device and OS support, we will always provide a minimum of 30 days notice.

### Android Support Policy

We will always aim to have the following devices available as a baseline:

* The two latest Google Pixel models & all variations.
* A generic-tablet model.

We will always aim to support the latest versions of Android and additionally continue to provide support for previous versions. Our policy for this is as follows:

* We will always support the latest version.
* Once a version is no longer supported by Google, we'll mark it as deprecated.
* Deprecated versions are then removed after 30 days provided it's total usage over seven days is less than 1%.
* We consider API versions unsupported once they are no longer included in [Android Security Bulletins](https://source.android.com/docs/security/bulletin).

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest base Pixel we support running the previous version of Android, i.e. Pixel 10 running Android 16/API 36. Before we change the default, we will always provide a minimum of 30 days notice.

Additionally when removing Device and OS support, we will always provide a minimum of 30 days notice.
