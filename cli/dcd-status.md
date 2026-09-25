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
| `--json` | Output results as JSON. Exits `0` once a result is retrieved (including a `FAILED` run); usage errors, such as omitting both `--upload-id` and `--name`, exit `1` |

The upload status is one of `PASSED`, `FAILED`, `RUNNING`, `PENDING` or `QUEUED`. It's never `CANCELLED`: a run with a cancelled test is reported as `FAILED`, while the test itself keeps its `CANCELLED` status.

## Examples

```bash
dcd status --upload-id 7e12345f-eb12-12ec-a30b-bb1234f1d12a
```

```bash
dcd status --name "Nightly regression"
```

**Output:**
```
⏺ Upload Status
  ⎿ ✗ failed
    name        Nightly regression
    upload id   7e12345f-eb12-12ec-a30b-bb1234f1d12a
    binary id   67894274-b789-4c1e-80d4-da8998998999
    created     22/09/2026, 10:30:00
    console     https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a

⏺ Test Results
  ⎿ ✓ ./login-test/login.yaml   · 1m 4s · 22/09/2026, 10:30:01
    ✗ ./login-test/onboarding.yaml   · 32s · 22/09/2026, 10:30:01 · Element not found: Text matching regex next.* not found
```

Dates and times are shown in your system's locale and time zone.

## JSON Output

Use `--json` for machine-readable output:

```bash
dcd status --name "Nightly regression" --json
```

```json
{
  "status": "FAILED",
  "appBinaryId": "67894274-b789-4c1e-80d4-da8998998999",
  "uploadId": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a&result=4500",
  "name": "Nightly regression",
  "createdAt": "2026-09-22T10:30:00.123456+00:00",
  "tests": [
    {
      "name": "./login-test/login.yaml",
      "status": "PASSED",
      "durationSeconds": 64,
      "createdAt": "2026-09-22T10:30:01.234567+00:00",
      "device": "iPhone 16 - 18"
    },
    {
      "name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "durationSeconds": 32,
      "failReason": "Element not found: Text matching regex next.* not found",
      "createdAt": "2026-09-22T10:30:01.234567+00:00",
      "device": "iPhone 16 - 18"
    }
  ]
}
```

If the lookup itself fails — for example the upload ID doesn't exist, or the API can't be reached — `--json` prints a `FAILED` status with an `error` message instead, and still exits `0`:

```json
{
  "status": "FAILED",
  "error": "Resource not found. Upload not found",
  "attempts": 1,
  "tests": []
}
```

Check for an `error` field before treating `FAILED` as a failed test run.

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
      if [[ "$STATUS" == "PASSED" || "$STATUS" == "FAILED" ]]; then
        break
      fi
      sleep 30
    done
    [ "$STATUS" == "PASSED" ]
```

See [Async Execution](../advanced/async-execution.md) for more patterns.

## Underlying API

`dcd status` calls `GET /uploads/status` on the DeviceCloud API. See [Uploads API](../api/uploads.md) if you need to call it directly.
