# App Management

Device Cloud provides several ways to manage your application binaries during test execution.

## App Binary Options

### Primary App Binary
You have two ways to specify your main application binary:

1. **Direct File Upload**
```bash
dcd cloud --app-file ./path/to/your/app.apk
```

2. **Using Previously Uploaded Binary**
```bash
dcd cloud --app-binary-id abc123
```

### Additional App Binaries
For testing scenarios requiring multiple apps (e.g., companion apps):

```bash
# Upload multiple new apps
dcd cloud --app-file main.apk --additional-app-files companion.apk other.apk

# Use previously uploaded binaries
dcd cloud --app-binary-id main-id --additional-app-binary-ids companion-id other-id

# Mix and match
dcd cloud --app-file main.apk --additional-app-binary-ids companion-id
```

## Binary Management

### SHA Hash Checking
By default, Device Cloud checks the SHA hash of your binary to avoid redundant uploads (it will automatically work out the app-binary-id for you). To override:

```bash
dcd cloud --app-file ./app.apk --ignore-sha-check
```

Use this when:
- You need to force a re-upload of the same binary
- You're experiencing hash verification issues

