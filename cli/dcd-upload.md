# dcd upload

Upload an app binary to DeviceCloud and get back a binary ID. Use the binary ID in subsequent `dcd cloud` runs to skip re-uploading the same binary.

DeviceCloud deduplicates binaries by SHA checksum — if you upload the same binary twice, the existing ID is returned and no upload occurs.

```bash
dcd upload <app-file> [flags]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `<app-file>` | Path to your app binary (`.apk` for Android, `.app` or `.zip` for iOS) |

## Flags

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var |
| `--ignore-sha-check` | Force re-upload even if a binary with the same SHA already exists |
| `--json` | Output the binary ID as JSON |
| `--debug` | Enable verbose debug logging |

## Examples

```bash
dcd upload app.apk
```

```bash
dcd upload app.zip --api-key <key> --json
```

**Output:**
```
Binary ID: 67894274-b789-4c1e-80d4-da8998998999

You can use this Binary ID in subsequent test runs with:
dcd cloud --app-binary-id 67894274-b789-4c1e-80d4-da8998998999 path/to/flow.yaml
```

## Using Binary IDs

Uploading the binary separately is useful when running the same build across multiple test jobs — upload once, then pass `--app-binary-id` to each `dcd cloud` run:

```bash
# Upload once
BINARY_ID=$(dcd upload app.apk --json | jq -r '.appBinaryId')

# Run multiple jobs reusing the same binary
dcd cloud flows/smoke/ --app-binary-id $BINARY_ID --include-tags smoke
dcd cloud flows/regression/ --app-binary-id $BINARY_ID --include-tags regression
```
