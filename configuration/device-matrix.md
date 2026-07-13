# Device Matrix

By default every flow in an upload runs on one device, set by the `--ios-device`,
`--ios-version`, `--android-device` and `--android-api-level` flags on `dcd cloud`.

A **device matrix** runs your whole suite against several devices from a single `dcd cloud`
invocation. Every flow runs once per device, all under one upload with one console entry.

## Usage

Pass `--ios-device-matrix <device>:<version>` (or `--android-device-matrix <device>:<apiLevel>`) once per device you want. Supported devices and operating systems are listed [here](../getting-started/devices-configuration.md).

### iOS

```bash
dcd cloud --app-binary-id <id> ./flows \
  --ios-device-matrix iphone-16-pro:18 \
  --ios-device-matrix iphone-16-pro:26 \
  --ios-device-matrix iphone-16-pro-max:26
# one upload, 3 devices x N flows
```

### Android

```bash
dcd cloud --app-binary-id <id> ./flows \
  --android-device-matrix pixel-7:34 \
  --android-device-matrix pixel-6:33
```

Append `:play` to run a cell against a Google Play device:

```bash
dcd cloud --app-binary-id <id> ./flows \
  --android-device-matrix pixel-7:34 \
  --android-device-matrix pixel-7:34:play
```

Every `--ios-device-matrix` / `--android-device-matrix` names **exactly one device**. There is no
cross-product: the flags are not combined with each other, or with `--ios-device` / `--ios-version`.

```bash
# runs exactly these two, and nothing else
dcd cloud [...] --ios-device-matrix iphone-15:17 --ios-device-matrix iphone-16-plus:26
```

This is deliberate as not every device supports every OS. Naming each device explicitly means you always get
exactly what you asked for.

## Cost

A matrix runs one test per (flow x device), so a 4-device matrix over 10 flows is **40 flows**, not 10. Before submitting, the CLI prints the number of flows and what they will cost:

```
Device matrix
  cells       4
  est. cost   $0.32
  Pixel 7 - API 34   2 flows - $0.16
  Pixel 6 - API 33   2 flows - $0.16
```

Rates are per device — iPad and Google Play flows are charged at the advanced rate, as per our [pricing](../billing/test-run-billing.md).

## Results

Each device gets its own result, grouped together in the console so you can compare a flow across devices at a glance.

Under `--json`, every entry in `tests[]` carries a `device` object, so the same flow run on two
devices is unambiguous:

```json
{
  "uploadId": "...",
  "tests": [
    { "name": "login.yaml", "status": "PASSED", "device": { "name": "Pixel 7", "osVersion": "34" } },
    { "name": "login.yaml", "status": "FAILED", "device": { "name": "Pixel 6", "osVersion": "33" } }
  ]
}
```

Without `--async` the run waits for **every** device and exits `0` only if all of them passed. Retrying a single failed result re-runs just that one flow on that one device and not the entire matrix.

## Rules

- Every device and OS must be a supported combination, including Google Play if applicable. An unsupported one is rejected before anything runs so you never get a partial submission.

- One platform per upload. An upload runs one app binary, so `--ios-device-matrix` and `--android-device-matrix` cannot be combined in the same run.

- A flow that names its own device wins. If a flow targets a device in its YAML via [per-flow devices](per-flow-devices.md), it runs once on that device and is excluded from the matrix. Ten flows across four devices with one targeted flow is 37 runs, not 40.