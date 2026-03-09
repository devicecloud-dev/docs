# Quickstart

The dcd command line is intentionally designed to mimic the Maestro Cloud API. In most cases, you can just change `maestro cloud` to `dcd cloud`:

```bash
# maestro cloud --apiKey <apiKey> <appFile> <flowFile>

dcd cloud --apiKey <apiKey> <appFile> <flowFile>
```

### 1. Install the CLI

Install npm ([instructions here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)), then run:

```
npm install -g @devicecloud.dev/dcd
```

### 2. Get your API key

You'll need an API key to trigger a flow run. Find it in the [console settings](https://console.devicecloud.dev/settings) page.

See [API Keys](api-keys.md) for more detail.

### 3. Run your first flow

**iOS**

```
dcd cloud --apiKey <apiKey> <appFile>.app <flowFile>
```

**Android**

```
dcd cloud --apiKey <apiKey> <appFile>.apk <flowFile>
```

That's it! Questions? Issues? Head to our Discord.

---

### Upgrading the CLI

```
npm install -g @devicecloud.dev/dcd@latest
```

**Prerelease versions** (not recommended): Occasionally, prerelease versions are available under the `alpha`, `beta`, and `rc` tags, in increasing order of stability. See [available versions on NPM](https://www.npmjs.com/package/@devicecloud.dev/dcd?activeTab=versions).

```
npm install -g @devicecloud.dev/dcd@alpha
npm install -g @devicecloud.dev/dcd@beta
npm install -g @devicecloud.dev/dcd@rc
```

---

### Limits

Every flow has a 10-minute execution limit after which it will be automatically cancelled.

---

### Next steps

- [Flows & Workspaces](flows.md) — organise and run multiple flows
- [Devices & OS Versions](devices-configuration.md) — choose Android API level or iOS version
- [App Management](../configuration/app-management.md) — upload and reuse binaries
- [CI/CD Integration](../ci-cd/overview.md) — run tests in your pipeline
