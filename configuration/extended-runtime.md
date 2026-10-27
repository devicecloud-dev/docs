# Extended Runtime

Every flow has a 10-minute execution limit. If a flow legitimately needs longer, such as a long end-to-end journey, you can give it up to **20 minutes** with extended runtime.

Extended runtime is set per flow, and each flow that uses it is charged at **2×** its normal rate. Flows that don't use it keep the 10-minute limit and the normal price, so nothing changes unless you turn it on.

## Usage

Set `DEVICECLOUD_OVERRIDE_EXTENDED_RUNTIME` in the flow's `env:` block:

```yaml
# in your long-flow.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_EXTENDED_RUNTIME: true
---
- launchApp
# ... long flow ...
```

* The value must be `true` (or the string `"true"`). Any other value is ignored, and the flow keeps the 10-minute limit.
* Set it on each top-level flow that needs it. The other flows in the same upload keep the 10-minute limit. A flow that one of your flows calls with `runFlow` runs inside the caller's limit.
* Like all `DEVICECLOUD_OVERRIDE_*` settings, this only works in the flow's `env:` block, not with `-e`.

The limit covers the whole Maestro run, including starting Maestro on the device, so the flow's own steps get slightly less than the full 20 minutes. A flow that is still running at the limit is stopped and marked as failed with a "Test run timed out after 20 minutes" error, and its logs and video are still uploaded.

You can check your organization's limits in the console under **Settings → Execution**.

## Pricing

A flow with extended runtime is charged at 2× the rate it would otherwise cost (see [Test Run Billing](../billing/test-run-billing.md)). For example, a standard Android flow costs $0.18 instead of $0.09.

* The 2× applies whether or not the flow uses the extra time. A flow that finishes in 3 minutes is still charged at 2×.
* In a [device matrix](device-matrix.md), the flow is charged at 2× on every device in the matrix. The `est. cost` that `dcd cloud` prints for a matrix includes it.
* [Retries](../advanced/retry-strategies.md) get the same 20-minute limit and, like all retries, are free.
* Any discount on your account applies to extended flows as well.

## Things to know

* **It holds a concurrency slot for longer.** A 20-minute flow occupies one of your [concurrency](../getting-started/concurrency-and-parallel-runs.md) slots for up to twice as long as a 10-minute one, so other runs in your queue may wait longer.
* **A stuck flow costs more.** If a flow times out because it's stuck (waiting for an element that never appears, for example), extended runtime only makes it fail later and at twice the price. Check the flow's video and logs first, and use extended runtime for flows that really are long.
* **20 minutes is the maximum.** It can't be raised per organization.

## FAQ

### Do I need to ask for extended runtime?
No. Any organization can use it by setting `DEVICECLOUD_OVERRIDE_EXTENDED_RUNTIME` on a flow. If **Settings → Execution** shows extended runtime as off for your organization, contact support@devicecloud.dev.

### Can I turn it on for every flow at once?
No. It's set per flow, so you only pay 2× for the flows that need it.
