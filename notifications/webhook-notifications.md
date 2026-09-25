# Webhook Notifications

DeviceCloud can send a POST request to a URL of your choice when a set of tests completes. No request is sent for a run superseded by a newer run through [`--cancel-previous`](../advanced/cancel-previous.md).

### Enabling Webhooks

Head to the [console settings](https://console.devicecloud.dev/settings?section=notifications) page, open the **Notifications** section and find **Webhooks**. Enter your webhook URL there.

{% hint style="info" %}
Only HTTPS URLs are supported.
{% endhint %}

You can also send a test request from the console to verify that your endpoint processes webhooks correctly. The test payload will contain information from your most recent job (or sample data if there isn't one yet), is marked with `"test": true`, and uses an `upload_id` prefixed with `test_` and a webhook ID prefixed with `wh_test_`.

### Webhook Structure

**Request headers:**

```
Content-Type: application/json
X-DeviceCloud-Secret: DeviceCloud_<webhook_secret>
X-DeviceCloud-Webhook-ID: wh_<random_hex>
X-DeviceCloud-Timestamp: <unix_timestamp>
User-Agent: DeviceCloud-Webhooks/1.0
```

**Request body:**

```json
{
  "event": "upload.completed",
  "timestamp": "2026-09-19T15:07:15.357Z",
  "upload_id": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "console_url": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "status": "PASSED",
  "device": {
    "name": "iPhone 16",
    "osVersion": "18",
    "runnerType": "default",
    "maestroVersion": "2.10.0"
  },
  "summary": {
    "totalTests": 1,
    "passed": 1,
    "failed": 0,
    "durationSeconds": 45,
    "wallClockDurationSeconds": 45,
    "retryCount": 0
  },
  "results": [
    {
      "name": "./auth/login.yaml",
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
    "gh_repo": "acme/mobile-app",
    "gh_branch": "main",
    "gh_sha": "4f2c1e9b7d3a6f8e0c5b2a9d1e7f3c6b8a0d4e2f"
  }
}
```

**Fields:**

| Field | Description |
| --- | --- |
| `event` | Always `upload.completed`. |
| `status` | Overall run outcome: `PASSED` only when every test passed, otherwise `FAILED`. Use this to gate a deploy or set a commit status. |
| `device` | Device and runner context for the run: `name`, `osVersion`, `runnerType`, and `maestroVersion`. Individual fields are omitted when unavailable — `name` and `osVersion` are left out when the run's flows used more than one device. |
| `summary` | Aggregate counts (`totalTests`, `passed`, `failed`, and optional `cancelled`/`queued`/`pending`/`running`) plus `durationSeconds`, `wallClockDurationSeconds`, and `retryCount`. |
| `results` | One entry per test (its latest attempt): `name`, `status`, `durationSeconds` (omitted when no duration was recorded), `failReason` (failures only), plus `tags` and `properties` (see below). |
| `metadata` | Every key/value pair attached to the run: the pairs you supplied via the CLI `--metadata` flag, the `gh_*` keys set by the CLI's git flags (e.g. `--branch` is sent as `gh_branch`), and any keys added by our CI integrations (e.g. `gh_*` from the GitHub Action, `bb_*` from the Bitbucket pipe). Omitted when there are none. |
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
Property values are always delivered as strings — numbers and booleans are converted (`42` becomes `"42"`, `true` becomes `"true"`).
{% endhint %}

{% hint style="warning" %}
Property values must be scalars. Maestro rejects a flow whose `properties:` contains a nested object or a list, failing it before it runs with `Incorrect Format: <key>`.
{% endhint %}

### Delivery

* Each attempt times out after 10 seconds, so respond with a `2xx` quickly and do any slow processing afterwards.
* Only timeouts are retried, up to 3 attempts in total (1 second, then 2 seconds apart). Every attempt carries the same `X-DeviceCloud-Webhook-ID`, so you can use it to ignore duplicates.
* Any HTTP response ends delivery, including a `4xx` or `5xx`, and so does any other connection error — these aren't retried.
* The URL's address is checked before every delivery. URLs that resolve to private, loopback, link-local or other reserved addresses are rejected, as are ports 22, 25, 53, 3306, 5432, 6379 and 27017.
* The console doesn't keep a delivery log, so log incoming requests on your side if you need a record.

### Repeat Deliveries After Retries

If tests are retried after a run has already been reported — for example when you retry a failed test from the console — DeviceCloud sends another `upload.completed` for the same `upload_id` once the retried tests finish. It carries the run's updated `status`, `summary` and `results`.

This is on by default, so automations always see the latest outcome. To be called only once per run, turn off **Re-deliver after retries** in the Webhooks section of the console.

Your endpoint should therefore treat `upload_id` as the key for a run and keep the delivery with the latest `timestamp`, rather than assuming one request per run.

### Webhook Secrets

Every request includes the secret shown on your DeviceCloud console, sent as-is in the `X-DeviceCloud-Secret` header. To verify a request came from DeviceCloud, compare that header with your secret using a constant-time comparison (such as `crypto.timingSafeEqual` in Node.js or `hmac.compare_digest` in Python) and reject the request if they don't match.

Requests are not HMAC-signed, and `X-DeviceCloud-Timestamp` isn't tied to the request body, so the secret is the check to rely on.

Keep this secret private, just like your API key. If it's exposed, regenerate it from the Webhooks section of the console — the current secret stops working straight away.
