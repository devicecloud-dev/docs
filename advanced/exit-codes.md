# Exit Codes

Device Cloud uses standard exit codes to indicate the status of command execution. Understanding these codes is useful for CI/CD integration and automation.

## Standard Exit Codes

### Success

```bash
0    # Command completed successfully
```

### General Errors

```bash
1    # CLI or infrastructure error (bad workspace, network failure, dcd bug)
2    # Test run explicitly failed
```

## JSON Output

The two JSON flags behave differently around test failures:

- **`--json`** — prints results as JSON to stdout but still signals the outcome through the exit code: `0` on success, `2` on test failure, `1` on CLI/infrastructure errors.
- **`--json-file`** — writes results to a file and exits `0` even when the test run fails, so a failing test won't stop your pipeline. CLI/infrastructure errors still exit `1`.

{% hint style="info" %}
Use `--json-file` when you want to inspect the result yourself rather than have a non-zero exit code fail the build. Use `--json` when you still want the exit code to gate your pipeline.
{% endhint %}
