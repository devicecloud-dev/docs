# EAS Workflows

The DeviceCloud EAS Workflow wrapper is a drop-in alternative to Expo's built-in [`maestro-cloud`](https://docs.expo.dev/eas/workflows/syntax/#maestro-cloud) job type. Run your Maestro flows on DeviceCloud directly from your [EAS Workflow](https://docs.expo.dev/eas/workflows/get-started/) — no need to leave your Expo pipeline.

## Quick Start

```yaml
jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: preview

  e2e:
    needs: [build_android]
    runs_on: linux-medium
    steps:
      - uses: eas/checkout
      - id: download
        uses: eas/download_build
        with:
          build_id: ${{ needs.build_android.outputs.build_id }}
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v1 \
            --app-file ${{ steps.download.outputs.artifact_path }} \
            --flows ./.maestro
```

Before running, store your DeviceCloud API key as an EAS project secret:

```bash
eas env:create --scope project --environment production --environment preview --environment development \
  --name DEVICE_CLOUD_API_KEY --visibility secret --type string --value <your-api-key>
```

You can find your API key in the [DeviceCloud console settings](https://console.devicecloud.dev/settings).


::: info
EAS Workflow custom jobs run on EAS-hosted runners. `linux-medium` is sufficient — the wrapper just hands off to DeviceCloud, which runs your tests on its own device fleet.
:::

## Platform Examples

### Android

```yaml
jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: preview

  e2e_android:
    needs: [build_android]
    runs_on: linux-medium
    env:
      DCD_EAS_BUILD_ID: ${{ needs.build_android.outputs.build_id }}
      DCD_EAS_PLATFORM: ${{ needs.build_android.outputs.platform }}
      DCD_EAS_APP_VERSION: ${{ needs.build_android.outputs.app_version }}
      DCD_GH_REPO: acme/my-app # your repository, as owner/repo
      DCD_GH_SHA: ${{ github.sha }}
      DCD_GH_BRANCH: ${{ github.ref_name }}
      DCD_CHECK_NAME: Android
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
      flow_results: ${{ steps.dcd.outputs.flow_results }}
    steps:
      - uses: eas/checkout
      - id: download
        uses: eas/download_build
        with:
          build_id: ${{ needs.build_android.outputs.build_id }}
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v1 \
            --app-file ${{ steps.download.outputs.artifact_path }} \
            --flows ./.maestro \
            --android-device pixel-8 \
            --android-api-level 34
```

### iOS

```yaml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
      profile: preview

  e2e_ios:
    needs: [build_ios]
    runs_on: linux-medium
    env:
      DCD_EAS_BUILD_ID: ${{ needs.build_ios.outputs.build_id }}
      DCD_EAS_PLATFORM: ${{ needs.build_ios.outputs.platform }}
      DCD_EAS_APP_VERSION: ${{ needs.build_ios.outputs.app_version }}
      DCD_GH_REPO: acme/my-app # your repository, as owner/repo
      DCD_GH_SHA: ${{ github.sha }}
      DCD_GH_BRANCH: ${{ github.ref_name }}
      DCD_CHECK_NAME: iOS
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
      flow_results: ${{ steps.dcd.outputs.flow_results }}
    steps:
      - uses: eas/checkout
      - id: download
        uses: eas/download_build
        with:
          build_id: ${{ needs.build_ios.outputs.build_id }}
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v1 \
            --app-file ${{ steps.download.outputs.artifact_path }} \
            --flows ./.maestro \
            --ios-device iphone-16 \
            --ios-version 18
```

::: info
You don't need a macOS runner for iOS — DeviceCloud runs iOS simulators on its own Mac fleet.
:::

---

## Environment Variables

EAS context that doesn't change per-flow goes through the **job-level** `env:` block. Step-level `env:` may be silently ignored — keep `env:` on the job.

The wrapper turns these into either dcd CLI flags or `--metadata` tags (so each run is searchable in the console).

### Provided by EAS automatically

| Variable | Source | Purpose |
|----------|--------|---------|
| `DEVICE_CLOUD_API_KEY` |`eas env:create --visibility secret` | The dcd CLI's `--api-key` (required). Auto-injected at runtime. |

### Build context (recommended)

| Variable | YAML source | Tagged as |
|----------|-------------|-----------|
| `DCD_EAS_BUILD_ID` | `${{ needs.<build_job>.outputs.build_id }}` | `eas_build_id` metadata |
| `DCD_EAS_PLATFORM` | `${{ needs.<build_job>.outputs.platform }}` | `eas_platform` metadata |
| `DCD_EAS_APP_VERSION` | `${{ needs.<build_job>.outputs.app_version }}` | `eas_app_version` metadata |
| `DCD_EAS_PROFILE` | `${{ needs.<build_job>.outputs.profile }}` | `eas_profile` metadata |

The build artifact itself is downloaded by `eas/download_build` and passed via `--app-file` — there is no `build_url` output on EAS Workflow build jobs.

### Git context (optional)

| Variable | YAML source | Tagged as |
|----------|-------------|-----------|
| `DCD_GH_SHA` | `${{ github.sha }}` | `gh_sha` metadata |
| `DCD_GH_BRANCH` | `${{ github.ref_name }}` | `gh_branch` metadata |
| `DCD_GH_RUN_ID` | `${{ workflow.id }}` | `gh_run_id` metadata — the EAS workflow run ID, the same on every job of one workflow run (EAS has no `github.run_id`) |
| `DCD_GH_PR_NUMBER` | `${{ github.event.pull_request.number }}` | `gh_pr_number` metadata |
| `DCD_GH_PR_URL` | `${{ github.event.pull_request.html_url }}` | `gh_pr_url` metadata |
| `DCD_GH_REPO` | `${{ github.repository }}`, or a fixed `owner/repo` string | `gh_repo` metadata |
| `DCD_CHECK_NAME` | a fixed string, e.g. `iOS` | `gh_check_name` metadata — names the [GitHub check](github-checks.md) this job posts (`DeviceCloud / iOS`) |

To post a [GitHub check](github-checks.md), set both `DCD_GH_REPO` and `DCD_GH_SHA`, and connect the DeviceCloud GitHub App. Without both, no check is posted. A fixed `owner/repo` string for `DCD_GH_REPO`, as in the [Platform Examples](#platform-examples), stays valid on manual runs, where `${{ github.repository }}` doesn't (see the warning below).

Set `DCD_CHECK_NAME` when a commit is tested by more than one job, so each gets a check of its own that can be required separately in branch protection. Keep it fixed per job — GitHub matches required checks by name.

::: warning
`${{ github.event.pull_request.number }}`, `${{ github.event.pull_request.html_url }}` and `${{ github.repository }}` resolve to `null` on manual triggers and EAS rejects them as invalid env values. Only set the PR and repo variables inside an `if:` guard that limits the job to PR events, or omit them. `github.sha` and `github.ref_name` coerce to empty strings safely.
:::

### Advanced

| Variable | Default | Description |
|----------|---------|-------------|
| `DEVICE_CLOUD_API_URL` | `https://api.devicecloud.dev` | Override the API URL (staging/dev environments). |
| `DCD_USE_BETA` | `false` | Set to the string `true` to use the beta dcd CLI (any other value is treated as `false`). |
| `DCD_EAS_BUILD_URL` | — | URL of an Expo iOS simulator build (`.tar.gz`), passed to `dcd cloud --app-url` instead of downloading the artifact and passing `--app-file`. The CLI downloads and extracts it. iOS only: Android builds must use `--app-file`. Expo's signed URLs expire after about an hour. |

---

## CLI Flags

Anything you pass on the command line after `npx @devicecloud.dev/eas-workflow@v1 ...` is forwarded verbatim to [`dcd cloud`](../cli/dcd-cloud.md).

### App source

| Flag | Description |
|------|-------------|
| `--app-file <path>` | Path to the downloaded build (typically `${{ steps.download.outputs.artifact_path }}`). |
| `--app-binary-id <id>` | Reuse a previously uploaded binary instead of re-uploading. |
| `--ignore-sha-check` | Skip the duplicate-upload SHA check. Not recommended. |

### Flow Selection

| Flag | Description |
|------|-------------|
| `--flows <path>` | Path to a flow file or directory, e.g. `./.maestro`. Required: there is no default. |
| `--include-tags <tags>` | Only run flows with these Maestro tags (comma-separated). |
| `--exclude-tags <tags>` | Exclude flows with these tags. |
| `--exclude-flows <path>` | Subdirectories to exclude. |
| `--config <path>` | Path to a custom Maestro config file. |

### Device Configuration

For the devices and OS versions you can pass, and which combinations work, see [Devices & OS Versions](../getting-started/devices-configuration.md).

| Flag | Description |
|------|-------------|
| `--android-device <model>` | Android device, e.g. `pixel-8`. Default `pixel-10`. |
| `--android-api-level <n>` | Android API level, e.g. `34`. Default `36`. |
| `--ios-device <model>` | iOS device, e.g. `iphone-17`. Default `iphone-16`. |
| `--ios-version <n>` | Major iOS version, e.g. `18`. Default `26`. |
| `--android-device-matrix <cell>`, `--ios-device-matrix <cell>` | Run every flow once per device and OS pair, e.g. `pixel-8:34`. Repeatable. See [Device Matrix](../configuration/device-matrix.md). |
| `--device-locale <code>` | E.g. `de_DE`. See [Device Locale](../configuration/device-locale.md). |
| `--orientation <deg>` | Android only. `0` or `90`. |
| `--google-play` | Android only. Run on Google Play devices. |
| `--runner-type <type>` | `default`, `cpu1`, `m1`, `m4`. `m1` and `m4` incur premium pricing. See [Runner Types](../configuration/runner-type.md). |
| `--render-engine <engine>` | Android only. `lavapipe` or `swiftshader`, the software renderer the emulator boots with on the default Android runner. Leave it out to let DeviceCloud choose (`swiftshader` for apps built with Flutter, otherwise `lavapipe`). |

### Test Configuration

| Flag | Description |
|------|-------------|
| `--maestro-version <semver>` | Maestro CLI version. See [Maestro Versions](../configuration/maestro-versions.md). |
| `--env KEY=value` | Inject environment variables into your flows. Repeatable. |
| `--name <name>` | Custom name for this test run. |
| `--metadata key=value` | Extra metadata for the run. Repeatable. |
| `--retry <n>` | Number of automatic retries on failure (max `2`). Retries are free. |
| `--report <format>` | `junit` or `html`, saved in the working directory as `report.xml` or `report.zip`. `html-detailed` and `allure` are deprecated, see [Report Formats](../artifacts/report-formats.md). |
| `--junit-path <path>`, `--html-path <path>` | Save the report somewhere else. |

### Execution Options

| Flag | Description |
|------|-------------|
| `--async` | Exit immediately without waiting for results (exit code `0` regardless). See [Async Execution](../advanced/async-execution.md). |
| `--cancel-previous` | Cancel the still-queued tests of the previous run of this job on the same branch or PR. Needs `DCD_GH_REPO` plus `DCD_GH_BRANCH` or `DCD_GH_PR_NUMBER`; set `DCD_CHECK_NAME` per job. See [Cancelling superseded runs](../advanced/cancel-previous.md). |
| `--priority <level>` | `low`, `normal` (default) or `high`. Reorders only your team's own queued runs. See [Run Priority](../configuration/run-priority.md). |
| `--download-artifacts <mode>` | Download logs/screenshots/videos as `artifacts.zip` in the working directory. Options: `ALL`, `FAILED`. `--artifacts-path` saves it somewhere else. |
| `--json-file` | Write the results to `<upload_id>_dcd.json`. The job still fails when the run fails. |
| `--disable-animations` | Disable device animations. See [Animations](../configuration/disable-animations.md). |
| `--maestro-chrome-onboarding` | Android only. See [Chrome Onboarding](../advanced/chrome-onboarding.md). |
| `--android-no-snapshot` | Force cold boot. Auto-enabled for API 34+. |
| `--debug` | Verbose debug output. |

Full CLI reference: [CLI: Cloud](../cli/dcd-cloud.md).

---

## Outputs

The wrapper emits these as EAS step outputs via `set-output` after the run completes.

| Output | Description |
|--------|-------------|
| `console_url` | URL to view the test results in the DeviceCloud console. |
| `upload_status` | Overall status: `PASSED` or `FAILED` once the run has finished (a run with a cancelled flow counts as `FAILED`). `PENDING`, `QUEUED` or `RUNNING` with `--async`, or if the run hadn't finished when the status was read. `ERROR` if the wrapper couldn't read the status. `SUPERSEDED` (from 1.4.0) when a newer run replaced this one through [`--cancel-previous`](../advanced/cancel-previous.md); the job passes. |
| `flow_results` | JSON array: `[{ "name": "...", "status": "PASSED" }]`. |
| `app_binary_id` | ID of the uploaded binary. Reuse via `--app-binary-id` to skip re-upload. |

### Using outputs in a downstream job

```yaml
jobs:
  e2e:
    needs: [build_android]
    runs_on: linux-medium
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
    steps:
      - uses: eas/checkout
      - id: download
        uses: eas/download_build
        with:
          build_id: ${{ needs.build_android.outputs.build_id }}
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v1 \
            --app-file ${{ steps.download.outputs.artifact_path }} \
            --flows ./.maestro

  notify:
    needs: [e2e]
    steps:
      - run: |
          echo "Status: ${{ needs.e2e.outputs.status }}"
          echo "Results: ${{ needs.e2e.outputs.console_url }}"
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Every flow passed, a newer run superseded this one through [`--cancel-previous`](../advanced/cancel-previous.md), or, with `--async`, the run was submitted. |
| `1` | A flow failed or was cancelled, the CLI hit an error, or the wrapper couldn't read the run's status. |

The wrapper only exits `0` or `1`: it turns the CLI's `2` (the run failed) into `1`. See [Exit Codes](../advanced/exit-codes.md) for what `dcd cloud` itself returns.

---

## Common Patterns

### Run on every PR

```yaml
on:
  pull_request: {}

jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: preview

  e2e:
    needs: [build_android]
    runs_on: linux-medium
    env:
      DCD_EAS_BUILD_ID: ${{ needs.build_android.outputs.build_id }}
      DCD_GH_SHA: ${{ github.sha }}
    steps:
      - uses: eas/checkout
      - id: download
        uses: eas/download_build
        with:
          build_id: ${{ needs.build_android.outputs.build_id }}
      - run: |
          npx --yes @devicecloud.dev/eas-workflow@v1 \
            --app-file ${{ steps.download.outputs.artifact_path }} \
            --flows ./.maestro
```

### Run async (non-blocking)

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --flows ./.maestro \
      --async \
      --name ${{ github.sha }}
```

### Pass secrets into flows

Set each secret as an EAS env var first:

```bash
eas env:create --scope project --environment production \
  --name TEST_USERNAME --visibility secret --type string --value <value>
eas env:create --scope project --environment production \
  --name TEST_PASSWORD --visibility secret --type string --value <value>
```

Then reference it as a regular env var in the wrapper invocation:

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --flows ./.maestro \
      --env "USERNAME=$TEST_USERNAME" \
      --env "PASSWORD=$TEST_PASSWORD"
```

### Filter by tag

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v1 \
      --flows ./.maestro \
      --app-file ${{ steps.download.outputs.artifact_path }} \
      --include-tags smoke,critical \
      --exclude-tags wip
```

---

## Migrating from `maestro-cloud`

EAS's built-in `maestro-cloud` job only runs your flows on Maestro Cloud. To switch to DeviceCloud, replace the whole job with a custom job that calls the wrapper:

```yaml
# Before
e2e:
  type: maestro-cloud
  params:
    build_id: ${{ needs.build.outputs.build_id }}
    maestro_project_id: proj_xxx
    flows: ./.maestro

# After
e2e:
  needs: [build]
  runs_on: linux-medium
  steps:
    - uses: eas/checkout
    - id: download
      uses: eas/download_build
      with:
        build_id: ${{ needs.build.outputs.build_id }}
    - run: |
        npx --yes @devicecloud.dev/eas-workflow@v1 \
          --app-file ${{ steps.download.outputs.artifact_path }} \
          --flows ./.maestro
```

Then store your DeviceCloud API key as a project secret (as shown in [Quick Start](#quick-start)).

Move the other `maestro-cloud` params like this:

| `maestro-cloud` param | In the new job |
|---|---|
| `build_id` | `build_id` on the `eas/download_build` step, which hands the file to `--app-file` |
| `maestro_project_id`, `maestro_api_key` | Remove them. The wrapper uses `DEVICE_CLOUD_API_KEY`. |
| `flows` | `--flows` |
| `include_tags`, `exclude_tags` | `--include-tags`, `--exclude-tags` |
| `maestro_version` | `--maestro-version`, see [Maestro Versions](../configuration/maestro-versions.md) |
| `maestro_config` | `--config` |
| `device_locale` | `--device-locale` |
| `device_model` | `--android-device` or `--ios-device`, with DeviceCloud's device names, e.g. `pixel-8` or `iphone-16` |
| `device_os` | `--android-api-level` (e.g. `34`) or `--ios-version` (the major version, e.g. `18`) |
| `name` | `--name` |
| `branch` | `DCD_GH_BRANCH` in the job's `env:` |
| `async` | `--async` |
| `skip_build_check` | Not needed. |
| `environment` | Keep it on the new job: it picks the EAS environment that `DEVICE_CLOUD_API_KEY` is read from. A custom job uses `production` unless you set it, while `maestro-cloud` defaults to `preview`. |

## Source

The wrapper is open source and can be found here: [github.com/devicecloud-dev/device-cloud-for-eas](https://github.com/devicecloud-dev/device-cloud-for-eas).
