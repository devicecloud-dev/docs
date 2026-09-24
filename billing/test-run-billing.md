# Test Run Billing

{% hint style="info" %}
All amounts exclude Sales Tax - this will be added at checkout for your country by our Merchant of Record, Paddle.
{% endhint %}

DeviceCloud charges your Team's account per test run. This happens as soon as you run `dcd cloud`.

In billing terms, a test run is a single top-level flow executing on a single device. Multiple flows in an upload will incur multiple charges. 

For example, an upload with 10 flows running on iOS (at $0.11 per test run) will incur $1.10 of charges to your Team's account.

Details of charges made to your account can be found on the [billing page](https://console.devicecloud.dev/billing).

| Test Run Type    | Includes                                                                                          | Cost (USD) |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------- |
| Standard iOS     | Any iPhone device on our default [runner type](../configuration/runner-type.md)                   | $0.11      |
| Advanced iOS     | Any runs on our `m4` [runner type](../configuration/runner-type.md) and any iPad runs (on either runner). | $0.15 |
| Standard Android | Any non-Play Pixel phone (except the Pixel 10 Pro Fold) on our cpu1 [runner type](../configuration/runner-type.md) | $0.09 |
| Advanced Android | Any runs on our `gpu1` and `m1` [runner types](../configuration/runner-type.md), and any Tablet, Pixel 10 Pro Fold or Play device runs | $0.15 |

{% hint style="info" %}
Enterprise customers with volume discounts or grandfathered users with older pricing may have different pricing. You can view your account's test run cost in the [billing page](https://console.devicecloud.dev/billing)
{% endhint %}

### Credits

New users are given $20 in free credits to test the service.

Historically, DeviceCloud users purchased credits in advance and these were drawn down via usage. Credits can no longer be purchased or topped up — [subscriptions](subscriptions.md) have replaced them — but any prepaid balance you still hold doesn't expire. If you also have a subscription, your prepaid balance (including any remaining free credits) is spent first, before your plan's included usage.

### Cancelled tests

A test you cancel before it starts running is refunded at 75% of its cost. The 25% is used to cover our network and egress costs from preparing your test to run.

Running tests can't be cancelled from the console. A running test cancelled through the API is charged in full.

Each refund appears as a negative line in your usage history, alongside the original charge. Where it goes depends on how the test was paid for:

* **Credit balance** - the refund is added back to your balance immediately.
* **Your plan's included credits** - the refund restores that amount of your included allowance for the current billing period.
* **Overage** - the refund reduces overage that hasn't been billed yet. Overage that has already been billed isn't credited back; the refund is deducted from any further overage in the same billing period instead.

A run paid for from more than one of these is refunded in the same proportions. Refunds for cancelled tests are never paid back to your card.

### Retries

Retrying a test doesn't cost anything: retries you start from the console or with `--retry` aren't charged. If a test is interrupted by an infrastructure failure on our side (for example, a simulator that fails to boot), it is re-run automatically at no extra charge.

### Plan changes

Upgrading your plan takes effect immediately, and you're charged the prorated difference for the rest of the current billing period. Downgrading takes effect from your next billing date, and no refund is issued for the current period.

### Overdue payments

If a subscription payment fails, you can keep testing for 72 hours while the payment is retried. After that, new test runs are refused with HTTP `402` until the payment succeeds.
