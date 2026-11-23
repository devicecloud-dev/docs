# Authentication

DeviceCloud supports two ways to authenticate the CLI: **browser login** (best for local, interactive use) and an **API key** (best for CI and headless environments). The REST API uses an API key.

## `dcd login` (recommended for local use)

Run `dcd login` once and authenticate in your browser. The CLI stores the resulting session locally, so you don't need to pass a key on every command.

```bash
dcd login
```

This opens your browser, where you sign in with an email code, GitHub, Google, a passkey or your company's SSO, then choose **Authorize and finish login**. If you use two-factor authentication, or your team requires it, you'll also confirm with your authenticator app or a passkey. If you belong to more than one team, you'll be prompted to pick one. The session is stored at:

- `$DCD_CONFIG_DIR/config.json`, if `DCD_CONFIG_DIR` is set, or
- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is written with `0600` permissions (owner read/write only). The CLI keeps the session fresh while you use it, but a session ends 30 days after you log in, or after 7 days without a `dcd` command, whichever comes first. Then the CLI tells you to run `dcd login` again. These limits don't apply to API keys: a key lasts until its expiry date, if you set one, or until you revoke it. So use a key for CI and for processes that keep running, such as the [MCP server](../mcp/connect.md). See [Session limits](../security/sign-in-and-sessions.md#sessions).

::: info
No browser on the box (e.g. over SSH)? Run `dcd login --no-browser` and the CLI prints a URL to open elsewhere.
:::

See [Login & Accounts](../cli/dcd-login.md) for `logout`, `whoami`, and `switch-org`.

## API key (recommended for CI / headless)

In CI and other non-interactive environments, use an API key.

### Getting an API key

1. Log in to the [console](https://console.devicecloud.dev/settings).
2. Open **Settings → API Keys** and choose **Create API key**.
3. Give it a **Name**, and choose its **Access** and **Expiry**. For CI, choose **CI: run tests only**; see [Key access](#key-access).
4. Copy the key. It's shown only once, when it's created or rotated, so store it straight away, for example as a CI secret.

### Key access

You choose what a key can do when you create it. You can't change it later, so create a new key if you need different access.

| Access | What the key can do | Use it for |
| --- | --- | --- |
| **Full access** | Everything an API key can do. | Scripts that manage runs or read results across your team |
| **CI: run tests only** | Upload builds and flows, start test runs, and follow, download and report on the runs it started. | CI secrets |
| **Device sessions only** | Start and drive device sessions and upload builds. It can't start test runs or read results. | AI agents using [Agent Devices](../mcp/agent-devices.md) |

A CI-only key limits what a leaked secret can do. Whoever holds it can start test runs, which are billed, but can't read your other runs, results or artifacts, or change your settings.

With a CI-only key, these work for the runs the key started:

- `dcd cloud`, including `--download-artifacts`, `--report` and `--cancel-previous`
- `dcd status`
- `dcd artifacts`

`--cancel-previous` only cancels earlier runs that the same key started.

These need a key with full access, or `dcd login`:

- `dcd list`
- Reading a run that another key or a person started
- The [REST API](../api/overview.md) flow analytics endpoints
- The [MCP server](../mcp/connect.md)

A command outside a key's access fails with HTTP `403` and the error code `API_KEY_SCOPE`. Asking a CI-only key about a run it didn't start returns `404`, the same as a run that doesn't exist.

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
