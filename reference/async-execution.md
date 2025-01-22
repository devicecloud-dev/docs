# Async Execution

Device Cloud supports asynchronous test execution, allowing you to start tests and continue with other tasks without waiting for completion.

This typically used in CI/CD to start tests without blocking the pipeline.

## Basic Usage

### Starting Async Tests

```bash
dcd cloud ... --async
```

If the test is correctly submitted, this command will exit code 0 regardless of the test result.
