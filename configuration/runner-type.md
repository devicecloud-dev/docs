---
description: "The hardware each DeviceCloud test runs on, and the larger runner types, such as M4 for iOS, you can choose for resource-heavy apps and tests."
---

# Runner Types

By default each test run uses the following underlying hardware specifications:

| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores |
| ----------- | -------- | ------- | ------------ | ----- | --------- |
| `default`   | iOS      | MacOS   | M1           | 8 GB  | 8         |
| `cpu1`      | Android  | Ubuntu  | x86          | 15 GB | 13        |

Android runs use `cpu1` unless you choose another runner type. Default iOS runs usually run on M1 hosts, but an idle M4 host can also pick them up.

Simulators and emulators keep needing more resources, so we offer extra runner types for heavier apps and tests.

::: info
The `m4` runner type is in beta while we add capacity.
:::

If your app or test struggles on the default runner types, try the options below. `m4` and `m1` runs are charged at the advanced rate, see our [pricing](../billing/test-run-billing.md).

## Available runners


| Runner Type | Platform | Host OS | Architecture | RAM   | CPU Cores | Notes |
| ----------- | -------- | ------- | ------------ | ----- | --------- | ----- |
| `m4`        | iOS      | MacOS   | M4           | 16 GB | 10        | |
| `m1`        | Android  | MacOS   | M1           | 8 GB  | 8         | Apple Silicon (arm64). Google Play runs are moving here, see below. |

::: warning
The `gpu1` runner type was removed on 9 November 2026. Android runs that still pass `--runner-type gpu1`, or set it with `DEVICECLOUD_OVERRIDE_RUNNER_TYPE`, run on `cpu1` instead, billed at the standard Android rate. They don't fail. On iOS, `gpu1` is still rejected. Stop passing `gpu1`: Android runs use `cpu1` by default, or you can pass `--runner-type cpu1`. See the [Support Policy](../getting-started/support-policy.md#runner-types) for more information.
:::

::: info
**Google Play runs are moving from `cpu1` to `m1`**, at the same price. See [Deprecations & Removals](../getting-started/deprecations.md) for the date.
:::

### Limitations

* `m4` is iOS only. Choosing it for an Android app is rejected.
* `cpu1` and `m1` are Android only. On iOS, `m1` is treated as `default` (with a warning), and `cpu1` is rejected.
* On `m1`, every flow must run on API level 34 to 37. This includes devices chosen per flow or in a [device matrix](device-matrix.md).
* Google Play is available on `m1` on `pixel-8` (API 34) and `pixel-10` (API 36, 37). See [Google Play APIs](google-play-apis.md#device-availability).
* `m1` runs arm64-v8a code only. An APK with native libraries must include arm64-v8a ones, otherwise the run is rejected.
* Generic Tablet isn't available on `m1`, so don't select it with that runner type.

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
* Like all [per-flow overrides](per-flow-overrides.md), this only works in the flow's `env:` block, not with `-e`.

## Runner Type Support Policy

How we retire runner types is set out in our [Support Policy](../getting-started/support-policy.md#runner-types).
