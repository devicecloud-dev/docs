---
description: "REST API endpoints for one upload's test results: statuses and failure reasons, JUnit and HTML reports, and artifact downloads."
---

# Results

All results endpoints operate on a specific upload identified by its UUID.

With a key that has [**CI: run tests only**](../getting-started/api-keys.md#key-access) access, every endpoint on this page works only for runs that key started. Any other run answers HTTP `404` with the standard error envelope and `"error": "UPLOAD_NOT_FOUND"`, the same as a run that doesn't exist.

**Status values:** `PENDING`, `QUEUED`, `RUNNING`, `PASSED`, `FAILED`, `CANCELLED`

---

## Get results

Returns all test results for an upload, including status and failure reasons.

This endpoint reports a test waiting in the queue as `PENDING`, not `QUEUED`, so that older CLIs keep working. Treat both as "not started yet". [`GET /uploads/status`](uploads.md#get-upload-status) reports `QUEUED`.

```
GET /results/:uploadId
```

**Example**

```bash
curl https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "statusCode": 200,
  "results": [
    {
      "id": 4500,
      "test_file_name": "./login-test/onboarding.yaml",
      "test_name": "Onboarding",
      "status": "FAILED",
      "fail_reason": "Element not found: Text matching regex next.* not found",
      "duration_seconds": 32,
      "retry_of": null,
      "created_at": "2026-01-15T10:30:04Z",
      "simulator_name": "pixel-10-api-36",
      "platform": "android"
    }
  ]
}
```

Every attempt is included: a retry appears as its own entry, with `retry_of` set to the `id` of the original attempt. Each entry also includes `config` (the run settings for that test) and `result_files` (references to its stored artifacts, plus the step log itself when it is 512 KB or smaller), which are left out of the example above. Responses for large uploads can therefore run to several megabytes. To poll a run's progress, use the [summary view](#summary-view), or [`GET /uploads/status`](uploads.md#get-upload-status) if you only need the latest attempt of each test.

An upload ID with no results in your team, such as a mistyped one, answers HTTP `200` with an empty `results` list, not `404` (unless you use a CI-only key, as above). If a poll keeps getting an empty list, check the ID.

Each result also has a `cancellation_reason`, which is `null` unless the test
was cancelled for a recorded reason:

* `superseded_by:<upload id>` — a newer run from the same CI context replaced
  this one. See [Cancelling superseded runs](../advanced/cancel-previous.md).
* `Cancelled: payment for this run failed.` — the run's payment failed after
  its tests were created, for example because it was submitted at the same
  moment as another run and together they went over your
  [Overage Limit](../billing/overage.md#when-a-run-would-go-over-the-limit).

A test you cancel yourself has a `null` reason, and so does a retry of a cancelled test. Match on the `superseded_by:`
prefix rather than comparing whole values, as more reasons may be added.

### Summary view

Add `?view=summary` to get only the fields you need to follow a run's progress. Each entry then has `id`, `test_file_name`, `status`, `fail_reason`, `duration_seconds`, `retry_of`, `cancellation_reason` and `simulator_name`, plus a `config` that holds only `deviceName` and `osVersion`. `result_files` is left out, so the response stays small however long the step logs get. Every attempt is still included.

```bash
curl "https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a?view=summary" \
  -H "x-app-api-key: <key>"
```

```json
{
  "statusCode": 200,
  "results": [
    {
      "id": 4500,
      "test_file_name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "retry_of": null,
      "duration_seconds": 32,
      "fail_reason": "Element not found: Text matching regex next.* not found",
      "cancellation_reason": null,
      "simulator_name": "pixel-10-api-36",
      "config": { "deviceName": "Pixel 10", "osVersion": "36" }
    }
  ]
}
```

### Polling efficiently

Responses carry an `ETag` header. Send it back in `If-None-Match` on your next request. If nothing has changed since then, the API answers `304 Not Modified` with an empty body.

```bash
curl -i "https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a?view=summary" \
  -H "x-app-api-key: <key>" \
  -H 'If-None-Match: W/"2f1-Xb3kq0x8wYc8pXK9z1l3m6V2c4A"' \
  -H "Cache-Control: max-age=0"
```

Also send `Cache-Control: max-age=0`. Fetch-based clients, including Node's built-in `fetch`, add `Cache-Control: no-cache` to any request that carries `If-None-Match`, and the API then always sends the full response.

The API also compresses responses when the request includes an `Accept-Encoding` header (`br` or `gzip`). Most HTTP clients send it by default; with curl, pass `--compressed`.

---

## Download JUnit report

Returns one JUnit XML report covering the latest attempt of every test in an upload. A test without a report of its own gets a generated test case, so every test appears. Compatible with most CI systems.

An upload with no results in your team answers HTTP `404`.

```
GET /results/:uploadId/report
```

**Example**

```bash
curl https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/report \
  -H "x-app-api-key: <key>" \
  -o report.xml
```

---

## Download HTML report

::: tip
We recommend [Download ZIPs through the CDN](#download-zips-through-the-cdn) instead: `report-bundle` gives the same ZIP, built and served by our CDN.
:::

Returns a ZIP containing the HTML report together with the screenshots, videos and logs of every test in an upload (the latest attempt of each). An upload with no results in your team answers HTTP `404`.

```
GET /results/:uploadId/html-report
```

**Example**

```bash
curl https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/html-report \
  -H "x-app-api-key: <key>" \
  -o report.zip
```

---

## Download artifacts

::: tip
We recommend [Download ZIPs through the CDN](#download-zips-through-the-cdn) instead: `artifacts-bundle` gives the same ZIP, with the same `results` and `resultId` filters, built and served by our CDN.
:::

Returns a zip file containing logs, screenshots, and videos. Filter to all results or failing only. Each test's files sit in a folder named after its result ID (`<resultId>/logs/`, `<resultId>/screenshots/`, `<resultId>/videos/`), and a merged JUnit `report.xml` covering the whole upload is added at the root — see [Artifact Archive Structure](../artifacts/artifacts.md#artifact-archive-structure).

```
POST /results/:uploadId/download
```

**Body**

| Field | Values | Description |
|-------|--------|-------------|
| `results` | `FAILED`, `ALL` | Which test artifacts to include. |
| `resultId` | A result ID (optional) | Only the files of the flow run this result belongs to: its first attempt and every retry, on that one device. `report.xml` then covers just that run. Use the `id` of a result from [Get results](#get-results). A value that isn't a positive whole number is a `400`, and a result that isn't in this upload is a `404`. |

**Example**

```bash
curl -X POST https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/download \
  -H "x-app-api-key: <key>" \
  -H "Content-Type: application/json" \
  -d '{"results": "FAILED"}' \
  -o artifacts.zip
```

To download one flow run only, add its result ID:

```bash
curl -X POST https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/download \
  -H "x-app-api-key: <key>" \
  -H "Content-Type: application/json" \
  -d '{"results": "ALL", "resultId": 4446290}' \
  -o artifacts.zip
```

---

## Download ZIPs through the CDN

Gets the artifacts ZIP or the HTML report ZIP from DeviceCloud's CDN, which builds it. It takes two requests: one to the API for a signed manifest, then one to the CDN with that manifest, which answers with the ZIP. The ZIPs have the same layout as the [HTML report](#download-html-report) and [artifacts](#download-artifacts) downloads (see [Artifact Archive Structure](../artifacts/artifacts.md#artifact-archive-structure)). This is the recommended way to download them, and the one the `dcd` CLI uses: the CDN builds and serves the ZIP, so a large download doesn't have to pass through the API.

### 1. Get a manifest

```
GET /results/:uploadId/artifacts-bundle
GET /results/:uploadId/report-bundle
```

`artifacts-bundle` is for the artifacts ZIP and `report-bundle` for the HTML report ZIP. `artifacts-bundle` takes the same filters as [Download artifacts](#download-artifacts), as query parameters:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `results` | `FAILED`, `ALL` | Which test artifacts to include. Leave it out for `ALL`. |
| `resultId` | A result ID (optional) | Only the files of the flow run this result belongs to: its first attempt and every retry, on that one device. `report.xml` then covers just that run. A value that isn't a positive whole number is a `400`, and a result that isn't in this upload is a `404`. |

**Response**

```json
{
  "bundleUrl": "https://cdn.devicecloud.dev/bundle",
  "manifest": "{\"version\":1,\"filename\":\"artifacts-failed.zip\",...}",
  "sig": "Vb2y0pQ8xJ3kM1nR5tW7zA9cE4fH6iL0oS2uX8dG1qY",
  "filename": "artifacts-failed.zip",
  "entryCount": 42
}
```

* `bundleUrl` is where to send the manifest. Use it as given rather than hard-coding it.
* `manifest` and `sig` go to the CDN unchanged. Don't parse `manifest`: its contents may change.
* `filename` is a name you can save the ZIP under.
* `entryCount` is how many stored files the ZIP holds, not counting the generated `report.xml` or `report.html`.

A manifest expires an hour after it's issued, so get a new one for each download.

An upload with no results in your team answers HTTP `404`, with only a `message`. An upload with more than 9,000 files answers HTTP `413` with `message`, `entryCount` and `maxEntries`. To download one, ask `artifacts-bundle` for fewer files at a time, with `resultId` or `results=FAILED`.

### 2. Download the ZIP

Send `manifest` and `sig` as JSON to `bundleUrl`. Don't send your API key: the signature is what authorizes the request.

```
POST <bundleUrl>
```

```json
{ "manifest": "<manifest>", "sig": "<sig>" }
```

The answer is the ZIP, streamed as it's built. If a file can't be fetched partway through, the download ends early and leaves a truncated ZIP, so get a new manifest and try again. An error before the ZIP starts comes as plain text: `401` once the manifest has expired, `403` if `manifest` or `sig` doesn't match what the API issued, `400` for a malformed body, and `502` for a temporary problem on our side (retry).

**Example**

```bash
curl "https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/artifacts-bundle?results=FAILED" \
  -H "x-app-api-key: <key>" \
  -o bundle.json

jq '{manifest, sig}' bundle.json | curl -X POST "$(jq -r .bundleUrl bundle.json)" \
  -H "Content-Type: application/json" \
  --data-binary @- \
  -o artifacts.zip
```

The same in Python, with only the standard library:

```python
import json
import shutil
import urllib.request

upload_id = "7e12345f-eb12-12ec-a30b-bb1234f1d12a"
manifest_request = urllib.request.Request(
    f"https://api.devicecloud.dev/results/{upload_id}/artifacts-bundle?results=FAILED",
    headers={"x-app-api-key": "<key>"},
)
with urllib.request.urlopen(manifest_request) as response:
    bundle = json.load(response)

zip_request = urllib.request.Request(
    bundle["bundleUrl"],
    data=json.dumps({"manifest": bundle["manifest"], "sig": bundle["sig"]}).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(zip_request) as response, open("artifacts.zip", "wb") as out:
    shutil.copyfileobj(response, out)
```

For the HTML report, request `report-bundle` instead of `artifacts-bundle`, with no query parameters.
