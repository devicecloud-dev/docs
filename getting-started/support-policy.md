---
description: "Which devices, OS versions, Maestro versions and runner types DeviceCloud supports, and how and when they're deprecated and removed."
---

# Support Policy

This page sets out which devices, OS versions, Maestro versions and runner types we support, and how we retire them. For what's deprecated now, and what was removed recently, see [Deprecations & Removals](deprecations.md).

## How removals work

Everything on this page is retired the same way:

1. Once we stop supporting a device, OS version, Maestro version or runner type, we mark it as deprecated and list it on [Deprecations & Removals](deprecations.md) with a target removal date.
2. We remove it at least 30 days later, provided its total usage over seven days is less than 1%. If usage is still higher, the target date moves.

We also give at least 30 days' notice before we change a default device, OS version or Maestro version.

If you need a device or OS version we don't offer, contact support on [Discord](https://discord.gg/gm3mJwcNw8), on Slack (Enterprise customers only) or at [support@devicecloud.dev](mailto:support@devicecloud.dev), and we'll see what we can do. We may also be able to support a beta OS version, case by case.

## Devices and OS versions

We aim to provide a wide range of devices and OS versions so that you can test your apps as thoroughly as you need. Storage constraints mean we can only offer some of them. [Devices & OS Versions](devices-configuration.md) lists what's available now.

### iOS devices

We support:

* The latest even-numbered iPhone model and its variations, e.g. iPhone 18, 18e, 18 Pro and 18 Pro Max, once Apple has released them.
* The previous two supported (i.e. even-numbered) generations of base-model iPhones, i.e. iPhone 16 and iPhone 14. Variations such as Plus, Pro and Pro Max are covered only for the latest even-numbered generation, so they fall out of support when a new even-numbered generation arrives.
* The latest "un-numbered" iPhones, provided their screen dimensions are noticeably different from devices we already support, i.e. iPhone Air and iPhone Duo.
* The latest odd-numbered, base-model iPhone, i.e. iPhone 17.
* The latest generation of iPad Pro, in both screen sizes.

### iOS versions

* We support the latest version plus the previous two.
* We always run the latest point release of each (e.g. 26.x rather than 26.0). Point releases change without notice: you target a major version, such as `--ios-version 26`, and we run it on the newest 26.x we hold.
* Once a version is no longer one of the latest three, we mark it as deprecated.

### Default iOS device

The default is the latest even-numbered base iPhone we support, running the previous version of iOS. It has been iPhone 16 on iOS 26 since 2 November 2026.

### Android devices

We support:

* The latest even-numbered Google Pixel model and its variations, i.e. Pixel 10, 10 Pro, 10 Pro XL and 10 Pro Fold.
* The previous two supported (i.e. even-numbered) generations of Pixels, i.e. Pixel 8 and Pixel 6.
* The latest odd-numbered, base-model Pixel, i.e. Pixel 11.
* A generic tablet.

### Android versions

* We support the latest version.
* Once Google no longer supports a version, we mark it as deprecated. We consider an API level unsupported once it's no longer included in the [Android Security Bulletins](https://source.android.com/docs/security/bulletin).

### Default Android device

The default is the latest even-numbered base Pixel we support, running the previous version of Android: Pixel 10 on Android 16 (API 36).

## Maestro versions

* We add support for every new version.
* Once a new minor version is released (for example 2.7.0), we mark every patch of the previous minor version (2.6.x) except the newest as deprecated.
* Once a minor version is five or more minor versions old, we may mark it as deprecated.

::: info
For example, Maestro 2.0.0 received 10 patch releases (2.0.1 to 2.0.10) and we supported all of them. Once Maestro 2.1.0 was released, we would deprecate 2.0.0 to 2.0.9 and keep 2.0.10.

Once Maestro 2.5.0 is released, 2.0.10 is five minor versions old, so we may mark it as deprecated and remove it after 30 days, provided its usage has dropped below 1%.
:::

We may change the default Maestro version from time to time. [Maestro Versions](../configuration/maestro-versions.md) lists the versions we support and the current default.

## Runner types

We may occasionally retire a runner type, for example because it overlaps with other runner types or isn't used. [Runner Types](../configuration/runner-type.md) lists the ones available now.
