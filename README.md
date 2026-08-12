# Welcome to DeviceCloud

DeviceCloud is a third-party Maestro Cloud alternative.

Reasons to switch:

* Cheap unit-based pricing
* Up to 200 parallel runs
* Twice as fast as Maestro Cloud for half the cost
* Google Play APIs
* Tablets and iPads
* Fast support response times (via Discord or Slack Connect)

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

* [MCP Server](mcp/overview.md) - let Claude, Cursor and other MCP clients run your tests
* [CLI Reference](cli/overview.md) - every `dcd` command and flag
* [REST API](api/overview.md) - uploads, results and flows over HTTP

### Pricing & plans

* [Test Run Billing](billing/test-run-billing.md) - what a single test run costs
* [Subscriptions](billing/subscriptions.md) - the Pro, Max and Enterprise plans
* [Concurrency & Parallel Runs](getting-started/concurrency-and-parallel-runs.md) - how many of your tests run at once

## FAQ

### Is DeviceCloud really a drop-in replacement for Maestro Cloud?

For most projects, yes. The CLI mimics the Maestro Cloud API, so you change `maestro cloud` to `dcd cloud` and drop the `--apiKey` flag. On GitHub Actions you swap a single `uses:` line — all other inputs are compatible. See [Quick Start](getting-started/quickstart.md) and [Migrating from Maestro Cloud](ci-cd/github-actions.md#migrating-from-maestro-cloud).

### How much does it cost?

DeviceCloud bills per test run — a single top-level flow on a single device — at $0.11 for standard iOS and $0.09 for standard Android. iPad, Google Play, tablet and non-default runner flows are charged at the advanced rate of $0.15. New accounts get $20 of free credits. See [Test Run Billing](billing/test-run-billing.md).

### How many tests can I run in parallel?

It depends on your plan: Pro runs up to 5 iOS and 5 Android tests at once, and Max up to 20 of each. Enterprise concurrency is arranged to fit your requirements. Once you hit your maximum, further tests queue and start automatically as capacity frees up. See [Concurrency & Parallel Runs](getting-started/concurrency-and-parallel-runs.md) and [Subscriptions](billing/subscriptions.md).

### Which devices and OS versions can I run on?

Android covers Pixel 6, 6 Pro, 7 and 7 Pro plus a generic tablet, on API levels 29–36, defaulting to a Pixel 7 on API 34. iOS covers the iPhone 14, 15 and 16 families and the iPad Pro (6th generation) on iOS 17, 18 and 26 — iOS 16 is deprecated and will be removed on 23 August 2026. Not every device supports every OS version, so check the availability tables in [Devices & OS Versions](getting-started/devices-configuration.md).

### Which Maestro versions are supported?

Ten versions from 2.0.4 to 2.8.0, selected with `--maestro-version`. Runs default to 2.2.0, and `--maestro-version latest` currently resolves to 2.8.0. We periodically remove support for older versions, so it's worth staying up to date. See [Maestro Versions](configuration/maestro-versions.md).

### Do I need an API key, or can I just log in?

Both work. Run `dcd login` once for local use and the CLI stores a session, so you never pass a key on a command. In CI or any headless environment, set `DEVICE_CLOUD_API_KEY` or pass `--api-key`. When more than one credential is present, precedence is the `--api-key` flag, then the environment variable, then the stored session. See [Authentication](getting-started/api-keys.md).

### How do I run DeviceCloud in my CI?

There are first-class integrations for GitHub Actions, Bitrise, Bitbucket Pipelines and EAS Workflows. Any other provider can call the CLI directly with `npx --yes @devicecloud.dev/dcd@latest cloud <app-file> <flows-dir>` and gate the build on the [exit code](advanced/exit-codes.md). See [CI/CD Integration](ci-cd/overview.md).

### How do I get videos, logs and test reports?

Pass `--download-artifacts ALL` (or `FAILED`) to a `dcd cloud` run, or fetch them after the fact with `dcd artifacts --upload-id <uuid> --download-artifacts ALL`. Everything is also downloadable from the console. Reports are available as `junit`, `html`, `html-detailed` and `allure` via `--report`. See [Artifacts & Downloads](artifacts/artifacts.md) and [Report Formats](artifacts/report-formats.md).

### Is there a time limit on a test?

Yes — every flow has a 10-minute execution limit, after which it is automatically cancelled. Failed tests can be retried up to twice, giving a maximum of three total runs, free of charge. See [Quick Start](getting-started/quickstart.md#limits) and [Retry Strategies](advanced/retry-strategies.md).

### Can I allow-list DeviceCloud in our firewall?

Yes. Test runner egress comes from a published set of IP ranges, and the same list is served from an unauthenticated endpoint — `GET https://api.devicecloud.dev/ip-addresses` — so your tooling can poll it rather than watching a docs page. See [IP Addresses](security/ip-addresses.md).

### Can AI agents drive DeviceCloud?

Yes. The `@devicecloud.dev/dcd` package ships `dcd-mcp`, a Model Context Protocol server that lets Claude, Cursor, VS Code and other MCP clients list devices, submit runs, check status and download artifacts. It's in beta, and the one billable tool can be hidden entirely with `--read-only`. See [MCP Server](mcp/overview.md).

### How do I get support?

Every account gets community and team support via [Discord](https://discord.gg/gm3mJwcNw8), and you can email [support@devicecloud.dev](mailto:support@devicecloud.dev). Target initial response times run from 4 hours (urgent) to 3 business days (low), with faster targets, priority email and dedicated Slack on the Max and Enterprise plans. Support hours are 8am–8pm UK time, Monday to Friday. See [Service Level Agreements](legal/service-level-agreements.md).

{% hint style="info" %}
Question not answered here? Ask in our [Discord](https://discord.gg/gm3mJwcNw8) or email [support@devicecloud.dev](mailto:support@devicecloud.dev) — we're happy to help.
{% endhint %}
