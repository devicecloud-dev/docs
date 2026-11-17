---
description: "The devices, OS versions, Maestro versions, report formats and runner types DeviceCloud is retiring, when, and what to move to, plus what was removed recently."
---

# Deprecations & Removals

Before we remove a device, an OS version, a Maestro version, a report format or a runner type, we mark it as deprecated and set a target date for its removal. This page lists what's deprecated now, and what was removed recently.

## Upcoming

Removal dates are targets, subject to change based on usage.

| Item | Kind | Target date | Move to |
|------|------|-------------|---------|
| Pixel 7 (`pixel-7`) | Android device | 23 November 2026 | `pixel-8` or `pixel-10` (`pixel-6` for API level 33). On Google Play, `pixel-8` keeps API level 34 |
| iOS 17 | iOS version | 23 November 2026 | iOS 18, 26 or 27. iPhone 14 runs iOS 18 |
| Maestro 2.2.0 | Maestro version | 23 November 2026 | 2.6.1 or newer |
| `html-detailed` and `allure` | Report formats | 7 December 2026 | `--report html` or `--report junit`. See [Report Formats](../artifacts/report-formats.md) for what happens to runs that still pass them |
| iPhone 16 Pro (`iphone-16-pro`) | iOS device | 7 December 2026 | `iphone-16` (the default), `iphone-17`, `iphone-air`, `iphone-18-pro` or `iphone-18-pro-max` |
| Google Play on `cpu1` | Runner type change | 14 December 2026 | Nothing: Google Play runs move to `m1` on their own. Test your app on `m1` first, see [Moving to Apple Silicon](../configuration/google-play-apis.md#moving-to-apple-silicon-m1) |

`dcd live` is deprecated too, with no removal date set. Use [`dcd device`](../cli/dcd-device.md) instead.

## Recently removed

| Date | Removed |
|------|---------|
| 9 November 2026 | The `gpu1` runner type. Android runs that still pass it run on `cpu1`, see [Runner Types](../configuration/runner-type.md) |
| 9 November 2026 | iPhone 16 Pro Max |
| 2 November 2026 | iPhone 15, iPhone 16 Plus and iPad Pro (6th Generation) |
| 26 October 2026 | Pixel 6 Pro, Pixel 7 Pro and Generic Tablet on API level 33 |
| 19 October 2026 | Android API levels 29-31 (Android 10-12) |
| 19 October 2026 | Maestro 2.0.4, 2.0.9, 2.1.0, 2.5.0, 2.5.1 and 2.6.0 |

## Support policies

Each policy says when something is deprecated, and when it can be removed:

* [Device & OS Support Policy](devices-configuration.md#device-os-support-policy)
* [Maestro Support Policy](../configuration/maestro-versions.md#maestro-support-policy)
* [Runner Type Support Policy](../configuration/runner-type.md#runner-type-support-policy)
