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

{% hint style="warning" %}
**Never use env-var names starting with `EAS_BUILD_*`.** That namespace is reserved by EAS Build workers (`EAS_BUILD_ID`, `EAS_BUILD_PROJECT_ID`, `EAS_BUILD_WORKINGDIR`, etc.). If you set e.g. `EAS_BUILD_ID: ${{ needs.X.outputs.build_id }}` in your YAML, you'll clobber the worker's own job-run identifier and the job will fail silently after `PREPARE_PROJECT` with no error message — only a confusing `Failed to refresh project archive` warning in the logs. This wrapper uses `DCD_EAS_*` prefixes to avoid the collision.
{% endhint %}

{% hint style="info" %}
EAS automatically injects project-scoped secret env vars into every step as process environment variables — **don't** reference them via `${{ secrets.X }}` in YAML. That syntax doesn't exist in EAS Workflows (it'll error with "Invalid identifier 'secrets'"). Just declare the env var with `--visibility secret` and the wrapper reads it via `process.env`.
{% endhint %}

{% hint style="info" %}
EAS Workflow custom jobs run on EAS-hosted runners. `linux-medium` is sufficient — the wrapper just hands off to DeviceCloud, which runs your tests on its own device fleet.
{% endhint %}

## How It Works

The wrapper reads EAS/git context (build ID, commit SHA, branch) from environment variables, then shells out to the [DeviceCloud CLI](../cli/overview.md) with the right flags. The build artifact is downloaded by EAS's built-in `eas/download_build` step and passed to the wrapper as `--app-file`. The wrapper parses the run status when complete and emits EAS step outputs so downstream jobs can react to the result.

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
      DCD_GH_SHA: ${{ github.sha }}
      DCD_GH_BRANCH: ${{ github.ref_name }}
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
            --android-device pixel-7 \
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
      DCD_GH_SHA: ${{ github.sha }}
      DCD_GH_BRANCH: ${{ github.ref_name }}
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

{% hint style="info" %}
You don't need a macOS runner for iOS — DeviceCloud runs iOS simulators on its own Mac fleet.
{% endhint %}

---

## Environment Variables

EAS context that doesn't change per-flow goes through the **job-level** `env:` block. Step-level `env:` may be silently ignored — keep `env:` on the job.

The wrapper turns these into either DCD flags or `--metadata` tags (so each run is searchable in the console).

### Provided by EAS automatically

| Variable | Source | Purpose |
|----------|--------|---------|
| `DEVICE_CLOUD_API_KEY` | project secret (set via `eas env:create --visibility secret`) | DCD `--apiKey` (required). Auto-injected; don't reference via `${{ secrets.X }}`. |

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

{% hint style="warning" %}
`${{ github.event.pull_request.number }}` and `${{ github.repository }}` resolve to `null` on manual triggers and EAS rejects them as invalid env values. Only use them inside an `if:` guard that limits the job to PR events, or omit them. `github.sha` and `github.ref_name` coerce to empty strings safely.
{% endhint %}

### Advanced

| Variable | Default | Description |
|----------|---------|-------------|
| `DEVICE_CLOUD_API_URL` | `https://api.devicecloud.dev` | Override the API URL (staging/dev environments). |
| `DCD_USE_BETA` | `false` | Set to `true` to use the beta DCD CLI. |

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
| `--retry <n>` | Number of automatic retries on failure (max `2`). Retries are free. |
| `--report <format>` | `junit`, `html`, `html-detailed`, `allure`. See [Report Formats](../test-reports/report-formats.md). |

### Execution Options

| Flag | Description |
|------|-------------|
| `--async` | Exit immediately without waiting for results (exit code `0` regardless). See [Async Execution](../advanced/async-execution.md). |
| `--download-artifacts <mode>` | Download logs/screenshots/videos. Options: `ALL`, `FAILED`. |
| `--disable-animations` | Disable device animations. See [Animations](../configuration/disable-animations.md). |
| `--maestro-chrome-onboarding` | Android only. See [Chrome Onboarding](../advanced/chrome-onboarding.md). |
| `--android-no-snapshot` | Force cold boot. Auto-enabled for API 35+. |
| `--debug` | Verbose debug output. |

Full CLI reference: [CLI: Cloud](../cli/dcd-cloud.md).

---

## Outputs

The wrapper emits these as EAS step outputs via `set-output` after the run completes.

| Output | Description |
|--------|-------------|
| `console_url` | URL to view the test results in the DeviceCloud console. |
| `upload_status` | Final status: `PENDING`, `RUNNING`, `PASSED`, `FAILED`, or `CANCELLED`. |
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
| `0` | All flows passed, or run started successfully in async mode. |
| `1` | At least one flow failed, the run was cancelled, or the wrapper hit an internal error. |

See [Exit Codes](../advanced/exit-codes.md) for the full list.

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

Set the secret as an EAS env var first:

```bash
eas env:create --scope project --environment production \
  --name TEST_USERNAME --visibility secret --type string --value <value>
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

EAS's built-in `maestro-cloud` job is closed-source and hardcoded to Maestro Cloud. To switch to DeviceCloud, replace the whole job with a custom job that calls the wrapper:

```yaml
# Before
e2e:
  type: maestro-cloud
  params:
    build_id: ${{ needs.build.outputs.build_id }}
    maestro_project_id: proj_xxx
    flows: ./.maestro
    maestro_api_key: ${{ secrets.MAESTRO_CLOUD_API_KEY }}

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

## Source

The wrapper is open source: [github.com/devicecloud-dev/device-cloud-for-eas](https://github.com/devicecloud-dev/device-cloud-for-eas). Issues and PRs welcome.
