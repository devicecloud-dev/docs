# GitHub Actions

The DeviceCloud GitHub Action is a drop-in replacement for the [Maestro Cloud Action](https://github.com/mobile-dev-inc/action-maestro-cloud). The inputs are identical where practical, so switching is straightforward.

## Quick Start

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: <path_to_your_app_file>
```

Store your API key as a [GitHub Actions secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets) named `DCD_API_KEY`. You can find your API key in the [console settings](https://console.devicecloud.dev/settings).

## Trigger Recommendations

Trigger tests on pushes to your main branch and on pull requests:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

{% hint style="info" %}
If you use `pull_request_target` to run tests from forked PRs, explicitly check out the PR HEAD to ensure you're testing the changed code.
{% endhint %}

```yaml
on:
  push:
    branches: [main]
  pull_request_target:
    branches: [main]
jobs:
  run-maestro-on-dcd:
    name: Run Flows on DeviceCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.sha }}
```

## Platform Examples

### Android

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app/build/outputs/apk/debug/app-debug.apk
```

`app-file` accepts a path or a glob pattern. When using a glob, the first matched file is used.

### iOS

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: <app_name>.zip
```

`app-file` must point to an Apple silicon compatible Simulator `.app` build, or a zipped `.zip` bundle. Glob patterns are supported; the first match is used.

### iOS with Expo

If you build with EAS, you can pass the signed build URL directly using `app-url` instead of downloading the archive yourself. The URL is fetched and extracted automatically.

```yaml
- name: Build with EAS
  run: eas build --platform ios --profile simulator --non-interactive --json > build.json

- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-url: ${{ fromJson(steps.eas-build.outputs.result).artifacts.buildUrl }}
    flows: .maestro/
```

> **Note:** Expo signed URLs expire after ~1 hour. Generate a fresh URL immediately before this step.

---

## Inputs Reference

### Authentication

| Input | Required | Description |
|-------|----------|-------------|
| `api-key` | Yes | Your DeviceCloud API key. Can also be set via the `DEVICE_CLOUD_API_KEY` environment variable. |

### App Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `app-file` | No* | — | Path or glob to the app binary (APK or .app/.zip). *Either `app-file` or `app-binary-id` is required. |
| `app-binary-id` | No* | — | ID of a previously uploaded app binary. Skips the upload step. |
| `additional-app-files` | No | — | Multiline list of additional binary paths to install before the test. |
| `additional-app-binary-ids` | No | — | Multiline list of additional previously-uploaded binary IDs. |
| `ignore-sha-check` | No | `false` | Skip the SHA hash check that prevents duplicate uploads. Not recommended. |

### Flow Selection

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `flows` | No | `./.maestro/` | Path to a flow file or folder containing flows. Alias: `workspace`. `flows` takes precedence if both are set. |
| `workspace` | No | `./.maestro/` | Alias for `flows`. |
| `exclude-flows` | No | — | Subdirectories to exclude when building the flow list. |
| `include-tags` | No | — | Only run flows with these Maestro tags (comma-separated). |
| `exclude-tags` | No | — | Exclude flows with these Maestro tags (comma-separated). |
| `config` | No | `config.yaml` in workspace | Path to a custom Maestro config file. |

### Device Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `android-device` | No | — | Android device model. Options: `pixel-6`, `pixel-6-pro`, `pixel-7`, `pixel-7-pro`, `generic-tablet`. |
| `android-api-level` | No | `34` | Android API level. Options: `29`, `30`, `31`, `32`, `33`, `34`, `35`, `36`. |
| `ios-device` | No | — | iOS device model. Options: `iphone-14`, `iphone-14-pro`, `iphone-15`, `iphone-15-pro`, `iphone-16`, `iphone-16-plus`, `iphone-16-pro`, `iphone-16-pro-max`, `ipad-pro-6th-gen`. |
| `ios-version` | No | `17` | Major iOS version. Options: `16`, `17`, `18`, `26`. |
| `device-locale` | No | — | Device locale in `ISO-639-1_ISO-3166-1` format (e.g. `de_DE`). See [Device Locale](../configuration/device-locale.md). |
| `orientation` | No | `0` | Android only. Device orientation in degrees. Options: `0`, `90`, `180`, `270`. |
| `google-play` | No | `false` | Android only. Run flows against Google Play devices. |
| `runner-type` | No | `default` | Runner type. Options: `default`, `m1`, `m4`. Non-default runners incur premium pricing. See [Runner Types](../configuration/runner-type.md). |

See the [Devices & OS Versions](../getting-started/devices-configuration.md) page for the full availability matrix.

### Test Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-version` | No | — | Maestro CLI version to run flows with. See [Maestro Versions](../configuration/maestro-versions.md). |
| `env` | No | — | Multiline list of environment variables (`KEY=value`) to inject into flows. |
| `name` | No | Commit message | Custom name for this test run, visible in the console. |
| `retry` | No | `0` | Number of retries on failure (max `3`). Retries are free — same as pressing retry in the UI. |
| `report` | No | — | Report format. Options: `junit`, `html`, `html-detailed`, `allure`. See [Report Formats](../test-results/report-formats.md). |

