# Status API

You can query the status of an upload using the following CLI command:

```
dcd status --apiKey <key> --upload-id <uuid>
```

Or using the upload name:

```
dcd status --apiKey <key> --name "Upload 123"
```

_Note: if you have multiple uploads with the same name, it will return the latest result only._



Example output:

<pre><code>
📊 Upload Status
════════════════════════════════════════════════════════════════════════════════
✓  Status:      FAILED
🆔 Upload ID:   7e12345f-eb12-12ec-a30b-bb1234f1d12a
📱 Binary ID:   67894274-b789-4c1e-80d4-da8998998999
🔗 Console:     https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a&#x26;result=4500

📋 Test Results
────────────────────────────────────────────────────────────────────────────────
✗ ./login-test/onboarding.yaml
   Status: FAILED
<strong>   Fail reason: Error: Element not found: Text matching regex next.* not found
</strong>   Duration: 32s

</code></pre>



### JSON Output

Use the `--json` flag to trigger machine interpretable output:

```
dcd status --apiKey <key> --name "Upload 123" --json
```

Example output:

```json
{
  "status": "FAILED",
  "tests": [
    {
      "name": "./login-test/onboarding.yaml",
      "status": "FAILED",
      "failReason": "Error: Element not found: Text matching regex next.* not found",
      "durationSeconds": 32
    }
  ],
  "appBinaryId": "67894274-b789-4c1e-80d4-da8998998999",
  "uploadId": "7e12345f-eb12-12ec-a30b-bb1234f1d12a",
  "consoleUrl": "https://console.devicecloud.dev/results?upload=7e12345f-eb12-12ec-a30b-bb1234f1d12a&result=4500"
}
```

This can be interpreted by command line tools such as [jq](https://jqlang.github.io/jq/) to pull out values.

For example, to extract the app binary ID and save it to a local ENV var:

```bash
export APP_BINARY_ID=$(dcd status \
    --api-key <key> \
    --name "Upload 123" \
    --json \
    | jq -r '.appBinaryId')

echo $APP_BINARY_ID
# 67894274-b789-4c1e-80d4-da8998998999
```

