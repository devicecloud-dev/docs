# dcd cloud

Upload an app binary and run Maestro flows on DeviceCloud. This is the primary command and a drop-in replacement for `maestro cloud`.

```bash
dcd cloud <appFile> <flowFile> [flags]
```

The command blocks until all tests have completed, then exits with an appropriate [exit code](../advanced/exit-codes.md).

## Arguments

| Argument | Description |
|----------|-------------|
| `<appFile>` | Path to your app binary: `.apk` for Android, `.app` or `.zip` for iOS, or an Expo iOS build archive (`.tar.gz`), which is extracted automatically |
| `<flowFile>` | Path to the flow file or directory of flows to run |

## Flags

### Authentication

| Flag | Description |
|------|-------------|
| `--api-key <key>`, `--apiKey` | Your DeviceCloud API key. Defaults to the `DEVICE_CLOUD_API_KEY` env var. Optional if you've run [`dcd login`](dcd-login.md) |
| `--api-url <url>` | API base URL. Defaults to the environment you logged in to with `dcd login`, otherwise `https://api.devicecloud.dev` |

See [Authentication](../getting-started/api-keys.md) for the full picture.

### App

| Flag | Description |
|------|-------------|
| `--app-binary-id <id>` | Reuse a previously uploaded binary instead of uploading again |
| `--app-url <url>` | Signed URL to an Expo iOS build (`.tar.gz`). The archive is downloaded and extracted automatically. Expo signed URLs expire after ~1 hour. Mutually exclusive with `--app-file` |
| `--app-file <path>` | Path to the app binary (alternative to the positional `<appFile>` argument) |
| `--ignore-sha-check` | Force re-upload even if a binary with the same SHA already exists |
| `--encrypt` / `--no-encrypt` | Envelope encryption is on by default: the app binary, flow files and `--env` values are encrypted on your machine before upload, each with its own key. Pass `--no-encrypt` (or set `DCD_ENCRYPT=0`) to turn it off; the upload is still encrypted in transit. An unchanged binary is still deduplicated, so it isn't uploaded again. See [Data Encryption](../security/security-overview.md#data-encryption) |

### Device

| Flag | Description |
|------|-------------|
| `--android-device <device>` | Android device model to run on (see [Devices](../getting-started/devices-configuration.md)) |
| `--android-api-level <level>` | Android API level |
| `--ios-device <device>` | iOS device model to run on (see [Devices](../getting-started/devices-configuration.md)) |
| `--ios-version <version>` | iOS version |
| `--device-locale <locale>` | Device locale (see [Device Locale](../configuration/device-locale.md)) |
| `--orientation <orientation>` | Device orientation, `0` (portrait) or `90` (landscape). Android only (see [Orientation](../configuration/orientation.md)) |
| `--google-play` | Use a Google Play-enabled device. Android only (see [Google Play APIs](../configuration/google-play-apis.md)) |
| `--runner-type <type>` | Runner type to use: `default` (the default), `cpu1`, `m1` or `m4` (see [Runner Types](../configuration/runner-type.md)) |
| `--render-engine <engine>` | Android only. Software renderer the emulator boots with: `lavapipe` (default) or `swiftshader`. Try `swiftshader` if your app fails to render or the device drops out mid-run. Apps built with Flutter are detected and switched automatically |
| `--ios-device-matrix <device>:<version>` | Run every flow once on each listed iOS device, e.g. `iphone-16:18`. Repeat the flag for each device. Can't be combined with `--android-device-matrix` (see [Device Matrix](../configuration/device-matrix.md)) |
| `--android-device-matrix <device>:<apiLevel>` | Run every flow once on each listed Android device, e.g. `pixel-8:34`. Append `:play` for Google Play. Repeat the flag for each device. Can't be combined with `--ios-device-matrix` (see [Device Matrix](../configuration/device-matrix.md)) |

### Flows

| Flag | Description |
|------|-------------|
| `--flows <path>` | Path to a flow file or a directory of flows (alternative to the positional `<flowFile>` argument) |
| `--config <path>` | Path to a `config.yaml` workspace config file (see [Workspace Configuration](../configuration/workspace-config.md)) |
| `--exclude-flows <paths>` | Flow files or sub-directories to exclude. Comma-separated, or repeat the flag |
| `--include-tags <tags>` | Only run flows with these tags. Comma-separated, or repeat the flag |
| `--exclude-tags <tags>` | Skip flows with these tags. Comma-separated, or repeat the flag |

