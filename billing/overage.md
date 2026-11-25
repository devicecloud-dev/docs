---
description: "How usage beyond your plan's included credits is charged on the Pro and Max plans: the order usage is paid in, when overage is invoiced, the Overage Limit, and what happens when a run would go over it."
---

# Overage

The Pro and Max [subscriptions](subscriptions.md) include a set amount of usage each billing period: $25 on Pro and $200 on Max. The console calls this your **included credits**. Usage beyond it is **overage**. Overage is charged at the same per-run prices as everything else (see [Test Run Billing](test-run-billing.md)), added to your next invoice, and capped by your [Overage Limit](#overage-limit).

::: info
All amounts exclude Sales Tax. Our Merchant of Record, Paddle, adds tax for your country to your invoice.
:::

## How usage is paid for

Each run is charged when you submit it. The charge is taken from three places, in this order:

1. **Prepaid credit balance.** This covers free credits and any credits bought before subscriptions replaced them.
2. **Included credits.** Your plan's included usage for the current billing period.
3. **Overage.** Whatever is left.

One upload can be split across all three. For example, with $1 of included credits left, a $3 upload uses that $1 and adds $2 of overage.

The [billing page](https://console.devicecloud.dev/billing) shows your included credits used and remaining, and your overage so far this billing period. Every charge is listed under **Usage**, with a type of `CREDITS`, `SUBSCRIPTION` or `OVERAGE`.

## When overage is billed

Overage is billed in arrears. It isn't charged to your card as you go. It builds up through the billing period, and the billing page shows it as it does. It's added to your next subscription invoice in the last two days before you renew. Each renewal invoice therefore holds two things:

* the plan fee for the billing period that's starting
* the overage from the billing period that's ending

Overage from the last day of a billing period may only be added after you renew. If so, it appears on the invoice after that.

For example, a Pro team uses $60 of test runs in one billing period. $25 of that is covered by its included credits and $35 is overage. At renewal it's invoiced $25 for the next period's plan fee plus $35 of overage, so $60 before tax.

You can see past invoices under **Invoice history** on the billing page.

## Upgrading during a billing period

When you upgrade from Pro to Max, the overage you've already used in the current billing period counts against Max's included credits first, up to what's left of them. The amount moved isn't billed as overage. The upgrade itself is charged as the prorated difference, as usual (see [Plan changes](test-run-billing.md#plan-changes)).

For example, a Pro team has used its $25 of included credits and $150 of overage, then upgrades to Max. The $150 moves onto Max's included credits, so the team has used $175 of its $200 and has no overage. None of the $150 is billed as overage, and its next $25 of usage this billing period comes from its included credits.

If the overage is more than Max's included credits can take, only that part moves. The rest stays overage. Under **Usage**, the move appears as a negative `OVERAGE` entry and a matching `SUBSCRIPTION` entry.

If you upgrade in the last two days before you renew, some of that overage may already be on your renewal invoice. It still moves onto Max's included credits, and we refund it after the renewal is paid.

## Overage Limit

The Overage Limit caps how much overage you can run up in one billing period, so a runaway pipeline can't produce an unexpected bill. The limit is added on top of your included credits. It doesn't cap your total spend.

By default the limit is 8× your plan's included credits:

| Plan | Included credits | Default Overage Limit | Most usage per billing period |
| ---- | ---------------- | --------------------- | ----------------------------- |
| Pro  | $25              | $200                  | $225                          |
| Max  | $200             | $1,600                | $1,800                        |

### Changing the limit

Only owners and admins can see the billing page and change the limit:

1. Open the [billing page](https://console.devicecloud.dev/billing).
2. Select **Edit** next to **Overage Limit**.
3. Enter a whole number of dollars and select **Save**.

The new limit applies from your next run.

* Set it to `0` to allow no overage at all. Runs then stop as soon as your included credits are used up.
* There's no maximum.
* If you change plan and haven't changed the limit yourself, it moves to the new plan's default. A limit you've set yourself is kept.

## When a run would go over the limit

When you submit a run, DeviceCloud checks whether its cost would take your usage for the billing period past your included credits plus your Overage Limit. If it would, the whole upload is refused and none of its tests run.

That means a run can be refused before you've used the whole limit. With $5 of your Overage Limit left, a $6 upload is refused, but a $4 upload still runs. Tests that were already queued or running aren't affected.

`dcd cloud` reports the refusal as an error and exits with code `1`, even with `--json-file`. In CI, the step fails like any other CLI error. The output looks like this:

```text
✗ Error: Failed to submit test flows: Usage limit exceeded … (HTTP 402)
```

The full message also gives your usage so far, the cost of the upload, your limit and the dates of your billing period. Behind the CLI, the API responds with HTTP `402` and `"error": "USAGE_LIMIT_EXCEEDED"`.

To start testing again, raise your Overage Limit or wait for your next billing period to start.

A [hard stop](usage-alerts.md#hard-stop) that you've set on a usage alert refuses runs in the same way, with the same HTTP `402` and `USAGE_LIMIT_EXCEEDED`. Its message names the alert's limit instead of the Overage Limit.

[Live sessions](../cli/dcd-live.md) and [Agent Devices](../mcp/agent-devices.md) sessions count towards your usage too, and are checked the same way when they start, at what they would cost at their maximum length. A session that is already running isn't stopped.


## Warnings

The billing page shows a warning once you've used 80% of your Overage Limit, and another when you reach it. With a limit of `0`, both are based on your included credits instead.

To be told by email, Slack or webhook when usage reaches an amount you choose, per day, per week or per billing period, set up [Usage Alerts & Limits](usage-alerts.md).


## Refunds

Tests you cancel before they start are refunded at 75% of their cost. A refund for a test paid from overage reduces overage that hasn't been added to an invoice yet. Overage is only added to your invoice in the last two days before you renew, so the refund usually lands before the overage it cancels is invoiced. If that overage is already on your next invoice, the refund comes off any further overage in the same billing period instead. See [Cancelled tests](test-run-billing.md#cancelled-tests).

## Other plans

* **Enterprise.** Your agreement sets your overage terms. Contact support for details.
* **No subscription.** If you only have a prepaid credit balance, there's no overage. Runs are refused once the balance runs out.

If a renewal payment fails, including one with overage on it, see [Overdue payments](test-run-billing.md#overdue-payments).
