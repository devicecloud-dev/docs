# Environment Variables

Device Cloud allows you to inject environment variables into your test flows, enabling dynamic configuration and secure credential management.

## Setting Environment Variables

### Command Line
```bash
dcd cloud app.apk flows/ -e API_URL=https://api.example.com -e API_KEY=secret
```

`-e` is short for `--env`.

### Multiple Variables
```bash
dcd cloud app.apk flows/ \
          -e DB_HOST=localhost \
          -e DB_USER=test \
          -e DB_PASS=password \
          -e ENVIRONMENT=staging
```

## Use Cases

### Configuration Management
```bash
# Development
dcd cloud app.apk flows/ -e API_URL=https://dev-api.example.com

# Staging
dcd cloud app.apk flows/ -e API_URL=https://staging-api.example.com

# Production
dcd cloud app.apk flows/ -e API_URL=https://api.example.com
```

### Secure Credentials
```bash
dcd cloud app.apk flows/ -e USERNAME=${CI_USERNAME} \
          -e PASSWORD=${CI_PASSWORD}
```

Add `--encrypt` (or set `DCD_ENCRYPT=1`) to encrypt the `--env` values on your machine before they're uploaded. This also encrypts the app binary and your flow files.

## iOS: SIMCTL Variable Passthrough

On iOS, variables prefixed with `SIMCTL_CHILD_` are passed through by the simulator directly to the app under test, with the prefix stripped. This allows you to inject values that are readable from inside the app via `ProcessInfo.processInfo.environment`.

```bash
dcd cloud app.zip flow.yaml -e SIMCTL_CHILD_API_URL=https://staging-api.example.com
```

Inside the iOS app, this is accessible as `API_URL`:

```swift
let apiUrl = ProcessInfo.processInfo.environment["API_URL"]
```

This is useful for feature flags, environment switching, or any value your app reads at launch without needing to rebuild the binary.

Variables starting with `SIMCTL_CHILD_DYLD_` are blocked and never reach the app.

## Built-in Variables

DeviceCloud also sets these variables on every run, so a flow can adapt to the device it runs on:

| Variable | Value |
| --- | --- |
| `DCD_DEVICE` | The device and OS version, lowercased and hyphenated — for example `pixel-8-api-34`, `pixel-8-api-34-play` on a Google Play device, `iphone-16-ios-18` or `ipad-pro-12-9-inch-6th-generation-ios-26`. |
| `DCD_PLATFORM` | `android` or `ios`. |

Passing your own value with `-e` overrides the built-in one. [Visual Testing](../advanced/visual-testing.md#per-device-baselines) uses `DCD_DEVICE` to pick a baseline per device.

## Maestro Settings

Variables whose names start with `MAESTRO_` are also set in the environment of the Maestro process, as well as being available to your flows. Use them to pass settings that Maestro reads from its environment.

## DeviceCloud Overrides

`DEVICECLOUD_OVERRIDE_*` settings, such as [`DEVICECLOUD_OVERRIDE_DEVICE_LOCALE`](device-locale.md), only work in a flow's `env:` block. Passed with `-e`, they're treated as ordinary variables and have no effect.

## Masking Secrets

Values of variables whose names contain a keyword such as `PASSWORD`, `TOKEN`, `SECRET` or `API_KEY` are masked in the result log and in the downloadable `maestro.log`, stdout/stderr and `commands.json` — see [Inspecting Variables](../artifacts/inspecting-variables.md) for the full list of keywords. Masking has limits:

- Values passed with `--env` / `-e` are only masked if they're 5 or more characters long, so a short value such as a 4-digit PIN stays visible.
- Literal values assigned in a script, such as `password = '...'`, are masked. Values written directly in a flow's `env:` block, and values computed at runtime (`output.*`), are not.
- HTML and JUnit reports, device logs, screenshots and videos are not scrubbed.

## Best Practices

- Never commit sensitive values
- Use CI/CD secrets
- Use UPPERCASE for variable names
- Use descriptive names
- Name secret-bearing variables with a keyword like `PASSWORD`, `TOKEN`, `SECRET`, or `API_KEY` so their values are masked in logs, within the limits above