### Test Configuration

| Flag | Description |
|------|-------------|
| `--maestro-version <version>`, `--maestroVersion` | Maestro version to use, or `latest` (see [Maestro Versions](../configuration/maestro-versions.md)) |
| `--env <KEY=VALUE>`, `-e` | Environment variables to pass to the test. Repeat for multiple values (see [Environment Variables](../configuration/environment-variables.md)) |
| `--metadata <key=value>`, `-m` | Arbitrary metadata to attach to the run (shown in the console). Repeat for multiple values |
| `--name <name>` | Name for this upload (shown in the console) |
| `--retry <n>` | Retry failed tests up to `n` times (free of charge). Max `2`: a higher value is reduced to `2` (see [Retry Strategies](../advanced/retry-strategies.md)) |

### GitHub / PR Context

Attach Git and pull request metadata to a run. These values are displayed in the DeviceCloud console alongside the test results, making it easy to trace a run back to the exact commit or PR that triggered it.

| Flag | Description |
|------|-------------|
| `--branch <name>` | Git branch name for this run |
| `--commit-sha <sha>` | Git commit SHA for this run |
| `--repo-name <owner/repo>` | Repository in `owner/repo` format (e.g. `acme/my-app`) |
| `--pr-number <number>` | Pull request number |
| `--pr-url <url>` | Pull request URL |

### Android-Specific

| Flag | Description |
|------|-------------|
| `--maestro-chrome-onboarding` | Force Maestro-based Chrome onboarding. Slows tests but can fix browser-related crashes (see [Chrome Onboarding](../advanced/chrome-onboarding.md)) |
| `--android-no-snapshot` | Force a cold boot instead of a snapshot boot on the standard Android runner. Automatically enabled for API 34+ |
| `--show-crosshairs` | Display crosshairs for screen interactions during test execution |

### Performance

| Flag | Description |
|------|-------------|
| `--disable-animations` | Disable device animations during test execution. On Android, disables system animation scales. On iOS, enables Reduce Motion. Overrides `disableAnimations` in `config.yaml`, and `--no-disable-animations` keeps animations on even when `config.yaml` turns them off (see [Animations](../configuration/disable-animations.md)) |

### Output & Execution

