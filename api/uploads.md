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
