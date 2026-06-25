# Authentication

DeviceCloud supports two ways to authenticate the CLI: **browser login** (best for local, interactive use) and an **API key** (best for CI and headless environments). The REST API uses the API key.

## `dcd login` (recommended for local use)

Run `dcd login` once and authenticate in your browser. The CLI stores the resulting session locally, so you don't need to pass a key on every command — and it unlocks live test updates and a smoother experience.

```bash
dcd login
```

This opens your browser, where you sign in (email OTP or Enterprise SSO) and authorise the CLI. If you belong to more than one organisation, you'll be prompted to pick one. The session is stored at:

- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is written with `0600` permissions (owner read/write only). Expiring sessions are refreshed automatically — you generally only log in again if you log out or switch machines.

{% hint style="info" %}
No browser on the box (e.g. over SSH)? Run `dcd login --no-browser` and the CLI prints a URL to open elsewhere.
{% endhint %}

See [Login & Accounts](../cli/dcd-login.md) for `logout`, `whoami`, and `switch-org`.

## API key (recommended for CI / headless)

In CI and other non-interactive environments, use an API key.

### Getting your API key

1. Log in to the [console](https://console.devicecloud.dev/settings)
2. Open **Settings → API Key**
3. Copy the key

### Using your API key

Set it as an environment variable so you don't have to pass it on every command:

```bash
export DEVICE_CLOUD_API_KEY=your-api-key-here
dcd cloud <appFile> <flowFile>
```

Or pass it explicitly with `--api-key` on any command:

```bash
dcd cloud --api-key your-api-key-here <appFile> <flowFile>
```

{% hint style="info" %}
Store your API key as a secret in your CI provider (e.g. a GitHub Actions secret) — never commit it to your repository.
{% endhint %}

## Precedence

When more than one credential is available, the CLI resolves authentication in this order:

1. `--api-key` flag
2. `DEVICE_CLOUD_API_KEY` environment variable
3. Stored session from `dcd login`

## REST API

The [REST API](../api/overview.md) authenticates with the API key, passed in the `x-app-api-key` header:

```bash
curl https://api.devicecloud.dev/... \
  -H "x-app-api-key: your-api-key-here"
```
