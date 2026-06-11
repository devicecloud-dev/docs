# Test Run Billing

{% hint style="info" %}
All amounts exclude Sales Tax - this will be added at checkout for your country by our Merchant of Record, Paddle.
{% endhint %}

DeviceCloud debits customers account per test run.

In billing terms, a test run is a single top-level flow executing on a single device. Multiple flows in an upload will incur multiple charges. 

For example, an upload with 10 flows running on iOS (at $0.11 per test run) will incur $1.10 of debits to the customer account.

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

Historically, DeviceCloud users have purchased credits in advance and these have been drawn down via usage.

{% hint style="info" %}
Note: credits are only valid for 12 months, after which they automatically expire.
{% endhint %}

New users are given $20 in free credits to test the service.

The ability to purchase credits is being phased out in favour of [subscriptions](subscriptions.md).