# Usage Alerts & Limits

Usage alerts tell your team when usage reaches an amount you choose, by email, Slack or webhook. Turn on **Hard stop** on an alert and DeviceCloud also refuses new runs that would take usage past it.

Alerts work alongside your [Overage Limit](overage.md#overage-limit). The Overage Limit caps overage for the whole billing period. An alert can watch a day, a week or the billing period, and a hard stop can refuse runs well before the Overage Limit would.

::: info
Usage alerts need an active subscription. They count only usage that your plan pays for, so runs paid from a prepaid credit balance don't count towards them.
:::

## Adding an alert

Owners and admins manage alerts on the [billing page](https://console.devicecloud.dev/billing), in the **Usage Alerts & Limits** card:

1. Pick a window: **Daily**, **Weekly** or **Billing period**.
2. For a billing-period alert, pick **Dollar amount** or **% of allowance**. Daily and weekly alerts always use a dollar amount.
3. Enter the threshold.
4. Under **Notify**, select **Email**, **Slack**, **Webhook**, or any mix of them.
5. To refuse runs that would go over the threshold, turn on **Hard stop**.
6. Select **Add alert**.

Each alert in the list has a switch to turn it off or on, and a **Delete** button. A team can have up to 20 alerts.

## How usage is measured

* **Daily** and **Weekly** windows are UTC calendar days and weeks. A week starts on Monday.
* **Billing period** is your subscription's current billing period.
* Usage is what your plan has paid for in the window, from included credits and overage, after [refunds](test-run-billing.md#cancelled-tests).
* **% of allowance** is a share of your included credits plus your Overage Limit. For example, 80% of the Pro plan's default allowance ($25 + $200) is $180. This option isn't available if your team has no Overage Limit.

## When an alert is sent

Usage is checked each time a run is charged. An alert is sent the first time usage in its window reaches the threshold, and at most once per window. Changing an alert's window or threshold resets it for the current window.

Every channel gets the same summary: usage so far in the window, the threshold and what's left of it, your billing period's usage against your allowance, and, when it can be estimated, when you'll reach the allowance at your current rate.

* **Email** goes to your team's billing email address, or to its owners and admins if none is set. It's sent from hello@devicecloud.dev.
* **Slack** posts to the channel connected under **Settings → Notifications**, whatever its **Only notify on failures** setting. See [Slack Notifications](../notifications/slack-notifications.md).
* **Webhook** sends a [`usage.alert` event](../notifications/webhook-notifications.md#usage-alert) to your webhook URL.

## Hard stop

With **Hard stop** on, DeviceCloud checks each new run before it starts. If the run's cost would take usage in the alert's window past the threshold, the whole upload is refused and none of its tests run. Tests already queued or running aren't affected.

`dcd cloud` reports the refusal as an error and exits with code `1`. The API responds with HTTP `402` and `"error": "USAGE_LIMIT_EXCEEDED"`, the same as a refusal by the [Overage Limit](overage.md#when-a-run-would-go-over-the-limit). The message names the window and the limit, and says when new runs can start again:

```text
✗ Error: Failed to submit test flows: Usage limit exceeded: this run ($3.30) would take usage today (2026-11-17, UTC) to $51.20, past your hard stop of $50.00. … (HTTP 402)
```

A refused run also sends the alert on its channels, unless it has already been sent in this window. A hard stop with no channels refuses runs without telling anyone.

To start testing again, raise the threshold, turn the hard stop off, or wait for the window to end.

Hard stops apply to test runs. They don't stop [Live sessions](../cli/dcd-live.md) or [Agent Devices](../mcp/agent-devices.md) sessions.

## When the Overage Limit refuses a run

Your Overage Limit still applies on top of your alerts. When it refuses a run, DeviceCloud sends every billing-period alert that the run would have taken usage past, marked as a refused run, whether or not the alert is a hard stop. As with any alert, each one is sent at most once per billing period. So an alert set at 100% of your allowance still reaches you when the Overage Limit stops your tests.

## Through the API

You can manage the same alerts with the [REST API](../api/overview.md):

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/usage-alerts` | List your team's alerts |
| `POST` | `/usage-alerts` | Add an alert |
| `PATCH` | `/usage-alerts/{id}` | Change an alert |
| `DELETE` | `/usage-alerts/{id}` | Delete an alert |

Any member can list alerts. Adding, changing and deleting them needs an owner or admin, or an API key. An alert has these fields:

| Field | Values |
| --- | --- |
| `window_type` | `day`, `week` or `period` |
| `threshold` | Dollars, or a percentage when `threshold_type` is `percent` |
| `threshold_type` | `credits` (dollars, the default) or `percent`. `percent` is only allowed with `period` |
| `channels` | Any of `email`, `slack` and `webhook`. Defaults to `["email"]`. Leave it empty for a hard stop that sends nothing |
| `hard_stop` | `true` refuses runs that would go over the threshold. Defaults to `false` |
| `enabled` | Defaults to `true` |
