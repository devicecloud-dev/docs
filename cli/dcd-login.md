# Login & Accounts

These commands manage browser-based authentication and the team your runs are billed to. They're the recommended way to authenticate for local or interactive use. For CI and headless environments, you should use an [API key](../getting-started/api-keys.md) instead.

Each of these commands takes `--json`, which prints its result as one JSON object on stdout.

## `dcd login`

Authenticate with DeviceCloud via your browser. Run it once and the CLI stores your session, so subsequent commands don't need an API key.

```bash
dcd login
```

This opens your browser. Sign in with an email code, GitHub, Google, a passkey or your company's SSO, then choose **Authorize and finish login**. If you use two-factor authentication, or your team requires it, you'll also confirm with your authenticator app or a passkey. A session that doesn't meet a team's sign-in requirement can't reach that team's results (see [Sign-in and two-factor authentication](../security/sign-in-and-sessions.md#sign-in-and-two-factor-authentication)). If you belong to more than one team, the CLI then asks you to pick the one to use. The picker starts on the team from your last login, so pressing Enter keeps it. Your session is then saved locally (see [Where credentials are stored](#where-credentials-are-stored)).

The CLI waits up to 10 minutes for you to finish in the browser. After that, it stops with "Login timed out", and you run `dcd login` again.

### Flags

| Flag | Description |
|------|-------------|
| `--no-browser` | Print the login URL instead of opening a browser. Useful over SSH or on machines without a browser. |
| `--frontend-url <url>` | Override the frontend URL used to complete login |
| `--org <name\|id>` | Use this team instead of picking one. Teams are matched by name (case-insensitive), slug or ID, and login fails if you're not a member. |
| `--api-url <url>` | The API to log in to (default `https://api.devicecloud.dev`). Later commands use the same API until you log in to another one |
| `--json` | Print the result as one JSON object on stdout. The login URL and any prompts go to stderr |

::: info
`dcd login` uses a PKCE browser flow with no local server, so it works over SSH and when you open the URL on a different device. A leaked login URL is inert and can't be used to claim your session.
:::

If you're already logged in, `dcd login` asks for confirmation before replacing the existing session.

### Without a terminal

When `dcd login` runs where nobody can answer a prompt, such as in a script or a shell that an AI agent runs, it doesn't prompt:

- If you're already logged in, it replaces the session without asking. Your existing session stays until the new login completes.
- If you belong to more than one team, it uses `--org` if you pass it. Otherwise it uses the team from your last login to the same environment and prints which one it used.
- If there's no previous team (for example, after `dcd logout`), it exits with an error that lists your teams, so you can run it again with `--org`.

You still complete sign-in in a browser. Pass `--no-browser` to print the URL instead of opening it.

## `dcd logout`

Delete the session stored on this machine.

```bash
dcd logout
```

This only affects the `dcd login` session and it does not touch the environment variables or the `--api-key` flag.

`dcd logout` doesn't end the session on DeviceCloud's side: until it expires, anyone with a copy of the session file can still use it. To end a session for good, open **Settings → Account** in the console. Under **Active sessions**, sign out that device, or choose **Sign out of all devices** to end every session, including the console one you're using.

## `dcd whoami`

Show the user and team of your stored `dcd login` session.

```bash
dcd whoami
```

Prints the logged-in user, the active team, and the environment. If you're not logged in, it prints a hint to run `dcd login` or set `DEVICE_CLOUD_API_KEY`.

::: info
`dcd whoami` only reads the stored session. If you also pass `--api-key` or export `DEVICE_CLOUD_API_KEY`, every other command uses that key — and the key's team — instead of the session shown here.
:::

## `dcd switch-org`

Switch the active team for your logged-in session. Useful if you belong to more than one team.

```bash
# Interactive picker
dcd switch-org

# Switch directly by team name
dcd switch-org "example@example.com's Team"
```

Teams are matched by name (case-insensitive), slug or ID. Without a terminal, such as in a script, pass the team name, because the picker needs a keypress. Requires an active `dcd login` session. It only changes the session's team: an exported `DEVICE_CLOUD_API_KEY` doesn't affect `switch-org`, but still takes precedence for every other command.

## Where credentials are stored

The session from `dcd login` is written to:

- `$DCD_CONFIG_DIR/config.json`, if `DCD_CONFIG_DIR` is set, or
- `$XDG_CONFIG_HOME/dcd/config.json`, or
- `~/.dcd/config.json` if `XDG_CONFIG_HOME` is not set

The file is created with `0600` permissions (owner read/write only) and holds your session tokens and the active team. The CLI keeps the session fresh while you use it, but the session itself has a limit: it ends 30 days after you log in, or after 7 days without a `dcd` command, whichever comes first. When it ends, commands fail with a message telling you to run `dcd login` again. A process that keeps running, such as the [MCP server](../mcp/connect.md), stops working at the same point, so use an API key for long-running processes. See [Session limits](../security/sign-in-and-sessions.md#sessions).
