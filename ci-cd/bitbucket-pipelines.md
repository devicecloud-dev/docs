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
          - pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
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
- pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/app-release.apk'
    WORKSPACE: '.maestro'
    ANDROID_DEVICE: 'pixel-7'
    ANDROID_API_LEVEL: '34'
    REPORT: 'junit'
```

### iOS

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'build/MyApp.app.zip'
    WORKSPACE: '.maestro'
    IOS_DEVICE: 'iphone-16-pro'
    IOS_VERSION: '18'
```

## Variables

The pipe variables map 1:1 to the [`dcd cloud`](dcd-cloud.md) CLI flags. The full list lives in the pipe's [README](https://bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket/src/main/README.md). Required: `API_KEY`. Common ones:

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
| `DOWNLOAD_ARTIFACTS` | `ALL` or `FAILED` — downloads logs/screenshots/videos. |
| `ASYNC` | `"true"` to fire-and-forget. |
| `RUNNER_TYPE` | `m1` or `m4` for premium runners. |

## Bitbucket context auto-attached

The pipe auto-attaches Bitbucket context (commit SHA, repo, branch, PR number) as metadata on every run and are included on the Console UI so you know what triggered each run. 

If you would prefer not to include this metadata, set `INCLUDE_BITBUCKET_CONTEXT: 'false'`.

## Outputs

The pipe writes a `dcd-result.env` file into the repo's working directory. Subsequent script lines in the same step can `source` it:

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
  variables:
    API_KEY: $DEVICE_CLOUD_API_KEY
    APP_FILE: 'app.apk'
    WORKSPACE: '.maestro'

- source ./dcd-result.env
- echo "Console: $DEVICE_CLOUD_CONSOLE_URL"
- echo "Status:  $DEVICE_CLOUD_UPLOAD_STATUS"
```

Exported: `DEVICE_CLOUD_CONSOLE_URL`, `DEVICE_CLOUD_UPLOAD_STATUS`, `DEVICE_CLOUD_FLOW_RESULTS`, `DEVICE_CLOUD_APP_BINARY_ID`, `DEVICE_CLOUD_UPLOAD_ID`.

The pipe exits non-zero on test failures so the build fails by default.

## Passing env vars into flows

```yaml
- pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
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

To expose a report as a Bitbucket artifact (and have Bitbucket pick up the test results UI), declare it on the step. For example, if you would like a JUnit report, set up your pipe like this:

```yaml
- step:
    name: E2E tests
    script:
      - pipe: docker://moropo/device-cloud-for-bitbucket:1.2.0
        variables:
          API_KEY: $DEVICE_CLOUD_API_KEY
          APP_FILE: 'app.apk'
          WORKSPACE: '.maestro'
          REPORT: 'junit'
    artifacts:
      - report.xml
```

## Source

[bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket](https://bitbucket.org/devicecloud-dev/device-cloud-for-bitbucket).
