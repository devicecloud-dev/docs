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

A run fails if any of its tests fails or is cancelled, so a run you cancel from the console also exits `2`. With `--async`, `dcd cloud` exits `0` as soon as the run is submitted, whatever the outcome.

## JSON Output

The two JSON flags behave differently around test failures:

- **`--json`** — prints results as JSON to stdout but still signals the outcome through the exit code: `0` on success, `2` on test failure, `1` on CLI/infrastructure errors.
- **`--json-file`** — writes results to a file and exits `0` even when the test run fails, so a failing test won't stop your pipeline. CLI/infrastructure errors still exit `1`.

{% hint style="info" %}
Use `--json-file` when you want to inspect the result yourself rather than have a non-zero exit code fail the build. Use `--json` when you still want the exit code to gate your pipeline.
{% endhint %}

`dcd status --json` exits `0` whenever it prints a result. That includes a `FAILED` run and a failed lookup, which is also reported as `FAILED` but with an `error` field (see [dcd status](../cli/dcd-status.md#json-output)).

## Live Sessions

- **`dcd live run`** exits `2` if the flow fails, or if it's still running when `--timeout` is reached.
- **`dcd live exec`** exits `0` even when the commands fail — check the printed result.

See [dcd live](../cli/dcd-live.md) for the full reference.
