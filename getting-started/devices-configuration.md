---
description: "Every device, Android API level and iOS version DeviceCloud supports, the defaults you get without flags, and the support policy for adding and removing them."
---

# Devices & OS Versions

## Default Devices

If you don't specify a device or OS version, then you will be allocated the default device image:

**Android:** Pixel 10 (API level 36)

**iOS:** iPhone 16 (iOS 26)

## Android API Levels

DeviceCloud will default to API level 36 unless you pass the `--android-api-level` flag:

```bash
dcd cloud app.apk test.yaml --android-api-level 37
```

| Android Version | API Level       |
| --------------- | --------------- |
| Android 17      | 37              |
| Android 16      | 36              |
| Android 15      | 35              |
| Android 14      | 34              |
| Android 13      | 33              |
| Android 12L     | 32              |

API levels 29-31 (Android 10-12) were removed on 19 October 2026.

Need Google Play? See [Google Play APIs](../configuration/google-play-apis.md)

## Android Devices

DeviceCloud will default to Pixel 10 unless you pass the `--android-device` flag:

```bash
dcd cloud app.apk test.yaml --android-device pixel-6
```

::: info
Pixel 10 runs API levels 36 and 37 only. To run on API level 32-35, pass `--android-device` as well as `--android-api-level`, for example `--android-device pixel-8 --android-api-level 34`. A run that sets only the API level is checked against Pixel 10 and rejected.
:::

| id                  | Name                                                                                   | Dimensions  | Valid Android API Levels           |
| ------------------- | -------------------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `pixel-6`           | Pixel 6                                                                                | 1080 x 2400 | 32, 33, 34, 35, 36, 37             |
| `pixel-7`           | Pixel 7 (deprecated)                                                                   | 1080 x 2400 | 33, 34, 35, 36, 37                 |
| `pixel-8`           | Pixel 8                                                                                | 1080 x 2400 | 34, 35, 36, 37                     |
| `pixel-10`          | Pixel 10                                                                               | 1080 x 2424 | 36, 37                             |
| `pixel-10-pro`      | Pixel 10 Pro                                                                           | 1280 x 2856 | 36, 37                             |
| `pixel-10-pro-xl`   | Pixel 10 Pro XL                                                                        | 1344 x 2992 | 36, 37                             |
| `pixel-10-pro-fold` | Pixel 10 Pro Fold (starts unfolded)                                                    | 2076 x 2152 | 36, 37                             |
| `pixel-11`          | Pixel 11                                                                               | 1080 x 2424 | 37                                 |
| `generic-tablet`    | Generic Tablet (starts in landscape; pass `--orientation 90` for portrait) | 2560 x 1440 | 36, 37                             |

Generic Tablet and Pixel 10 Pro Fold runs are billed at the Advanced Android rate, see [pricing](../billing/test-run-billing.md).

The Pixel 10 Pro Fold starts unfolded; a flow can fold it, see [Foldable Devices](../configuration/foldable-devices.md).

::: warning
Pixel 7 is deprecated and we're targeting removal on 14 December 2026. This date is subject to change based on usage.
:::

Pixel 6 Pro, Pixel 7 Pro and Generic Tablet on API level 33 were removed on 26 October 2026.

## iOS Versions

DeviceCloud will default to iOS 26 unless you pass the `--ios-version` flag. The default iPhone 16 runs iOS 18, 26 and 27, so a run that sets only the version runs on iPhone 16. To run that version on another device, pass an `--ios-device` that runs it as well (see [iOS Devices](devices-configuration.md#ios-devices)):

```bash
dcd cloud app.zip test.yaml --ios-device iphone-17 --ios-version 27
```

| id   | Version                       |
| ---- | ----------------------------- |
| `27` | 27.0 (27.1 on the iPhone Duo) |
| `26` | 26.5                          |
| `18` | 18.6                          |

iOS 17 was removed on 24 November 2026, and runs that pass `--ios-version 17` are rejected. iPhone 14 runs iOS 18.

## iOS Devices

DeviceCloud will default to iPhone 16 unless you pass the `--ios-device` flag. Pass `--ios-version` with it, choosing one of the versions in the device's row:

```bash
dcd cloud app.zip test.yaml --ios-device ipad-pro-m5-13 --ios-version 26
```

::: info
A run that sets only the device runs on iOS 26, so a device that doesn't offer iOS 26 needs `--ios-version` as well, for example `--ios-device iphone-14 --ios-version 18` or `--ios-device iphone-18-pro --ios-version 27`. Without it, the run is rejected.
:::

| id                  | Name                       | Dimensions  | Valid iOS versions |
| ------------------- | -------------------------- | ----------- | ------------------ |
| `iphone-duo`        | iPhone Duo (starts folded) | 1398 x 2034 | 27                 |
| `iphone-18-pro-max` | iPhone 18 Pro Max          | 1320 x 2868 | 27                 |
| `iphone-18-pro`     | iPhone 18 Pro              | 1206 x 2622 | 27                 |
| `iphone-air`        | iPhone Air                 | 1260 x 2736 | 26, 27             |
| `iphone-17`         | iPhone 17                  | 1206 x 2622 | 26, 27             |
| `iphone-16-pro`     | iPhone 16 Pro (deprecated) | 1206 x 2622 | 18, 26, 27         |
| `iphone-16`         | iPhone 16                  | 1179 x 2556 | 18, 26, 27         |
| `iphone-14`         | iPhone 14                  | 1170 x 2532 | 18                 |
| `ipad-pro-m5-13`    | iPad Pro 13-inch (M5)      | 2064 x 2752 | 26, 27             |
| `ipad-pro-m5-11`    | iPad Pro 11-inch (M5)      | 1668 x 2420 | 26, 27             |

iPad and iPhone Duo runs are billed at the Advanced iOS rate, see [pricing](../billing/test-run-billing.md).

::: warning
iPhone 16 Pro is deprecated and we're targeting removal on 7 December 2026; this is subject to change based on usage. Runs that target it will be rejected once it's removed, so move them to `iphone-16` (the default), `iphone-17`, `iphone-air`, `iphone-18-pro` or `iphone-18-pro-max`.
:::

iPhone 16 Pro Max was removed on 9 November 2026, and runs that target it are rejected. Move them to one of the devices above. `iphone-18-pro` and `iphone-18-pro-max` run iOS 27 only, so pass `--ios-version 27` with them.

iPhone 15, iPhone 16 Plus and iPad Pro (6th Generation) were removed on 2 November 2026.

### Foldables

The iPhone Duo starts folded, on its cover screen, and the Pixel 10 Pro Fold starts unfolded. A flow can fold or unfold either part-way through a run, and tap or take screenshots on whichever screen is active. See [Foldable Devices](../configuration/foldable-devices.md).

## Targeting a single flow

The flags above set the device for the whole upload. When only one flow needs a particular device then that flow can name its own device in its YAML instead. See [Pin a flow to a device](../configuration/per-flow-overrides.md#pin-a-flow-to-a-device).

## Running your suite across several devices

To run every flow against several devices from a single `dcd cloud` invocation use a [device matrix](../configuration/device-matrix.md).

## Device & OS Support Policy

Which devices and OS versions we support, and how we deprecate and remove them, is set out in our [Support Policy](support-policy.md#devices-and-os-versions). For what's deprecated now, see [Deprecations & Removals](deprecations.md). Need a device or OS version we don't offer? [Contact support](support-policy.md#how-removals-work).
