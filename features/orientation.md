# Device Orientation

Control Android device orientation during test execution.

> **Note**: Android only. iOS devices use their default orientation.

## Options

- `0`: Portrait (default)
- `90`: Landscape Right
- `180`: Portrait Upside Down
- `270`: Landscape Left

## Usage

```bash
# Portrait
dcd cloud <options> --orientation 0

# Landscape
dcd cloud <options> --orientation 90

# With device selection
dcd cloud <options> --android-device pixel-6 --orientation 90
```

