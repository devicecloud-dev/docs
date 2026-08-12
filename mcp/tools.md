# Tools Reference

Every tool the [MCP server](overview.md) exposes, with its parameters and return shape.

All tools return pretty-printed JSON as their text payload. Failures come back as an error result the agent can read and react to — a failing tool never tears down the server, so an agent can recover and retry.

{% hint style="warning" %}
The MCP server is a new, beta capability. The tool surface may change.
{% endhint %}

## dcd_list_devices <a href="#dcd-list-devices" id="dcd-list-devices"></a>

Discover the devices, OS versions, and Maestro versions available to your organisation. Agents should call this **before** `dcd_run_cloud_test` so they pass valid device values.

Takes no parameters.

Returns `{ ios, android, androidPlay, maestro }`, where each platform maps an OS version to its supported device list. See [Devices & OS Versions](../getting-started/devices-configuration.md) and [Maestro Versions](../configuration/maestro-versions.md).

## dcd_list_runs <a href="#dcd-list-runs" id="dcd-list-runs"></a>

List recent flow uploads for your organisation, most recent first.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by upload name. Supports a `*` wildcard, e.g. `nightly-*` |
| `from` | string | Only uploads created on or after this ISO 8601 date, e.g. `2024-01-01` |
| `to` | string | Only uploads created on or before this ISO 8601 date |
| `limit` | integer | Maximum uploads to return, 1–100 (default `20`) |
| `offset` | integer | Uploads to skip, for pagination (default `0`) |

Returns `{ uploads: [{ id, name, created_at, consoleUrl }], total, limit, offset }`. Use a returned `id` with `dcd_get_status` or `dcd_download_artifacts`.

## dcd_get_status <a href="#dcd-get-status" id="dcd-get-status"></a>

Get the status and per-test results of a single upload. This is the polling primitive: after an async `dcd_run_cloud_test`, call this until `status` leaves `PENDING` / `QUEUED` / `RUNNING`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `uploadId` | string | UUID of the upload, as returned by `dcd_run_cloud_test` or `dcd_list_runs` |
| `name` | string | Name of the upload to look up |

Provide **exactly one** of `uploadId` or `name` — passing both, or neither, is an error.

Returns `{ status, name, createdAt, tests: [{ name, status, durationSeconds, failReason }] }`.

## dcd_download_artifacts <a href="#dcd-download-artifacts" id="dcd-download-artifacts"></a>

Download a completed run's artifacts (the videos/logs zip) and/or a formatted report to local disk. It reads cloud state and writes local files, so it stays available in [read-only mode](overview.md#read-only-mode).

| Parameter | Type | Description |
|-----------|------|-------------|
| `uploadId` | string | **Required.** UUID of the upload to download artifacts for |
| `type` | `ALL` \| `FAILED` | Which tests to include artifacts for (default `ALL`) |
| `artifactsPath` | string | Where to write the artifacts zip (default `./artifacts.zip`) |
| `report` | `junit` \| `allure` \| `html` | Also download a formatted report of this type |
| `reportPath` | string | Where to write the report (defaults by type: `report.xml` for `junit`, otherwise `report.html`) |

Returns `{ uploadId, artifactsPath, reportPath, warnings }`. A **non-empty `warnings` array means a download could not be produced** — most often because the run has no results yet. An empty array means success. See [Artifacts & Downloads](../artifacts/artifacts.md) and [Report Formats](../artifacts/report-formats.md).

## dcd_run_cloud_test <a href="#dcd-run-cloud-test" id="dcd-run-cloud-test"></a>

Submit a Maestro flow, or a directory of flows, to run on DeviceCloud.

{% hint style="warning" %}
This tool consumes test credits. It's annotated as destructive so clients can prompt before calling it, and it's hidden entirely in [read-only mode](overview.md#read-only-mode).
{% endhint %}

| Parameter | Type | Description |
|-----------|------|-------------|
| `flowFile` | string | **Required.** Path to a Maestro `.yaml`/`.yml` flow, or a directory of flows |
| `appFile` | string | Path to a local app binary — `.apk`, `.app`, or `.zip`. Mutually exclusive with `appBinaryId` |
| `appBinaryId` | string | ID of a previously uploaded binary. Mutually exclusive with `appFile` |
| `iosVersion` | string | iOS version, e.g. `17` |
| `iosDevice` | string | iOS device, e.g. `iphone-14` |
| `androidApiLevel` | string | Android API level, e.g. `34` |
| `androidDevice` | string | Android device, e.g. `pixel-7` |
| `googlePlay` | boolean | Use a [Google Play-enabled](../configuration/google-play-apis.md) Android image |
| `name` | string | A name for this run |
| `env` | string[] | [Environment variables](../configuration/environment-variables.md) as `KEY=VALUE` strings |
| `includeTags` | string[] | Only run flows with these tags |
| `excludeTags` | string[] | Skip flows with these tags |
| `excludeFlows` | string[] | Flow paths/patterns to exclude |
| `maestroVersion` | string | Pin a specific [Maestro version](../configuration/maestro-versions.md) |
| `retry` | integer | Auto-[retry](../advanced/retry-strategies.md) failed tests, 0–2 |
| `runnerType` | `default` \| `m4` \| `m1` \| `gpu1` \| `cpu1` | [Runner type](../configuration/runner-type.md) (default `default`) |
| `configFile` | string | Path to a [workspace config](../configuration/workspace-config.md) |
| `ignoreShaCheck` | boolean | Force re-upload of the binary even if an identical one already exists |
| `dryRun` | boolean | Preview which flows would run, without submitting |
| `wait` | boolean | Block until the run completes instead of returning immediately (default `false`) |
| `waitTimeoutSeconds` | integer | Max seconds to wait when `wait` is true, 30–3600 (default `600`) |

You must provide either `appFile` or `appBinaryId` — not both, and not neither. Use [`dcd upload`](../cli/dcd-upload.md) or a previous run to get a reusable `appBinaryId`.

### Async by default

By default the tool returns as soon as the run is submitted:

```json
{ "uploadId": "...", "consoleUrl": "...", "status": "PENDING", "tests": [ ... ] }
```

Poll `dcd_get_status` with that `uploadId` until the status is terminal. This is the recommended shape for agents — it keeps the tool call short and avoids a long-blocking request.

Set `wait: true` to block instead. The tool polls every 10 seconds up to `waitTimeoutSeconds`, then returns with `timedOut: true` if the run hasn't finished. **The run continues in the cloud regardless** — a timeout is not a cancellation, and you can resume by polling `dcd_get_status` with the returned `uploadId`.

### Previewing a run

`dryRun: true` resolves the flows and returns them without submitting anything or spending credits:

```json
{
  "dryRun": true,
  "flows": [{ "file": "...", "flowName": "...", "tags": [ ... ] }],
  "sequentialFlowCount": 0
}
```

This is a cheap way for an agent to confirm it's about to run the flows you expect before it calls the billable path for real.
