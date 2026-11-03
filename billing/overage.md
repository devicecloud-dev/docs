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

Overage is billed in arrears. It isn't charged to your card as you go. About once a day, any new overage is added to your next subscription invoice. Each renewal invoice therefore holds two things:

* the plan fee for the billing period that's starting
* the overage from the billing period that's ending

Overage from the last day of a billing period may only be added after you renew. If so, it appears on the invoice after that.

For example, a Pro team uses $60 of test runs in one billing period. $25 of that is covered by its included credits and $35 is overage. At renewal it's invoiced $25 for the next period's plan fee plus $35 of overage, so $60 before tax.

You can see past invoices under **Invoice history** on the billing page.

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


## Warnings

The billing page shows a warning once you've used 80% of your Overage Limit, and another when you reach it. With a limit of `0`, both are based on your included credits instead.

These warnings only appear on the billing page. We don't currently email you about overage, so set a limit your pipelines can safely stop at.

## Refunds

Tests you cancel before they start are refunded at 75% of their cost. A refund for a test paid from overage reduces overage that hasn't been added to an invoice yet. Overage is added about once a day, so the refund usually lands before the overage it cancels is invoiced. If that overage is already on your next invoice, the refund comes off any further overage in the same billing period instead. See [Cancelled tests](test-run-billing.md#cancelled-tests).

## Other plans

* **Enterprise.** Your agreement sets your overage terms. Contact support for details.
* **No subscription.** If you only have a prepaid credit balance, there's no overage. Runs are refused once the balance runs out.

If a renewal payment fails, including one with overage on it, see [Overdue payments](test-run-billing.md#overdue-payments).
