# Subscriptions

DeviceCloud offers subscriptions for use of the service.

{% hint style="info" %}
All prices exclude Sales Tax. On the Pro and Max plans, tax is added at checkout for your country by our Merchant of Record, Paddle. On the Enterprise plan, tax is added to your invoice where applicable.
{% endhint %}

Subscriptions have replaced one-off credit purchases. Reach out to support if you need help choosing a plan.

### Pro Plan

This subscription costs $25 per month and comes with $25 of usage included which can be used as per [test-run-billing.md](test-run-billing.md "mention").

Additional usage beyond $25 will be billed as overage and charged in your next monthly payment.

This plan lets you run up to 5 iOS and 5 Android tests in parallel. Read about [concurrency-and-parallel-runs.md](../getting-started/concurrency-and-parallel-runs.md "mention") to understand how this may be reduced at peak times.

If you require support when using this plan, you can contact our team and community via [Discord](https://discord.gg/gm3mJwcNw8).\
\
This plan supports unlimited users and unlimited apps. Results are retained for 6 months.

### Max Plan

This subscription costs $200 per month and comes with $200 of usage included which can be used as per [test-run-billing.md](test-run-billing.md "mention").

Additional usage beyond $200 will be billed as overage and charged in your next monthly payment.

This plan lets you run up to 20 iOS and 20 Android tests in parallel.

In addition, it offers **Concurrency Protection** to ensure you always have at least 1 test running even at very busy times. Read more [concurrency-and-parallel-runs.md](../getting-started/concurrency-and-parallel-runs.md "mention") to understand how this works.

This plan supports [enterprise-single-sign-on.md](../security/enterprise-single-sign-on.md "mention") and priority support via email.

This plan supports unlimited users and unlimited apps. Results are retained for 6 months.

### Overage Limit

On the Pro and Max plans, overage is capped each billing period so a runaway pipeline can't produce an unexpected bill. By default the **Overage Limit** is 8× your plan's included usage — $200 on Pro and $1,600 on Max — and it applies on top of the usage included in your plan. You can view and change it on the [billing page](https://console.devicecloud.dev/billing), which shows a warning once you've used 80% of it. If you change plan and haven't customised the limit, it moves to the new plan's default.

Once the limit is reached, new test runs are refused with HTTP `402` (`USAGE_LIMIT_EXCEEDED`) until your next billing period starts or you raise the limit.

### Enterprise Plan

This subscription starts at $7,500 per year and allows for custom terms including volume discounts.

This plan is paid by invoice and includes private, dedicated support via Slack as standard.

Please reach out to [sales@devicecloud.dev](mailto:sales@devicecloud.dev) for more info.

