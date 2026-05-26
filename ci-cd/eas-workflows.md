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
    after: [build_android]
    runs_on: linux-medium
    steps:
      - id: dcd
        run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
```

Store your API key as an [EAS secret](https://docs.expo.dev/eas/workflows/syntax/#secrets) named `DEVICE_CLOUD_API_KEY`. You can find your API key in the [console settings](https://console.devicecloud.dev/settings).

{% hint style="info" %}
EAS Workflow custom jobs run on EAS-hosted runners. `linux-medium` is sufficient — the wrapper just hands off to DeviceCloud, which runs your tests on its own device fleet.
{% endhint %}

## How It Works

The wrapper reads EAS context (build URL, commit SHA, branch, PR number) from environment variables, then shells out to the [DeviceCloud CLI](../cli/overview.md) with the right flags. It parses the run status when complete and emits EAS step outputs so downstream jobs can react to the result.

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
    after: [build_android]
    runs_on: linux-medium
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
    steps:
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v0 \
            --flows ./.maestro \
            --android-device pixel-7 \
            --android-api-level 34
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
          EAS_BUILD_ID: ${{ after.build_android.outputs.build_id }}
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
    after: [build_ios]
    runs_on: linux-medium
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
    steps:
      - id: dcd
        run: |
          npx --yes @devicecloud.dev/eas-workflow@v0 \
            --flows ./.maestro \
            --ios-device iphone-16 \
            --ios-version 18
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_ios.outputs.build_url }}
          EAS_BUILD_ID: ${{ after.build_ios.outputs.build_id }}
```

{% hint style="info" %}
You don't need a macOS runner for iOS — DeviceCloud runs iOS simulators on its own Mac fleet.
{% endhint %}

---

## Environment Variables

EAS context that doesn't change per-flow goes through the step's `env:` block. The wrapper turns these into either DCD flags (for `DEVICE_CLOUD_API_KEY` and `EAS_BUILD_URL`) or `--metadata` tags (for everything else, so each run is searchable in the console).

### Required

| Variable | Source | Description |
|----------|--------|-------------|
| `DEVICE_CLOUD_API_KEY` | `${{ secrets.DEVICE_CLOUD_API_KEY }}` | Your DeviceCloud API key. |

### Build Source

One of these is required. Use `EAS_BUILD_URL` after an EAS `build` job, or pass `--app-binary-id` / `--app-file` as a CLI flag.

| Variable | Source | Description |
|----------|--------|-------------|
| `EAS_BUILD_URL` | `${{ after.<build_job>.outputs.build_url }}` | Signed URL to the EAS build artifact. Used as `--app-url`. |

### Run Metadata (Optional)

