# REST API

The DeviceCloud REST API gives you programmatic access to the same data available in the console — test results, upload history, and flow analytics.

## Authentication

Include your API key in every request:

```
x-app-api-key: <your-api-key>
```

You can create an API key in the console under **Settings → API Keys**. The full key is shown only once, when it's created or rotated, so store it securely.

Requests can also be authenticated with a DeviceCloud login session, which is how the CLI authenticates after `dcd login`: send `Authorization: Bearer <access-token>` together with `x-dcd-org: <team-id>`, where the signed-in user must be a member of that team. For scripts and CI, use an API key.

A missing or invalid API key returns HTTP `403`.

## Base URL

```
https://api.devicecloud.dev
```

## Rate limits

The API accepts up to 60 requests per minute. Requests over the limit receive HTTP `429 Too Many Requests`; wait a moment and try again.

These endpoints aren't rate limited, so they're safe to poll: [`GET /results/:uploadId`](results.md#get-results), [`GET /uploads/status`](uploads.md#get-upload-status) and [`GET /ip-addresses`](ip-addresses.md).

## Errors

Most errors are returned with a matching HTTP status code. Three endpoints are the exception: [`GET /results/:uploadId`](results.md#get-results), [`GET /flows`](flows.md#get-flow-summaries) and [`GET /flows/runs`](flows.md#get-runs-for-a-flow) respond with HTTP `200` and report the error in the body instead:

```json
{
  "statusCode": 400,
  "message": "fileName query parameter is required."
}
```

Check the `statusCode` field in the body as well as the HTTP status. A malformed upload ID (not a UUID) is rejected with a real HTTP `400`.

## Endpoints

| Resource | Description |
|----------|-------------|
| [Uploads](uploads.md) | List uploads and poll run status |
| [Results](results.md) | Fetch results, reports, and artifacts for an upload |
| [Flows](flows.md) | Aggregated analytics and run history per flow file |
| [IP Addresses](ip-addresses.md) | Current egress IPs for firewall allow-listing (no API key required) |
