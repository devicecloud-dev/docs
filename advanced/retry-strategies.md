# Retry Strategies

Failed tests can be automatically retried using the `--retry` flag. Retries are free of charge and capped at 2, giving a maximum of 3 total runs per test. If needed, you can queue additional retries on the [console](https://console.devicecloud.dev/results).

## Usage

```bash
dcd cloud app.apk flows/ --retry 2
```

If a test fails, DeviceCloud will re-run the test up to the specified number of times, stopping as soon as a run passes. The final status reflects the last run. You can view the other results using the dropdown menu on the console.

## Limitations

- The maximum value is `--retry 2` (3 runs total)
- Only failed test executions are retried — configuration errors (invalid flow files, authentication failures, missing dependencies) will not be retried
- Retries count toward your concurrency limit while running

{% hint style="info" %}
If your test is still failing after 2 retries, reach out on Discord for help diagnosing the root cause.
{% endhint %}
