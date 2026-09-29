# Runner Type

By default each test run uses the following underlying hardware specifications:

| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores |
| ----------- | -------- | ------- | ------------ | ----- | --------- |
| `default`   | iOS      | MacOS   | M1           | 8 GB  | 8         |
| `cpu1`      | Android  | Ubuntu  | x86          | 15 GB | 13        |

Android runs use `cpu1` unless you choose another runner type. Default iOS runs usually run on M1 hosts, but an idle M4 host can also pick them up.

As modern simulators and emulators are becoming more resource intensive, we're gradually rolling out additional runner types to support more advanced/intensive test scenarios.

{% hint style="info" %}
Additional runner types are currently in beta as we work to increase capacity.
{% endhint %}

If your app or test is struggling with the default runner types, you can try the options below. Please note that non-default runner types are charged at the advanced run fee as per our [pricing](../billing/test-run-billing.md).

## Available runners


| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores | Notes |
| ----------- | -------- | ------- | ------------ | ----- | --------- | ----- |
| `m4`        | iOS      | MacOS   | M4           | 16 GB | 10        | |
| `m1`        | Android  | MacOS   | M1           | 8 GB  | 8         | Very limited capacity. Used for debugging host OS issues on Android. |
| `gpu1`      | Android  | Ubuntu  | x86          | 15 GB | 8         | Deprecated. Limited capacity. Additional GPU acceleration also provided. |

{% hint style="warning" %}
`gpu1` is deprecated and **will be removed on 9 November 2026**. From that date, runs that pass `--runner-type gpu1` will run on `cpu1` instead, at the standard Android rate, rather than failing. To move now, stop passing `--runner-type gpu1` (Android runs use `cpu1` by default) or pass `--runner-type cpu1`. See the [Runner Type Support Policy](#runner-type-support-policy) for more information.
{% endhint %}|

### Limitations

* `m4` is iOS only. Choosing it for an Android app is rejected.
* `cpu1`, `m1` and `gpu1` are Android only. On iOS, `m1` is treated as `default` (with a warning), and `cpu1` and `gpu1` are rejected.
* On `m1` and `gpu1`, every flow must run on API level 34 or above (up to 37 on `m1`) and can't use Google Play. This includes devices chosen per flow or in a [device matrix](device-matrix.md).
* Generic Tablet isn't available on `m1` or `gpu1`, so don't select it with those runner types.

### Usage

To use a specialised runner, use the CLI flag `--runner-type`.

```bash
dcd cloud ... --runner-type=<type>

# For example, to use the m4 runner:
dcd cloud ... --runner-type=m4
```

## Runner Type Support Policy

We occasionally retire a runner type that overlaps with others, so that capacity isn't split across pools that do the same job. Our policy for this is as follows:

* Once a runner type is to be no longer offered, we'll mark it as deprecated.
* Deprecated runner types are then removed after at least 30 days provided their total usage over seven days is less than 1%.
* The removal date, and what happens to runs that still ask for the runner type after it, are announced when the runner type is deprecated.
