# GitHub Actions

The DeviceCloud GitHub Action is a drop-in replacement for the [Maestro Cloud Action](https://github.com/mobile-dev-inc/action-maestro-cloud). The inputs are identical where practical, so switching is straightforward.

To get a pass/fail check on each pull request, which you can require before merging, install the DeviceCloud GitHub App. See [GitHub Checks](github-checks.md).

## Quick Start

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: <path_to_your_app_file>
```

Store your API key as a [GitHub Actions secret](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) named `DCD_API_KEY`. Create the key under **Settings → API Keys** in the [console](https://console.devicecloud.dev/settings), with **CI: run tests only** access, so a leaked secret can't read your other runs. See [Key access](../getting-started/api-keys.md#key-access).

## Trigger Recommendations

Trigger tests on pushes to your main branch and on pull requests:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Pull requests from forks

GitHub doesn't pass secrets to `pull_request` runs from a fork, so `DCD_API_KEY` is empty and the DeviceCloud step fails. To skip the job on fork PRs instead of failing it, add a condition to the job:

```yaml
jobs:
  run-maestro-on-dcd:
    name: Run Flows on DeviceCloud
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
```

We don't recommend switching to `pull_request_target` to test forks. It runs with your repository's secrets, including your DeviceCloud API key, so a fork's build scripts and flows would run with access to them. GitHub also restricts it now:

- Since 20 July 2026, `actions/checkout` refuses to check out a fork's code in a `pull_request_target` run unless you set its `allow-unsafe-pr-checkout` input.
- From 2 December 2026, GitHub blocks `pull_request_target` in public repositories unless an Actions policy (**Settings** > **Actions** > **Policies**) allows it.

If you still need it, allow the event for that workflow in an Actions policy, set `allow-unsafe-pr-checkout: true` on the checkout step, and only run it on PRs you've reviewed, for example by requiring approval through a GitHub environment.

## Platform Examples

### Android

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app/build/outputs/apk/debug/app-debug.apk
```

`app-file` also accepts a glob pattern such as `build/**/*.apk`. When a pattern matches several files, the first in sorted order is used.

### iOS

```yaml
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: <app_name>.zip
```

`app-file` must point to an Apple silicon compatible Simulator `.app` build, or a zipped `.zip` bundle. It can also be a glob pattern, as for Android.

### iOS with Expo

If you build with EAS, download the build artifact in an earlier step and pass the resulting file to `app-file`. For a first-class Expo experience that wires this up for you, use the dedicated [EAS Workflows integration](eas-workflows.md) instead.

---

## Inputs Reference

`@v2` always runs the latest 2.x release of the Action, so every input below is available.

### Authentication

| Input | Required | Description |
|-------|----------|-------------|
| `api-key` | Yes | Your DeviceCloud API key. Pass it from a secret, e.g. `api-key: ${{ secrets.DCD_API_KEY }}`. |

### App Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `app-file` | No* | — | Path to the app binary (`.apk`, `.app`/`.zip`, or an Expo iOS `.tar.gz`), or a glob pattern (first match in sorted order). *Set exactly one of `app-file` and `app-binary-id`. |
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

For the devices and OS versions you can pass, and which combinations work, see [Devices & OS Versions](../getting-started/devices-configuration.md).

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `android-device` | No | `pixel-10` | Android device model, e.g. `pixel-8`. |
| `android-api-level` | No | `36` | Android API level, e.g. `34`. |
| `ios-device` | No | `iphone-16` | iOS device model, e.g. `iphone-17`. |
| `ios-version` | No | `26` | Major iOS version, e.g. `18`. |
| `device-locale` | No | — | Device locale in `ISO-639-1_ISO-3166-1` format (e.g. `de_DE`). See [Locale](../configuration/device-settings.md#locale). |
| `orientation` | No | `0` | Android only. Device orientation in degrees. Options: `0`, `90`. |
| `google-play` | No | `false` | Android only. Run flows against Google Play devices. |
| `runner-type` | No | `default` | Runner type. Options: `default`, `cpu1`, `m1`, `m4`. `m1` and `m4` incur premium pricing. See [Runner Types](../configuration/runner-type.md). |

### Test Configuration

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-version` | No | — | Maestro CLI version to run flows with. See [Maestro Versions](../configuration/maestro-versions.md). |
| `env` | No | — | Multiline list of environment variables (`KEY=value`) to inject into flows. |
| `name` | No | PR title or commit message | Custom name for this test run, visible in the console. Defaults to the pull request's title on PR events, the commit message on push events, and the commit SHA otherwise. |
| `retry` | No | `0` | Number of retries on failure, up to `2`. See [Retry Strategies](../advanced/retry-strategies.md). |
| `report` | No | — | Report format: `junit` or `html`, saved in the working directory as `report.xml` or `report.zip`. `html-detailed` still works but is deprecated. See [Report formats](../artifacts/artifacts.md#report-formats). |

### Android-Specific Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `maestro-chrome-onboarding` | No | `false` | Force Maestro-based Chrome onboarding. Fixes browser-related crashes but slows tests. See [Chrome onboarding](../configuration/device-settings.md#chrome-onboarding). |
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
| `check-name` | No | — | Names the [GitHub check](github-checks.md) this run posts — `iOS` gives a check called `DeviceCloud / iOS`. Use it when a PR runs more than once so each run gets its own check. Keep it fixed for a given job. It's ignored when `include-github-context` is `false`, because the run then carries no commit to post a check on. |

### Execution Options

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `async` | No | `false` | Exit immediately without waiting for results. Returns exit code `0` regardless of test outcome. See [Async Execution](../advanced/async-execution.md). |
| `cancel-previous` | No | `false` | Cancel the still-queued tests of the previous run of this job on the same branch or PR. See [Cancelling superseded runs](../advanced/cancel-previous.md). |
| `priority` | No | `normal` | Run priority: `low`, `normal` or `high`. Reorders only your team's own queued runs. See [Run Priority](../configuration/run-priority.md). |
| `quiet` | No | `true` | Quieter output, without progress updates while the run is polled. Set to `false` to see them. |
| `download-artifacts` | No | — | Download logs, screenshots, and videos after the run, as `artifacts.zip` in the working directory. Options: `ALL`, `FAILED`. |
| `json-file` | No | `false` | Write test results to `<upload_id>_dcd.json` in the working directory. See [Save JSON results file](#save-json-results-file). |
| `debug` | No | `false` | Enable verbose debug output. |
| `use-beta` | No | `false` | Use the beta version of the dcd CLI. |

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
| `DEVICE_CLOUD_UPLOAD_STATUS` | Overall status of the test run: `PASSED` or `FAILED` once it has finished (a run with a cancelled flow counts as `FAILED`). `PENDING`, `QUEUED` or `RUNNING` if it hadn't finished when the status was read, and always `PENDING` with `async: true`. `ERROR` if the Action couldn't read the status; the job then fails. `SUPERSEDED` when a newer run replaced this one through [`cancel-previous`](../advanced/cancel-previous.md); the job passes. |
| `DEVICE_CLOUD_APP_BINARY_ID` | ID of the uploaded app binary. Reuse this in subsequent jobs to skip re-uploading. Not set with `async: true`. |

If `dcd cloud` itself exits with an error (exit code `1`), the job fails and no outputs are set.

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
  uses: slackapi/slack-github-action@v4.0.0
  with:
    method: chat.postMessage
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload: |
      channel: ${{ secrets.SLACK_CHANNEL_ID }}
      text: "Test run status: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_UPLOAD_STATUS }}\nView results: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_CONSOLE_URL }}"
```

DeviceCloud can also post every run to Slack itself, without a workflow step. See [Slack Notifications](../notifications/slack-notifications.md).

### Save results as a workflow artifact

```yaml
- name: Save Test Results
  if: always()
  env:
    FLOW_RESULTS: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_FLOW_RESULTS }}
  run: printf '%s\n' "$FLOW_RESULTS" > test-results.json

- name: Upload Results
  if: always()
  uses: actions/upload-artifact@v7
  with:
    name: test-results
    path: test-results.json
```

Passing the output through `env:` rather than writing `${{ }}` into the script keeps a flow name with a quote in it from breaking the command.

### Reuse the uploaded binary in a later job

This needs the first job to wait for its results: with `async: true`, `DEVICE_CLOUD_APP_BINARY_ID` isn't set. The second job runs only if the first one passed.

```yaml
jobs:
  upload-and-test:
    runs-on: ubuntu-latest
    outputs:
      binary-id: ${{ steps.devicecloud.outputs.DEVICE_CLOUD_APP_BINARY_ID }}
    steps:
      - uses: actions/checkout@v7

      - name: Build app
        run: ./gradlew assembleDebug

      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        id: devicecloud
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app/build/outputs/apk/debug/app-debug.apk

  test-another-suite:
    needs: upload-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

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

::: info
With the [DeviceCloud GitHub App](github-checks.md) installed, an async run reports back as a pass/fail check on the pull request, so you can gate merges without keeping a runner alive to wait for results.
:::

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
      "device": { "name": "Pixel 10", "osVersion": "36", "googlePlay": false },
      "durationSeconds": 48,
      "fileName": "./login.yaml",
      "flowName": "Login",
      "name": "./login.yaml",
      "status": "PASSED",
      "tags": ["smoke"]
    },
    {
      "device": { "name": "Pixel 10", "osVersion": "36", "googlePlay": false },
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

Replace the `uses` value, then check your inputs and outputs against the tables below:

```yaml
# Before
- uses: mobile-dev-inc/action-maestro-cloud@v3
  with:
    api-key: ${{ secrets.MCLOUD_API_KEY }}
    project-id: proj_xxx
    app-file: app.apk

# After
- uses: devicecloud-dev/device-cloud-for-maestro@v2
  with:
    api-key: ${{ secrets.DCD_API_KEY }}
    app-file: app.apk
```

Update your secret name from `MCLOUD_API_KEY` to `DCD_API_KEY` (or whatever name you choose when storing your DeviceCloud API key).

These Maestro Cloud inputs work unchanged: `api-key`, `app-file`, `app-binary-id`, `workspace`, `name`, `env`, `async`, `android-api-level`, `ios-version`, `device-locale`, `priority`, `include-tags` and `exclude-tags`. The ones below aren't supported. GitHub only warns about inputs an action doesn't recognise, so remove or replace them. In particular, `device-model` and `device-os` are ignored, so until you replace them your flows run on the [default device](../getting-started/devices-configuration.md#default-devices).

| Maestro Cloud input | DeviceCloud equivalent |
|---------------------|------------------------|
| `project-id` | Not needed: runs belong to the team that owns the API key. |
| `api-url` | Remove it. Left in place, it points the Action at another API. |
| `device-model` | `ios-device` or `android-device`, with DeviceCloud's device names, e.g. `iphone-16` or `pixel-8` |
| `device-os` | `ios-version` (the major version, e.g. `18`) or `android-api-level` (e.g. `34`) |
| `maestro-cli-version` | `maestro-version` |
| `timeout` | None. The Action waits until the run finishes; use `async: true` to return straight away. |
| `branch` | None. The branch is attached automatically with the rest of the [GitHub / PR context](#github-pr-context). |
| `mapping-file` | Not supported. |

The outputs have new names, so update any step that reads them:

| Maestro Cloud output | DeviceCloud output |
|----------------------|--------------------|
| `MAESTRO_CLOUD_CONSOLE_URL` | `DEVICE_CLOUD_CONSOLE_URL` |
| `MAESTRO_CLOUD_APP_BINARY_ID` | `DEVICE_CLOUD_APP_BINARY_ID` |
| `MAESTRO_CLOUD_UPLOAD_STATUS` | `DEVICE_CLOUD_UPLOAD_STATUS`. Its values differ too: a finished run is `PASSED` or `FAILED`, not `SUCCESS`, `ERROR`, `CANCELED`, `WARNING` or `STOPPED`. See [Outputs Reference](#outputs-reference). |
| `MAESTRO_CLOUD_FLOW_RESULTS` | `DEVICE_CLOUD_FLOW_RESULTS`. Each entry has the flow's `name` and `status`. |
