# Results

All results endpoints operate on a specific upload identified by its UUID.

**Status values:** `PENDING`, `QUEUED`, `RUNNING`, `PASSED`, `FAILED`, `CANCELLED`

---

## Get results

Returns all test results for an upload, including status and failure reasons.

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

## Download artifacts

Returns a zip file containing logs, screenshots, and videos. Filter to all results or failing only.

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
