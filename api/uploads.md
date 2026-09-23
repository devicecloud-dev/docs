# Uploads

## List uploads

Returns a paginated list of test uploads for your organisation.

```
GET /uploads/list
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter by upload name. Supports `*` as a wildcard. |
| `from` | string | No | Return uploads created on or after this date (ISO 8601). |
| `to` | string | No | Return uploads created on or before this date (ISO 8601). A date without a time means midnight at the start of that day (UTC), so `to=2026-01-31` leaves out uploads made on 31 January — use `2026-02-01` or `2026-01-31T23:59:59Z` to include them. |
| `limit` | number | No | Maximum number of results. Default: `20`. At most 1,000 uploads are returned per request; use `offset` to page through more. |
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

## Get upload status

Returns the current status and individual test results for a specific upload. Useful for polling a run in progress.

```
GET /uploads/status
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uploadId` | string | No* | The upload UUID. |
| `name` | string | No* | The upload name. Returns the most recent match if multiple exist. |

*One of `uploadId` or `name` is required. If no upload matches, the response is HTTP `404`.

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
  "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a&result=4500",
  "tests": [
    {
      "name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "durationSeconds": 32,
      "failReason": "Element not found: Text matching regex next.* not found",
      "createdAt": "2026-01-15T10:30:04Z",
      "device": "pixel-7-api-34"
    }
  ]
}
```

`tests` lists the latest attempt of each test. Each entry also carries `createdAt` and `device` (the device the test ran on, e.g. `pixel-7-api-34` or `iPhone 16 - 18`), and `consoleUrl` includes a `&result=` parameter that opens the upload's most recently created test.

The overall `status` is worked out from the tests:

- `FAILED` as soon as any test has failed or been cancelled — even while other tests are still running, so check `tests` if you need to wait for every test to finish;
- otherwise `RUNNING`, `PENDING` or `QUEUED` while tests are still in progress;
- `PASSED` when every test has passed.
