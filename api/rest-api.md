# REST API

The devicecloud.dev REST API gives you programmatic access to the same data available in the console — test results, upload history, and flow analytics. All requests are authenticated with your API key.

## Authentication

Include your API key in every request:

```
x-app-api-key: <your-api-key>
```

You can find your API key in the console under **Settings → API Key**.

---

## Uploads

### List uploads

Returns a paginated list of test uploads for your organisation.

```
GET /uploads/list
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter by upload name. Supports `*` as a wildcard. |
| `from` | string | No | Return uploads created on or after this date (ISO 8601). |
| `to` | string | No | Return uploads created on or before this date (ISO 8601). |
| `limit` | number | No | Maximum number of results. Default: `20`. |
| `offset` | number | No | Number of results to skip. Default: `0`. |

**Example**

```bash
curl https://api.devicecloud.dev/uploads/list \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "uploads": [
    {
      "id": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
      "name": "Nightly regression",
      "created_at": "2026-01-15T10:30:00Z",
      "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

---

### Get upload status

Returns the current status and individual test results for a specific upload. Useful for polling a run in progress.

```
GET /uploads/status
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uploadId` | string | No* | The upload UUID. |
| `name` | string | No* | The upload name. Returns the most recent match if multiple exist. |

*One of `uploadId` or `name` is required.

**Example**

```bash
curl "https://api.devicecloud.dev/uploads/status?uploadId=7e12345f-eb12-12ec-a30b-bb1234f1d12a" \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "uploadId": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "status": "FAILED",
  "name": "Nightly regression",
  "createdAt": "2026-01-15T10:30:00Z",
  "appBinaryId": "67894274-b789-4c1e-80d4-da8998998999",
  "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "tests": [
    {
      "name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "durationSeconds": 32,
      "failReason": "Element not found: Text matching regex next.* not found"
    }
  ]
}
```

---

## Results

### Get results for an upload

Returns all test results for a given upload, including status and failure reasons.

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
      "status": "FAILED",
      "fail_reason": "Element not found: Text matching regex next.* not found",
      "duration_seconds": 32,
      "retry_of": null
    }
  ]
}
```

**Status values:** `PENDING`, `QUEUED`, `RUNNING`, `PASSED`, `FAILED`, `CANCELLED`

---

### Download JUnit report

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

### Download HTML report

Returns a zipped HTML report with screenshots and logs for all tests in an upload.

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

### Download artifacts

Returns a zip file containing test artifacts. You can choose to download all results or only failing ones.

```
POST /results/:uploadId/download
```

**Body**

```json
{
  "results": "FAILED"
}
```

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

---

## Flows

The flows endpoints return aggregated analytics across all test runs for each flow file — the same data shown on the Flows page in the console.

Pass rates are calculated as `passed / (passed + failed)`, excluding cancelled and in-progress runs.

### Get flow summaries

Returns pass rates, run counts, average durations, and a daily status breakdown for every flow in your organisation.

```
GET /flows
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | No | Filter by platform: `android` or `ios`. |
| `appId` | string | No | Filter by app ID (e.g. `com.example.app`). |
| `days` | number | No | Lookback window in days. Default: `14`. Ignored if `startDate` is set. |
| `startDate` | string | No | Start of date range (ISO 8601). Overrides `days`. |
| `endDate` | string | No | End of date range (ISO 8601). Defaults to now if `startDate` is set. |
| `tags` | string | No | Comma-separated tag filter. Returns flows that have any of the given tags (e.g. `smoke,critical`). |

**Example**

```bash
curl "https://api.devicecloud.dev/flows?platform=ios&startDate=2026-01-01&endDate=2026-01-31" \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "statusCode": 200,
  "flows": [
    {
      "flow_name": "Login flow",
      "file_name": "src/flows/login.yaml",
      "pass_rate": 94,
      "passed_runs": 47,
      "failed_runs": 3,
      "total_runs": 50,
      "avg_duration": 38,
      "last_run_at": "2026-01-31T14:22:00Z",
      "tags": ["smoke", "critical"],
      "daily_data": {
        "2026-01-31": "passed",
        "2026-01-30": "mixed",
        "2026-01-29": "passed"
      }
    }
  ]
}
```

**`daily_data` values:** `passed` (all runs passed), `failed` (all runs failed), `mixed` (both), `null` (no runs that day)

---

### Get runs for a flow

Returns individual run history for a specific flow file.

```
GET /flows/runs
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileName` | string | Yes | The flow file path (e.g. `src/flows/login.yaml`). |
| `platform` | string | No | Filter by platform: `android` or `ios`. |
| `appId` | string | No | Filter by app ID. |
| `limit` | number | No | Maximum number of runs to return. Default: `100`. |
| `startDate` | string | No | Start of date range (ISO 8601). |
| `endDate` | string | No | End of date range (ISO 8601). |

**Example**

```bash
curl "https://api.devicecloud.dev/flows/runs?fileName=src/flows/login.yaml&platform=ios" \
  -H "x-app-api-key: <key>"
```

**Response**

```json
{
  "statusCode": 200,
  "runs": [
    {
      "id": 4500,
      "status": "PASSED",
      "createdAt": "2026-01-31T14:22:00Z",
      "durationSeconds": 35,
      "failReason": null,
      "testUploadId": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
      "uploadName": "Nightly regression"
    }
  ]
}
```