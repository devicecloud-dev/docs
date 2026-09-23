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
| Standard Android | Any non-Play Pixel phone on our cpu1 [runner type](../configuration/runner-type.md)               | $0.09      |
| Advanced Android | Any runs on our `gpu1` and `m1` [runner types](../configuration/runner-type.md) and Tablet or Play devices (on either runner) | $0.15 |

{% hint style="info" %}
Enterprise customers with volume discounts or grandfathered users with older pricing may have different pricing. You can view your account's test run cost in the [billing page](https://console.devicecloud.dev/billing)
{% endhint %}

### Credits

New Teams are given $20 of trial credit to test the service. Credit balances never expire and can't be topped up, and any remaining balance is used before the included credits of your [plan](subscriptions.md).

### Cancelled tests

A test you cancel before it starts running is refunded at 75% of its cost. The 25% is used to cover our network and egress costs from preparing your test to run.

Running tests can't be cancelled from the console. A running test cancelled through the API is charged in full.

Each refund appears as a negative line in your usage history, alongside the original charge. Where it goes depends on how the test was paid for:

* **Credit balance** - the refund is added back to your balance immediately.
* **Your plan's included credits** - the refund restores that amount of your included allowance for the current billing period.
* **Overage** - the refund reduces overage that hasn't been billed yet. Overage that has already been billed isn't credited back; the refund is deducted from any further overage in the same billing period instead.

A run paid for from more than one of these is refunded in the same proportions. Refunds for cancelled tests are never paid back to your card.
