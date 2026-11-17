# Uploads

## List uploads

Returns a paginated list of test uploads for your organisation.

```
GET /uploads/list
```

**Query parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter by upload name. Supports `*` as a wildcard. A name with a `*` matches regardless of case; without one, the match is exact. |
| `from` | string | No | Return uploads created on or after this date (ISO 8601). |
| `to` | string | No | Return uploads created on or before this date (ISO 8601). A date without a time means midnight at the start of that day (UTC), so `to=2026-01-31` leaves out uploads made on 31 January — use `2026-02-01` or `2026-01-31T23:59:59Z` to include them. |
| `limit` | number | No | Maximum number of results. Default: `20`. At most 1,000 uploads are returned per request; use `offset` to page through more. |
| `offset` | number | No | Number of results to skip. Default: `0`. |

The response is HTTP `400` if `limit` isn't a whole number of 1 or more, `offset` isn't a whole number of 0 or more, `from` or `to` isn't ISO 8601, or `from` is after `to`.

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

*One of `uploadId` or `name` is required. With both, `uploadId` is tried first. If no upload matches, the response is HTTP `404`. With neither, or with an `uploadId` that isn't a UUID, it's HTTP `400`.

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
      "device": "pixel-10-api-36"
    }
  ]
}
```

`tests` lists the latest attempt of each test. `device` is the device the test ran on, such as `pixel-10-api-36` or `iPhone 16 - 18`. `durationSeconds` is left out until the test has a duration, and `failReason` appears only on a failed test.

`consoleUrl` opens the upload in the console at its most recently created test (the `&result=` parameter).

The overall `status` is worked out from the tests:

- `FAILED` as soon as any test has failed or been cancelled — even while other tests are still running, so check `tests` if you need to wait for every test to finish;
- otherwise `RUNNING`, `PENDING` or `QUEUED` while tests are still in progress;
- `PASSED` when every test has passed.

If the run was superseded by a newer run through [`--cancel-previous`](../advanced/cancel-previous.md), the response also has a `supersededBy` field with the newer run's upload ID. Its `status` is still `FAILED`, because its cancelled tests count against it.
