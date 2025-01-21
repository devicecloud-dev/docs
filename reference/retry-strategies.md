# Retry Strategies

Device Cloud provides retry functionality to handle flaky tests and temporary failures.

## Basic Usage

### Setting Retry Count
```bash
dcd cloud --retry 3
```

This will:
- Run the test initially
- Retry up to 3 times on failure
- Stop on first success
- Report final status

## Understanding Retries

### What Gets Retried
- Failed test executions
- Infrastructure issues
- Device availability problems

### What Doesn't Get Retried
- Invalid flow files
- Missing dependencies
- Authentication failures

## Cost Implications

> **Note**: Each retry counts as a separate test execution and will deduct credits from your account.

