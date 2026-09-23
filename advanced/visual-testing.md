# Visual Testing

Maestro's `assertScreenshot` command compares the current screen against a reference image — a **baseline** — that you commit to your repository.

```yaml
- assertScreenshot: screenshots/home.png
```

DeviceCloud runs these assertions like any other command. The one thing you need to set up is getting your baseline images onto the device.

{% hint style="warning" %}
**Requires DeviceCloud CLI 5.6.0 or later**, the first version that uploads your baselines.

**Use Maestro 2.10.0.** The default version, 2.2.0, resolves the baseline path against a different working directory and reports `Screenshot file not found` no matter where you put the file. Pass `--maestro-version 2.10.0` (or `--maestro-version latest`) until the default becomes 2.10.0 on 19 October 2026 — see [Maestro Versions](../configuration/maestro-versions.md).
{% endhint %}

## Uploading your baselines

The CLI reads your flows before it uploads them, and bundles every baseline that an `assertScreenshot` command names with a literal path, the same way it bundles `addMedia` and `runScript` files. The example above needs no configuration: `screenshots/home.png` is uploaded with the flow.

When the path contains a variable, the CLI can't tell which file you mean, so declare the baselines with `includedPaths` in your workspace [`config.yaml`](../configuration/workspace-config.md) — see [per-device baselines](#per-device-baselines) below:

```yaml
# config.yaml
flows:
  - ./**/*.yaml

includedPaths:
  - screenshots/**
```

A baseline that isn't uploaded never reaches the device, and the assertion fails with `Screenshot file not found`. The CLI doesn't stop you uploading a flow whose baseline doesn't exist yet; the error comes from the run.

## Where baselines live

Maestro resolves the path **relative to the flow file's own directory**, so this layout works:

```
.maestro/
  config.yaml
  visual.yaml          - assertScreenshot: screenshots/home.png
  screenshots/
    home.png
```

You can climb out of the flow's folder with `../` if you prefer to keep baselines in one shared place.

The file extension is optional. `assertScreenshot: screenshots/home` looks for `screenshots/home.png`.

## Creating your first baseline

Maestro has no "record" mode, so you have to capture the first baseline yourself. A baseline must match the device's screen dimensions **exactly**, so capture it on a local emulator or simulator configured identically to the DeviceCloud device you intend to test on — a `pixel-7` / API 34 AVD for `--android-device pixel-7 --android-api-level 34`, for example.

1. Boot that local device and run the flow with `takeScreenshot` in place of the assertion:

   ```yaml
   - takeScreenshot: home
   ```

   ```bash
   maestro test .maestro/visual.yaml
   ```

2. Copy the PNG out of Maestro's output directory into `screenshots/home.png` and commit it.

3. Swap the command to `assertScreenshot`. A literal path needs nothing else; a path with a variable also needs `includedPaths` in your config.

{% hint style="warning" %}
**Don't use `--download-artifacts` to create a baseline.** Screenshots and videos from a run are downscaled and re-encoded for the console — a 1080x2400 screen comes back as a 486x1080 JPEG — so they will never match at full size. They are for looking at, not for asserting against.
{% endhint %}

If the dimensions are wrong you will see a size mismatch naming both sizes, which tells you exactly what to capture at:

```
Screenshot size mismatch: expected 486x1080, actual 1080x2400.
Screenshots must have the same dimensions to compare.
```

## Tuning the threshold

```yaml
- assertScreenshot:
    path: screenshots/home.png
    thresholdPercentage: 98
```

`thresholdPercentage` is the **percentage of pixels that must match**, defaulting to `95`. It is a floor, not a tolerance — the assertion passes when the measured match is at or above it, so a **lower** number is more permissive. Start at the default and lower it only if a screen has genuinely unstable content.

A non-numeric value fails the step rather than falling back to the default.

{% hint style="warning" %}
**A size mismatch always fails, whatever the threshold.** Baselines are locked to the resolution they were captured at, so a baseline taken on one device will never pass on a device with a different screen size. If you use `cropOn`, the baseline must have been captured with the same `cropOn`.
{% endhint %}

## Per-device baselines

Because baselines are resolution-locked, a [device matrix](../configuration/device-matrix.md) needs one baseline per device. Every run exposes the device profile as `DCD_DEVICE`, so you can select the right baseline from the path:

```yaml
- assertScreenshot: screenshots/${DCD_DEVICE}/home.png
```

```
screenshots/
  pixel-7-api-34/home.png
  iphone-16-ios-18/home.png
```

```yaml
# config.yaml
includedPaths:
  - screenshots/**
```

`DCD_DEVICE` is a lowercased, hyphenated form of the device profile you requested — `pixel-7-api-34` on Android, `iphone-16-ios-18` on iOS. `DCD_PLATFORM` (`android` or `ios`) is available too. Setting either yourself as an environment variable overrides the built-in value.

{% hint style="info" %}
A variable in the path means the CLI cannot work out which file is needed ahead of the run, so `includedPaths` is required here — the automatic pickup only handles literal paths.
{% endhint %}

## Reading a failure

A failed comparison reports the match it measured, so you can tell a real regression from a threshold that is set too high:

```
Comparison error: Assert screenshot matches screenshots/home.png (threshold: 90%)
  - threshold not met, current: 7.78%
```

Maestro also writes a diff image highlighting the changed regions. DeviceCloud collects it at full resolution and shows it in the run's media strip alongside the video and screenshots, so you can see what moved without re-running anything.

The diff is only produced for a pixel mismatch. A size mismatch fails before any comparison happens, and reports the expected and actual dimensions in the step error instead.

{% hint style="warning" %}
Maestro writes that diff next to the baseline **in your working directory** when you run locally, as `<baseline>_diff.png`. Add `**/*_diff.png` to your `.gitignore` so local runs don't leave them lying around your repository.
{% endhint %}
