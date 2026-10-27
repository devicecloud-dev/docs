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
| `m1`        | Android  | MacOS   | M1           | 8 GB  | 8         | Apple Silicon (arm64). Runs Google Play from 14 December 2026. |
| `gpu1`      | Android  | Ubuntu  | x86          | 15 GB | 8         | Deprecated. Limited capacity. Additional GPU acceleration also provided. |

{% hint style="warning" %}
`gpu1` is deprecated and **will be removed on 9 November 2026**. From that date, runs that pass `--runner-type gpu1` will run on `cpu1` instead, at the standard Android rate, rather than failing. To move now, stop passing `--runner-type gpu1` (Android runs use `cpu1` by default) or pass `--runner-type cpu1`. See the [Runner Type Support Policy](#runner-type-support-policy) for more information.
{% endhint %}|

{% hint style="info" %}
**Google Play runs move to `m1` on 14 December 2026.** From that date every Google Play run uses `m1` rather than `cpu1`, at the same price. To test your app on `m1` now, add `--runner-type m1` to your Google Play runs. See [Moving to Apple Silicon](google-play-apis.md#moving-to-apple-silicon-m1).
{% endhint %}

### Limitations

* `m4` is iOS only. Choosing it for an Android app is rejected.
* `cpu1`, `m1` and `gpu1` are Android only. On iOS, `m1` is treated as `default` (with a warning), and `cpu1` and `gpu1` are rejected.
* On `m1` and `gpu1`, every flow must run on API level 34 or above (up to 37 on `m1`). This includes devices chosen per flow or in a [device matrix](device-matrix.md).
* Google Play is available on `m1` on `pixel-8` (API 34) and `pixel-10` (API 36, 37), and not on `gpu1`. See [Google Play APIs](google-play-apis.md#device-availability).
* `m1` runs arm64-v8a code only. An APK with native libraries must include arm64-v8a ones, otherwise the run is rejected.
* Generic Tablet isn't available on `m1` or `gpu1`, so don't select it with those runner types.

### Usage

To use a specialised runner, use the CLI flag `--runner-type`.

```bash
dcd cloud ... --runner-type=<type>

# For example, to use the m4 runner:
dcd cloud ... --runner-type=m4
```

### Overriding the runner type for a single flow

To run just one flow on a different runner type, set `DEVICECLOUD_OVERRIDE_RUNNER_TYPE` in that flow's `env:` block. It overrides `--runner-type` for that flow only. The other flows in the upload keep the upload's runner type.

```yaml
# in your test.yaml
appId: my.app
env:
    DEVICECLOUD_OVERRIDE_RUNNER_TYPE: m4
---
# test steps
```

* The same [limitations](#limitations) apply as for `--runner-type`. The one difference: on iOS, `m1` becomes `default` without a warning. On Android, `default` becomes `cpu1`.
* A value that isn't a runner type, or one that the platform doesn't support, rejects the whole upload before anything runs. The flow is never quietly run on the upload's runner type instead.
* The flow is charged at its own runner type's rate. For example, an `m4` flow in a `default` upload is charged the advanced rate, and the other flows are charged the standard rate.
* In a [device matrix](device-matrix.md), the flow still runs on every device in the matrix, each time on its own runner type.
* Like all `DEVICECLOUD_OVERRIDE_*` settings, this only works in the flow's `env:` block, not with `-e`.

## Runner Type Support Policy

We may occasionally need to retire a runner type from our platform. This may be that it overlaps with other runner types or due to a lack of usage. Our policy for this is as follows:

* Once a runner type is to be no longer offered, we'll mark it as deprecated.
* Deprecated runner types are then removed after at least 30 days provided their total usage over seven days is less than 1%.
