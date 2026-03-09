# Notifications

DeviceCloud can notify you when a test run is complete via email or webhook.

## Email Notifications

Configure email notifications in your `config.yaml`:

#### Notify on failures only

```yaml
# .maestro/config.yaml
notifications:
  email:
    enabled: true
    recipients:
      - sam@example.com
      - devs@example.com
```

#### Notify on successes and failures

```yaml
# .maestro/config.yaml
notifications:
  email:
    enabled: true
    onSuccess: true
    recipients:
      - sam@example.com
      - devs@example.com
```

---

## Webhook Notifications

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
X-DCD-Secret: DeviceCloud_<webhook_secret>
X-DCD-Webhook-ID: wh_test_<random_hex>
X-DCD-Timestamp: <unix_timestamp>
User-Agent: DCD-Webhooks/1.0
```

**Request body:**

```json
{
  "event": "upload.completed",
  "timestamp": "2025-09-19T15:07:15.357Z",
  "upload_id": "test_upload_synthetic_123",
  "console_url": "https://console.devicecloud.dev/results?upload=test_upload_synthetic_123",
  "summary": {
    "total_tests": 1,
    "passed": 1,
    "failed": 0,
    "durationSeconds": 45
  },
  "results": [
    {
      "name": "test_flow.yaml",
      "status": "PASSED",
      "duration_seconds": 45
    }
  ],
  "test": true
}
```

### Webhook Secrets

All webhook requests are signed with the secret shown on your DeviceCloud console. Use this to verify the request came from DeviceCloud.

Keep this secret private, just like your API key.
