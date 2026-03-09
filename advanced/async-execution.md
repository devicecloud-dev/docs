# Async Execution

By default, `dcd cloud` waits for all tests to complete before exiting. Async mode lets you start a test run and return immediately — useful when you want to avoid blocking your CI pipeline.

## Basic Usage

```bash
dcd cloud --apiKey <apiKey> <appFile> <flowFile> --async
```

When tests are submitted successfully, the command exits with code `0` regardless of test outcome. If submission itself fails, it exits with code `1`.

Pair `--async` with `--name` to make it easy to look up results later:

```bash
dcd cloud --apiKey <apiKey> <appFile> <flowFile> --async --name "build-$GIT_SHA"
```

## Checking Results After an Async Run

Use the `dcd status` command to poll for results by upload ID:

```bash
dcd status --apiKey <apiKey> <uploadId>
```

Or use the [Status API](../ci-cd/status-api.md) to query results programmatically via HTTP.

## GitHub Actions Pattern

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

      # Check test results at the end
      - name: Verify DeviceCloud status
        run: |
          echo "Test results: ${{ steps.dcd.outputs.DEVICE_CLOUD_UPLOAD_STATUS }}"
          echo "View at: ${{ steps.dcd.outputs.DEVICE_CLOUD_CONSOLE_URL }}"
```

## Considerations

- The console URL is available via the `DEVICE_CLOUD_CONSOLE_URL` action output so you can link to results from your CI summary.
- Retries (`--retry`) and async mode work together — DeviceCloud handles retries in the background.
- If you need the final pass/fail status in CI, use `dcd status` to poll or use the [Status API](../ci-cd/status-api.md) directly.
