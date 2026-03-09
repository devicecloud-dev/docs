# Runner Type

{% hint style="info" %}
Runner Type is currently an experimental feature
{% endhint %}

By default each test run uses the following underlying hardware specifications:

| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores |
| ----------- | -------- | ------- | ------------ | ----- | --------- |
| `default`   | iOS      | MacOS   | M1           | 8 GB  | 8         |
| `cpu1`      | Android  | Ubuntu  | x86          | 12 GB | 12        |

As modern simulators and emulators are becoming more resource intensive, DeviceCloud is gradually rolling out additional runner types to support more advanced/intensive test scenarios.

If your app or test is struggling with the default runner types, you can try the options below. Note: non-default runner types are charged at the advanced run fee as per [pricing](https://devicecloud.dev/#pricing).

Opt-in to non-default runner types using the CLI flag:

`dcd cloud ... --runner-type=m4`

| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores | Notes |
| ----------- | -------- | ------- | ------------ | ----- | --------- | ----- |
| `m4`        | iOS      | MacOS   | M4           | 16 GB | 10        | |
| `m1`        | Android  | MacOS   | M1           | 8 GB  | 8         | Limited capacity. Used for debugging host OS issues on Android. |
| `gpu1`      | Android  | Ubuntu  | x86          | 16 GB | 5         | Additional GPU acceleration also provided. |
