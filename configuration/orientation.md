---
description: "Run Android tests in portrait or landscape with --orientation, and the values it accepts. iOS devices stay in portrait."
---

# Device Orientation

Control Android device orientation during test execution.

::: info
Android only. `--orientation` is ignored on iOS, where devices stay in portrait.
:::

## Options

* `0`: Portrait (default)
* `90`: Landscape

Only `0` and `90` are accepted. The legacy `180` and `270` values are rejected.

::: info
Generic Tablet starts in landscape, so on it `0` (and the default) is landscape and `90` is portrait.
:::

## Usage

```bash
# Portrait
dcd cloud ... --orientation 0

# Landscape
dcd cloud ... --orientation 90
```
