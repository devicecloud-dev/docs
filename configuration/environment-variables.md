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

## Best Practices

- Never commit sensitive values
- Use CI/CD secrets
- Use UPPERCASE for variable names
- Use descriptive names