### Android-Specific Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-chrome-onboarding` | No | `false` | Force Maestro-based Chrome onboarding. Fixes browser-related crashes but slows tests. See [Chrome Onboarding](../advanced/chrome-onboarding.md). |
| `android-no-snapshot` | No | `false` | Force cold boot instead of snapshot boot. Automatically enabled for API level 35+. |
| `enable-animations` | No | `false` | Keep device animations enabled during tests. By default animations are disabled to reduce CPU load. |

### GitHub / PR Context

Attach Git and pull request metadata to a run. These values are displayed in the DeviceCloud console alongside the test results.

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `branch` | No | — | Git branch name for this run. |
| `commit-sha` | No | — | Git commit SHA for this run. |
| `repo-name` | No | — | Repository in `owner/repo` format (e.g. `acme/my-app`). |
| `pr-number` | No | — | Pull request number. |
| `pr-url` | No | — | Pull request URL. |

### Execution Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `async` | No | `false` | Exit immediately without waiting for results. Returns exit code `0` regardless of test outcome. See [Async Execution](../advanced/async-execution.md). |
| `quiet` | No | `false` | Reduce console output. Useful in verbose CI environments. |
| `download-artifacts` | No | — | Download logs, screenshots, and videos after the run. Options: `ALL`, `FAILED`. |
| `json-file` | No | `false` | Write test results to a JSON file (`<run_name>_dcd.json` or `<upload_id>_dcd.json`). |
| `debug` | No | `false` | Enable verbose debug output. |
| `use-beta` | No | `false` | Use the beta version of the DCD CLI. |

---

## Outputs Reference

Add an `id` to the step to reference its outputs in later steps:

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  id: devicecloud
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
```

| Output | Description |
|--------|-------------|
| `DEVICE_CLOUD_CONSOLE_URL` | URL to view the test results in the DeviceCloud console. |
| `DEVICE_CLOUD_FLOW_RESULTS` | JSON array with results for each flow: `[{ "name": "...", "status": "PASSED" }]`. |
| `DEVICE_CLOUD_UPLOAD_STATUS` | Overall status of the test run: `PENDING`, `RUNNING`, `PASSED`, `FAILED`, or `CANCELLED`. |
| `DEVICE_CLOUD_APP_BINARY_ID` | ID of the uploaded app binary. Reuse this in subsequent jobs to skip re-uploading. |

---

## Using Outputs

### Post results to Slack

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  id: devicecloud
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk

- name: Post Test Results to Slack
  if: always()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    channel-id: 'test-results'
    slack-message: |
      Test Run Status: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_UPLOAD_STATUS }}
      View Results: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_CONSOLE_URL }}
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### Save results as a workflow artifact

```yaml
- name: Save Test Results
  if: always()
  run: |
    echo '${{ steps.devicecloud.outputs.DEVICE_CLOUD_FLOW_RESULTS }}' > test-results.json

- name: Upload Results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results.json
```

### Reuse the uploaded binary in a later job

```yaml
jobs:
  upload-and-test:
    runs-on: ubuntu-latest
    outputs:
      binary-id: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_APP_BINARY_ID }}
    steps:
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        id: devicecloud
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app.apk

  test-another-suite:
    needs: upload-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-binary-id: ${{ needs.upload-and-test.outputs.binary-id }}
          flows: other-tests/
```

---

## Common Patterns

### Attach PR context to test runs

Pass Git and PR metadata so each run is traceable back to the commit or PR that triggered it. The information is displayed in the DeviceCloud console.

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    branch: ${{ github.head_ref || github.ref_name }}
    commit-sha: ${{ github.sha }}
    repo-name: ${{ github.repository }}
    pr-number: ${{ github.event.pull_request.number }}
    pr-url: ${{ github.event.pull_request.html_url }}
```

### Run async tests (non-blocking)

Use `async: true` to start tests without blocking your pipeline. Then use [`dcd status`](../cli/dcd-status.md) to check results separately.

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    async: true
    name: ${{ github.sha }}
```

### Filter tests by tag

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    include-tags: smoke, critical
    exclude-tags: wip
```

### Pass secrets to flows

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    env: |
      USERNAME=${{ secrets.TEST_USERNAME }}
      PASSWORD=${{ secrets.TEST_PASSWORD }}
```

### Save JSON results file

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    json-file: true
    name: my-run
```

This creates `my-run_dcd.json`:

```json
{
  "uploadId": "abcd1234-5678-efgh-9012-ijklmnopqrst",
  "consoleUrl": "https://console.devicecloud.dev/results?upload=abcd1234-...",
  "appBinaryId": "app-binary-5678",
  "status": "PASSED",
  "flowResults": [
    { "name": "login_test", "status": "PASSED" },
    { "name": "checkout_flow", "status": "PASSED" }
  ]
}
```

---

## Migrating from Maestro Cloud

Switch in one line — replace the `uses` value:

```yaml
# Before
- uses: mobile-dev-inc/action-maestro-cloud@v2
  with:
    api-key: ${{ secrets.MCLOUD_API_KEY }}
    app-file: app.apk

# After
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
```

All other inputs are compatible. The only change needed (beyond the `uses` line) is updating your secret name from `MCLOUD_API_KEY` to `DCD_API_KEY` (or whatever name you choose when storing your DeviceCloud API key).
