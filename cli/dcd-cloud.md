# dcd cloud

Upload an app binary and run Maestro flows on DeviceCloud. This is the primary command and a drop-in replacement for `maestro cloud`.

```bash
dcd cloud <app-file> <flows-dir> [flags]
```

The command blocks until all tests have completed, then exits with an appropriate [exit code](../advanced/exit-codes.md).

## Arguments

| Argument | Description |
|----------|-------------|
| `<app-file>` | Path to your app binary (`.apk` for Android, `.app` or `.zip` for iOS) |
| `<flows-dir>` | Path to the flow file or directory of flows to run |

## Flags

### Authentication

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Your DeviceCloud API key. Defaults to `DEVICE_CLOUD_API_KEY` env var |

### App

| Flag | Description |
|------|-------------|
| `--app-binary-id <id>` | Reuse a previously uploaded binary instead of uploading again |
| `--app-url <url>` | Signed URL to an Expo iOS build (`.tar.gz`). The archive is downloaded and extracted automatically. Expo signed URLs expire after ~1 hour. Mutually exclusive with `--app-file` |
| `--additional-app-files <paths>` | Comma-separated list of additional app files to upload |
| `--additional-app-binary-ids <ids>` | Comma-separated list of additional binary IDs to include |
| `--ignore-sha-check` | Force re-upload even if a binary with the same SHA already exists |

### Device

| Flag | Description |
|------|-------------|
| `--android-device <device>` | Android device model to run on (see [Devices](../getting-started/devices-configuration.md)) |
| `--android-api-level <level>` | Android API level |
| `--ios-device <device>` | iOS device model to run on (see [Devices](../getting-started/devices-configuration.md)) |
| `--ios-version <version>` | iOS version |
| `--device-locale <locale>` | Device locale (see [Device Locale](../configuration/device-locale.md)) |
| `--orientation <orientation>` | Device orientation (see [Orientation](../configuration/orientation.md)) |
| `--google-play` | Use a Google Play-enabled device (see [Google Play APIs](../configuration/google-play-apis.md)) |
| `--runner-type <type>` | Runner type to use (see [Runner Types](../configuration/runner-type.md)) |

### Flows

| Flag | Description |
|------|-------------|
| `--flows <paths>` | Comma-separated list of flow files to run (alternative to positional arg) |
| `--config <path>` | Path to a `config.yaml` workspace config file |
| `--exclude-flows <paths>` | Comma-separated list of flow files to exclude |
| `--include-tags <tags>` | Only run flows with these tags (comma-separated) |
| `--exclude-tags <tags>` | Skip flows with these tags (comma-separated) |

### Test Configuration

| Flag | Description |
|------|-------------|
| `--maestro-version <version>` | Maestro version to use (see [Maestro Versions](../configuration/maestro-versions.md)) |
| `--env <KEY=VALUE>` | Environment variables to pass to the test. Repeat for multiple values |
| `--name <name>` | Name for this upload (shown in the console) |
| `--retry <n>` | Retry failed tests up to `n` times. Max `2` (see [Retry Strategies](../advanced/retry-strategies.md)) |
| `--report <format>` | Generate a report. Options: `junit`, `html`, `html-detailed`, `allure` (see [Report Formats](../test-results/report-formats.md)) |

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
| `--maestro-chrome-onboarding` | Run Chrome onboarding before tests (see [Chrome Onboarding](../advanced/chrome-onboarding.md)) |
| `--android-no-snapshot` | Disable snapshot restore at test start |
| `--enable-animations` | Enable device animations during tests |

### Output & Execution

| Flag | Description |
|------|-------------|
| `--async` | Submit tests and return immediately without waiting for results (see [Async Execution](../advanced/async-execution.md)) |
| `--quiet` | Suppress per-test output; print only the final summary |
| `--json` | Output results as JSON. Exits `0` even on test failure |
| `--json-file <path>` | Write JSON results to a file |
| `--download-artifacts <ALL\|FAILED>` | Download test artifacts after completion (see [Artifacts](../test-results/artifacts.md)) |
| `--debug` | Enable verbose debug logging |
| `--use-beta` | Use the beta version of the DeviceCloud runner |

## Examples

**Android:**
```bash
dcd cloud app.apk flows/ --android-device "Pixel 8" --android-api-level 34
```

**iOS:**
```bash
dcd cloud app.zip flows/ --ios-device "iPhone 16" --ios-version 18
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
dcd cloud app.apk flows/ --json-file results.json
```
