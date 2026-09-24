# Concurrency & Parallel Runs

DeviceCloud supports parallel runs, also known as concurrency. This means multiple tests run simultaneously, greatly reducing the overall test suite execution time for a given CI run.

Limits are set per platform and [runner type](../configuration/runner-type.md). In the console, under **Settings → Execution**, the **Concurrency Limits** card shows two values for each: minimum guaranteed concurrency (**Concurrency Protection**) and maximum concurrency (**Surge Concurrency When Capacity Allows**).

The plans come with these limits:

| Plan | iOS `default` | iOS `m4` | Android `cpu1` (default) | Android `gpu1` | Android `m1` |
|------|---------------|----------|--------------------------|----------------|--------------|
| Pro | up to 5 | up to 5 | up to 5 | up to 2 | up to 1 |
| Max | up to 20, with 1 protected | up to 5 | up to 20, with 1 protected | up to 2 | up to 1 |

Cheaper plans typically have no Concurrency Protection, which means that during busy periods when runner capacity is stretched, you may need to wait for runner availability or experience less concurrency than your maximum.

Once you reach your maximum concurrency for a runner type, additional tests enter a queued state and sit in a backlog until you're under your concurrency limits. At that point, they automatically move to pending and are processed by the runners.

If you have a plan with Concurrency Protection, DeviceCloud will prioritise your jobs to ensure your minimum concurrency is met. On the Max plan, Concurrency Protection covers the standard runners only: iOS `default` and Android `cpu1`.

Some accounts have a shared pool instead, shown in the console as **Standard — shared across iOS & Android**. Standard iOS (`default`) and Android (`cpu1`) runs then draw on one combined limit rather than a limit each.

#### **Enterprise Plans**

If you need larger guaranteed concurrency or a bespoke concurrency setup and availability, please contact us at [sales@devicecloud.dev](mailto:sales@devicecloud.dev) and we'd be happy to arrange an enterprise plan that meets your requirements.

#### **Why limit concurrency at all?**

DeviceCloud owns its own hardware, which is how we're able to offer such competitive prices. However, we have limited capacity in our runner pool. As such, we sometimes need to limit concurrency to ensure fair throughput for everyone. As more users subscribe, we gradually invest in and expand this pool to increase overall capacity.
