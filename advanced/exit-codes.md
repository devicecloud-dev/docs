# Exit Codes

Device Cloud uses standard exit codes to indicate the status of command execution. Understanding these codes is useful for CI/CD integration and automation.

## Standard Exit Codes

### Success

```bash
0    # Command completed successfully
```

### General Errors

```bash
1    # CLI failed due to bad workspace or dcd bug
2    # Test run explicitly failed
```

{% hint style="info" %}
`--json` still reflects the run outcome in its exit code: `0` on success, `2` on test failure, `1` on CLI/infrastructure errors.

Only `--json-file` forces exit `0` even when the test run fails (infrastructure errors still exit `1`). Test failures are then communicated through the JSON output rather than the exit code — useful when you want a later CI step to decide what to do with the results.
{% endhint %}
