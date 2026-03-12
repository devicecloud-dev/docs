# Flows

The flows endpoints return aggregated analytics across all test runs for each flow file — the same data shown on the Flows page in the console.

Pass rates are calculated as `passed / (passed + failed)`, excluding cancelled and in-progress runs.

---

## Get flow summaries

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

## Get runs for a flow

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
