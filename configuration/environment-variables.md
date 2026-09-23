# Environment Variables

Device Cloud allows you to inject environment variables into your test flows, enabling dynamic configuration and secure credential management.

## Setting Environment Variables

### Command Line
```bash
dcd cloud -e API_URL=https://api.example.com -e API_KEY=secret
```

### Multiple Variables
```bash
dcd cloud -e DB_HOST=localhost \
          -e DB_USER=test \
          -e DB_PASS=password \
          -e ENVIRONMENT=staging
```

## Use Cases

### Configuration Management
```bash
# Development
dcd cloud -e API_URL=https://dev-api.example.com

# Staging
dcd cloud -e API_URL=https://staging-api.example.com

# Production
dcd cloud -e API_URL=https://api.example.com
```

### Secure Credentials
```bash
dcd cloud -e USERNAME=${CI_USERNAME} \
          -e PASSWORD=${CI_PASSWORD}
```

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

## Built-in Variables

DeviceCloud also sets these variables on every run, so a flow can adapt to the device it runs on:

| Variable | Value |
| --- | --- |
| `DCD_DEVICE` | The device and OS version, lowercased and hyphenated — for example `pixel-7-api-34`, `pixel-7-api-34-play` on a Google Play device, `iphone-16-ios-18` or `ipad-pro-12-9-inch-6th-generation-ios-26`. |
| `DCD_PLATFORM` | `android` or `ios`. |

Passing your own value with `-e` overrides the built-in one. [Visual Testing](../advanced/visual-testing.md#per-device-baselines) uses `DCD_DEVICE` to pick a baseline per device.

## Best Practices

- Never commit sensitive values
- Use CI/CD secrets
- Use UPPERCASE for variable names
- Use descriptive names
- Name secret-bearing variables with a keyword like `PASSWORD`, `TOKEN`, `SECRET`, or `API_KEY` so their values are automatically masked in logs and artifacts — see [Inspecting Variables](../artifacts/inspecting-variables.md)

