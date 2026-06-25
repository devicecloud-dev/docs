# Login & Accounts

These commands manage browser-based authentication and the organisation your runs are billed to. They're the recommended way to authenticate for local, interactive use. For CI and headless environments, use an [API key](../getting-started/api-keys.md) instead.

## `dcd login`

Authenticate with DeviceCloud via your browser. Run it once and the CLI stores your session, so subsequent commands don't need an API key.

```bash
dcd login
```

This opens your browser to complete sign-in (email OTP or Enterprise SSO). After you authorise the CLI, if you belong to more than one organisation you'll be prompted to pick the one to use. Your session is then saved locally (see [Where credentials are stored](#where-credentials-are-stored)).

### Flags

| Flag | Description |
|------|-------------|
| `--no-browser` | Print the login URL instead of opening a browser. Useful over SSH or on machines without a browser — open the URL on any device to finish signing in |
| `--api-url <url>` | API base URL to authenticate against (defaults to production) |
| `--frontend-url <url>` | Override the frontend URL used to complete login |

{% hint style="info" %}
Login uses a PKCE browser flow with no local server, so it works over SSH and when you open the URL on a different device. A leaked login URL is inert — it can't be used to claim your session.
{% endhint %}

If you're already logged in, `dcd login` asks for confirmation before replacing the existing session.

## `dcd logout`

Clear the stored session and revoke it server-side (best effort).

```bash
dcd logout
```

This only affects the `dcd login` session — it does not touch the `DEVICE_CLOUD_API_KEY` environment variable or `--api-key` flag.

## `dcd whoami`

Show the user and organisation the CLI is currently acting as.

```bash
dcd whoami
```

Prints the logged-in user, the active organisation, and the environment. If you're not logged in, it points you to `dcd login` or `DEVICE_CLOUD_API_KEY`.

## `dcd switch-org`

Switch the active organisation for your logged-in session. Useful if you belong to more than one organisation.

```bash
# Interactive picker
dcd switch-org

# Switch directly by organisation name
dcd switch-org "My Org"
```

Organisations are matched by name (case-insensitive). If a name is ambiguous, run `dcd switch-org` with no argument to pick interactively. Requires an active `dcd login` session — an exported `DEVICE_CLOUD_API_KEY` does not override the session here.

## Where credentials are stored

The session from `dcd login` is written to:

- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is created with `0600` permissions (owner read/write only) and holds your session tokens and the active organisation. Expiring sessions are refreshed automatically, so you rarely need to log in again.
