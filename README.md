# Welcome to DeviceCloud

DeviceCloud is a third-party Maestro Cloud alternative.

Why teams switch:

* Per-test-run pricing, with $20 of free credits to start
* Parallel runs: up to 20 iOS and 20 Android tests at once on the Max plan, and more on Enterprise
* Google Play APIs, tablets, iPads and foldables
* Fast support, through Discord or Slack Connect

## Try it

The CLI is intentionally designed to mimic the Maestro Cloud API, so in most cases the migration is one line:

```bash
# before
maestro cloud --apiKey <apiKey> <appFile> <flowFile>

# after
dcd cloud <appFile> <flowFile>
```

Start with the [Quick Start](getting-started/quickstart.md) to install the CLI and run your first flow.

## Quick links

### Get started

* [Quick Start](getting-started/quickstart.md) - install the CLI and run your first flow
* [Authentication](getting-started/api-keys.md) - `dcd login` locally, API key in CI
* [Flows & Workspaces](getting-started/flows-and-workspaces.md) - run a single file, a directory, or a whole workspace
* [Devices & OS Versions](getting-started/devices-configuration.md) - every supported device, Android API level and iOS version

### Run in CI

* [CI/CD Integration](ci-cd/overview.md) - supported providers, and the features that matter in a pipeline
* [GitHub Actions](ci-cd/github-actions.md) - drop-in replacement for the Maestro Cloud action
* [GitHub Checks](ci-cd/github-checks.md) - report pass/fail straight onto the pull request
* [Artifacts & Downloads](artifacts/artifacts.md) - pull logs, screenshots, videos and reports

### Configure your runs

* [Device Matrix](configuration/device-matrix.md) - run your suite across several devices in one upload
* [Maestro Versions](configuration/maestro-versions.md) - pin a Maestro version, or track `latest`
* [Environment Variables](configuration/environment-variables.md) - inject config and secrets into your flows

### Automate with AI & code

* [Agent Devices](mcp/agent-devices.md) - give your AI agent a cloud iOS or Android device to drive, with a person on hand when it gets stuck (beta)
* [Connect an AI Agent](mcp/connect.md) - let Claude Code, Cursor and other MCP clients run your tests
* [CLI Reference](cli/overview.md) - every `dcd` command and flag
* [REST API](api/overview.md) - uploads, results, flow analytics, device sessions and IP addresses over HTTP

### Pricing & plans

* [Test Run Billing](billing/test-run-billing.md) - what a single test run costs
* [Subscriptions](billing/subscriptions.md) - the Pro, Max and Enterprise plans
* [Overage](billing/overage.md) - usage beyond your plan's included credits, and the Overage Limit
* [Concurrency & Parallel Runs](getting-started/concurrency-and-parallel-runs.md) - how many of your tests run at once

## FAQ

### Is DeviceCloud really a drop-in replacement for Maestro Cloud?

