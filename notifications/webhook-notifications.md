# Webhook Notifications

DeviceCloud can send a POST request to a URL of your choice when a set of tests completes.

### Enabling Webhooks

Head to the [console settings](https://console.devicecloud.dev/settings) page and scroll to the Webhooks section. Enter your webhook URL there.

{% hint style="info" %}
Only HTTPS URLs are supported.
{% endhint %}

You can also send a test request from the console to verify that your endpoint processes webhooks correctly. The test payload will contain information from your most recent job.

### Webhook Structure

**Request headers:**

```
Content-Type: application/json
X-DeviceCloud-Secret: DeviceCloud_<webhook_secret>
X-DeviceCloud-Webhook-ID: wh_test_<random_hex>
X-DeviceCloud-Timestamp: <unix_timestamp>
User-Agent: DeviceCloud-Webhooks/1.0
```

**Request body:**

```json
{
  "event": "upload.completed",
  "timestamp": "2025-09-19T15:07:15.357Z",
  "upload_id": "test_upload_synthetic_123",
  "console_url": "https://console.devicecloud.dev/results?upload=test_upload_synthetic_123",
  "status": "PASSED",
  "device": {
    "name": "iPhone 15",
    "osVersion": "17.5",
    "runnerType": "standard",
    "maestroVersion": "1.39.0"
  },
  "summary": {
    "totalTests": 1,
    "passed": 1,
    "failed": 0,
    "durationSeconds": 45
  },
  "results": [
    {
      "name": "test_flow.yaml",
      "status": "PASSED",
      "durationSeconds": 45,
      "tags": ["smoke"],
      "properties": {
        "jira_ticket": "ENG-402",
        "deployment_env": "staging"
      }
    }
  ],
  "metadata": {
    "branch": "main",
    "commit": "abc1234"
  },
  "test": true
}
```

**Fields:**

| Field | Description |
| --- | --- |
| `event` | Always `upload.completed`. |
| `status` | Overall run outcome: `PASSED` only when every test passed, otherwise `FAILED`. Use this to gate a deploy or set a commit status. |
| `device` | Device and runner context for the run: `name`, `osVersion`, `runnerType`, and `maestroVersion`. Individual fields are omitted when unavailable. |
| `summary` | Aggregate counts (`totalTests`, `passed`, `failed`, and optional `cancelled`/`queued`/`pending`/`running`) plus `durationSeconds`, `wallClockDurationSeconds`, and `retryCount`. |
| `results` | One entry per test: `name`, `status`, `durationSeconds`, `failReason` (failures only), plus `tags` and `properties` (see below). |
| `metadata` | The key/value pairs you supplied via the CLI `--metadata` flag. Omitted when none were provided. |
| `test` | Present and `true` only for test requests sent from the console. |

### Tags and Custom Properties

Each entry in `results` carries the `tags` and `properties` declared in that flow's YAML front matter, so you can route or filter events without a second API call:

```yaml
appId: com.example.app
name: Login Flow
tags:
  - smoke
properties:
  jira_ticket: "ENG-402"
  deployment_env: "staging"
---
- launchApp
```

`tags` and `properties` are each omitted from a result when the flow declares none.

{% hint style="info" %}
Property values are always delivered as strings — numbers and booleans are converted (`42` becomes `"42"`, `true` becomes `"true"`). Nested objects and lists are not supported and are dropped.
{% endhint %}

### Webhook Secrets

All webhook requests are signed with the secret shown on your DeviceCloud console. Use this to verify the request came from DeviceCloud.

Keep this secret private, just like your API key.
