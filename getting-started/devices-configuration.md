# Devices & OS Versions

### Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 7 (API level 34) - **from 19 October 2026 the default becomes API level 36** (still Pixel 7), and **from 26 October 2026 the default device becomes Pixel 10**. Pin `--android-api-level 34` or `--android-device pixel-7` if you need to stay on them.

**iOS:** iPhone 14 (iOS 17.5) - **from 2 November 2026 the default becomes iPhone 16 running iOS 26**. Pin `--ios-device iphone-14` if you need to stay on that device; iOS 17 is being removed on the same date, so there is no way to stay on it.

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
| `pixel-6-pro`    | Pixel 6 Pro (deprecated)                                                                            | 1440 x 3120 | 33, 35                             |
| `pixel-7`        | Pixel 7 (deprecated)                                                                                | 1080 x 2400 | 33, 34, 35, 36, 37                 |
| `pixel-7-pro`    | Pixel 7 Pro (deprecated)                                                                            | 1440 x 3120 | 33, 34, 35, 36, 37                 |
| `pixel-8`        | Pixel 8                                                                                | 1080 x 2400 | 34, 35, 36, 37                     |
| `pixel-10`       | Pixel 10                                                                               | 1080 x 2424 | 36, 37                             |
| `pixel-10-pro`   | Pixel 10 Pro                                                                           | 1280 x 2856 | 36, 37                             |
| `pixel-10-pro-xl` | Pixel 10 Pro XL                                                                       | 1344 x 2992 | 36, 37                             |
| `pixel-10-pro-fold` | Pixel 10 Pro Fold (unfolded)                                                        | 2076 x 2152 | 36, 37                             |
| `pixel-11`       | Pixel 11                                                                               | 1080 x 2424 | 37                                 |
| `generic-tablet` | Generic Tablet (Note: starts in landscape by default, use orientation=90 for portrait) | 2560 x 1440 | 33, 36, 37                         |

{% hint style="warning" %}
Pixel 6 Pro, Pixel 7 and Pixel 7 Pro are deprecated and we're targetting removal on **26 October 2026**. This is subject to change based on usage, see the [Android Support Policy](devices-configuration.md#android-support-policy) for more information.
{% endhint %}

