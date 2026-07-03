# Device Orientation

Control Android device orientation during test execution.

> **Note**: Android only. iOS devices are always portrait.

## Options

* `0`: Portrait (default)
* `90`: Landscape

> **Note**: Only `0` and `90` are supported. The legacy `180` and `270` values are no longer accepted.

## Usage

```bash
# Portrait
dcd cloud ... --orientation 0

# Landscape
dcd cloud ... --orientation 90
```
