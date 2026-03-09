# Device Orientation

Control Android device orientation during test execution.

> **Note**: Android only. iOS devices are always portrait.

## Options

* `0`: Portrait (default)
* `90`: Landscape Right
* `180`: Portrait Upside Down
* `270`: Landscape Left

## Usage

```bash
# Portrait
dcd cloud ... --orientation 0

# Landscape
dcd cloud ... --orientation 90
```
