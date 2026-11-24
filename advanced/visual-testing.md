# Visual Testing

Maestro's `assertScreenshot` command compares the current screen against a reference image — a **baseline** — that you commit to your repository.

```yaml
- assertScreenshot: screenshots/home.png
```

DeviceCloud runs these assertions like any other command. The one thing you need to set up is getting your baseline images onto the device.

::: warning
**Don't pin `--maestro-version 2.2.0`.** That version resolves the baseline path against a different working directory and reports `Screenshot file not found` no matter where you put the file. Use the default version or a later one (see [Maestro Versions](../configuration/maestro-versions.md)).
:::

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

You can climb out of the flow's folder with `../` if you prefer to keep baselines in one shared place. Keep them inside the workspace folder you pass to `dcd cloud`, because `includedPaths` can't reach outside it. Baselines outside the folder that holds your flows also move the upload root up, which changes the paths your flows are recorded under — see [`includedPaths`](../configuration/workspace-config.md#includedpaths).

The file extension is optional. `assertScreenshot: screenshots/home` looks for `screenshots/home.png`.

## Creating your first baseline

Maestro has no "record" mode, so you have to capture the first baseline yourself. A baseline must match the device's screen dimensions **exactly**, so capture it on a local emulator or simulator configured identically to the DeviceCloud device you intend to test on — a `pixel-8` / API 34 AVD for `--android-device pixel-8 --android-api-level 34`, for example — or [on DeviceCloud itself](#capturing-a-baseline-on-devicecloud).

1. Boot that local device and run the flow with `takeScreenshot` in place of the assertion:

   ```yaml
   - takeScreenshot: home
   ```

   ```bash
   maestro test .maestro/visual.yaml
   ```

2. Copy the PNG out of Maestro's output directory into `screenshots/home.png` and commit it.

3. Swap the command to `assertScreenshot`. A literal path needs nothing else; a path with a variable also needs `includedPaths` in your config.

### Capturing a baseline on DeviceCloud

A baseline can be captured on the DeviceCloud device itself, so you don't have to set up a matching local device. This works for the whole screen and for a crop made with `cropOn`:

1. Run the flow on the device you will assert on, with `takeScreenshot` in place of the assertion, and download the result. For a crop, use the same `cropOn` the assertion will use:

   ```yaml
   - takeScreenshot:
       path: home-header
       cropOn:
         id: header
   ```

   ```bash
   dcd cloud app.apk .maestro/ --android-device pixel-8 --android-api-level 34 --download-artifacts ALL
   ```

2. The zip holds the screenshot as `<result-id>/screenshots/visual-home-header.png`, named after the flow and the `path`. It is the PNG the device took, at its full size. Commit it unchanged, for example as `screenshots/home-header.png`.

3. Swap the command to `assertScreenshot` with the same `cropOn`:

   ```yaml
   - assertScreenshot:
       path: screenshots/home-header.png
       cropOn:
         id: header
   ```

Earlier downloads saved `takeScreenshot` output as a JPEG (`.jpg`). A baseline made from one still works if you name it with its `.jpg` extension, but a few of its pixels differ slightly from the device's own capture. Capture it again for an exact copy.

::: warning
**Use only `takeScreenshot` output as a baseline.** The other screenshots in a download, such as the failure screenshot and step screenshots, are re-encoded as JPEG for the console, and any taller than 1080 px are downscaled — a 1080x2400 screen comes back as a 486x1080 JPEG — so they will never match at full size.
:::

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

::: warning
**A size mismatch always fails, whatever the threshold.** Baselines are locked to the resolution they were captured at, so a baseline taken on one device will never pass on a device with a different screen size. If you use `cropOn`, the baseline must have been captured with the same `cropOn`.
:::

## Per-device baselines

Because baselines are resolution-locked, a [device matrix](../configuration/device-matrix.md) needs one baseline per device. Every run exposes the device it runs on as `DCD_DEVICE`, so you can select the right baseline from the path:

```yaml
- assertScreenshot: screenshots/${DCD_DEVICE}/home.png
```

```
screenshots/
  pixel-8-api-34/home.png
  iphone-16-ios-18/home.png
```

```yaml
# config.yaml
includedPaths:
  - screenshots/**
```

`DCD_DEVICE` is the device and OS version, lowercased and hyphenated:

| Device | `DCD_DEVICE` |
| --- | --- |
| `--android-device pixel-8 --android-api-level 34` | `pixel-8-api-34` |
| The same with `--google-play` | `pixel-8-api-34-play` |
| `--android-device generic-tablet --android-api-level 36` | `13-5in-freeform-api-36` |
| `--ios-device iphone-16 --ios-version 18` | `iphone-16-ios-18` |
| `--ios-device iphone-17 --ios-version 26` | `iphone-17-ios-26` |

iPads use their full model name (`--ios-device ipad-pro-m5-13 --ios-version 26` is `ipad-pro-13-inch-m5-ios-26`) and the generic tablet its emulator profile, so the value isn't always your device flag. Print it once before you name your folders: add `- evalScript: ${console.log('DCD_DEVICE=' + DCD_DEVICE)}` to a flow and look for the `JsConsole` line in the run's Maestro log.

`DCD_PLATFORM` (`android` or `ios`) is available too. Passing either yourself with `--env` overrides the built-in value. See [Built-in Variables](../configuration/environment-variables.md#built-in-variables).

::: info
A variable in the path means the CLI cannot work out which file is needed ahead of the run, so `includedPaths` is required here — the automatic pickup only handles literal paths.
:::

## Reading a failure

A failed comparison reports the match it measured, so you can tell a real regression from a threshold that is set too high:

```
Comparison error: Assert screenshot matches screenshots/home.png (threshold: 90%)
  - threshold not met, current: 7.78%
```

Maestro also writes a diff image that boxes the changed regions. It does this for every assertion that doesn't match, including `optional: true` assertions that only warn and let the flow pass. DeviceCloud collects each diff as a full-resolution PNG and shows it in the run's media strip alongside the video and screenshots, and `--download-artifacts` puts it in the result's `screenshots/` folder, so you can see what moved without re-running anything.

Each diff is named after the flow and the baseline it was compared with, with the baseline's folders joined by hyphens. A flow `visual.yaml` that asserts `screenshots/pixel-8-api-34/home.png` gives `visual-diff-screenshots-pixel-8-api-34-home_diff.png`, so a flow that checks several baselines gets one diff for each, and you can tell them apart. From Maestro 2.12.0, a flow that asserts the same baseline twice gets a diff for each time, and the second name ends in the step, such as `…-home_diff-step-017-assertScreenshot.png`.

The diff is only produced for a pixel mismatch. A size mismatch fails before any comparison happens, and reports the expected and actual dimensions in the step error instead.

::: warning
Up to Maestro 2.11, a local run writes that diff next to the baseline **in your working directory**, named after it: `screenshots/home_diff.png` for `screenshots/home.png`. Delete these before you run `dcd cloud` from the same folder. An `includedPaths` pattern such as `screenshots/**` uploads them, and DeviceCloud shows every `*_diff.png` it finds as a diff from the run. Add `**/*_diff.png` to your `.gitignore` too, so they never reach your repository.

From Maestro 2.12.0, a local run writes the diff to Maestro's own output folder instead, as `assert-screenshot/step-NNN-assertScreenshot-diff.png` under the flow's folder in `~/.maestro/tests/<run>/`, and leaves your working directory alone.
:::
