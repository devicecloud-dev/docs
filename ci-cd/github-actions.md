# GitHub Actions

The DeviceCloud GitHub Action is a drop-in replacement for the [Maestro Cloud Action](https://github.com/mobile-dev-inc/action-maestro-cloud). The inputs are identical where practical, so switching is straightforward.

Additionally, you can set up our GitHub App to use GitHub Checks to manage pull requests and blocking. Read more [here](github-checks.md).

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

{% hint style="warning" %}
If you use `pull_request_target` to run tests from forked PRs, explicitly check out the PR HEAD to ensure you're testing the changed code. Be aware that `pull_request_target` runs with your repository's secrets, including your DeviceCloud API key, so anything the job runs from a fork's checkout (build scripts, and the flows themselves) runs with access to them. Only run it on PRs you've reviewed, for example by requiring approval through a GitHub environment.
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

From v2.6.0, `app-file` also accepts a glob pattern such as `build/**/*.apk`. When a pattern matches several files, the first in sorted order is used.

### iOS

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: <app_name>.zip
```

`app-file` must point to an Apple silicon compatible Simulator `.app` build, or a zipped `.zip` bundle. From v2.6.0 it can also be a glob pattern, as for Android.

### iOS with Expo

If you build with EAS, download the build artifact in an earlier step and pass the resulting file to `app-file`. For a first-class Expo experience that wires this up for you, use the dedicated [EAS Workflows integration](eas-workflows.md) instead.

---

## Inputs Reference

### Authentication

| Input | Required | Description |
|-------|----------|-------------|
| `api-key` | Yes | Your DeviceCloud API key. Pass it from a secret, e.g. `api-key: ${{ secrets.DCD_API_KEY }}`. |

### App Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `app-file` | No* | — | Path to the app binary (`.apk`, `.app`/`.zip`, or an Expo iOS `.tar.gz`), or from v2.6.0 a glob pattern (first match in sorted order). *Either `app-file` or `app-binary-id` is required. |
| `app-binary-id` | No* | — | ID of a previously uploaded app binary. Skips the upload step. |
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
| `android-device` | No | `pixel-7` | Android device model. Options: `pixel-6`, `pixel-6-pro`, `pixel-7`, `pixel-7-pro`, `pixel-8`, `pixel-10`, `pixel-10-pro`, `pixel-10-pro-xl`, `pixel-10-pro-fold`, `pixel-11`, `generic-tablet`. Default becomes `pixel-10` from 26 October 2026. |
| `android-api-level` | No | `34` | Android API level. Options: `29`, `30`, `31`, `32`, `33`, `34`, `35`, `36`, `37`. Default becomes `36` from 19 October 2026. |
| `ios-device` | No | — | iOS device model. Options: `iphone-14`, `iphone-15`, `iphone-16`, `iphone-16-plus`, `iphone-16-pro`, `iphone-16-pro-max`, `ipad-pro-6th-gen`. |
| `ios-version` | No | `17` | Major iOS version. Options: `17`, `18`, `26`, `27`. |
| `device-locale` | No | — | Device locale in `ISO-639-1_ISO-3166-1` format (e.g. `de_DE`). See [Device Locale](../configuration/device-locale.md). |
| `orientation` | No | `0` | Android only. Device orientation in degrees. Options: `0`, `90`. |
| `google-play` | No | `false` | Android only. Run flows against Google Play devices. |
| `runner-type` | No | `default` | Runner type. Options: `default`, `cpu1`, `gpu1`, `m1`, `m4`. `gpu1`, `m1` and `m4` incur premium pricing. See [Runner Types](../configuration/runner-type.md). |

See the [Devices & OS Versions](../getting-started/devices-configuration.md) page for the full availability matrix.

### Test Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-version` | No | — | Maestro CLI version to run flows with. See [Maestro Versions](../configuration/maestro-versions.md). |
| `env` | No | — | Multiline list of environment variables (`KEY=value`) to inject into flows. |
| `name` | No | PR title or commit message | Custom name for this test run, visible in the console. Defaults to the pull request's title on PR events, the commit message on push events, and the commit SHA otherwise. |
| `retry` | No | `0` | Number of retries on failure (max `2`). Retries are free — same as pressing retry in the UI. |
| `report` | No | — | Report format. Options: `junit`, `html`, and from v2.6.0 `html-detailed`. See [Report Formats](../artifacts/report-formats.md). |

### Android-Specific Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-chrome-onboarding` | No | `false` | Force Maestro-based Chrome onboarding. Fixes browser-related crashes but slows tests. See [Chrome Onboarding](../advanced/chrome-onboarding.md). |
| `android-no-snapshot` | No | `false` | Force cold boot instead of snapshot boot. Automatically enabled for API level 34+. |
| `render-engine` | No | — | Software renderer the emulator boots with on the default Android runner (`cpu1`). Options: `lavapipe`, `swiftshader`. Leave unset to let DeviceCloud choose: `lavapipe`, or `swiftshader` for apps built with Flutter. Try `swiftshader` if your app fails to render or the device drops offline mid-run. |

### Performance Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `disable-animations` | No | `false` | Disable device animations during test execution. On Android, disables system animation scales. On iOS, enables Reduce Motion. Reduces CPU load and may improve test reliability. |

### GitHub / PR Context

The action automatically attaches Git and pull request metadata to each run, read from the GitHub Actions environment. These values are displayed in the DeviceCloud console alongside the results, so you can trace a run back to the commit or PR that triggered it — you don't need to pass branch, commit, or PR values yourself.

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `include-github-context` | No | `true` | Automatically attach GitHub/PR context (branch, commit SHA, PR number, PR URL, run ID, repository) to the run as metadata. Set to `false` to opt out. |
| `check-name` | No | — | Names the [GitHub check](github-checks.md) this run posts — `iOS` gives a check called `DeviceCloud / iOS`. Use it when a PR runs more than once so each run gets its own check. Keep it fixed for a given job. |

### Execution Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `async` | No | `false` | Exit immediately without waiting for results. Returns exit code `0` regardless of test outcome. See [Async Execution](../advanced/async-execution.md). |
| `cancel-previous` | No | `false` | Cancel the still-queued tests of the previous run of this job on the same branch or PR (from v2.6.0). See [Cancelling superseded runs](../advanced/cancel-previous.md). |
| `quiet` | No | `true` | Quieter output, without progress updates while the run is polled. Set to `false` to see them. Before v2.6.0 this input had no effect and the output was always quiet. |
| `download-artifacts` | No | — | Download logs, screenshots, and videos after the run. Options: `ALL`, `FAILED`. |
| `json-file` | No | `false` | Write test results to `<upload_id>_dcd.json` in the working directory. See [Save JSON results file](#save-json-results-file). |
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
| `DEVICE_CLOUD_FLOW_RESULTS` | JSON array with results for each flow: `[{ "name": "...", "status": "PASSED" }]`. Empty (`[]`) with `async: true`. |
| `DEVICE_CLOUD_UPLOAD_STATUS` | Overall status of the test run: `PASSED` or `FAILED` once it has finished (a run with a cancelled flow counts as `FAILED`). `PENDING`, `QUEUED` or `RUNNING` if it hadn't finished when the status was read, and always `PENDING` with `async: true`. `ERROR` if the Action couldn't read the status. |
| `DEVICE_CLOUD_APP_BINARY_ID` | ID of the uploaded app binary. Reuse this in subsequent jobs to skip re-uploading. Not set with `async: true`. |

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

This needs the first job to wait for its results: with `async: true`, `DEVICE_CLOUD_APP_BINARY_ID` isn't set.

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

### Opt out of automatic PR context

Git and PR metadata (branch, commit SHA, PR number/URL, repository, run ID) is attached automatically — see [GitHub / PR Context](#github-pr-context). To turn it off, set `include-github-context: false`:

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
    include-github-context: false
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

{% hint style="info" %}
With the [DeviceCloud GitHub App](github-checks.md) installed, an async run reports back as a pass/fail check on the pull request, so you can gate merges without keeping a runner alive to wait for results.
{% endhint %}

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
```

This writes `<upload_id>_dcd.json` to the job's working directory, for example `3f6c1a2e-8b4d-4c1e-9a7f-2d5e6b8c9a01_dcd.json`. The file name can't be changed from the Action.

```json
{
  "consoleUrl": "https://console.devicecloud.dev/results?upload=3f6c1a2e-8b4d-4c1e-9a7f-2d5e6b8c9a01",
  "status": "FAILED",
  "tests": [
    {
      "device": { "name": "Pixel 7", "osVersion": "34", "googlePlay": false },
      "durationSeconds": 48,
      "fileName": "./login.yaml",
      "flowName": "Login",
      "name": "./login.yaml",
      "status": "PASSED",
      "tags": ["smoke"]
    },
    {
      "device": { "name": "Pixel 7", "osVersion": "34", "googlePlay": false },
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

`status` is `PASSED` only when every flow passed. `flowName` is the flow's `name:` (or its file name without the extension), and `notices` lists any deprecation or other notices shown for the run. With `async: true` the file is written straight away with `status` set to `PENDING`.

---

## Migrating from Maestro Cloud

Replace the `uses` value, then check your inputs against the table below:

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

Update your secret name from `MCLOUD_API_KEY` to `DCD_API_KEY` (or whatever name you choose when storing your DeviceCloud API key).

These Maestro Cloud inputs work unchanged: `api-key`, `app-file`, `app-binary-id`, `workspace`, `name`, `env`, `async`, `android-api-level`, `ios-version`, `device-locale`, `include-tags` and `exclude-tags`. The ones below aren't supported. GitHub only warns about inputs an action doesn't recognise, so remove or replace them. In particular, `device-model` and `device-os` are ignored, so until you replace them your flows run on the [default device](../getting-started/devices-configuration.md#default-devices).

| Maestro Cloud input | DeviceCloud equivalent |
|---------------------|------------------------|
| `project-id` | Not needed: runs belong to the team that owns the API key. |
| `device-model` | `ios-device` or `android-device` |
| `device-os` | `ios-version` or `android-api-level` |
| `maestro-cli-version` | `maestro-version` |
| `timeout` | None. The Action waits until the run finishes; use `async: true` to return straight away. |
| `branch` | None. The branch is attached automatically with the rest of the [GitHub / PR context](#github-pr-context). |
| `mapping-file` | Not supported. |
