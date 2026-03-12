# dcd status

Check the status of a test upload by name or upload ID. Useful for polling an async run or retrieving results after the fact.

```bash
dcd status --upload-id <uuid> [flags]
dcd status --name <upload-name> [flags]
```

One of `--upload-id` or `--name` is required. If multiple uploads share the same name, the most recent is returned.

## Flags

| Flag | Description |
|------|-------------|
| `--upload-id <uuid>` | UUID of the upload to check |
| `--name <name>` | Name of the upload to check |
| `--api-key <key>` | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var |
| `--json` | Output results as JSON. Always exits `0` |

## Examples

```bash
dcd status --upload-id 7e12345f-eb12-12ec-a30b-bb1234f1d12a
```

```bash
dcd status --name "Nightly regression"
```

**Output:**
```
📊 Upload Status
════════════════════════════════════════════════════════════════════════════════
✓  Status:      FAILED
🆔 Upload ID:   7e12345f-eb12-12ec-a30b-bb1234f1d12a
📱 Binary ID:   67894274-b789-4c1e-80d4-da8998998999
🔗 Console:     https://console.devicecloud.dev/results?upload=7e12345f-...

📋 Test Results
────────────────────────────────────────────────────────────────────────────────
✗ ./login-test/onboarding.yaml
   Status: FAILED
   Fail reason: Element not found: Text matching regex next.* not found
   Duration: 32s
```

## JSON Output

Use `--json` for machine-readable output:

```bash
dcd status --name "Nightly regression" --json
```

```json
{
  "status": "FAILED",
  "tests": [
    {
      "name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "failReason": "Element not found: Text matching regex next.* not found",
      "durationSeconds": 32
    }
  ],
  "appBinaryId": "67894274-b789-4c1e-80d4-da8998998999",
  "uploadId": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a&result=4500"
}
```

Use with [jq](https://jqlang.github.io/jq/) to extract specific values:

```bash
export BINARY_ID=$(dcd status --name "Nightly regression" --json | jq -r '.appBinaryId')
```

## Polling an Async Run

When using `dcd cloud --async`, use `dcd status` to poll for completion:

```bash
# GitHub Actions example
- name: Run tests
  run: dcd cloud app.apk flows/ --async --name "CI-${{ github.run_id }}"

- name: Wait for results
  run: |
    while true; do
      STATUS=$(dcd status --name "CI-${{ github.run_id }}" --json | jq -r '.status')
      echo "Status: $STATUS"
      if [[ "$STATUS" == "PASSED" || "$STATUS" == "FAILED" || "$STATUS" == "CANCELLED" ]]; then
        break
      fi
      sleep 30
    done
    [ "$STATUS" == "PASSED" ]
```

See [Async Execution](../advanced/async-execution.md) for more patterns.

## Underlying API

`dcd status` calls `GET /uploads/status` on the DeviceCloud API. See [Uploads API](../api/uploads.md) if you need to call it directly.
