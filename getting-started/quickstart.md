# Quickstart

The dcd command line is intentionally designed to mimic the Maestro Cloud API. In most cases, you can just change `maestro cloud` to `dcd cloud`:

```bash
# maestro cloud --apiKey <apiKey> <appFile> <flowFile>

dcd cloud <appFile> <flowFile>
```

### 1. Install the CLI

The recommended install is the standalone binary — no Node required.

{% tabs %}
{% tab title="macOS / Linux" %}
```bash
curl -fsSL https://get.devicecloud.dev/install.sh | sh
```
{% endtab %}

{% tab title="Windows" %}
```powershell
irm https://get.devicecloud.dev/install.ps1 | iex
```
{% endtab %}

{% tab title="npm" %}
Install [Node 22+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), then run:

```bash
npm install -g @devicecloud.dev/dcd
```
{% endtab %}
{% endtabs %}

### 2. Authenticate

Log in once in your browser — the CLI remembers your session, so you don't need to pass a key on every command:

```bash
dcd login
```

Running in CI or a headless environment? Use an API key instead. Find it in the [console settings](https://console.devicecloud.dev/settings) page and set it as an environment variable:

```bash
export DEVICE_CLOUD_API_KEY=your-api-key
```

See [Authentication](api-keys.md) for more detail.

### 3. Run your first flow

**iOS**

```bash
dcd cloud <appFile>.app <flowFile>
```

**Android**

```bash
dcd cloud <appFile>.apk <flowFile>
```

That's it! Questions? Issues? Head to our Discord.

---

### Upgrading the CLI

If you installed the standalone binary:

```bash
dcd upgrade
```

If you installed via npm:

```bash
npm install -g @devicecloud.dev/dcd@latest
```

**Prerelease versions** (not recommended): Occasionally, prerelease versions are available under the `alpha`, `beta`, and `rc` tags, in increasing order of stability. See [available versions on NPM](https://www.npmjs.com/package/@devicecloud.dev/dcd?activeTab=versions).

```bash
npm install -g @devicecloud.dev/dcd@alpha
npm install -g @devicecloud.dev/dcd@beta
npm install -g @devicecloud.dev/dcd@rc
```

---

### Limits

Every flow has a 10-minute execution limit after which it will be automatically cancelled.

---

### Next steps

- [Flows & Workspaces](flows-and-workspaces.md) — organise and run multiple flows
- [Devices & OS Versions](devices-configuration.md) — choose Android API level or iOS version
- [App Management](../configuration/app-management.md) — upload and reuse binaries
- [CI/CD Integration](../ci-cd/overview.md) — run tests in your pipeline
```
