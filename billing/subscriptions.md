---
description: "The Pro, Max and Enterprise plans: what each costs and includes, the Overage Limit, and running DeviceCloud without a subscription."
---

# Subscriptions

DeviceCloud offers three subscription plans: Pro, Max and Enterprise.

::: info
All prices exclude Sales Tax. On the Pro and Max plans, tax is added at checkout for your country by our Merchant of Record, Paddle. On the Enterprise plan, tax is added to your invoice where applicable.
:::

Subscriptions have replaced one-off credit purchases. Reach out to support if you need help choosing a plan.

## Pro Plan

This subscription costs $25 per month and comes with $25 of usage included which can be used as per [Test Run Billing](test-run-billing.md).

Additional usage beyond $25 is billed as [overage](overage.md) on your next monthly invoice.

This plan runs up to 5 tests at once on each [runner type](../configuration/runner-type.md), with no Concurrency Protection. See [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md).

For support, ask our team and community on [Discord](https://discord.gg/gm3mJwcNw8) or email [support@devicecloud.dev](mailto:support@devicecloud.dev).

This plan supports unlimited users and unlimited apps. Results are retained for 6 months.

## Max Plan

This subscription costs $200 per month and comes with $200 of usage included which can be used as per [Test Run Billing](test-run-billing.md).

Additional usage beyond $200 is billed as [overage](overage.md) on your next monthly invoice.

This plan runs up to 20 tests at once on most runner types, and has **Concurrency Protection** on the standard runners. See [Concurrency & Parallel Runs](../getting-started/concurrency-and-parallel-runs.md) for the limits and how protection works.

This plan supports [Enterprise SSO](../security/enterprise-single-sign-on.md) and priority support via email.

This plan supports unlimited users and unlimited apps. Results are retained for 6 months.

## Overage Limit

On the Pro and Max plans, overage is capped each billing period so a runaway pipeline can't produce an unexpected bill. By default the **Overage Limit** is 8× your plan's included usage: $200 on Pro and $1,600 on Max, on top of the usage included in your plan. Owners and admins can change it on the [billing page](https://console.devicecloud.dev/billing).

A run that would take you over the limit is refused. See [Overage](overage.md#overage-limit) for how the limit works and what happens when you reach it.

To be told before you get there, or to refuse runs at a lower amount per day, week or billing period, set up [Usage Alerts & Limits](usage-alerts.md).

## Enterprise Plan

This subscription starts at $15,000 per year and allows for custom terms including volume discounts.

This plan is paid by invoice and includes private, dedicated support via Slack as standard.

Please reach out to [sales@devicecloud.dev](mailto:sales@devicecloud.dev) for more info.

## Without a subscription

New teams get $20 of free credits to try DeviceCloud. Without a subscription, runs are paid from that prepaid balance and there's no overage: new runs are refused once the balance runs out. See [Credits](test-run-billing.md#credits).

A new team without a subscription can run up to 5 tests at once on iOS `default`, Android `cpu1` and Android `m1`, and up to 2 on iOS `m4`, with no Concurrency Protection.

