# CI/CD Integration

DeviceCloud has integrations for the CI providers below. For any other provider, call the CLI directly, as described in [Any CI](any-ci.md). To ask for a new integration, post in [GitHub Discussions](https://github.com/orgs/devicecloud-dev/discussions).

## Integration Guides

* [GitHub Actions](github-actions.md) — The DeviceCloud GitHub Action, with every input and output
* [GitHub Checks](github-checks.md) — A pass/fail check on each pull request, whichever CI started the run
* [Bitrise Steps](bitrise-steps.md) — The Device Cloud for Maestro step
* [EAS Workflows](eas-workflows.md) — A custom job for Expo's EAS Workflows
* [Bitbucket Pipelines](bitbucket-pipelines.md) — The DeviceCloud pipe
* [Any CI](any-ci.md) — The CLI on its own, with GitLab CI and CircleCI examples

## Useful Features For CI/CD

* [Async Execution](../advanced/async-execution.md) — Fire-and-forget tests without blocking your pipeline
* [Cancelling Superseded Runs](../advanced/cancel-previous.md) — Drop the previous run's queued tests when a newer commit arrives
* [Run Priority](../configuration/run-priority.md) — Choose which of your own queued runs starts first
* [dcd status](../cli/dcd-status.md) — Poll for results after an async run
* [Report Formats](../artifacts/report-formats.md) — Generate JUnit/HTML reports for your CI system
* [Artifacts & Downloads](../artifacts/artifacts.md) — Access logs, screenshots, and videos
* [Exit Codes](../advanced/exit-codes.md) — Gate your pipeline on the result

## Configuration

* [Environment Variables](../configuration/environment-variables.md) — Pass secrets and config to your flows
* [API Keys](../getting-started/api-keys.md) — Manage authentication