All optional. Attach as much context as you want — each one becomes a searchable tag on the test run in the [DeviceCloud console](https://console.devicecloud.dev).

| Variable | Source | Tagged As |
|----------|--------|-----------|
| `EAS_BUILD_ID` | `${{ after.<build_job>.outputs.build_id }}` | `eas_build_id` |
| `EAS_BUILD_PLATFORM` | `${{ after.<build_job>.outputs.platform }}` | `eas_platform` |
| `EAS_BUILD_PROFILE` | (you set this) | `eas_profile` |
| `EAS_APP_VERSION` | `${{ after.<build_job>.outputs.app_version }}` | `eas_app_version` |
| `EAS_GH_SHA` | `${{ github.sha }}` | `gh_sha` |
| `EAS_GH_BRANCH` | `${{ github.ref_name }}` | `gh_branch` |
| `EAS_GH_PR_NUMBER` | `${{ github.event.pull_request.number }}` | `gh_pr_number` |
| `EAS_GH_PR_URL` | `${{ github.event.pull_request.html_url }}` | `gh_pr_url` |
| `EAS_GH_REPO` | `${{ github.repository }}` | `gh_repo` |
| `EAS_GH_RUN_ID` | `${{ github.run_id }}` | `gh_run_id` |

### Advanced

| Variable | Default | Description |
|----------|---------|-------------|
| `DEVICE_CLOUD_API_URL` | — | Override the API URL. Used for staging environments. |
| `DCD_USE_BETA` | `false` | Set to `true` to use the beta DCD CLI. |

---

## CLI Flags

Anything you pass on the command line after `npx @devicecloud.dev/eas-workflow@v0 ...` is forwarded verbatim to [`dcd cloud`](../cli/dcd-cloud.md). Common ones:

### Flow Selection

| Flag | Description |
|------|-------------|
| `--flows <path>` | Path to a flow file or directory. Default: `./.maestro/`. |
| `--include-tags <tags>` | Only run flows with these Maestro tags (comma-separated). |
| `--exclude-tags <tags>` | Exclude flows with these tags. |
| `--exclude-flows <path>` | Subdirectories to exclude. |
| `--config <path>` | Path to a custom Maestro config file. |

### Device Configuration

| Flag | Description |
|------|-------------|
| `--android-device <model>` | `pixel-6`, `pixel-6-pro`, `pixel-7`, `pixel-7-pro`. |
| `--android-api-level <n>` | `29` – `36`. Default `34`. |
| `--ios-device <model>` | `iphone-14`, `iphone-15`, `iphone-16`, `iphone-16-pro`, `iphone-16-pro-max`, `ipad-pro-6th-gen`. |
| `--ios-version <n>` | `16`, `17`, `18`, `26`. Default `17`. |
| `--device-locale <code>` | E.g. `de_DE`. See [Device Locale](../configuration/device-locale.md). |
| `--orientation <deg>` | Android only. `0`, `90`, `180`, `270`. |
| `--google-play` | Android only. Run on Google Play devices. |
| `--runner-type <type>` | `default`, `m1`, `m4`. Non-default incurs premium pricing. See [Runner Types](../configuration/runner-type.md). |

See the [Devices & OS Versions](../getting-started/devices-configuration.md) page for the full availability matrix.

### Test Configuration

| Flag | Description |
|------|-------------|
| `--maestro-version <semver>` | Maestro CLI version. See [Maestro Versions](../configuration/maestro-versions.md). |
| `--env KEY=value` | Inject environment variables into your flows. Repeatable. |
| `--name <name>` | Custom name for this test run. |
| `--retry <n>` | Number of retries on failure (max `2`). Free — same as the UI retry button. |
| `--report <format>` | `junit`, `html`, `html-detailed`, `allure`. See [Report Formats](../test-reports/report-formats.md). |

### App Source (alternative to `EAS_BUILD_URL`)

| Flag | Description |
|------|-------------|
| `--app-binary-id <id>` | Reuse a previously uploaded binary. |
| `--app-file <path>` | Upload a local binary. |
| `--ignore-sha-check` | Skip the duplicate-upload SHA check. Not recommended. |

### Execution Options

| Flag | Description |
|------|-------------|
| `--async` | Exit immediately without waiting for results (exit code `0` regardless). See [Async Execution](../advanced/async-execution.md). |
| `--download-artifacts <mode>` | Download logs/screenshots/videos. Options: `ALL`, `FAILED`. |
| `--disable-animations` | Disable device animations. See [Animations](../configuration/disable-animations.md). |
| `--maestro-chrome-onboarding` | Android only. See [Chrome Onboarding](../advanced/chrome-onboarding.md). |
| `--android-no-snapshot` | Force cold boot. Auto-enabled for API 35+. |
| `--debug` | Verbose debug output. |

The full CLI reference is at [CLI: Cloud](../cli/dcd-cloud.md).

---

## Outputs

The wrapper emits these as EAS step outputs via `set-output` after the run completes.

| Output | Description |
|--------|-------------|
| `console_url` | URL to view the test results in the DeviceCloud console. |
| `upload_status` | Final status: `PENDING`, `RUNNING`, `PASSED`, `FAILED`, or `CANCELLED`. |
| `flow_results` | JSON array: `[{ "name": "...", "status": "PASSED" }]`. |
| `app_binary_id` | ID of the uploaded binary. Reuse via `--app-binary-id` in later jobs to skip re-upload. |

### Using outputs in a downstream job

```yaml
jobs:
  e2e:
    after: [build_android]
    runs_on: linux-medium
    outputs:
      console_url: ${{ steps.dcd.outputs.console_url }}
      status: ${{ steps.dcd.outputs.upload_status }}
    steps:
      - id: dcd
        run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}

  notify:
    after: [e2e]
    steps:
      - run: |
          echo "Status: ${{ after.e2e.outputs.status }}"
          echo "Results: ${{ after.e2e.outputs.console_url }}"
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All flows passed, or run started successfully in async mode. |
| `1` | At least one flow failed, the run was cancelled, or the wrapper hit an internal error. |

See [Exit Codes](../advanced/exit-codes.md) for the full list of DCD CLI exit codes.

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
    after: [build_android]
    runs_on: linux-medium
    steps:
      - run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
          EAS_GH_PR_NUMBER: ${{ github.event.pull_request.number }}
          EAS_GH_SHA: ${{ github.sha }}
```

### Run async (non-blocking)

```yaml
- run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro --async --name ${{ github.sha }}
  env:
    DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
    EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
```

### Pass secrets into flows

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v0 \
      --flows ./.maestro \
      --env USERNAME=${{ secrets.TEST_USERNAME }} \
      --env PASSWORD=${{ secrets.TEST_PASSWORD }}
  env:
    DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
    EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
```

### Filter by tag

```yaml
- run: |
    npx --yes @devicecloud.dev/eas-workflow@v0 \
      --flows ./.maestro \
      --include-tags smoke,critical \
      --exclude-tags wip
  env:
    DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
    EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}
```

### Reuse the uploaded binary across jobs

```yaml
jobs:
  e2e_smoke:
    after: [build_android]
    runs_on: linux-medium
    outputs:
      binary_id: ${{ steps.dcd.outputs.app_binary_id }}
    steps:
      - id: dcd
        run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro/smoke --include-tags smoke
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
          EAS_BUILD_URL: ${{ after.build_android.outputs.build_url }}

  e2e_full:
    after: [e2e_smoke]
    runs_on: linux-medium
    steps:
      - run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro/full --app-binary-id ${{ after.e2e_smoke.outputs.binary_id }}
        env:
          DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
```

---

## Migrating from `maestro-cloud`

EAS's built-in `maestro-cloud` job is closed-source and hardcoded to Maestro Cloud. To switch to DeviceCloud, replace the whole job with a custom job that calls the wrapper:

```yaml
# Before
e2e:
  type: maestro-cloud
  params:
    build_id: ${{ after.build.outputs.build_id }}
    maestro_project_id: proj_xxx
    flows: ./.maestro
    maestro_api_key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}

# After
e2e:
  after: [build]
  runs_on: linux-medium
  steps:
    - run: npx --yes @devicecloud.dev/eas-workflow@v0 --flows ./.maestro
      env:
        DEVICE_CLOUD_API_KEY: ${{ secrets.DEVICE_CLOUD_API_KEY }}
        EAS_BUILD_URL: ${{ after.build.outputs.build_url }}
```

Update your secret name from `MAESTRO_CLOUD_API_KEY` to `DEVICE_CLOUD_API_KEY` (or whatever name you choose for your DeviceCloud key).

## Source

The wrapper is open source: [github.com/devicecloud-dev/device-cloud-for-eas](https://github.com/devicecloud-dev/device-cloud-for-eas). Issues and PRs welcome.
