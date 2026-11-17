# Retry Strategies

DeviceCloud can run a failed test again for you. Retries are free: a retried run is never charged.

## Automatic retries

Pass `--retry` to `dcd cloud`:

```bash
dcd cloud app.apk flows/ --retry 2
```

When a test fails, DeviceCloud runs it again, up to the number of times you set, and stops as soon as an attempt passes. The maximum is `2`, so a test runs at most 3 times. The CLI reduces a higher value to `2` and warns you.

- Any failed test is retried, except one that fails because its encrypted app, flows or environment variables can't be decrypted. That would fail the same way again, so it doesn't use up a retry.
- A retry joins the queue as a new test run, with the original run's [priority](../configuration/run-priority.md). While it runs, it counts towards your [concurrency limit](../getting-started/concurrency-and-parallel-runs.md) like any other test.
- `dcd cloud` waits for the retries before it exits. Its exit code, and the `status` under `--json`, follow the last attempt of each test. With `--async`, the retries happen in the background.
- A retry of a flow with [extended runtime](../configuration/extended-runtime.md) gets the same 20-minute limit.

## Infrastructure failures

If a test is interrupted by a failure on our side, such as a simulator that fails to boot, DeviceCloud runs it again automatically. That doesn't use up a retry, and it isn't charged (see [Test Run Billing](../billing/test-run-billing.md#retries)).

## Retrying from the console

You can also retry tests from the [console](https://console.devicecloud.dev/results), on top of any `--retry` attempts. These retries are free too. Results older than 6 months can't be retried.

With the [DeviceCloud GitHub App](../ci-cd/github-checks.md), a failed check also has a **Re-run failed tests** button.

## Seeing every attempt

A test's final status is the status of its last attempt. In the console, pick an earlier attempt from the attempt menu on the result. [Artifacts](../artifacts/artifacts.md) keep each attempt in its own folder, while `report.xml` covers only the last attempt of each flow.

[Email](../notifications/email-notifications.md), [Slack](../notifications/slack-notifications.md) and [webhook](../notifications/webhook-notifications.md) notifications each have a setting for whether to report again after retries.

::: info
If your test is still failing after 2 retries, reach out on [Discord](https://discord.gg/gm3mJwcNw8) for help diagnosing the root cause.
:::
