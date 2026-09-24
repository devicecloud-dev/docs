# Bitbucket Pipelines

DeviceCloud ships a [Bitbucket Pipe](https://support.atlassian.com/bitbucket-cloud/docs/pipes/) that runs your Maestro flows on devicecloud.dev directly from your Bitbucket Pipelines.

## Quick Start

Add the pipe to a step in your `bitbucket-pipelines.yml`:

```yaml
image: atlassian/default-image:4

pipelines:
  default:
    - step:
        name: E2E tests
        script:
          - pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
            variables:
              API_KEY: $DEVICE_CLOUD_API_KEY
              APP_FILE: 'build/app-release.apk'
              WORKSPACE: '.maestro'
              ANDROID_DEVICE: 'pixel-6'
              ANDROID_API_LEVEL: '34'
```

Store your DeviceCloud API key as a **Secured Repository variable** in *Repository settings → Repository variables*. Reference it as `$DEVICE_CLOUD_API_KEY` and pass it to the pipe as `API_KEY`.

Find your API key at [console.devicecloud.dev/settings](https://console.devicecloud.dev/settings).

## Platform Examples

### Android

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/app-release.apk'
    WORKSPACE: '.maestro'
    ANDROID_DEVICE: 'pixel-8'
    ANDROID_API_LEVEL: '34'
    REPORT: 'junit'
```

### iOS

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/MyApp.app.zip'
    WORKSPACE: '.maestro'
    IOS_DEVICE: 'iphone-16-pro'
    IOS_VERSION: '18'
```

## Variables

Most pipe variables map to the [`dcd cloud`](../cli/dcd-cloud.md) CLI flag of the same name, e.g. `ANDROID_API_LEVEL` sets `--android-api-level`. The full list for version 1.5.0 lives in the pipe's [README](https://bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket/src/v1.5.0/README.md). Required: `API_KEY`. Common ones:

| Variable | Description |
|---|---|
| `API_KEY` | DeviceCloud API key (required, secured). |
| `APP_FILE` | Path to the app binary to upload. |
| `APP_BINARY_ID` | Reuse a previously uploaded binary. |
| `WORKSPACE` / `FLOWS` | Path to your Maestro flows folder/file. |
| `ANDROID_DEVICE`, `ANDROID_API_LEVEL` | Android device + API level. |
| `IOS_DEVICE`, `IOS_VERSION` | iOS device + version. |
| `ENV_LIST` | Newline-separated `KEY=VALUE` env vars injected into flows. |
| `INCLUDE_TAGS` / `EXCLUDE_TAGS` | Filter flows by Maestro tag. |
| `REPORT` | `junit`, `html`, `html-detailed`, `allure`. |
| `JUNIT_PATH` | Where to write the JUnit report (default `./report.xml`). |
| `DOWNLOAD_ARTIFACTS` | `ALL` or `FAILED` — downloads logs/screenshots/videos. |
| `ASYNC` | `"true"` to fire-and-forget. |
| `RUNNER_TYPE` | `default`, `cpu1`, `gpu1`, `m1` or `m4`. `gpu1`, `m1` and `m4` are premium runners, see [Runner Type](../configuration/runner-type.md). |
| `RENDER_ENGINE` | Android only: `lavapipe` or `swiftshader`, the software renderer the emulator boots with on the default Android runner. Leave unset to let DeviceCloud choose (`swiftshader` for apps built with Flutter, otherwise `lavapipe`). |

## Bitbucket context auto-attached

The pipe auto-attaches Bitbucket context (commit SHA, repo, branch, PR number) as metadata on every run and are included on the Console UI so you know what triggered each run. 

If you would prefer not to include this metadata, set `INCLUDE_BITBUCKET_CONTEXT: 'false'`.

If your repository is mirrored on GitHub and you use [GitHub checks](github-checks.md), pass `gh_repo` and `gh_sha` through `METADATA` (the Bitbucket context above is for the console, not for GitHub) and set `CHECK_NAME` to name the check this run posts — `iOS` gives `DeviceCloud / iOS`. Worth doing whenever a commit is tested more than once: checks that share a name share a single branch-protection entry.

## Outputs

The pipe writes a `dcd-result.env` file into the repo's working directory. Subsequent script lines in the same step can `source` it:

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'app.apk'
    WORKSPACE: '.maestro'

- source ./dcd-result.env
- echo "Console: $DEVICE_CLOUD_CONSOLE_URL"
- echo "Upload:  $DEVICE_CLOUD_UPLOAD_ID"
```

Exported: `DEVICE_CLOUD_CONSOLE_URL`, `DEVICE_CLOUD_UPLOAD_STATUS`, `DEVICE_CLOUD_FLOW_RESULTS`, `DEVICE_CLOUD_APP_BINARY_ID`, `DEVICE_CLOUD_UPLOAD_ID`.

- `DEVICE_CLOUD_UPLOAD_STATUS` is `PASSED` or `FAILED` once the run has finished, or `PENDING`, `QUEUED` or `RUNNING` if it hadn't (an `ASYNC` run reports whatever it had reached at submission). It's `ERROR` if the status couldn't be read.
- `DEVICE_CLOUD_FLOW_RESULTS` is a JSON array with one entry per flow: `[{"name": "...", "status": "PASSED"}]`, plus `failReason` for a failed flow.

{% hint style="info" %}
Before pipe 1.5.0 only `DEVICE_CLOUD_CONSOLE_URL` and `DEVICE_CLOUD_UPLOAD_ID` are filled in; the other three are empty.
{% endhint %}

The pipe exits non-zero when the run fails, so the build fails by default. From 1.5.0 that holds with `JSON_FILE: 'true'` too; on earlier versions, where the CLI exits 0 in that mode, leave `JSON_FILE` unset if you rely on the pipe's result.

## Passing env vars into flows

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'app.apk'
    WORKSPACE: '.maestro'
    ENV_LIST: |
      USERNAME=test@example.com
      PASSWORD=$TEST_PASSWORD
      ENVIRONMENT=staging
```

`$TEST_PASSWORD` is interpolated by Bitbucket from your repo variables before the pipe runs.

## Reports as build artifacts

Bitbucket's **Tests** tab only reads JUnit reports from folders such as `test-results/`, so write the report there with `JUNIT_PATH`. To keep it as a downloadable Bitbucket artifact too, declare it on the step. For example:

```yaml
- step:
    name: E2E tests
    script:
      - pipe: docker://moropo/device-cloud-for-bitbucket:1.5.0
        variables:
          API_KEY: $DEVICE_CLOUD_API_KEY
          APP_FILE: 'app.apk'
          WORKSPACE: '.maestro'
          REPORT: 'junit'
          JUNIT_PATH: 'test-results/report.xml'
    artifacts:
      - test-results/**
```

## Source

[bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket](https://bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket).
