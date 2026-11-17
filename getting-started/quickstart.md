---
description: "Install the dcd CLI, log in, and run your first Maestro flow on DeviceCloud. Switching from Maestro Cloud is usually a one-line change."
---

# Quick Start

The dcd command line is intentionally designed to mimic the Maestro Cloud API. In most cases, you can just change `maestro cloud` to `dcd cloud`:

```bash
# maestro cloud --apiKey <apiKey> <appFile> <flowFile>

dcd cloud <appFile> <flowFile>
```

## 1. Install the CLI

The recommended install is the standalone binary — no Node required.

::::tabs
== macOS / Linux
```bash
curl -fsSL https://get.devicecloud.dev/install.sh | sh
```

== Windows
```powershell
irm https://get.devicecloud.dev/install.ps1 | iex
```

== npm
Install [Node 22+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), then run:

```bash
npm install -g @devicecloud.dev/dcd
```
::::

## 2. Authenticate

Log in once in your browser. The CLI remembers your session, so you don't need to pass a key on every command:

```bash
dcd login
```

No account yet? Sign up at the [console](https://console.devicecloud.dev) first. New accounts get $20 of [free credits](../billing/test-run-billing.md#credits).

Running in CI or a headless environment? Use an API key instead. Create one under **Settings → API Keys** in the [console](https://console.devicecloud.dev/settings). The key is shown only once, so copy it straight into an environment variable or your CI secrets:

```bash
export DEVICE_CLOUD_API_KEY=your-api-key
```

See [Authentication](api-keys.md) for more detail.

## 3. Run your first flow

**iOS** needs a simulator build: an `.app` folder, a `.zip` of one, or an Expo simulator build (`.tar.gz`). Device builds (`.ipa`) aren't supported.

```bash
dcd cloud <appFile>.app <flowFile>
```

**Android** needs an `.apk`. App bundles (`.aab`) aren't supported.

```bash
dcd cloud <appFile>.apk <flowFile>
```

See [App Management](../configuration/app-management.md) for every accepted file type and how to reuse an uploaded build. Questions? Head to our [Discord](https://discord.gg/gm3mJwcNw8).

---

## Upgrading the CLI

If you installed the standalone binary:

```bash
dcd upgrade
```

If you installed via npm:

```bash
npm install -g @devicecloud.dev/dcd@latest
```

**Prerelease versions** (not recommended): Occasionally, prerelease versions are available under the `beta` tag. See [available versions on NPM](https://www.npmjs.com/package/@devicecloud.dev/dcd?activeTab=versions).

```bash
npm install -g @devicecloud.dev/dcd@beta
```

For the standalone binary, set `DCD_BETA=1` when you run the installer:

```bash
curl -fsSL https://get.devicecloud.dev/install.sh | DCD_BETA=1 sh
```

```powershell
$env:DCD_BETA=1; irm https://get.devicecloud.dev/install.ps1 | iex
```

---

## Limits

Every flow has a 10-minute execution limit. A flow that is still running when it reaches the limit is stopped and marked as failed, with a "Test run timed out after 10 minutes" error.

A flow that needs longer can opt into [extended runtime](../configuration/extended-runtime.md), which gives it up to 20 minutes and is charged at 2×.

---

## Next steps

- [Flows & Workspaces](flows-and-workspaces.md) — organise and run multiple flows
- [Devices & OS Versions](devices-configuration.md) — choose Android API level or iOS version
- [App Management](../configuration/app-management.md) — upload and reuse binaries
- [CI/CD Integration](../ci-cd/overview.md) — run tests in your pipeline
```
