# Test Run Billing

{% hint style="info" %}
All amounts exclude Sales Tax - this will be added at checkout for your country by our Merchant of Record, Paddle.
{% endhint %}

DeviceCloud debits customers account per test run.

In billing terms, a test run is a single top-level flow executing on a single device. Multiple flows in an upload will incur multiple charges. \
\
For example, an upload with 10 flows running on iOS (at $0.10 per test run) will incur $1 of debits to the customer account.\
\
Details of charges made to your account can be found on the [billing page](https://console.devicecloud.dev/billing).&#x20;

<table><thead><tr><th width="204.5078125">Test Run Type</th><th width="458.6953125">Includes</th><th>Cost (USD)</th></tr></thead><tbody><tr><td>Standard iOS</td><td>Any iPhone device on default <a href="../reference/runner-type.md">runner type</a></td><td>$0.10</td></tr><tr><td>Advanced iOS</td><td>Use of non-default <a href="../reference/runner-type.md">runner types</a> and/or iPad</td><td>$0.14</td></tr><tr><td>Standard Android</td><td>Any non-Play Pixel phone on default/cpu1 <a href="../reference/runner-type.md">runner type</a></td><td>$0.08</td></tr><tr><td>Advanced Android</td><td>Use of non-default <a href="../reference/runner-type.md">runner types</a> and/or Tablet and/or Play devices.</td><td>$0.14</td></tr></tbody></table>

{% hint style="info" %}
Enterprise customers with volume discounts or grandfathered users with older pricing may have different pricing - you can view your account's test run cost in the [billing page](https://console.devicecloud.dev/billing)
{% endhint %}

### Credits

Historically, DeviceCloud users have purchased credits in advanced and these have been drawn down via usage.

Note: credits are only valid for 12 months, after which they automatically expire.

New users are given free credits to test the service.

The ability to purchase credits is being phased out in favour of [subscriptions](subscriptions.md).