| Flag | Description |
|------|-------------|
| `--async` | Submit tests and return immediately (exit `0`) without waiting for results. `--download-artifacts` and `--report` do nothing with `--async`: download them later with [`dcd artifacts`](dcd-artifacts.md) (see [Async Execution](../advanced/async-execution.md)) |
| `--cancel-previous` | Cancel the still-queued tests of the previous run from the same CI context. Needs a repository plus a branch or PR: `--repo-name` with `--branch` or `--pr-number`, or the same values as `--metadata gh_repo=…` with `gh_branch=…` or `gh_pr_number=…` (see [Cancelling superseded runs](../advanced/cancel-previous.md)) |
| `--priority <level>` | `low`, `normal` (default) or `high`. Reorders only your team's own queued runs (see [Run Priority](../configuration/run-priority.md)) |
| `--quiet`, `-q` | Suppress per-test progress; print only the final summary |
| `--json` | Output results as JSON (see [JSON output](#json-output)). Exits `0` on success, `2` on test failure, `1` on CLI/infrastructure errors. The output includes a `notices` array with any deprecation or other notices for the run. A run superseded through `--cancel-previous` has `status` `SUPERSEDED` and exits `0` |
| `--json-file` | Write JSON results to a file (`<upload_id>_dcd.json` by default). Exits `0` even if the test run fails; infrastructure errors still exit `1`. Also turns on `--quiet` |
| `--json-file-name <name>` | Custom name (or relative path) for the JSON file. Requires `--json-file` |
| `--dry-run` | Simulate the run without uploading or triggering a test — useful for debugging workflow issues |
| `--report <format>`, `--format` | Generate and download a report. Options: `junit`, `html`, `html-detailed`, `allure`. `html-detailed` and `allure` are deprecated, and we're targeting their removal on 7 December 2026. After that, runs that pass them still run (see [Report Formats](../artifacts/report-formats.md)) |
| `--junit-path <path>` | Output path for the JUnit report (requires `--report junit`) |
| `--html-path <path>` | Output path for the HTML report (requires `--report html` or `html-detailed`). The HTML report downloads as a ZIP, so use a `.zip` path such as `./report.zip` |
| `--allure-path <path>` | Output path for the Allure report (requires `--report allure`). Deprecated, along with `allure` |
| `--download-artifacts <ALL\|FAILED>` | Download test artifacts after completion (see [Artifacts](../artifacts/artifacts.md)) |
| `--artifacts-path <path>` | Output path for the artifacts zip (default `./artifacts.zip`). Requires `--download-artifacts` |
| `--debug` | Enable verbose debug logging |

## JSON output

`--json` prints one JSON object on stdout when the run has finished. `--json-file` writes the same object to `<upload_id>_dcd.json`, or to the path you give with `--json-file-name`.

```json
{
  "consoleUrl": "https://console.devicecloud.dev/results?upload=3f6c1a2e-8b4d-4c1e-9a7f-2d5e6b8c9a01&result=4500",
  "status": "FAILED",
  "tests": [
    {
      "device": { "name": "Pixel 8", "osVersion": "34", "googlePlay": false },
      "durationSeconds": 48,
      "fileName": "./login.yaml",
      "flowName": "Login",
      "name": "./login.yaml",
      "status": "PASSED",
      "tags": ["smoke"]
    },
    {
      "device": { "name": "Pixel 8", "osVersion": "34", "googlePlay": false },
      "durationSeconds": 95,
      "failReason": "Element not found: Text matching regex: Pay now",
      "fileName": "./checkout.yaml",
      "flowName": "Checkout",
      "name": "./checkout.yaml",
      "status": "FAILED",
      "tags": []
    }
  ],
  "uploadId": "3f6c1a2e-8b4d-4c1e-9a7f-2d5e6b8c9a01",
  "notices": []
}
```

| Field | Description |
|---|---|
| `status` | `PASSED` when every test passed, `SUPERSEDED` when a newer run replaced this one through `--cancel-previous`, otherwise `FAILED`. With `--async` it's `PENDING`, because the CLI doesn't wait for the run |
| `uploadId` | The run's upload ID, for [`dcd status`](dcd-status.md) and [`dcd artifacts`](dcd-artifacts.md) |
| `consoleUrl` | The run in the console |
| `tests[]` | One entry per flow and device. When a test was [retried](../advanced/retry-strategies.md), the entry is its last attempt |
| `tests[].name`, `tests[].fileName` | The flow's path within the upload, such as `./login.yaml` |
| `tests[].flowName` | The flow's `name:`, or its file name without the extension |
| `tests[].status` | The test's own status, such as `PASSED`, `FAILED` or `CANCELLED`. With `--async`, its status when it was submitted |
| `tests[].durationSeconds` | How long the test ran, in seconds, or `null` if that isn't known. Not included with `--async` |
| `tests[].failReason` | Why the test failed. Only on failed tests |
| `tests[].tags` | The flow's tags |
| `tests[].device` | The device the test ran on: `name`, `osVersion` and `googlePlay`. Left out when the API doesn't report it |
| `notices[]` | Deprecation and other notices for the run, each with `slug`, `level`, `title`, `body` and `learnMoreUrl` |

If the CLI itself fails, for example on a bad flag, a network error or a run the API refuses to start, `--json` prints `{"status": "FAILED", "error": "…"}` and exits `1`. That's the same `status` as a failed run, so check the exit code, or look for an `error` field, before you treat `FAILED` as a test failure. `--json-file` writes no file in that case.

## Examples

**Android:**
```bash
dcd cloud app.apk flows/ --android-device pixel-8 --android-api-level 34
```

**iOS:**
```bash
dcd cloud app.zip flows/ --ios-device iphone-16 --ios-version 18
```

**Filter by tag:**
```bash
dcd cloud app.apk flows/ --include-tags smoke
```

**Reuse a previously uploaded binary:**
```bash
dcd cloud flows/ --app-binary-id 67894274-b789-4c1e-80d4-da8998998999
```

**Save results to JSON:**
```bash
dcd cloud app.apk flows/ --json-file --json-file-name results.json
```
