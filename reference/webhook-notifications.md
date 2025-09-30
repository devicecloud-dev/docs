# Webhook Notifications

DCD can be configured to notify you via webhook when a set of tests are complete.

### Enabling Webhooks

To enable this, head to the [settings](https://console.devicecloud.dev/settings) page on the console and scroll to the Webhooks section. You can then set a webhook URL of your choosing.

{% hint style="info" %}
Please note that we only support HTTPS URLs.
{% endhint %}

To enable webhook notifications, add the following to your config.yaml file:

```
# .maestro/config.yaml
notifications:
  webhook:
    enabled: true
```

### Triggering a Webhook

When a job is completed, we'll send a POST request to the URL specified.

You can also send a test request using the console to verify that webhooks process correctly. The test payload will contain information from your most recent job.

#### Webhook Structure

The request header will contain the following information:

```
  Content-Type: application/json
  X-DCD-Secret: DeviceCloud_<webhook_secret>
  X-DCD-Webhook-ID: wh_test_<random_hex>
  X-DCD-Timestamp: <unix_timestamp>
  User-Agent: DCD-Webhooks/1.0
```

The request body will contain a JSON structured as follows:

```
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

We sign all webhook requests with the secret found on your DCD console. You can use this secret to verify the request came from us.

Just like your API key, you should not share this secret with anyone.
