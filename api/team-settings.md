# Team Settings

The team settings endpoint returns how your team is set up: its concurrency limits, test runtime, sign-in requirement, retry escalation, overage limit and connected integrations. These are the settings the console shows under **Settings**.

It is read-only. Change settings in the console.

---

## Get team settings

```
GET /org/settings
```

Takes no parameters. An API key or any team member's login session can call it.

Some settings are shown only to team owners and admins in the console, and the API follows the same rule. For a standard member, `restricted` is `true` and `signInRequirement`, `retryEscalation` and `overage` are `null`. API keys see every setting.

**Example**

```bash
curl "https://api.devicecloud.dev/org/settings" \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "orgId": 7,
  "name": "Acme",
  "restricted": false,
  "concurrency": {
    "runners": [
      { "platform": "ios", "runnerType": "m4", "min": 0, "max": 2 },
      { "platform": "android", "runnerType": "gpu1", "min": 0, "max": 0 }
    ],
    "pools": [
      {
        "name": "standard",
        "min": 2,
        "max": 12,
        "members": [
          { "platform": "ios", "runnerType": "default" },
          { "platform": "android", "runnerType": "cpu1" }
        ]
      }
    ]
  },
  "testRuntime": { "defaultMinutes": 10, "extendedMinutes": 20 },
  "integrations": { "webhook": true, "slack": false, "github": true },
  "signInRequirement": "passkey",
  "retryEscalation": { "available": true, "target": "m1", "enabled": true },
  "overage": { "hasSubscription": true, "limitUsd": 200 }
}
```

**Fields**

| Field | Description |
|-------|-------------|
| `orgId` | Your team's ID. It's the value a login session sends in `x-dcd-org`. |
| `name` | Your team's name, or `null` if it has none. |
| `restricted` | `true` when the caller is a standard member. The owner and admin settings below are then `null`. |
| `concurrency.runners` | Each runner type with its own limit. `min` is how many tests can always run at once, and `max` is how many can run when capacity allows. `max: 0` means the runner type isn't enabled for your team. See [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md). |
| `concurrency.pools` | Limits that several runner types share. A runner type in a pool is listed under the pool, not in `runners`. |
| `testRuntime.defaultMinutes` | How long a flow can run by default. |
| `testRuntime.extendedMinutes` | How long a flow can run with [Extended Runtime](../configuration/extended-runtime.md), or `null` when extended runtime is off for your team. |
| `integrations` | Whether a [webhook](../notifications/webhook-notifications.md), [Slack](../notifications/slack-notifications.md) and [GitHub](../ci-cd/github-checks.md) are connected. |
| `signInRequirement` | How members must sign in to reach the team: `off`, `two_factor`, `passkey` or `passkey_and_code`. Owners and admins only. |
| `retryEscalation` | Owners and admins only. `available` says whether retry escalation can be turned on for your team. `target` is the runner type an Android test moves to when it is retried after an infrastructure failure (`m1` or `gpu1`). `enabled` says whether it is on. |
| `overage` | Owners and admins only. `hasSubscription` says whether the team has an active subscription. `limitUsd` is your [Overage Limit](../billing/overage.md#overage-limit) in US dollars per billing period, on top of your included credits, or `null` when it's uncapped or there's no subscription. |

A key limited to **Device sessions only** can't call this endpoint. It gets `403` with `"error": "API_KEY_SCOPE"`.

From the CLI, run [`dcd settings`](../cli/dcd-settings.md). AI agents can call the [`dcd_get_team_settings`](../mcp/tools.md#dcd-get-team-settings) MCP tool.
