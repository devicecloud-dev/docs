# dcd status

Check the status of a test upload by name or upload ID. Useful for polling an async run or retrieving results after the fact.

```bash
dcd status --upload-id <uuid> [flags]
dcd status --name <upload-name> [flags]
```

Pass either `--upload-id` or `--name`, not both. If multiple uploads share the same name, the most recent is returned.

## Flags

| Flag | Description |
|------|-------------|
| `--upload-id <uuid>` | UUID of the upload to check |
| `--name <name>` | Name of the upload to check |
| `--api-key <key>` | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var. Optional if you've run [`dcd login`](dcd-login.md) |
| `--api-url <url>` | API base URL. Defaults to the environment you logged in to with `dcd login`, otherwise `https://api.devicecloud.dev` |
| `--json` | Output results as JSON (see [JSON Output](#json-output) for its fields and exit codes) |

The upload status is one of `PASSED`, `FAILED`, `RUNNING`, `PENDING` or `QUEUED`. It's never `CANCELLED`: a run with a cancelled test is reported as `FAILED`, while the test itself keeps its `CANCELLED` status.

`FAILED` doesn't mean the run has finished. The status turns `FAILED` as soon as any test has failed with no retries left, or has been cancelled, even while other tests are still queued or running. The run has finished when none of its tests is `QUEUED`, `PENDING` or `RUNNING`.

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

Each test's `device` is the device and OS version it ran on, as one string, such as `iPhone 16 - 18` or `pixel-8-api-34`.

A run that a newer run superseded through [`--cancel-previous`](../advanced/cancel-previous.md) also has a `supersededBy` field: the newer run's upload ID. Its `status` is still `FAILED`, because its cancelled tests count against it, so check for `supersededBy` before you fail a CI job on `status`.

If the lookup itself fails — for example the upload ID doesn't exist, or the API can't be reached — `--json` prints a `FAILED` status with an `error` message instead, and still exits `0`:

```json
{
  "status": "FAILED",
  "error": "Resource not found. Upload not found",
  "attempts": 1,
  "tests": []
}
```

Other errors print the same `status` and `error` but exit `1`. These include passing neither `--upload-id` nor `--name`, or having no API key and no `dcd login` session. Either way, check for an `error` field before treating `FAILED` as a failed test run.

Use with [jq](https://jqlang.org/) to extract specific values:

```bash
export BINARY_ID=$(dcd status --name "Nightly regression" --json | jq -r '.appBinaryId')
```

## Polling an Async Run

When using `dcd cloud --async`, use `dcd status` to poll for completion. Wait until no test is still queued, pending or running, rather than stopping at the first `FAILED`:

```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      DEVICE_CLOUD_API_KEY: ${{ secrets.DCD_API_KEY }}
    steps:
      # ... build app.apk ...

      - name: Install the DeviceCloud CLI
        run: |
          curl -fsSL https://get.devicecloud.dev/install.sh | sh
          echo "$HOME/.dcd/bin" >> "$GITHUB_PATH"

      - name: Run tests
        run: dcd cloud app.apk flows/ --async --name "CI-${{ github.run_id }}"

      - name: Wait for results
        run: |
          while true; do
            RESULT=$(dcd status --name "CI-${{ github.run_id }}" --json)
            if echo "$RESULT" | jq -e '.error' > /dev/null; then
              echo "$RESULT"
              exit 1
            fi
            # Finished once no test is still queued, pending or running
            if echo "$RESULT" | jq -e '[.tests[].status] | all(. == "PASSED" or . == "FAILED" or . == "CANCELLED")' > /dev/null; then
              break
            fi
            sleep 30
          done
          echo "Status: $(echo "$RESULT" | jq -r '.status')"
          # Pass when every test passed, or when a newer run superseded this one
          echo "$RESULT" | jq -e '.status == "PASSED" or .supersededBy != null' > /dev/null
```

See [Async execution](../ci-cd/overview.md#async-execution) for more patterns.

## Underlying API

`dcd status` calls `GET /uploads/status` on the DeviceCloud API. See [Uploads API](../api/uploads.md) if you need to call it directly.
