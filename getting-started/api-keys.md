# Authentication

DeviceCloud supports two ways to authenticate the CLI: **browser login** (best for local, interactive use) and an **API key** (best for CI and headless environments). The REST API uses an API key.

## `dcd login` (recommended for local use)

Run `dcd login` once and authenticate in your browser. The CLI stores the resulting session locally, so you don't need to pass a key on every command.

```bash
dcd login
```

This opens your browser, where you sign in with an email code, GitHub, Google, a passkey or your company's SSO, then choose **Authorize and finish login**. If your team requires two-factor authentication, you'll also confirm with your authenticator app or a passkey. If you belong to more than one team, you'll be prompted to pick one. The session is stored at:

- `$DCD_CONFIG_DIR/config.json`, if `DCD_CONFIG_DIR` is set, or
- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is written with `0600` permissions (owner read/write only). The CLI keeps the session fresh while you use it, but a session ends 30 days after you log in, or after 7 days without a `dcd` command, whichever comes first. Then the CLI tells you to run `dcd login` again. These limits don't apply to API keys: a key lasts until its expiry date, if you set one, or until you revoke it. So use a key for CI and for processes that keep running, such as the [MCP server](../mcp/connect.md). See [Session limits](../security/security-overview.md#sessions).

::: info
No browser on the box (e.g. over SSH)? Run `dcd login --no-browser` and the CLI prints a URL to open elsewhere.
:::

See [Login & Accounts](../cli/dcd-login.md) for `logout`, `whoami`, and `switch-org`.

## API key (recommended for CI / headless)

In CI and other non-interactive environments, use an API key.

### Getting an API key

1. Log in to the [console](https://console.devicecloud.dev/settings).
2. Open **Settings → API Keys** and choose **Create API key**.
3. Give it a **Name**, and choose its **Access** and **Expiry**. **Full access** suits CI and scripts. **Device sessions only** suits AI agents that use [Agent Devices](../mcp/agent-devices.md): such a key can start and drive device sessions and upload builds, but can't start test runs or read results. You can't change a key's access later.
4. Copy the key. It's shown only once, so store it straight away, for example as a CI secret.

### Using an API key

Set it as an environment variable so you don't have to pass it on every command:

```bash
export DEVICE_CLOUD_API_KEY=your-api-key-here
dcd cloud <appFile> <flowFile>
```

Or pass it explicitly with `--api-key` on any command:

```bash
dcd cloud --api-key your-api-key-here <appFile> <flowFile>
```

::: info
Store your API keys as a secret in your CI provider (e.g. a GitHub Actions secret) — never commit it to your repository.
:::

## Precedence

When more than one credential is available, the CLI resolves authentication in this order:

1. `--api-key` flag
2. `DEVICE_CLOUD_API_KEY` environment variable
3. Stored session from `dcd login`

## REST API

The [REST API](../api/overview.md) authenticates with an API key, passed in the `x-app-api-key` header:

```bash
curl https://api.devicecloud.dev/... \
  -H "x-app-api-key: your-api-key-here"
```
