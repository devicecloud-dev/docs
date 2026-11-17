# dcd settings

Show how your team is set up: concurrency limits, test runtime, sign-in requirement, retry escalation, overage limit and connected integrations. It reads the same settings the console shows under **Settings**.

`dcd settings` is read-only. Change settings in the console.

```bash
dcd settings
```

```
⏺ Team
  ⎿ name                  Acme
    org id                7
    sign-in requirement   a passkey

⏺ Concurrency
  ⎿ iOS m4          min 0 · max 2
    Android gpu1    not enabled
    standard pool   min 2 · max 12
    standard pool is shared by iOS default and Android cpu1
    min: always available · max: when capacity allows

⏺ Test Runtime
  ⎿ default    10 min per flow
    extended   20 min per flow with EXTENDED_RUNTIME, charged at twice the rate

⏺ Retries & Billing
  ⎿ retry escalation   on · Android retries move to M1 runners
    overage limit      $200 per billing period, on top of included credits

⏺ Integrations
  ⎿ webhook   connected
    slack     not connected
    github    connected
```

## Owner and admin settings

The sign-in requirement, retry escalation and overage limit are shown only to team owners and admins, as in the console. A standard member sees `owner or admin only` for those three. An API key sees every setting.

## Flags

| Flag | Description |
|------|-------------|
| `--json` | Print the settings as one JSON object, the same object [`GET /org/settings`](../api/team-settings.md#get-team-settings) returns. |
| `--api-key` | API key to use instead of your `dcd login` session. Defaults to the `DEVICE_CLOUD_API_KEY` environment variable. |
| `--api-url` | API to talk to. Defaults to the one you logged in to, then `https://api.devicecloud.dev`. |

Without an API key, `dcd settings` uses your `dcd login` session and shows the team you have selected. Switch teams with `dcd switch-org`. See [Login & Accounts](dcd-login.md).

```bash
dcd settings --json | jq '.concurrency'
```

## Related

* [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md)
* [Extended Runtime](../configuration/extended-runtime.md)
* [Overage Limit](../billing/overage.md#overage-limit)
