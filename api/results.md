# Results

All results endpoints operate on a specific upload identified by its UUID.

**Status values:** `PENDING`, `QUEUED`, `RUNNING`, `PASSED`, `FAILED`, `CANCELLED`

---

## Get results

Returns all test results for an upload, including status and failure reasons.

Tests waiting in the queue are currently reported as `PENDING` rather than `QUEUED` by this endpoint, so treat both as "not started yet".

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
      "simulator_name": "pixel-7-api-34",
      "platform": "android"
    }
  ]
}
```

Every attempt is included: a retry appears as its own entry, with `retry_of` set to the `id` of the original attempt. Each entry also includes `config` (the run settings for that test) and `result_files` (references to its stored artifacts, plus the step log itself when it is 512 KB or smaller), which are left out of the example above. Responses for large uploads can therefore run to several megabytes; if you only need statuses, poll [`GET /uploads/status`](uploads.md#get-upload-status) instead.

Each result also has a `cancellation_reason`, which is `null` unless the test
was cancelled for a recorded reason:

* `superseded_by:<upload id>` — a newer run from the same CI context replaced
  this one. See [Cancelling superseded runs](../advanced/cancel-previous.md).
* `Cancelled: payment for this run failed.` — the run's payment failed after
  its tests were created.

A test you cancel yourself has a `null` reason, and so does a retry of a cancelled test. Match on the `superseded_by:`
prefix rather than comparing whole values, as more reasons may be added.

---

## Download JUnit report

Returns a combined JUnit XML report for all tests in an upload. Compatible with most CI systems.

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

Returns a ZIP containing the HTML report together with the screenshots, videos and logs of every test in an upload (the latest attempt of each).

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

Returns a zip file containing logs, screenshots, and videos. Filter to all results or failing only. Each test's files sit in a folder named after its result ID (`<resultId>/logs/`, `<resultId>/screenshots/`, `<resultId>/videos/`), and a merged JUnit `report.xml` covering the whole upload is added at the root — see [Artifact Archive Structure](../artifacts/artifacts.md#artifact-archive-structure).

```
POST /results/:uploadId/download
```

**Body**

| Field | Values | Description |
|-------|--------|-------------|
| `results` | `FAILED`, `ALL` | Which test artifacts to include. |

**Example**

```bash
curl -X POST https://api.devicecloud.dev/results/7e12345f-eb12-12ec-a30b-bb1234f1d12a/download \
  -H "x-app-api-key: <key>" \
  -H "Content-Type: application/json" \
  -d '{"results": "FAILED"}' \
  -o artifacts.zip
```