For most projects, yes. The CLI mimics the Maestro Cloud API, so you change `maestro cloud` to `dcd cloud` and drop the `--apiKey` flag. On GitHub Actions you swap a single `uses:` line and most inputs carry over unchanged; the migration guide lists the few Maestro-specific ones (such as `project-id` and `device-model`) to remove or replace. See [Quick Start](getting-started/quickstart.md) and [Migrating from Maestro Cloud](ci-cd/github-actions.md#migrating-from-maestro-cloud).

### How much does it cost?

DeviceCloud bills per test run: one top-level flow on one device. A standard run costs $0.11 on iOS and $0.09 on Android. Runs on an iPad, the iPhone Duo, the Pixel 10 Pro Fold, the generic tablet or a Google Play image, and runs on the `m4` and `m1` runner types, cost the advanced rate of $0.15. New accounts get $20 of free credits. The Pro and Max plans include a set amount of usage each month, and usage beyond that is billed as [overage](billing/overage.md), up to a limit you control. See [Test Run Billing](billing/test-run-billing.md).

### How many tests can I run in parallel?

It depends on your plan: on the standard runners, Pro runs up to 5 iOS and 5 Android tests at once, and Max up to 20 of each. Enterprise concurrency is arranged to fit your requirements. Once you hit your maximum, further tests queue and start automatically as capacity frees up. See [Concurrency & Parallel Runs](getting-started/concurrency-and-parallel-runs.md) and [Subscriptions](billing/subscriptions.md).

### Which devices and OS versions can I run on?

Android runs cover a range of Google Pixel phones plus a generic tablet, and iOS runs cover recent iPhones and the iPad Pro. Not every device supports every OS version, and older devices and versions are retired over time, so check [Devices & OS Versions](getting-started/devices-configuration.md) for the current devices, Android API levels and iOS versions.

### Which Maestro versions are supported?

We always support the latest version of Maestro, and older versions back to v2.2.0. We're targeting v2.2.0 for removal on 23 November 2026, after which v2.6.1 is the oldest. Runs default to v2.10.0, and `--maestro-version latest` always uses the newest version we support. We announce removals of older versions well in advance. See [Maestro Versions](configuration/maestro-versions.md).

### Do I need an API key, or can I just log in?

Both work. Run `dcd login` once for local use and our CLI will store your session, so you never pass a key on a command. For CI or any headless environment, you can generate and set `DEVICE_CLOUD_API_KEY` or pass `--api-key`. When more than one credential is present, precedence is the `--api-key` flag, then the environment variable, then the stored session. See [Authentication](getting-started/api-keys.md).

### How do I run DeviceCloud in my CI?

There are first-class integrations for GitHub Actions, Bitrise, Bitbucket Pipelines and EAS Workflows. Any other provider can call the CLI directly with `npx --yes @devicecloud.dev/dcd@latest cloud <app-file> <flows-dir>` and gate the build on the [exit code](advanced/exit-codes.md). See [CI/CD Integration](ci-cd/overview.md).

### How do I get videos, logs and test reports?

Pass `--download-artifacts ALL` (or `FAILED`) to a `dcd cloud` run, or fetch them after the fact with `dcd artifacts --upload-id <uuid> --download-artifacts ALL`. Each result in the console also has a download menu for its logs, reports, app binary and workspace. Reports are available as `junit` and `html` via `--report`. `html-detailed` and `allure` are deprecated, and we're targeting their removal on 7 December 2026. See [Artifacts & Downloads](artifacts/artifacts.md) and [Report Formats](artifacts/report-formats.md).

### Is there a time limit on a test?

Yes. Every flow has a 10-minute execution limit. A flow that is still running when it reaches the limit is stopped and marked as failed, with a "Test run timed out after 10 minutes" error. A flow that needs longer can opt into [extended runtime](configuration/extended-runtime.md), which gives it up to 20 minutes and is charged at 2×. `--retry` re-runs a failed test up to twice, free of charge, and you can also retry failed tests from the console. See [Quick Start](getting-started/quickstart.md#limits) and [Retry Strategies](advanced/retry-strategies.md).

### Can I allow-list DeviceCloud in our firewall?

Yes. Test runner egress comes from a published set of IP ranges, and the same list is served from an unauthenticated endpoint, `GET https://api.devicecloud.dev/ip-addresses`, so your tooling can poll it rather than watching a docs page. See [IP Addresses](security/ip-addresses.md).

### Can AI agents drive DeviceCloud?

Yes. `dcd mcp`, the Model Context Protocol server built into the CLI, lets Claude Code, Cursor, VS Code, Codex and other MCP clients list devices, run cloud tests, check status and download artifacts. `--read-only` hides the one billable tool. [Agent Devices](mcp/agent-devices.md) (closed beta) also give an agent a cloud device to drive, through DeviceCloud's hosted MCP server. See [Connect an AI Agent](mcp/connect.md).

### How do I get support?

Every account gets community and team support via [Discord](https://discord.gg/gm3mJwcNw8), and you can also email [support@devicecloud.dev](mailto:support@devicecloud.dev). We aim to respond within four hours for urgent queries, and within one to three business days for other queries, depending on severity. Max and Enterprise customers both receive priority email support and Enterprise customers have direct access to the team via Slack Connect. Support hours are 8am–8pm UK time, Monday to Friday. See [Service Level Agreements](legal/service-level-agreements.md).

::: info
Question not answered here? Ask in our [Discord](https://discord.gg/gm3mJwcNw8) or email [support@devicecloud.dev](mailto:support@devicecloud.dev) and we'll be happy to help.
:::
