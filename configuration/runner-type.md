# Runner Type

By default each test run uses the following underlying hardware specifications:

| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores |
| ----------- | -------- | ------- | ------------ | ----- | --------- |
| `default`   | iOS      | MacOS   | M1           | 8 GB  | 8         |
| `cpu1`      | Android  | Ubuntu  | x86          | 12 GB | 12        |

As modern simulators and emulators are becoming more resource intensive, we're is gradually rolling out additional runner types to support more advanced/intensive test scenarios.

{% hint style="info" %}
Additional runner types are currently in beta as we work to increase capacity.
{% endhint %}

If your app or test is struggling with the default runner types, you can try the options below. Please note that non-default runner types are charged at the advanced run fee as per our [pricing](../billing/test-run-billing.md).

## Available runners


| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores | Notes |
| ----------- | -------- | ------- | ------------ | ----- | --------- | ----- |
| `m4`        | iOS      | MacOS   | M4           | 16 GB | 10        | |
| `m1`        | Android  | MacOS   | M1           | 8 GB  | 8         | Very limited capacity. Used for debugging host OS issues on Android. |
| `gpu1`      | Android  | Ubuntu  | x86          | 16 GB | 5         | Limited capacity. Additional GPU acceleration also provided. |


### Usage

To use a specialised runner, use the CLI flag `--runner-type`.

```bash
dcd cloud ... --runner-type=<type>

# For example, to use the m4 runner:
dcd cloud ... --runner-type=m4
```