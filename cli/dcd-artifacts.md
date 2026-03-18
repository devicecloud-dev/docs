# dcd artifacts

Download artifacts or reports for a completed test run by upload ID. Use this command when you need to retrieve artifacts from a run that was submitted with `--async`, or to download reports independently after the fact.

```bash
dcd artifacts --upload-id <id> [flags]
```

## Flags

### Authentication

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var |

### Required

| Flag | Description |
|------|-------------|
| `--upload-id <uuid>` | UUID of the completed upload to download artifacts for |

### Artifact Download

| Flag | Description |
|------|-------------|
| `--download-artifacts <ALL\|FAILED>` | Download a zip of logs, screenshots, and videos. `ALL` includes every test; `FAILED` includes only failed tests. Mutually exclusive with `--report` |
| `--artifacts-path <path>` | Output path for the artifacts zip (default: `./artifacts.zip`). Requires `--download-artifacts` |

### Report Download

| Flag | Description |
|------|-------------|
| `--report <format>` | Download a test report. Options: `junit`, `html`, `html-detailed`, `allure`. Mutually exclusive with `--download-artifacts` |
| `--allure-path <path>` | Output path for the Allure report (default: `./report.html`). Requires `--report allure` |
| `--html-path <path>` | Output path for the HTML report (default: `./report.html`). Requires `--report html` or `html-detailed` |
| `--junit-path <path>` | Output path for the JUnit report (default: `./report.xml`). Requires `--report junit` |

### Other

| Flag | Description |
|------|-------------|
| `--debug` | Enable detailed debug logging |

## Examples

**Download artifacts for all tests:**
```bash
dcd artifacts --upload-id 123e4567-e89b-12d3-a456-426614174000 --download-artifacts ALL
```

**Download artifacts for failed tests only, to a custom path:**
```bash
dcd artifacts --upload-id 123e4567-e89b-12d3-a456-426614174000 --download-artifacts FAILED --artifacts-path ./failed-artifacts.zip
```

**Download a JUnit report:**
```bash
dcd artifacts --upload-id 123e4567-e89b-12d3-a456-426614174000 --report junit
```

**Download an Allure report to a custom path:**
```bash
dcd artifacts --upload-id 123e4567-e89b-12d3-a456-426614174000 --report allure --allure-path ./allure-report.html
```

## Using with Async Runs

`dcd artifacts` is especially useful alongside `--async`. Submit the run without blocking, then retrieve artifacts later:

```bash
# Submit tests and capture the upload ID
dcd cloud app.apk flows/ --async --json-file results.json

# ... later, once the run is complete ...
UPLOAD_ID=$(jq -r .uploadId results.json)
dcd artifacts --upload-id "$UPLOAD_ID" --download-artifacts ALL
```

See [Async Execution](../advanced/async-execution.md) and [Report Formats](../test-results/report-formats.md) for more details.
