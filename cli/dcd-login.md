# Login & Accounts

These commands manage browser-based authentication and the team your runs are billed to. They're the recommended way to authenticate for local or interactive use. For CI and headless environments, you should use an [API key](../getting-started/api-keys.md) instead.

## `dcd login`

Authenticate with DeviceCloud via your browser. Run it once and the CLI stores your session, so subsequent commands don't need an API key.

```bash
dcd login
```

This opens your browser to complete sign-in (email OTP or Enterprise SSO). After you authorise the CLI, if you belong to more than one team you'll be prompted to pick the one to use. Your session is then saved locally (see [Where credentials are stored](#where-credentials-are-stored)).

### Flags

| Flag | Description |
|------|-------------|
| `--no-browser` | Print the login URL instead of opening a browser. Useful over SSH or on machines without a browser. |
| `--frontend-url <url>` | Override the frontend URL used to complete login |

{% hint style="info" %}
`dcd login` uses a PKCE browser flow with no local server, so it works over SSH and when you open the URL on a different device. A leaked login URL is inert and can't be used to claim your session.
{% endhint %}

If you're already logged in, `dcd login` asks for confirmation before replacing the existing session.

## `dcd logout`

Clear the stored session and revoke it server-side (best effort).

```bash
dcd logout
```

This only affects the `dcd login` session and it does not touch the environment variables or the `--api-key` flag.

## `dcd whoami`

Show the user and team the CLI is currently acting as.

```bash
dcd whoami
```

Prints the logged-in user, the active team, and the environment. Does nothing if you're not logged in.

## `dcd switch-org`

Switch the active team for your logged-in session. Useful if you belong to more than one team.

```bash
# Interactive picker
dcd switch-org

# Switch directly by team name
dcd switch-org "example@example.com's Team"
```

Teams are matched by name (case-insensitive). Requires an active `dcd login` session and an exported `DEVICE_CLOUD_API_KEY` will not override the session.

## Where credentials are stored

The session from `dcd login` is written to:

- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is created with `0600` permissions (owner read/write only) and holds your session tokens and the active team. Expiring sessions are refreshed automatically, so you should rarely need to log in again.
