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
Note: flags `--json` and `--json-file` suppress Exit 2 and will instead Exit 0 as results failures are expressed via JSON.
{% endhint %}
