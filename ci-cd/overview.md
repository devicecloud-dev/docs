# CI/CD Integration

DeviceCloud has integrations for the CI providers below. For any other provider, call the CLI directly, as described in [Any CI](any-ci.md). To ask for a new integration, post in [GitHub Discussions](https://github.com/orgs/devicecloud-dev/discussions).

## Integration Guides

* [GitHub Actions](github-actions.md) — The DeviceCloud GitHub Action, with every input and output
* [GitHub Checks](github-checks.md) — A pass/fail check on each pull request, whichever CI started the run
* [Bitrise Steps](bitrise-steps.md) — The Device Cloud for Maestro step
* [EAS Workflows](eas-workflows.md) — A custom job for Expo's EAS Workflows
* [Bitbucket Pipelines](bitbucket-pipelines.md) — The DeviceCloud pipe
* [Any CI](any-ci.md) — The CLI on its own, with GitLab CI and CircleCI examples

## Useful Features For CI/CD

* [Async execution](#async-execution) — Fire-and-forget tests without blocking your pipeline
* [Cancelling Superseded Runs](../advanced/cancel-previous.md) — Drop the previous run's queued tests when a newer commit arrives
* [Run Priority](../configuration/run-priority.md) — Choose which of your own queued runs starts first
* [dcd status](../cli/dcd-status.md) — Poll for results after an async run
* [Report formats](../artifacts/artifacts.md#report-formats) — Generate JUnit/HTML reports for your CI system
* [Artifacts & Downloads](../artifacts/artifacts.md) — Access logs, screenshots, and videos
* [Exit Codes](../advanced/exit-codes.md) — Gate your pipeline on the result

## Configuration

* [Environment Variables](../configuration/environment-variables.md) — Pass secrets and config to your flows
* [API Keys](../getting-started/api-keys.md) — Manage authentication

## Async execution

By default, `dcd cloud` waits for all tests to complete before exiting. Async mode lets you start a test run and return immediately — useful when you want to avoid blocking your CI pipeline.

### Basic Usage

```bash
dcd cloud <appFile> <flowFile> --async
```

When tests are submitted successfully, the command exits with code `0` regardless of test outcome. If submission itself fails, it exits with code `1`.

Because the command doesn't wait for the run, `--download-artifacts` and `--report` do nothing with `--async`. Download artifacts and reports with [`dcd artifacts`](../cli/dcd-artifacts.md) once the run has finished. With `--json` or `--json-file`, the result has `status` `PENDING`, and each test has the status it was submitted with (see [JSON output](../cli/dcd-cloud.md#json-output)).

Pair `--async` with `--name` to make it easy to look up results later:

```bash
dcd cloud <appFile> <flowFile> --async --name "build-$GIT_SHA"
```

### Checking Results After an Async Run

Use the `dcd status` command to poll for results by upload ID:

```bash
dcd status --upload-id <id>
```

You can also look a run up by name with `--name` (handy when paired with `--async --name`). A run's status can turn `FAILED` before all its tests have finished, so wait until no test is queued, pending or running before you download anything. See [dcd status](../cli/dcd-status.md#polling-an-async-run) for an example.

### GitHub Actions Pattern

In GitHub Actions, async mode is useful when you want to kick off tests and check results in a later step, while other CI work continues in parallel:

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Build app
        run: ./gradlew assembleDebug

      # Start tests immediately — don't wait for results
      - uses: devicecloud-dev/device-cloud-for-maestro@v2
        id: dcd
        with:
          api-key: ${{ secrets.DCD_API_KEY }}
          app-file: app/build/outputs/apk/debug/app-debug.apk
          async: true
          name: ${{ github.sha }}

      # Continue with other CI work while tests run in the background
      - name: Run unit tests
        run: ./gradlew test

      # Record where to find the results
      - name: Record the console URL
        run: echo "View results at: ${{ steps.dcd.outputs.DEVICE_CLOUD_CONSOLE_URL }}"
```

::: info
In async mode the Action doesn't wait for the run, so `DEVICE_CLOUD_UPLOAD_STATUS` is always `PENDING`, `DEVICE_CLOUD_FLOW_RESULTS` is `[]` and `DEVICE_CLOUD_APP_BINARY_ID` isn't set. For a pass/fail verdict, poll [`dcd status`](../cli/dcd-status.md#polling-an-async-run) or use the [DeviceCloud GitHub App](github-checks.md) check.
:::

### Considerations

- The console URL is available via the `DEVICE_CLOUD_CONSOLE_URL` action output so you can link to results from your CI summary.
- Retries (`--retry`) and async mode work together — DeviceCloud handles retries in the background.
- If you need the final pass/fail status in CI, poll with [`dcd status`](../cli/dcd-status.md#polling-an-async-run).
- With the [DeviceCloud GitHub App](github-checks.md) installed, an async run reports its result back as a pass/fail check on the pull request, so you don't have to poll for it yourself.
