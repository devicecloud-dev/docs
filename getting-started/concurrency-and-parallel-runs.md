# Concurrency & Parallel Runs

DeviceCloud supports parallel runs, also known as concurrency. This means multiple tests run simultaneously, greatly reducing the overall test suite execution time for a given CI run.

In your DeviceCloud settings page, you'll see two values for each platform: minimum guaranteed concurrency and maximum concurrency.

Cheaper plans typically have no guaranteed minimum concurrency, which means that during busy periods when runner capacity is stretched, you may need to wait for runner availability or experience less concurrency than your maximum.

Once you reach your maximum concurrency for iOS or Android, additional tests enter a queued state and sit in a backlog until you're under your concurrency limits. At that point, they automatically move to pending and are processed by the runners.

If you have a plan with a minimum concurrency guarantee, DeviceCloud will prioritise your jobs to ensure your minimum concurrency is met.

Note that concurrency guarantees only apply to standard runner types. Experimental runner types, such as Android's M1 runner, are not covered by these concurrency rules.

#### **Enterprise Plans**

If you need larger guaranteed concurrency or a bespoke concurrency setup and availability, please contact us at [sales@devicecloud.dev](mailto:sales@devicecloud.dev) and we'd be happy to arrange an enterprise plan that meets your requirements.

#### **Why limit concurrency at all?**

DeviceCloud owns its own hardware, which is how we're able to offer such competitive prices. However, we have limited capacity in our runner pool. As such, we sometimes need to limit concurrency to ensure fair throughput for everyone. As more users subscribe, we gradually invest in and expand this pool to increase overall capacity.
