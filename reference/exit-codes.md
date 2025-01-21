# Exit Codes

Device Cloud uses standard exit codes to indicate the status of command execution. Understanding these codes is useful for CI/CD integration and automation.

## Standard Exit Codes

### Success
```bash
0    # Command completed successfully
```

### General Errors
```bash
1    # CLI Failed (your test didn't explicity fail but something went wrong - e.g. yaml parsing)
2    # Test run explicitly failed
```