{% hint style="warning" %}
Generic Tablet on API level 33 will be removed on **26 October 2026**. Move to API level 36 or 37, see the [Android Support Policy](devices-configuration.md#android-support-policy) for more information.
{% endhint %}

### iOS Versions

DeviceCloud will default to iOS 17 unless you pass the `--ios-version` flag:

```bash
dcd cloud app.zip test.yaml --ios-version 27
```

{% hint style="warning" %}
The default version of iOS is changing to 26 on the 2nd November 2026.
{% endhint %}

| id   | Version         |
| ---- | --------------- |
| `27` | 27.0            |
| `26` | 26.5            |
| `18` | 18.6            |
| `17` | 17.5 (deprecated) |

{% hint style="danger" %}
**iOS 27 requires your app to adopt the UIScene lifecycle.** From iOS 27 UIKit terminates any app that has not adopted it, at launch, before your first screen renders — the crash report shows `EXC_BREAKPOINT` in `__UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`. iOS 26 and earlier only warn, so an app that works on iOS 26 can still fail immediately on iOS 27.

This is an Apple platform change, not a DeviceCloud one, and it affects the app you upload rather than your flows. If your iOS 27 runs fail at the first `assertVisible` with the app apparently never appearing, check your run's crash logs for that symbol. Adopting `UIScene` in your app (or upgrading to a framework version that has) is the fix.
{% endhint %}

{% hint style="warning" %}
iOS 17 is deprecated and **will be removed on 2 November 2026**. Move `--ios-version` to 18, 26 or 27. See the [iOS Support Policy](devices-configuration.md#ios-support-policy) for more information.
{% endhint %}

### iOS Devices

DeviceCloud will default to iPhone 14 unless you pass the `--ios-device` flag:

```bash
dcd cloud app.zip test.yaml --ios-device ipad-pro-6th-gen
```

| id                    | Name                                   | Dimensions  | Valid iOS versions |
| --------------------- | -------------------------------------- | ----------- | ------------------ |
| `iphone-18-pro-max`   | iPhone 18 Pro Max                      | 1320 x 2868         | 27                 |
| `iphone-18-pro`       | iPhone 18 Pro                          | 1206 x 2622         | 27                 |
| `iphone-air`          | iPhone Air                             | 1260 x 2736         | 26, 27             |
| `iphone-17`           | iPhone 17                              | 1206 x 2622         | 26, 27             |
| `iphone-16-pro-max`   | iPhone 16 Pro Max (deprecated)         | 1320 x 2868 | 18, 26, 27         |
| `iphone-16-pro`       | iPhone 16 Pro (deprecated)             | 1206 x 2622 | 18, 26, 27         |
| `iphone-16-plus`      | iPhone 16 Plus (deprecated)            | 1290 x 2796 | 26, 27             |
| `iphone-16`           | iPhone 16                              | 1179 x 2556 | 18, 26, 27         |
| `iphone-15`           | iPhone 15 (deprecated)                 | 1179 x 2556 | 17                 |
| `iphone-14`           | iPhone 14                              | 1170 x 2532 | 17, 18             |
| `ipad-pro-m5-13`      | iPad Pro 13-inch (M5)                  | 2064 x 2752         | 26, 27             |
| `ipad-pro-m5-11`      | iPad Pro 11-inch (M5)                  | 1668 x 2420         | 26, 27             |
| `ipad-pro-6th-gen`    | iPad Pro (6th Generation) (deprecated) | 2048 x 2732 | 18, 26, 27         |

{% hint style="warning" %}
iPhone 15, iPhone 16 Plus, iPhone 16 Pro, iPhone 16 Pro Max and iPad Pro (6th Generation) are deprecated and **will be removed on 2 November 2026**. Move `--ios-device` to `iphone-16` (the new default), `iphone-17`, `iphone-18-pro`, `iphone-18-pro-max`, `iphone-air`, `ipad-pro-m5-11` or `ipad-pro-m5-13`. See the [iOS Support Policy](devices-configuration.md#ios-support-policy) for more information.
{% endhint %}

### Targeting a single flow

The flags above set the device for the whole upload. When only one flow needs a particular device then that flow can name its own device in its YAML instead. See [per-flow-devices.md](../configuration/per-flow-devices.md).

### Running your suite across several devices

To run every flow against several devices from a single `dcd cloud` invocation use a [device matrix](../configuration/device-matrix.md).

## Device & OS Support Policy

{% hint style="info" %}
This policy is undergoing a staged rollout. The Android half is in effect now; the iOS half comes into effect on **2 November 2026**.
{% endhint %}

We aim to provide a wide range of devices and OS versions so that you can test your apps as thoroughly as you need. However, due to storage constraints we can only provide access to certain devices and OS levels. Our policy on this is written below so you know what to expect.

If you need a device or OS that we don't currently offer, please feel free to reach out to support on [Discord](https://discord.gg/gm3mJwcNw8) or Slack (Enterprise customers only) or via email at [support@devicecloud.dev](mailto:support@devicecloud.dev) and we'll see what we can do.

### iOS Support Policy

#### iOS Devices

We will always aim to support the latest versions of iOS and additionally continue to provide support for previous versions. Our policy for this is as follows:

* The latest even-numbered iPhone model & its variations, i.e. iPhone 18, 18e, 18 Pro & 18 Pro Max. We support the ones Apple has actually released; at the time of writing that is the iPhone 18 Pro and 18 Pro Max.
* The previous two supported (i.e. even-numbered) generations of **base-model** iPhones, i.e. iPhone 16 & iPhone 14. Variations such as Plus, Pro and Pro Max are covered only for the latest even-numbered generation, so they fall out of support when a new even-numbered generation arrives.
* The latest "un-numbered" iPhones provided their screen dimensions are noticeably different from currently supported devices, i.e. iPhone Air & iPhone Duo.
* The latest odd-numbered, base-model iPhone, i.e. iPhone 17.
* The latest generation of iPad Pro, in both screen sizes.
* Once a device is to be no longer supported, we'll mark it as deprecated.
* Deprecated devices are then removed after 30 days provided its total usage over seven days is less than 1%.
* We may set a fixed removal date instead where a device is being retired as part of a scheduled policy change. The 2 November 2026 removals are one such case, and that date is not conditional on usage.

#### iOS Versions

We will always aim to support the latest versions of iOS and additionally continue to provide support for previous versions. Our policy for this is as follows:

* We will always support the latest version plus the previous two.
* Supported versions will always be the latest point release (i.e. 26.x rather than 26.0). Point releases change without notice; you target a major version such as `--ios-version 26` and we run it on the newest 26.x we hold.
* Once a version is two major versions old, we'll mark it as deprecated.
* Deprecated versions are then removed after 30 days provided it's total usage over seven days is less than 1%.
* We may set a fixed removal date instead where a version is being retired as part of a scheduled policy change. The removal of iOS 17 on 2 November 2026 is one such case, and that date is not conditional on usage.

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest even-numbered base iPhone we support running the previous version of iOS, i.e. iPhone 16 running iOS 26. Before we change the default, we will always provide a minimum of 30 days notice. The default becomes iPhone 16 / iOS 26 on 2 November 2026.

### Android Support Policy

#### Android Devices

We will always aim to support the latest devices and additionally continue to provide support for previous versions. Our policy for this is as follows:

* The latest even-numbered Google Pixel model & its variations, i.e. Pixel 10, 10 Pro, 10 Pro XL & 10 Pro Fold.
* The previous two supported (i.e. even-numbered) generations of Pixels, i.e. Pixel 8 & Pixel 6.
* The latest odd-numbered, base-model Pixel i.e. Pixel 11.
* A generic-tablet model.
* Once a device is to be no longer supported, we'll mark it as deprecated.
* Deprecated devices are then removed after 30 days provided its total usage over seven days is less than 1%.

#### Android Versions

We will always aim to support the latest versions of Android and additionally continue to provide support for previous versions. Our policy for this is as follows:

* We will always support the latest version.
* Once a version is no longer supported by Google, we'll mark it as deprecated.
* Deprecated versions are then removed after 30 days provided it's total usage over seven days is less than 1%.
* We consider API versions unsupported once they are no longer included in [Android Security Bulletins](https://source.android.com/docs/security/bulletin).

It may be possible in some cases to provide support for a beta version however this will be on a case-by-case basis; please contact our Support team if you would like to request this.

The default configuration will always be the latest base Pixel we support running the previous version of Android, i.e. Pixel 10 running Android 16/API 36. Before we change the default, we will always provide a minimum of 30 days notice.
